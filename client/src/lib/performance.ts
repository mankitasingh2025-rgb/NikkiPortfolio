// Performance monitoring utilities - NO FUNCTIONALITY CHANGES
export const reportWebVitals = (onPerfEntry?: (entry: PerformanceEntry) => void) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (onPerfEntry) {
          onPerfEntry(entry);
        }
        
        // Log to console in development only
        if (process.env.NODE_ENV === 'development') {
          const entryValue = 'value' in entry ? (entry as any).value : entry.startTime;
          console.log(`[Performance] ${entry.name}:`, {
            value: entryValue,
            rating: getRating(entry.name, entryValue),
          });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    } catch (e) {
      console.warn('Performance observer not fully supported:', e);
    }

    return () => observer.disconnect();
  }
};

// Rating function for performance metrics
const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const thresholds: Record<string, { good: number; poor: number }> = {
    'FCP': { good: 1800, poor: 3000 }, // First Contentful Paint
    'LCP': { good: 2500, poor: 4000 },  // Largest Contentful Paint
    'FID': { good: 100, poor: 300 },   // First Input Delay
    'CLS': { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
    'TTFB': { good: 800, poor: 1800 }, // Time to First Byte
  };

  const threshold = thresholds[name];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

// Memory usage monitoring - READ ONLY
export const checkMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
    };
  }
  return null;
};

// Network performance monitoring - READ ONLY
export const measureNetworkSpeed = async () => {
  const nav = navigator as any;
  if (!nav.connection) return null;
  
  const connection = nav.connection;
  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink + ' Mbps',
    rtt: connection.rtt + ' ms',
  };
};

// Component render monitoring - READ ONLY
export const measureRender = (componentName: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      const start = performance.now();
      const result = originalMethod.apply(this, args);
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Render] ${componentName}.${propertyKey}: ${end - start}ms`);
      }
      return result;
    };
    
    return descriptor;
  };
};

// Performance metrics collector
export const collectMetrics = () => {
  const metrics = {
    // Navigation timing
    navigation: performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming,
    // Paint timing
    paint: performance.getEntriesByType('paint'),
    // Memory usage
    memory: checkMemoryUsage(),
    // Network info
    network: null as any,
  };

  // Get network info if available
  if ('connection' in navigator) {
    const nav = navigator as any;
    metrics.network = {
      effectiveType: nav.connection.effectiveType,
      downlink: nav.connection.downlink,
      rtt: nav.connection.rtt,
    };
  }

  return metrics;
};

// Performance score calculation
export const calculatePerformanceScore = (metrics: any) => {
  let score = 100;
  
  // FCP penalty
  if (metrics.navigation?.loadEventEnd) {
    const fcp = metrics.navigation.loadEventEnd - metrics.navigation.fetchStart;
    if (fcp > 3000) score -= 30;
    else if (fcp > 2000) score -= 15;
  }
  
  // Memory penalty
  if (metrics.memory) {
    const usedMB = parseInt(metrics.memory.used);
    if (usedMB > 100) score -= 20;
    else if (usedMB > 50) score -= 10;
  }
  
  return Math.max(0, score);
};
