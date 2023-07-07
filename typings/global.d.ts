declare global {
  interface Window {
    electronAPI: {
      saveFile: (value: string) => void
      updateFile: (value: string) => void
    }
  }
}

export {}
