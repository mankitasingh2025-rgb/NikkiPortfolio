import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, User, Moon, Sun, ChevronRight, Mail, Check, ExternalLink, Linkedin, MessageCircle, Users, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useParams, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { getImageSrc, useProfile } from "@/lib/api";
import { ImageGalleryModal } from "@/components/ImageGalleryModal";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const { isDark, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const { data: project, isLoading, error } = useProjectDetail();
  const { data: profile } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmailToClipboard = async () => {
    const email = profile?.email || "iamnikita2911@gmail.com";
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        // Fallback for older browsers and mobile
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopiedEmail(true);
          setTimeout(() => setCopiedEmail(false), 2000);
        } catch (err) {
          console.error('Fallback copy failed:', err);
          // Show alert as last resort
          alert(`Email copied: ${email}`);
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Copy failed:', err);
      // Show alert as last resort
      alert(`Email copied: ${email}`);
    }
  };

  useEffect(() => {
    // Scroll to top immediately when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    
    // Also scroll after a short delay to ensure it overrides any browser scroll behavior
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/projects")}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  // Parse tags if they're stored as JSON string
  const tags = typeof project.tags === 'string' ? JSON.parse(project.tags) : (project.tags || []);
  
  // Get images from the project object (now includes images array)
  const projectImages = project.images || [];
  
  // Generate image sources using the getImageSrc utility
  const galleryImages = projectImages.map((img: any, index: number) => {
    const src = getImageSrc(img.imageUrl, img.imageData);
    console.log(`=== Image ${index + 1} ===`);
    console.log(`ID: ${img.id}`);
    console.log(`URL: ${img.imageUrl}`);
    console.log(`Has Data: ${!!img.imageData}`);
    console.log(`Generated Src: ${src}`);
    console.log(`-------------------`);
    return src;
  }).filter((src: string) => src && src.trim() !== '');
  
  // Handle image error and track failed images
  const handleImageError = (imageIndex: number, imageUrl: string) => {
    console.log(`❌ IMAGE FAILED - Index ${imageIndex + 1}: ${imageUrl}`);
    setFailedImages(prev => new Set(prev).add(imageIndex));
  };
  
  // Filter out failed images
  const validGalleryImages = galleryImages.filter((_: string, index: number) => !failedImages.has(index));
  
  console.log('Project images count:', projectImages.length);
  console.log('Failed images count:', failedImages.size);
  console.log('Valid gallery images count:', validGalleryImages.length);
  console.log('Gallery images:', galleryImages);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-black/5 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tight text-primary">Portfolio.</a>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full gap-2"
            onClick={() => setLocation("/projects")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen pb-8 px-6 max-w-6xl mx-auto scroll-mt-32">
        <div className="pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{project.title}</h1>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
              {project.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(project.createdAt || Date.now()).getFullYear()}
              </div>
              {project.client && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {project.client}
                </div>
              )}
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl md:rounded-3xl overflow-hidden h-64 md:h-96 lg:h-[500px] mb-12"
          >
            {validGalleryImages.length > 0 ? (
              <img 
                src={validGalleryImages[0]} 
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Failed to load hero image:', validGalleryImages[0]);
                  const img = e.target as HTMLImageElement;
                  // Try to load a different image or use not found from assets
                  if (validGalleryImages.length > 1) {
                    img.src = validGalleryImages[1];
                  } else {
                    img.src = "/notFound.png";
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📷</span>
                  </div>
                  <p className="text-muted-foreground">No images available for this project</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Project Details */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2"
            >
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">{project.description}</p>

              {/* Additional project details would go here if you have them in your database */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Project Details</h3>
                <p className="text-muted-foreground">{project.project_brief || 'No additional details available for this project.'}</p>
              </div>

                          </motion.div>

            {/* Desktop Project Info - Only visible on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden md:block glass p-8 rounded-3xl h-fit"
            >
              <h3 className="font-bold mb-6 text-lg">Project Info</h3>
              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  Featured Project
                </div>
                {project.createdAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="block">Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {project.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="block">{project.location}</span>
                  </div>
                )}
                {project.client && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <span className="block">{project.client}</span>
                  </div>
                )}
              </div>

              <h3 className="font-bold mb-4 text-lg">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Key Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4"
          >
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass p-6 rounded-2xl flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                <p>Professional design and execution</p>
              </div>
              <div className="glass p-6 rounded-2xl flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                <p>High-quality materials and finishes</p>
              </div>
              <div className="glass p-6 rounded-2xl flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                <p>Client-focused approach</p>
              </div>
              <div className="glass p-6 rounded-2xl flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                <p>Attention to detail</p>
              </div>
            </div>
            {/* Gallery */}
             <div className="pt-4">
              <h2 className="text-2xl font-bold mb-4">Project Gallery</h2>
            
            {/* 2x2 Grid with View All Card */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {/* First Row - 2 Images */}
              {validGalleryImages.slice(0, 2).map((image: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                  className="rounded-xl overflow-hidden h-40 md:h-48 lg:h-56 relative group cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`Image ${i + 1} clicked, opening modal at index ${i}`);
                    setIsModalOpen(true);
                    setModalInitialIndex(i);
                  }}
                >
                  <img 
                    src={image} 
                    alt={`Gallery ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error(`Failed to load image ${i + 1}:`, image);
                      handleImageError(i, image);
                      const img = e.target as HTMLImageElement;
                      img.src = "/notFound.png";
                    }}
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <ChevronRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Second Row - 1 Image + View All Card */}
              {validGalleryImages.length > 2 && (
                <>
                  {/* Third Image */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="rounded-xl overflow-hidden h-40 md:h-48 lg:h-56 relative group cursor-pointer"
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Image 3 clicked, opening modal at index 2');
                      setIsModalOpen(true);
                      setModalInitialIndex(2);
                    }}
                  >
                    <img 
                      src={validGalleryImages[2]} 
                      alt="Gallery 3"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error('Failed to load image 3:', validGalleryImages[2]);
                        handleImageError(2, validGalleryImages[2]);
                        const img = e.target as HTMLImageElement;
                        img.src = "/notFound.png";
                      }}
                    />
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <ChevronRight className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* View All Card */}
                  {validGalleryImages.length > 3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="rounded-xl overflow-hidden h-40 md:h-48 lg:h-56 relative group cursor-pointer bg-gradient-to-br from-primary via-primary/80 to-primary/60"
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('View All clicked, opening modal');
                        setIsModalOpen(true);
                        setModalInitialIndex(0);
                      }}
                    >
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform rotate-45 translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out" />
                      </div>
                      
                      {/* Content */}
                      <div className="relative h-full flex flex-col items-center justify-center text-white p-6 pointer-events-none">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="mb-4"
                        >
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <ChevronRight className="w-8 h-8" />
                          </div>
                        </motion.div>
                        
                        <div className="text-center">
                          <h3 className="font-bold text-xl mb-2">View All</h3>
                          <p className="text-sm text-white/90">
                            +{validGalleryImages.length - 3} more
                          </p>
                        </div>
                      </div>
                      
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                    </motion.div>
                  )}
                </>
              )}
            </div>
            </div>
          </motion.div>

        
          {/* CTA
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="min-h-screen pb-8 px-6 max-w-6xl mx-auto scroll-mt-24"
          >
            <div className="pt-20">
              <h2 className="text-3xl font-bold mb-4">Ready to start your project?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss your design needs and create something amazing together.
            </p>
            <Button
              size="lg"
              className="rounded-full px-8 h-14 text-base cursor-pointer"
              onClick={() => {
                window.location.href = "mailto:iamnikita2911@gmail.com";
              }}
            >
              Get in Touch
            </Button>
            </div>
          </motion.div> */}
          {/* CTA */}
          <motion.div
            key="contact-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="cursor-pointer"
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
                    <div className="grid grid-cols-3 gap-4 mb-8">
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          copyEmailToClipboard();
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          copyEmailToClipboard();
                        }}
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
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 border-t border-black/5 dark:border-white/10 bg-white dark:bg-black/50">
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
                <li><a href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
                <li><a href="/projects" className="text-muted-foreground hover:text-primary transition-colors">Projects</a></li>
                <li><a href="/experience" className="text-muted-foreground hover:text-primary transition-colors">Experience</a></li>
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
                <a href={`mailto:${profile?.email || "iamnikita2911@gmail.com"}`} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-6 text-xs md:text-sm text-muted-foreground text-center sm:text-left">
            <p>© 2025 Nikita Singh. All rights reserved.</p>
            <div className="flex gap-3 md:gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Dark Mode Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={toggleTheme}
        className="fixed bottom-8 left-8 w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primary/90 transition-colors dark:bg-primary/80 dark:hover:bg-primary"
        data-testid="button-dark-mode"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </motion.button>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={galleryImages}
        initialIndex={modalInitialIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
