import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

interface ViewAllButtonProps {
  text?: string;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export const ViewAllButton = ({ 
  text = "View All", 
  href = "/projects",
  variant = "primary",
  size = "md",
  showIcon = true,
  className = ""
}: ViewAllButtonProps) => {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const sizeStyles = {
    sm: "px-6 py-2.5 text-sm",
    md: "px-8 py-3 text-base",
    lg: "px-10 py-4 text-lg"
  };

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-primary to-primary/80 
      text-primary-foreground 
      border border-primary/20
      shadow-lg shadow-primary/25
      hover:shadow-xl hover:shadow-primary/35
      hover:scale-[1.02]
      active:scale-[0.98]
    `,
    secondary: `
      glass
      text-foreground
      border border-border
      shadow-lg
      hover:shadow-xl
      hover:scale-[1.02]
      active:scale-[0.98]
    `,
    outline: `
      bg-transparent
      text-primary
      border-2 border-primary
      hover:bg-primary/10
      hover:border-primary/60
      active:bg-primary/20
    `
  };

  const handleClick = () => {
    setLocation(href);
  };

  return (
    <motion.div
      className="inline-block"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <button
        onClick={handleClick}
        className={`
          relative overflow-hidden group
          inline-flex items-center justify-center gap-2
          font-semibold rounded-full
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
        `}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        
        {/* Sparkle effect on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-1 -right-1"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </motion.div>
        )}
        
        {/* Button content */}
        <span className="relative z-10 flex items-center gap-2">
          {text}
          {showIcon && (
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          )}
        </span>
        
        {/* Subtle border animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/50 via-transparent to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </button>
    </motion.div>
  );
};

export default ViewAllButton;
