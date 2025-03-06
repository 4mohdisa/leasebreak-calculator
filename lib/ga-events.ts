declare global {
  interface Window {
    gtag: (type: string, action: string, options?: Record<string, unknown>) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-8P7J41FWCV'

export const trackButtonClick = (buttonName: string, category: string = 'button_click') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', buttonName, {
      event_category: category,
      event_label: buttonName,
    } as Record<string, unknown>);
  }
};

export const trackCalculation = (calculatorType: string, values: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'calculation', {
      event_category: calculatorType,
      event_label: 'Calculator Used',
      ...values
    } as Record<string, unknown>);
  }
};

export const trackDownload = (fileType: string, fileName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'download', {
      event_category: fileType,
      event_label: fileName,
    } as Record<string, unknown>);
  }
};
