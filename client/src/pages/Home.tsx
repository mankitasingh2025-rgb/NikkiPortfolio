import { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, ExternalLink, Code2, Palette, Sparkles, Menu, X, Moon, Sun, MessageCircle, ArrowUp, Check, Users, Briefcase, Award } from "lucide-react";
import { Section, ProjectCard } from "@/components/Portfolio";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useSkills, useExperiences, useProjects, useProfile, getImageSrc, getIconComponent } from "@/lib/api";
import { SkeletonCard, SkeletonSkill, SkeletonExperience, ContentLoader, LoadingSpinner } from "@/components/LoadingStates";
import type { Skill, Experience, Project, ProjectImage } from "../../../shared/schema";

import avatarImage from "@assets/avatar_transparent.png";
import resumeFile from "@assets/Nikita_Singh_Resume_1766831247652.pdf";

export default memo(function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Fetch data from API
  const { data: skills = [], isLoading: skillsLoading } = useSkills();
  const { data: experiences = [], isLoading: experiencesLoading } = useExperiences();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: profile } = useProfile();

  // const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  //   e.preventDefault();
  //   const element = document.getElementById(id);
  //   if (element) {
  //     const navHeight = 80;
  //     const currentScroll = window.pageYOffset;
  //     const elementTop = element.offsetTop;
  //     const targetPosition = elementTop - navHeight;
      
  //     // Only scroll if we're not already at the target position (with 50px tolerance)
  //     if (Math.abs(currentScroll - targetPosition) > 50) {
  //       // Use scrollIntoView with block start for consistent positioning
  //       element.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'start',
  //         inline: 'nearest'
  //       });
        
  //       // Then adjust for navbar height
  //       setTimeout(() => {
  //         const adjustedScroll = window.pageYOffset;
  //         const offsetPosition = elementTop - navHeight;
          
  //         if (Math.abs(adjustedScroll - offsetPosition) > 10) {
  //           window.scrollTo({
  //             top: offsetPosition,
  //             behavior: 'smooth'
  //           });
  //         }
  //       }, 100);
  //     }
      
  //     setMobileMenuOpen(false);
  //   }
  // };
const scrollToSection = (e: any, id: string) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  setMobileMenuOpen(false);
};

  const copyEmailToClipboard = async () => {
    const email = profile?.email || "iamnikita2911@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } catch (err) {
        console.error('Failed to copy email: ', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-black/5 dark:border-white/10 smooth-transition">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" onClick={(e) => scrollToSection(e, 'home')} className="text-xl font-bold tracking-tight text-primary">Portfolio.</a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-foreground dark:text-foreground">
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-primary transition-colors link-smooth">About</a>
            <a href="#work" onClick={(e) => scrollToSection(e, 'work')} className="hover:text-primary transition-colors link-smooth">Work</a>
            <a href="#experience" onClick={(e) => scrollToSection(e, 'experience')} className="hover:text-primary transition-colors link-smooth">Experience</a>
            <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-primary transition-colors link-smooth">Contact</a>
          </div>

          {/* Right Section: Resume Button & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {/* Resume Button */}
            <a href={resumeFile} download="Nikita_Singh_Resume.pdf" className="cursor-pointer">
              <Button variant="outline" className="rounded-full px-6 cursor-pointer btn-smooth hover-lift" data-testid="button-resume">
                Resume
              </Button>
            </a>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-primary/10 rounded-lg smooth-transition hover-scale"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white dark:bg-black/50 border-t border-black/5 dark:border-white/10"
            >
              <div className="px-6 py-4 space-y-3 flex flex-col items-center text-foreground dark:text-foreground">
                <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="block py-2 hover:text-primary transition-colors font-medium">About</a>
                <a href="#work" onClick={(e) => scrollToSection(e, 'work')} className="block py-2 hover:text-primary transition-colors font-medium">Work</a>
                <a href="#experience" onClick={(e) => scrollToSection(e, 'experience')} className="block py-2 hover:text-primary transition-colors font-medium">Experience</a>
                <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="block py-2 hover:text-primary transition-colors font-medium">Contact</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen px-6 flex items-center justify-center ">
        <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Available for new projects</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            {profile?.name || "Nikita Singh"} <br /> 
            <span className="text-primary">{profile?.title || "Interior Designer."}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
            {profile?.bio || "Dynamic Executive Architect & Interior Designer with 4+ years of experience in modular design, space planning, and creating smart, efficient living spaces."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center">
            <Button 
              size="lg" 
              className="rounded-full px-8 h-14 text-base cursor-pointer btn-smooth hover-lift hover-glow" 
              onClick={(e) => scrollToSection(e as any, 'contact')}
              data-testid="button-hire"
            >
              Let's talk
            </Button>
            
            {/* Social Icons */}
            <div className="flex gap-3 md:gap-4">
              <a href={profile?.linkedinUrl || "https://linkedin.com/in/nikita-singh"} target="_blank" rel="noopener noreferrer" className="rounded-full flex-shrink-0">
                <Button size="icon" className="rounded-full w-10 h-10 md:w-12 md:h-12 cursor-pointer bg-primary/10 text-primary hover:bg-primary hover:text-white smooth-transition hover-scale" title="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </Button>
              </a>
              <a href={profile?.twitterUrl || "https://twitter.com/nikita_singh"} target="_blank" rel="noopener noreferrer" className="rounded-full flex-shrink-0">
                <Button size="icon" className="rounded-full w-10 h-10 md:w-12 md:h-12 cursor-pointer bg-primary/10 text-primary hover:bg-primary hover:text-white smooth-transition hover-scale" title="Twitter">
                  <Twitter className="w-5 h-5" />
                </Button>
              </a>
              <a href={profile?.instagramUrl || "https://instagram.com/nikita_singh"} target="_blank" rel="noopener noreferrer" className="rounded-full flex-shrink-0">
                <Button size="icon" className="rounded-full w-10 h-10 md:w-12 md:h-12 cursor-pointer bg-primary/10 text-primary hover:bg-primary hover:text-white smooth-transition hover-scale" title="Instagram">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                  </svg>
                </Button>
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="hidden md:flex flex-1 relative justify-center md:justify-end items-center"
        >
          <div className="w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-primary/10 rounded-full blur-3xl absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="relative animate-float w-2/3 md:w-full max-w-[400px]">
            <img 
              src={getImageSrc(profile?.avatarUrl, profile?.avatarData) || avatarImage}
              alt={`${profile?.name || "Nikita Singh"} Avatar`}
              className="w-full h-auto drop-shadow-2xl"
              loading="lazy"
              data-testid="img-avatar"
            />
          </div>
        </motion.div>
        </div>
      </section>

      {/* Services/Skills */}
      <Section title="Expertise" id="about" centered={false}>
        <div className="grid md:grid-cols-3 gap-8">
          {skillsLoading ? (
            // Enhanced loading skeleton with staggered animation
            Array.from({ length: 3 }).map((_, i) => (
              <motion.div 
                key={i} 
                className="p-8 rounded-3xl glass soft-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              >
                <motion.div 
                  className="w-12 h-12 bg-primary/10 rounded-2xl mb-6"
                  animate={{ 
                    backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.2
                  }}
                ></motion.div>
                <motion.div 
                  className="h-6 bg-primary/10 rounded mb-3"
                  animate={{ 
                    backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.2 + 0.1
                  }}
                ></motion.div>
                <motion.div 
                  className="h-4 bg-primary/10 rounded mb-2"
                  animate={{ 
                    backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.2 + 0.2
                  }}
                ></motion.div>
                <motion.div 
                  className="h-4 bg-primary/10 rounded w-3/4"
                  animate={{ 
                    backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.2 + 0.3
                  }}
                ></motion.div>
              </motion.div>
            ))
          ) : (
            skills.map((skill, i) => {
              const IconComponent = getIconComponent(skill.icon);
              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex items-start gap-4 p-6 glass rounded-2xl hover-lift"
                >
                  <motion.div 
                    className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconComponent className="w-7 h-7" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold mb-3">{skill.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{skill.description}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </Section>

      {/* Experience Section */}
      <Section title="Work Experience" id="experience" centered={false}>
        <div className="space-y-8">
          {experiencesLoading ? (
            // Enhanced loading skeleton with staggered animation
            Array.from({ length: 3 }).map((_, i) => (
              <motion.div 
                key={i} 
                className="flex flex-col md:flex-row gap-4 md:items-center justify-between p-8 glass rounded-3xl soft-shadow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              >
                <div className="flex-1">
                  <motion.div 
                    className="h-6 bg-primary/10 rounded mb-2 w-1/2"
                    animate={{ 
                      backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                    }}
                    transition={{ 
                      duration: 2.2, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.3
                    }}
                  ></motion.div>
                  <motion.div 
                    className="h-5 bg-primary/10 rounded mb-4 w-1/3"
                    animate={{ 
                      backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                    }}
                    transition={{ 
                      duration: 2.2, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.3 + 0.1
                    }}
                  ></motion.div>
                  <motion.div 
                    className="h-4 bg-primary/10 rounded mb-2"
                    animate={{ 
                      backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                    }}
                    transition={{ 
                      duration: 2.2, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.3 + 0.2
                    }}
                  ></motion.div>
                  <motion.div 
                    className="h-4 bg-primary/10 rounded w-3/4"
                    animate={{ 
                      backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                    }}
                    transition={{ 
                      duration: 2.2, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.3 + 0.3
                    }}
                  ></motion.div>
                </div>
                <motion.div 
                  className="h-8 bg-primary/10 rounded-full w-32"
                  animate={{ 
                    backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                  }}
                  transition={{ 
                    duration: 2.2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.3 + 0.4
                  }}
                ></motion.div>
              </motion.div>
            ))
          ) : (
            experiences.map((job: Experience, i: number) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ 
                  x: 5,
                  scale: 1.01,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="flex flex-col md:flex-row gap-4 md:items-center justify-between p-8 glass rounded-3xl soft-shadow cursor-pointer group"
              >
                <div>
                  <h3 className="text-xl font-bold text-primary">{job.role}</h3>
                  <p className="text-lg font-medium">{job.company}</p>
                  <p className="text-muted-foreground mt-2 max-w-2xl">{job.description}</p>
                </div>
                <div className="text-sm font-semibold bg-primary/5 text-primary px-4 py-2 rounded-full h-fit whitespace-nowrap">
                  {job.period}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Section>


       {/* Projects */}
      <Section title="Selected Work" id="work" centered={false}>
        <div className="grid md:grid-cols-2 gap-8">
          {projectsLoading ? (
            // Enhanced loading skeleton with staggered animation
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div 
                key={i} 
                className="glass rounded-3xl soft-shadow overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
              >
                <motion.div 
                  className="w-full h-48 bg-primary/10"
                  animate={{ 
                    backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.25
                  }}
                ></motion.div>
                <div className="p-8">
                  <motion.div 
                    className="h-6 bg-primary/10 rounded mb-3 w-3/4"
                    animate={{ 
                      backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.25 + 0.1
                    }}
                  ></motion.div>
                  <motion.div 
                    className="h-4 bg-primary/10 rounded mb-2"
                    animate={{ 
                      backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.25 + 0.2
                    }}
                  ></motion.div>
                  <motion.div 
                    className="h-4 bg-primary/10 rounded w-1/2 mb-6"
                    animate={{ 
                      backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.25 + 0.3
                    }}
                  ></motion.div>
                  <div className="flex gap-2">
                    <motion.div 
                      className="h-6 bg-primary/10 rounded-full w-16"
                      animate={{ 
                        backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                      }}
                      transition={{ 
                        duration: 2.5, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: i * 0.25 + 0.4
                      }}
                    ></motion.div>
                    <motion.div 
                      className="h-6 bg-primary/10 rounded-full w-20"
                      animate={{ 
                        backgroundColor: ["hsl(var(--primary)/0.1)", "hsl(var(--primary)/0.05)", "hsl(var(--primary)/0.1)"] 
                      }}
                      transition={{ 
                        duration: 2.5, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: i * 0.25 + 0.5
                      }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            projects.slice(0, 4).map((project: Project & { images: ProjectImage[] }, i: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ 
                  scale: 1.03,
                  y: -5,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="cursor-pointer"
              >
                <ProjectCard 
                  title={project.title} 
                  description={project.description}
                  tags={Array.isArray(project.tags) ? project.tags : []}
                  image={project.images && project.images.length > 0 
                    ? getImageSrc(project.images[0].imageUrl || undefined, project.images[0].imageData || undefined)
                    : undefined
                  }
                />
              </motion.div>
            ))
          )}
        </div>
        <div className="mt-12 text-center">
          <a href="/projects">
            <Button variant="link" className="text-primary font-semibold gap-2" data-testid="link-all-projects">
              View all projects <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </Section>

         {/* Contact Section */}
      <Section title="Contact" id="contact" centered={false}>
         <motion.div
                  key="contact-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="cursor-pointer md:col-span-2"
                >
                  <div className="relative group">
                    {/* Main card with gradient background */}
                    <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl p-1 overflow-hidden">
                      <div className="absolute inset-0 bg-white dark:bg-black/90 rounded-3xl"></div>
                      
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-2xl"></div>
                      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                      
                      <div className="relative p-8 md:p-12">
                        <div className="text-center max-w-3xl mx-auto">
                          {/* Icon with animation */}
                          <motion.div 
                            className="w-16 h-16 bg-white dark:bg-black/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-primary/20"
                            whileHover={{ 
                              scale: 1.1, 
                              rotate: 5,
                              boxShadow: "0 20px 40px -10px rgba(147, 51, 234, 0.3)"
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <Mail className="w-8 h-8 text-primary" />
                          </motion.div>
                          
                          {/* Main content */}
                          <div className="space-y-4 mb-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                              Let's Create Something Amazing
                            </h3>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                              Have a project in mind? I'd love to hear about it. Let's collaborate and bring your vision to life.
                            </p>
                          </div>

                          {/* Stats Section */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                            <div className="text-center p-4 bg-white/50 dark:bg-black/30 rounded-2xl backdrop-blur-sm border border-primary/20">
                              <div className="w-12 h-12 bg-[#9b6aef] rounded-full flex items-center justify-center mx-auto mb-3">
                                <Users className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-2xl font-bold text-primary mb-1">100%</div>
                              <div className="text-sm text-muted-foreground font-medium">Client Satisfied</div>
                            </div>
                            <div className="text-center p-4 bg-white/50 dark:bg-black/30 rounded-2xl backdrop-blur-sm border border-primary/20">
                              <div className="w-12 h-12 bg-[#9b6aef] rounded-full flex items-center justify-center mx-auto mb-3">
                                <Briefcase className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-2xl font-bold text-primary mb-1">50+</div>
                              <div className="text-sm text-muted-foreground font-medium">Projects Done</div>
                            </div>
                            <div className="text-center p-4 bg-white/50 dark:bg-black/30 rounded-2xl backdrop-blur-sm border border-primary/20">
                              <div className="w-12 h-12 bg-[#9b6aef] rounded-full flex items-center justify-center mx-auto mb-3">
                                <Award className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-2xl font-bold text-primary mb-1">4+</div>
                              <div className="text-sm text-muted-foreground font-medium">Years Experience</div>
                            </div>
                          </div>
                          
                          {/* Email display */}
                          <div className="relative inline-block mb-8">
                            <motion.div
                              className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-black/50 rounded-full cursor-pointer hover:bg-white dark:hover:bg-black/70 transition-all duration-300 group backdrop-blur-sm border border-primary/20"
                              onClick={copyEmailToClipboard}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Mail className="w-5 h-5 text-primary" />
                              <span className="text-base font-medium text-foreground">{profile?.email || "iamnikita2911@gmail.com"}</span>
                              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                                <span className="text-xs text-primary">📋</span>
                              </div>
                            </motion.div>
                            
                            {/* Copy popup */}
                            <AnimatePresence>
                              {copiedEmail && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg whitespace-nowrap"
                                >
                                  <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    <span>Email Copied!</span>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          
                          {/* CTA Button */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="cursor-pointer"
                          >
                            <Button 
                              size="lg" 
                              className="rounded-full px-8 py-4 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/80 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer text-white"
                              onClick={() => window.location.href = "mailto:iamnikita2911@gmail.com"}
                            >
                              <Mail className="w-5 h-5 mr-3" />
                              Get In Touch
                            </Button>
                          </motion.div>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
      </Section>



      {/* View All Projects Button */}
    



        


      {/* Footer */}
      <footer  className="py-12 md:py-16 border-t border-black/5 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Main CTA Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mb-12 md:mb-16">
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Ready to start?</h2>
              <p className="text-xs md:text-sm text-muted-foreground">Let's build something amazing together.</p>
            </div>
            <Button 
              size="sm" 
              className="rounded-full px-6 md:px-8 text-xs md:text-sm cursor-pointer whitespace-nowrap" 
              data-testid="button-footer-contact"
              onClick={() => {
                window.location.href = `mailto:${profile?.email || "iamnikita2911@gmail.com"}`;
              }}
            >
              Say Hello
            </Button>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12 pb-8 md:pb-12 border-b border-black/5 dark:border-white/10">
            {/* About */}
            <div>
              <h3 className="font-semibold text-sm md:text-base mb-2 md:mb-4">About</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">Interior Designer with 4+ years of experience creating beautiful, functional spaces.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-sm md:text-base mb-2 md:mb-4">Navigation</h3>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                <li><a href="#" onClick={(e) => scrollToSection(e, 'home')} className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
                <li><a href="#" onClick={(e) => scrollToSection(e, 'about')} className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
                <li><a href="#" onClick={(e) => scrollToSection(e, 'work')} className="text-muted-foreground hover:text-primary transition-colors">Work</a></li>
                <li><a href="#" onClick={(e) => scrollToSection(e, 'experience')} className="text-muted-foreground hover:text-primary transition-colors">Experience</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-sm md:text-base mb-2 md:mb-4">Contact</h3>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
                <li><a href={`mailto:${profile?.email || "iamnikita2911@gmail.com"}`} className="text-muted-foreground hover:text-primary transition-colors break-all">{profile?.email || "iamnikita2911@gmail.com"}</a></li>
                <li><a href={`tel:${profile?.phone || "+919876543210"}`} className="text-muted-foreground hover:text-primary transition-colors">{profile?.phone || "+91 98765 43210"}</a></li>
                <li><p className="text-muted-foreground">{profile?.location || "New Delhi, India"}</p></li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-sm md:text-base mb-2 md:mb-4">Connect</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <a href={profile?.linkedinUrl || "https://linkedin.com/in/nikita-singh"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href={profile?.instagramUrl || "https://instagram.com/nikita_singh"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href={profile?.twitterUrl || "https://twitter.com/nikita_singh"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href={`mailto:${profile?.email || "iamnikita2911@gmail.com"}`} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground text-center sm:text-left">
            <p>© 2025 Nikita Singh. All rights reserved.</p>
            <div className="flex gap-3 md:gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primary/90 transition-colors smooth-transition hover-scale"
        data-testid="button-scroll-top"
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>

      {/* Dark Mode Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="fixed bottom-8 left-8 w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primary/90 transition-colors dark:bg-primary/80 dark:hover:bg-primary smooth-transition hover-scale"
        data-testid="button-dark-mode"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </motion.button>
    </div>
  );
});
