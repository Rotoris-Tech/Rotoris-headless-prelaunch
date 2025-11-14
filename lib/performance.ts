/**
 * Performance monitoring utilities for Next.js
 * Used to track and report Core Web Vitals
 */

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

/**
 * Report Web Vitals to analytics
 * You can customize this to send to Google Analytics, Vercel Analytics, etc.
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }

  // Send to analytics
  // Example: Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Example: Send to custom API endpoint
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(metric),
  // });
}

/**
 * Log page performance metrics
 */
export function logPagePerformance() {
  if (typeof window === 'undefined') return;

  const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (perfData) {
    console.log({
      'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
      'TCP Connection': perfData.connectEnd - perfData.connectStart,
      'Request Time': perfData.responseStart - perfData.requestStart,
      'Response Time': perfData.responseEnd - perfData.responseStart,
      'DOM Processing': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      'Total Load Time': perfData.loadEventEnd - perfData.loadEventStart,
    });
  }
}

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string, callback: () => void) {
  const startTime = performance.now();
  callback();
  const endTime = performance.now();

  if (process.env.NODE_ENV === 'development') {
    console.log(`${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
  }
}

/**
 * Create a performance observer for specific entry types
 */
export function observePerformance(entryTypes: string[]) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Performance Entry:', {
            name: entry.name,
            type: entry.entryType,
            duration: entry.duration,
            startTime: entry.startTime,
          });
        }
      }
    });

    observer.observe({ entryTypes });
  } catch (error) {
    console.error('Error observing performance:', error);
  }
}
