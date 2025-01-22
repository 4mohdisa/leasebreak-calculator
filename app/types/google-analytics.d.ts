// types/google-analytics.d.ts
declare global {
    interface Window {
      gtag: (
        type: string,
        action: string,
        options?: {
          [key: string]: any;
        }
      ) => void;
      dataLayer: any[];
    }
  }
  
  export {}