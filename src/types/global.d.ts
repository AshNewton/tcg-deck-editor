export {};

declare global {
  interface Window {
    showOpenFilePicker?: (options?: {
      types?: any;
    }) => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker?: (options?: any) => Promise<FileSystemFileHandle>;
  }
}
