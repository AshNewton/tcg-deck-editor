export {};

declare global {
  interface Window {
    showOpenFilePicker?: (options?: {
      types?: any;
    }) => Promise<FileSystemFileHandle[]>;
      showSaveFilePicker?: (options?: any) => Promise<FileSystemFileHandle>;
      db: {
          getCards: () => Promise<any[]>;
          getCardByName: (name: string) => Promise<any[]>;
          addCard: (name: string) => Promise<{ id: number }>;
          deleteCard: (id: string) => Promise<void>;
      };
  }
}
