// Type definitions for draco3d
declare module "draco3d" {
  // Minimal interface definition to satisfy TypeScript
  const _default: any;
  export default _default;
}

// Type definitions for offscreencanvas
interface OffscreenCanvas extends EventTarget {
  width: number;
  height: number;
  getContext(contextId: string, options?: any): any;
  convertToBlob(options?: any): Promise<Blob>;
  transferToImageBitmap(): ImageBitmap;
}

interface Window {
  OffscreenCanvas: {
    prototype: OffscreenCanvas;
    new (width: number, height: number): OffscreenCanvas;
  };
}
