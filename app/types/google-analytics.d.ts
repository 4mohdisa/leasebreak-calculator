// types/google-analytics.d.ts
declare global {
    interface Window {
      gtag: (
        type: string,
        action: string,
        options?: Record<string, unknown>
      ) => void;
      dataLayer: unknown[];
    }
  }
  
  export {}