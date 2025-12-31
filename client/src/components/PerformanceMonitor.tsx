import { useState, useEffect } from 'react';
import { collectMetrics, calculatePerformanceScore, checkMemoryUsage } from '../lib/performance';

// Performance Dashboard Component - READ ONLY
export const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [score, setScore] = useState<number>(100);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const updateMetrics = () => {
      const currentMetrics = collectMetrics();
      const currentScore = calculatePerformanceScore(currentMetrics);
      setMetrics(currentMetrics);
      setScore(currentScore);
    };

    // Initial metrics
    updateMetrics();

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  // Toggle visibility with keyboard shortcut (Ctrl+Shift+P)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(!isVisible);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (process.env.NODE_ENV !== 'development' || !isVisible || !metrics) {
    return null;
  }

  const memory = checkMemoryUsage();

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg shadow-lg z-50 font-mono text-xs max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">Performance Monitor</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      {/* Performance Score */}
      <div className="mb-3">
        <div className="flex justify-between">
          <span>Score:</span>
          <span className={`font-bold ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
            {score}/100
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
          <div 
            className={`h-2 rounded-full ${score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-yellow-400' : 'text-red-400'}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Navigation Timing */}
      {metrics.navigation && (
        <div className="mb-3">
          <div className="font-semibold mb-1">Navigation Timing</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>FCP:</span>
              <span>{Math.round(metrics.navigation.loadEventEnd - metrics.navigation.fetchStart)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>DOM Ready:</span>
              <span>{Math.round(metrics.navigation.domContentLoadedEventEnd - metrics.navigation.fetchStart)}ms</span>
            </div>
          </div>
        </div>
      )}

      {/* Memory Usage */}
      {memory && (
        <div className="mb-3">
          <div className="font-semibold mb-1">Memory Usage</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Used:</span>
              <span>{memory.used}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span>{memory.total}</span>
            </div>
          </div>
        </div>
      )}

      {/* Network Info */}
      {metrics.network && (
        <div className="mb-3">
          <div className="font-semibold mb-1">Network</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Type:</span>
              <span>{metrics.network.effectiveType}</span>
            </div>
            <div className="flex justify-between">
              <span>Speed:</span>
              <span>{metrics.network.downlink} Mbps</span>
            </div>
          </div>
        </div>
      )}

      <div className="text-gray-400 text-xs mt-3">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
};

// Performance Hook for components
export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`[Performance] ${componentName} render time: ${endTime - startTime}ms`);
    };
  }, [componentName]);
};
