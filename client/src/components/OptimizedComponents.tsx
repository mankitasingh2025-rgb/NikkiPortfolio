import { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { getIconComponent } from '@/lib/api';
import { ProjectCard } from '@/components/Portfolio';

interface SkillCardProps {
  skill: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
  index: number;
}

export const SkillCard = memo(({ skill, index }: SkillCardProps) => {
  const IconComponent = getIconComponent(skill.icon);
  
  return (
    <div
      className="flex items-start gap-4 p-6 glass rounded-2xl hover-lift animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div 
        className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0 hover-scale"
      >
        <IconComponent className="w-7 h-7" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold mb-3">{skill.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{skill.description}</p>
      </div>
    </div>
  );
});

SkillCard.displayName = 'SkillCard';

interface ExperienceCardProps {
  job: {
    id: string;
    role: string;
    company: string;
    description: string;
    period: string;
  };
  index: number;
}

export const ExperienceCard = memo(({ job, index }: ExperienceCardProps) => {
  return (
    <div 
      className="flex flex-col md:flex-row gap-4 md:items-center justify-between p-8 glass rounded-3xl soft-shadow cursor-pointer group hover-lift animate-fade-in"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div>
        <h3 className="text-xl font-bold text-primary">{job.role}</h3>
        <p className="text-lg font-medium">{job.company}</p>
        <p className="text-muted-foreground mt-2 max-w-2xl">{job.description}</p>
      </div>
      <div className="text-sm font-semibold bg-primary/5 text-primary px-4 py-2 rounded-full h-fit whitespace-nowrap">
        {job.period}
      </div>
    </div>
  );
});

ExperienceCard.displayName = 'ExperienceCard';

interface ProjectCardWrapperProps {
  project: {
    id: string;
    title: string;
    description: string;
    tags: string | null;
    images: Array<{
      id: string;
      caption: string | null;
      createdAt: string | null;
      updatedAt: string | null;
      projectId: string;
      imageUrl: string | null;
      imageData: string | null;
      imageOrder: number | null;
    }>;
  };
  index: number;
  getImageSrc: (imageUrl?: string, imageData?: string) => string;
}

export const ProjectCardWrapper = memo(({ project, index, getImageSrc }: ProjectCardWrapperProps) => {
  return (
    <div
      className="cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <ProjectCard 
        title={project.title} 
        description={project.description}
        tags={project.tags ? (typeof project.tags === 'string' ? project.tags.split(',').map(tag => tag.trim()) : []) : []}
        image={project.images && project.images.length > 0 
          ? getImageSrc(project.images[0].imageUrl || undefined, project.images[0].imageData || undefined)
          : undefined
        }
      />
    </div>
  );
});

ProjectCardWrapper.displayName = 'ProjectCardWrapper';
