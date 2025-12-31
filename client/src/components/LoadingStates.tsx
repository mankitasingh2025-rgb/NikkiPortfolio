import { useState } from 'react';
import { cn } from '@/lib/utils';

// Skeleton loading components for various content types
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("glass rounded-3xl soft-shadow overflow-hidden", className)}>
    <div className="skeleton h-48 w-full" />
    <div className="p-8 space-y-4">
      <div className="skeleton h-6 w-3/4 rounded" />
      <div className="space-y-2">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="skeleton h-4 w-4/6 rounded" />
      </div>
      <div className="flex gap-2 pt-4">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-14 rounded-full" />
      </div>
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={cn(
          "skeleton h-4 rounded",
          i === lines - 1 ? "w-3/4" : "w-full"
        )}
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  };
  
  return (
    <div className={cn("skeleton rounded-full", sizeClasses[size])} />
  );
};

export const SkeletonButton = ({ width = "auto", height = "auto" }: { width?: string; height?: string }) => (
  <div 
    className="skeleton rounded-full" 
    style={{ width, height }}
  />
);

export const SkeletonSkill = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-3 p-4 glass rounded-2xl", className)}>
    <div className="skeleton w-12 h-12 rounded-xl" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-5 w-1/3 rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
    </div>
  </div>
);

export const SkeletonExperience = ({ className }: { className?: string }) => (
  <div className={cn("p-6 glass rounded-2xl space-y-4", className)}>
    <div className="skeleton h-6 w-1/3 rounded" />
    <div className="skeleton h-4 w-1/4 rounded" />
    <div className="space-y-2">
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-5/6 rounded" />
      <div className="skeleton h-4 w-4/6 rounded" />
    </div>
  </div>
);

// Loading spinner component
export const LoadingSpinner = ({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };
  
  return (
    <div className={cn("animate-spin rounded-full border-2 border-primary/20 border-t-primary", sizeClasses[size], className)} />
  );
};

// Pulse loading indicator
export const PulseLoader = ({ className }: { className?: string }) => (
  <div className={cn("flex space-x-1", className)}>
    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75" />
    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
  </div>
);

// Progress bar loader
export const ProgressBar = ({ progress = 0, className }: { progress?: number; className?: string }) => (
  <div className={cn("w-full bg-gray-200 rounded-full h-2", className)}>
    <div 
      className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
    />
  </div>
);

// Content loader with fade-in effect
export const ContentLoader = ({ 
  isLoading, 
  children, 
  skeleton, 
  className 
}: { 
  isLoading: boolean; 
  children: React.ReactNode; 
  skeleton: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("relative", className)}>
    {isLoading ? (
      <div className="animate-fade-in">
        {skeleton}
      </div>
    ) : (
      <div className="animate-fade-in">
        {children}
      </div>
    )}
  </div>
);

// Image loader with progressive loading
export const ImageLoader = ({ 
  src, 
  alt, 
  className,
  onLoad,
  onError 
}: { 
  src: string; 
  alt: string; 
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!imageLoaded && !imageError && (
        <div className="skeleton absolute inset-0" />
      )}
      {imageError ? (
        <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
          <span className="text-sm">Failed to load</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

// Page loader component
export const PageLoader = ({ message = "Loading..." }: { message?: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
    <LoadingSpinner size="lg" />
    <p className="text-muted-foreground animate-pulse">{message}</p>
  </div>
);

// Inline loading state for buttons
export const LoadingButton = ({ 
  children, 
  isLoading, 
  className, 
  ...props 
}: { 
  children: React.ReactNode; 
  isLoading: boolean; 
  className?: string;
  [key: string]: any;
}) => (
  <button 
    className={cn(
      "relative inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
      className
    )}
    disabled={isLoading}
    {...props}
  >
    {isLoading && (
      <LoadingSpinner size="sm" className="mr-2" />
    )}
    <span className={cn(isLoading ? "opacity-70" : "")}>
      {children}
    </span>
  </button>
);
