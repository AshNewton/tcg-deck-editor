export {};

declare global {
  interface Window {
    showOpenFilePicker?: (options?: {
      types?: any;
    }) => Promise<FileSystemFileHandle[]>;
      showSaveFilePicker?: (options?: any) => Promise<FileSystemFileHandle>;
      db: {
          getCards: () => Promise<any[]>;
          addCard: (name: string) => Promise<{ id: number }>;
      };
  }
}
