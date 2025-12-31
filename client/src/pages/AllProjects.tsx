import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Moon, Sun, Mail, Check, ExternalLink, Linkedin, MessageCircle, Users, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/Portfolio";
import { useTheme } from "@/context/ThemeContext";
import { useProjects, useProfile } from "@/lib/api";
import { getImageSrc } from "@/lib/api";
import { useLocation } from "wouter";
import { useState } from "react";

export default function AllProjects() {
  const { isDark, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const { data: projects = [], isLoading } = useProjects();
  const { data: profile } = useProfile();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const projectsPerPage = 3;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">All Projects</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our complete portfolio of design and architecture projects
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProjects.map((project: any, i: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
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
                  projectId={project.id}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10 rounded-full"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-full"
              >
                Next
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Card */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
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
            <p> 2025 Nikita Singh. All rights reserved.</p>
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
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}