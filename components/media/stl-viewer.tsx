"use client";

import React, { useState } from "react";
import { Box, RotateCcw } from "lucide-react";

interface STLViewerProps {
  url: string;
}

/**
 * A simplified STL Viewer component
 *
 * Note: This is a placeholder component that renders a message about the Three.js dependencies.
 * To make this component fully functional, install:
 * npm install three @react-three/fiber @react-three/drei @types/three --legacy-peer-deps
 */
export function STLViewer({ url }: STLViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(false);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Toggle rotation animation
  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  return (
    <div className="w-full h-[400px] rounded-xl border border-border bg-card flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Loading 3D model...</p>
        </div>
      ) : (
        <div className="text-center space-y-6 max-w-md">
          <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
            <Box
              className={`w-24 h-24 text-primary ${
                isRotating ? "animate-[spin_4s_linear_infinite]" : ""
              }`}
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl -z-10"></div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">3D Model Viewer</h3>
            <p className="text-muted-foreground mb-4">
              This 3D model is available for viewing and download.
            </p>
            <button
              onClick={toggleRotation}
              className="flex items-center gap-2 mx-auto bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              {isRotating ? "Stop Rotation" : "Simulate Rotation"}
            </button>
          </div>

          <p className="text-sm text-muted-foreground border-t border-border pt-4 mt-4">
            <span className="font-medium">Source:</span> {url.split("/").pop()}
          </p>
        </div>
      )}

      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
        <span className="opacity-70">Full 3D rendering requires Three.js</span>
      </div>
    </div>
  );
}
