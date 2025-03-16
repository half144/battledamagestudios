"use client";

import React, { useState, useRef, Suspense, useEffect } from "react";
import { Box, RotateCcw, AlertTriangle, Play, Pause, RotateCw, RefreshCw } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Stage,
  OrbitControls,
  useProgress,
  Html,
} from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Object3D, MeshStandardMaterial, DoubleSide, Vector3, BufferGeometry, MathUtils } from "three";
import { STLLoader } from "three-stdlib";
import { useLoader } from '@react-three/fiber';

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

// Auto-rotating model wrapper with improved multi-axis rotation
function AutoRotate({
  children,
  isManuallyRotating,
  autoRotate,
  rotationMode = "y",
}: {
  children: React.ReactNode;
  isManuallyRotating: boolean;
  autoRotate: boolean;
  rotationMode?: "y" | "x" | "all";
}) {
  const groupRef = useRef<Object3D>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    if (groupRef.current && !isManuallyRotating && autoRotate) {
      time.current += delta;
      
      if (rotationMode === "y" || rotationMode === "all") {
        groupRef.current.rotation.y += delta * 0.25;
      }
      
      if (rotationMode === "x" || rotationMode === "all") {
        // Se for modo "all", usamos um movimento de balanço mais suave no eixo X
        if (rotationMode === "all") {
          groupRef.current.rotation.x = Math.sin(time.current * 0.5) * 0.15;
        } else {
          // Rotação constante no eixo X se for modo "x"
          groupRef.current.rotation.x += delta * 0.15;
        }
      }
      
      // Adicionar um leve movimento no eixo Z para mais naturalidade na rotação completa
      if (rotationMode === "all") {
        groupRef.current.rotation.z = Math.sin(time.current * 0.3) * 0.05;
      }
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

// Fallback simple cube component
function FallbackCube({
  isRotating,
  autoRotate,
  rotationMode,
}: {
  isRotating: boolean;
  autoRotate: boolean;
  rotationMode: "y" | "x" | "all";
}) {
  const meshRef = useRef<Object3D>(null);

  useFrame((_, delta) => {
    if (isRotating && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <AutoRotate isManuallyRotating={isRotating} autoRotate={autoRotate} rotationMode={rotationMode}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#FF5C5C" />
      </mesh>
    </AutoRotate>
  );
}

// STL Model component specifically for STL files
function STLModel({
  url,
  isRotating,
  autoRotate,
  rotationMode,
}: {
  url: string;
  isRotating: boolean;
  autoRotate: boolean;
  rotationMode: "y" | "x" | "all";
}) {
  const [loadError, setLoadError] = useState<boolean>(!isValid3DModelURL(url));
  const modelRef = useRef<Object3D>(null);
  
  // Use STLLoader instead of GLTF for STL files
  const geometry = useLoader(STLLoader, url, undefined, (error) => {
    console.error("Error loading STL model:", error);
    setLoadError(true);
  });

  // Center and normalize the model on load
  useEffect(() => {
    if (geometry && modelRef.current) {
      const bufferGeometry = geometry as BufferGeometry;
      // Center the geometry
      (bufferGeometry as any).center();
      
      // Normalize scale to fit in view
      (bufferGeometry as any).computeBoundingBox();
      const boundingBox = (bufferGeometry as any).boundingBox;
      if (boundingBox) {
        const size = boundingBox.getSize(new Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxDim; // Scale to fit nicely in view
        modelRef.current.scale.set(scale, scale, scale);
      }
    }
  }, [geometry]);

  // If there's an error or the URL is invalid, show fallback
  if (loadError || !geometry || !isValid3DModelURL(url)) {
    return (
      <>
        <ErrorDisplay message="O arquivo fornecido não é um modelo 3D válido ou não pôde ser carregado." />
        <FallbackCube isRotating={isRotating} autoRotate={autoRotate} rotationMode={rotationMode} />
      </>
    );
  }

  return (
    <AutoRotate isManuallyRotating={isRotating} autoRotate={autoRotate} rotationMode={rotationMode}>
      <mesh ref={modelRef}>
        <bufferGeometry attach="geometry" {...geometry} />
        <meshStandardMaterial 
          color="#8fb8e0" 
          side={DoubleSide} 
          roughness={0.5} 
          metalness={0.2}
          flatShading={false}
        />
      </mesh>
    </AutoRotate>
  );
}

// Main component with error handling
export function STLViewer({ url }: STLViewerProps) {
  const [isRotating, setIsRotating] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [rotationMode, setRotationMode] = useState<"y" | "x" | "all">("all");
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsRef = useRef<any>(null);

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

  // Cycle through rotation modes
  const cycleRotationMode = () => {
    if (!autoRotate) {
      setAutoRotate(true);
      setIsRotating(false);
    }
    setRotationMode(current => {
      if (current === "y") return "x";
      if (current === "x") return "all";
      return "y";
    });
  };

  // Reset camera position
  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
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
      <Canvas 
        shadows
        dpr={[1, 2]} 
        camera={{ position: [0, 2, 10], fov: 40 }} // Posição inicial mais afastada e ligeiramente elevada
        gl={{ antialias: true }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.6} />
          <hemisphereLight intensity={0.5} color="#ffffff" groundColor="#bbbbff" />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          <directionalLight position={[0, 10, 0]} intensity={0.7} />
          
          <Stage
            environment="city"
            shadows
            intensity={0.5}
            scale={1.0}
            adjustCamera={false}
            preset="soft"
          >
            <STLModel
              url={url}
              isRotating={isRotating}
              autoRotate={autoRotate && !isUserInteracting}
              rotationMode={rotationMode}
            />
          </Stage>
          
          <OrbitControls
            ref={controlsRef}
            makeDefault
            minDistance={3}
            maxDistance={20}
            target={[0, 0, 0]}
            onChange={handleUserInteraction}
            onStart={handleUserInteraction}
            enableZoom={true}
            zoomSpeed={1.2}
            rotateSpeed={1.0} // Velocidade de rotação padrão
            enableDamping={true}
            dampingFactor={0.1}
            enablePan={true}
            minPolarAngle={Math.PI * 0.05} // Limita rotação vertical mínima (quase topo)
            maxPolarAngle={Math.PI * 0.95} // Limita rotação vertical máxima (quase base)
          />
        </Suspense>
      </Canvas>

      {/* Instruções simplificadas */}
      <div className="absolute top-3 left-3 bg-background/60 backdrop-blur-sm p-2 rounded-md text-xs text-muted-foreground">
        <p>Arraste para rotacionar | Scroll para zoom | Shift+arraste para mover</p>
      </div>
      
      {/* Controles */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={resetView}
          className="bg-background/80 backdrop-blur-sm"
          title="Resetar visualização"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={cycleRotationMode}
          className="bg-background/80 backdrop-blur-sm"
          title={
            rotationMode === "y" 
              ? "Rotação horizontal" 
              : rotationMode === "x" 
                ? "Rotação vertical" 
                : "Rotação completa"
          }
        >
          <RotateCw className="h-4 w-4" />
        </Button>

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