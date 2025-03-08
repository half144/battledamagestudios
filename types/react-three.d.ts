import * as React from "react";

// Declaration for @react-three/fiber
declare module "@react-three/fiber" {
  export class Canvas extends React.Component<any> {}
}

// Declaration for @react-three/drei
declare module "@react-three/drei" {
  export class OrbitControls extends React.Component<any> {}
  export class PerspectiveCamera extends React.Component<any> {}
}

// Declaration for three
declare module "three" {
  export class Mesh {
    scale: { set: (x: number, y: number, z: number) => void };
  }

  export class BufferGeometry {
    computeVertexNormals: () => void;
  }

  export interface LoadingManager {}
}

// Declaration for three/examples/jsm/loaders/STLLoader
declare module "three/examples/jsm/loaders/STLLoader" {
  export class STLLoader {
    load: (
      url: string,
      onLoad: (geometry: any) => void,
      onProgress?: (event: { loaded: number; total: number }) => void,
      onError?: (error: Error) => void
    ) => void;
  }
}

// Add JSX namespace declarations
declare namespace JSX {
  interface IntrinsicElements {
    mesh: any;
    primitive: any;
    meshStandardMaterial: any;
    ambientLight: any;
    spotLight: any;
    pointLight: any;
  }
}
