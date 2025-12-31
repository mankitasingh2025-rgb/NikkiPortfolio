import { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { useLocation } from 'wouter';
import { OptimizedImage } from '@/components/OptimizedImage';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  id?: string;
  centered?: boolean;
}

export const Section = memo(
  ({ title, children, id, centered = true }: SectionProps) => (
    <section
      id={id}
      className={`min-h-screen py-12 px-6 max-w-6xl mx-auto scroll-mt-20 flex flex-col ${
        centered ? 'justify-center' : 'justify-start'
      }`}
    >
      <h2
        className="text-3xl font-bold mb-12 text-center animate-fade-in"
        data-testid={`heading-section-${id}`}
      >
        {title}
      </h2>
      {children}
    </section>
  )
);

interface CardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  tags?: string[];
  image?: string;
  projectId?: string; // Add projectId prop
}

export const ProjectCard = memo(({ title, description, tags, image, projectId }: CardProps) => {
  const [, setLocation] = useLocation();
  // Use projectId if provided, otherwise fall back to URL-friendly title
  const navigationId = projectId || title.toLowerCase().replace(/\s+/g, '-');

  return (
    <div
      className="glass rounded-3xl soft-shadow group overflow-hidden flex flex-col smooth-transition hover-lift cursor-pointer"
      data-testid={`card-project-${navigationId}`}
      onClick={() => setLocation(`/projects/${navigationId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setLocation(`/projects/${navigationId}`);
        }
      }}
    >
      {image && (
        <div className="w-full h-48 overflow-hidden bg-primary/5">
          <OptimizedImage
            src={image}
            alt={title}
            className="group-hover:scale-110 transition-transform duration-200"
          />
        </div>
      )}
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed flex-1">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});
