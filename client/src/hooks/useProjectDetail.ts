import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";

const API_BASE = "/api";

export const useProjectDetail = () => {
  const { id } = useParams();

  return useQuery({
    queryKey: ["projects"],
    queryFn: () => fetch(`${API_BASE}/projects`).then(res => res.json()),
    select: (projects: any[]) => {
      return projects.find((project: any) => 
        project.id === id || 
        project.title.toLowerCase().replace(/\s+/g, '-') === id
      ) || projects[0]; // Fallback to first project
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProjectImages = (projectId: string) => {
  return useQuery({
    queryKey: ["project-images", projectId],
    queryFn: () => fetch(`${API_BASE}/projects`).then(res => res.json()),
    select: (projects: any[]) => {
      const project = projects.find((p: any) => p.id === projectId);
      return project?.images || [];
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
};
