import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useLocation } from 'wouter';
import { memo } from 'react';

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
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-3xl font-bold mb-12 text-center"
        data-testid={`heading-section-${id}`}
      >
        {title}
      </motion.h2>
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
    <motion.div
      whileHover={{ y: -5 }}
      className="glass rounded-3xl soft-shadow group overflow-hidden flex flex-col smooth-transition hover-lift"
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
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 smooth-transition"
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
    </motion.div>
  );
});
