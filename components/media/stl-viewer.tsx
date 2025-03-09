"use client";

import React, { useState, useRef, Suspense, useEffect } from "react";
import { Box, RotateCcw, AlertTriangle, Play, Pause } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Stage,
  OrbitControls,
  useProgress,
  Html,
  Box as DreiBox,
} from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Object3D, MeshStandardMaterial, DoubleSide, Color } from "three";

interface STLViewerProps {
  url: string;
}

// Loading component to show during model loading
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-2"></div>
        <p className="text-sm text-muted-foreground">
          Carregando modelo... {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  );
}

// Error display component
function ErrorDisplay({
  message = "Modelo não pôde ser carregado. Exibindo modelo alternativo.",
}) {
  return (
    <Html position={[0, 2, 0]} zIndexRange={[40, 50]} center={false}>
      <div className="flex items-center gap-2 px-3 py-2 bg-background/70 backdrop-blur-sm rounded-md border border-destructive/20 shadow-sm text-xs">
        <AlertTriangle className="h-3 w-3 text-destructive flex-shrink-0" />
        <span className="text-muted-foreground">{message}</span>
      </div>
    </Html>
  );
}

// Check if file is a valid 3D model
function isValid3DModelURL(url: string): boolean {
  if (!url) return false;
  const validExtensions = [".stl", ".obj", ".glb", ".gltf"];
  const extension = url.toLowerCase().split(".").pop();
  return extension ? validExtensions.includes(`.${extension}`) : false;
}

// Auto-rotating model wrapper
function AutoRotate({
  children,
  isManuallyRotating,
  autoRotate,
}: {
  children: React.ReactNode;
  isManuallyRotating: boolean;
  autoRotate: boolean;
}) {
  const groupRef = useRef<Object3D>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !isManuallyRotating && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3; // Slower, smoother rotation
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// Fallback simple cube component
function FallbackCube({
  isRotating,
  autoRotate,
}: {
  isRotating: boolean;
  autoRotate: boolean;
}) {
  const meshRef = useRef<Object3D>(null);

  useFrame((_, delta) => {
    if (isRotating && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <AutoRotate isManuallyRotating={isRotating} autoRotate={autoRotate}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#FF5C5C" />
      </mesh>
    </AutoRotate>
  );
}

// Safe STL Model component
function SafeSTLModel({
  url,
  isRotating,
  autoRotate,
}: {
  url: string;
  isRotating: boolean;
  autoRotate: boolean;
}) {
  const [loadError, setLoadError] = useState<boolean>(!isValid3DModelURL(url));
  const modelRef = useRef<Object3D>(null);

  // If the URL is invalid, render the fallback cube
  if (!isValid3DModelURL(url)) {
    return (
      <>
        <ErrorDisplay message="O arquivo fornecido não é um modelo 3D válido." />
        <FallbackCube isRotating={isRotating} autoRotate={autoRotate} />
      </>
    );
  }

  try {
    // Custom error handling for GLTFLoader
    const { scene } = useGLTF(url, undefined, undefined, (err) => {
      console.error("Error loading 3D model:", err);
      setLoadError(true);
    });

    // Handle rotation animation
    useFrame((_, delta) => {
      if (isRotating && modelRef.current) {
        modelRef.current.rotation.y += delta * 0.5;
      }
    });

    if (!scene) {
      return (
        <>
          <ErrorDisplay />
          <FallbackCube isRotating={isRotating} autoRotate={autoRotate} />
        </>
      );
    }

    return (
      <>
        {loadError && <ErrorDisplay />}
        {loadError ? (
          <FallbackCube isRotating={isRotating} autoRotate={autoRotate} />
        ) : (
          <AutoRotate isManuallyRotating={isRotating} autoRotate={autoRotate}>
            <primitive
              ref={modelRef}
              object={scene}
              scale={0.8}
              position={[0, 0, 0]}
            />
          </AutoRotate>
        )}
      </>
    );
  } catch (error) {
    console.error("Error in STL model component:", error);
    return (
      <>
        <ErrorDisplay />
        <FallbackCube isRotating={isRotating} autoRotate={autoRotate} />
      </>
    );
  }
}

// STL Model component with error boundary
function STLModel({
  url,
  isRotating,
  autoRotate,
}: {
  url: string;
  isRotating: boolean;
  autoRotate: boolean;
}) {
  try {
    return (
      <SafeSTLModel url={url} isRotating={isRotating} autoRotate={autoRotate} />
    );
  } catch (error) {
    console.error("Uncaught error in STL model:", error);
    return <FallbackCube isRotating={isRotating} autoRotate={autoRotate} />;
  }
}

export function STLViewer({ url }: STLViewerProps) {
  const [isRotating, setIsRotating] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle manual rotation animation
  const toggleRotation = () => {
    setIsRotating(!isRotating);
    if (!isRotating) {
      setAutoRotate(false);
    }
  };

  // Toggle auto-rotation
  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
    if (!autoRotate) {
      setIsRotating(false);
    }
  };

  // Handle user interaction with the model
  const handleUserInteraction = () => {
    setIsUserInteracting(true);

    // Clear any existing timeout
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }

    // Set a timeout to resume auto-rotation after 3 seconds of inactivity
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full aspect-video bg-muted/20 rounded-md border relative">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }}>
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Stage
            environment="city"
            shadows
            intensity={0.5}
            scale={1.0}
            adjustCamera={false}
          >
            <STLModel
              url={url}
              isRotating={isRotating}
              autoRotate={autoRotate && !isUserInteracting}
            />
          </Stage>
          <OrbitControls
            makeDefault
            minDistance={1.5}
            maxDistance={15}
            target={[0, 0, 0]}
            onChange={handleUserInteraction}
            onStart={handleUserInteraction}
            enableZoom={true}
            zoomSpeed={1.2}
          />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleAutoRotate}
          className="bg-background/80 backdrop-blur-sm"
          title={
            autoRotate
              ? "Desativar rotação automática"
              : "Ativar rotação automática"
          }
        >
          {autoRotate ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={toggleRotation}
          className="bg-background/80 backdrop-blur-sm"
          title={isRotating ? "Parar rotação manual" : "Iniciar rotação manual"}
        >
          <RotateCcw
            className={`h-4 w-4 ${isRotating ? "animate-spin" : ""}`}
          />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          className="bg-background/80 backdrop-blur-sm"
          title="Baixar modelo"
          onClick={() => {
            if (isValid3DModelURL(url)) {
              const link = document.createElement("a");
              link.href = url;
              link.download = url.split("/").pop() || "model.stl";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
        >
          <Box className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
