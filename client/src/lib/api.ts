import { useQuery } from "@tanstack/react-query";
import { 
  Palette, 
  Home, 
  Ruler, 
  Box, 
  Layers, 
  PenTool, 
  Eye,
  DraftingCompass,
  Building,
  PaintBucket,
  Sofa,
  Move3D
} from "lucide-react";

// API utility functions
const API_BASE = "/api";

export const api = {
  skills: () => fetch(`${API_BASE}/skills`).then(res => res.json()),
  experiences: () => fetch(`${API_BASE}/experiences`).then(res => res.json()),
  projects: () => fetch(`${API_BASE}/projects`).then(res => res.json()),
  profile: () => fetch(`${API_BASE}/profile`).then(res => res.json()),
  seed: () => fetch(`${API_BASE}/seed`, { method: "POST" }).then(res => res.json()),
};

// React Query hooks
export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: api.skills,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useExperiences = () => {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: api.experiences,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: api.projects,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: api.profile,
    staleTime: 5 * 60 * 1000,
  });
};

// Utility function to get image source (URL or base64 data)
export const getImageSrc = (imageUrl?: string, imageData?: string): string => {
  if (imageData) {
    return `data:image/png;base64,${imageData}`;
  }
  return imageUrl || "";
};

// Icon mapping for skills
export const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    // Core icons for interior design
    Palette: Palette,
    Home: Home,
    Ruler: Ruler,
    Box: Box,
    Layers: Layers,
    PenTool: PenTool,
    Eye: Eye,
    DraftingCompass: DraftingCompass,
    Building: Building,
    PaintBucket: PaintBucket,
    Sofa: Sofa,
    Move3D: Move3D,
    
    // Fallback for any other icons
    default: Palette
  };
  return icons[iconName] || icons.default;
};