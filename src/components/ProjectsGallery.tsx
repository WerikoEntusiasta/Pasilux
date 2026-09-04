import React, { useState } from 'react';
import { PROJECTS_PORTFOLIO } from '../data';
import { ProjectPortfolioItem } from '../types';
import { 
  Building2, 
  MapPin, 
  User, 
  Sparkles, 
  Maximize2, 
  X, 
  ArrowRight, 
  Compass,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';

interface ProjectsGalleryProps {
  onSelectProjectForQuote?: (project: ProjectPortfolioItem) => void;
  onNavigateToCatalog?: () => void;
}

export default function ProjectsGallery({ onSelectProjectForQuote, onNavigateToCatalog }: ProjectsGalleryProps) {
  const { siteTexts } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectPortfolioItem | null>(null);

  const categories = ['Todos', 'Residencial', 'Corporativo', 'Marcenaria', 'Comercial'];

  const filteredProjects = selectedCategory === 'Todos'
    ? PROJECTS_PORTFOLIO
    : PROJECTS_PORTFOLIO.filter(p => p.category === selectedCategory);

  const handleOpenModal = (project: ProjectPortfolioItem) => {
    setActiveProjectModal(project);
  };

  const handleCloseModal = () => {
    setActiveProjectModal(null);
  };

  // Close modal on Esc
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    if (activeProjectModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProjectModal]);

  return (
    <section id="projetos" className="py-24 bg-stone-50 border-t border-neutral-200 relative overflow-hidden">
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-gold/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-neutral-200/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-neutral-200/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold-dark text-xs font-mono font-bold tracking-wider uppercase mb-3">
              <Building2 className="h-3.5 w-3.5" />
              <span>{siteTexts.projectsBadge || 'Portfólio & Obras Entregues'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-950 tracking-tight">
              {siteTexts.projectsTitle || 'Projetos Realizados com Pasilux'}
            </h2>
            <p className="font-sans text-neutral-600 text-sm md:text-base font-light mt-3 max-w-2xl leading-relaxed">
              {siteTexts.projectsSubtitle || 'Inspire-se com obras de arquitetura residencial, corporativa e marcenaria fina de alto padrão especificadas com nossos perfis de alumínio e tecnologia LED.'}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-neutral-950 text-gold font-bold shadow-md'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:border-gold/60 hover:text-neutral-900'
                }`}
                id={`project-filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleOpenModal(project)}
              className="group bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col cursor-pointer hover:border-gold/60 transform hover:-translate-y-1"
              id={`project-card-${project.id}`}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-neutral-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-black/20" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-neutral-950/85 backdrop-blur-md border border-neutral-700/60 text-gold font-mono text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {project.category}
                  </span>
                </div>

                {/* Location & Year */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 font-mono text-[11px] text-neutral-200 drop-shadow">
                    <MapPin className="h-3.5 w-3.5 text-gold" />
                    {project.location}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-300 bg-black/40 px-2 py-0.5 rounded">
                    {project.year}
                  </span>
                </div>

                {/* Hover zoom icon */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-black/60 rounded-full text-white backdrop-blur-xs">
                  <Maximize2 className="h-4 w-4" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-950 group-hover:text-gold-dark transition-colors leading-snug">
                    {project.title}
                  </h3>
                  
                  {project.architect && (
                    <p className="text-xs text-neutral-500 font-sans flex items-center gap-1.5 mt-1">
                      <User className="h-3 w-3 text-neutral-400" />
                      <span>{project.architect}</span>
                    </p>
                  )}

                  <p className="text-xs text-neutral-600 font-light mt-3 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Used Profiles Tags */}
                <div className="pt-4 border-t border-neutral-100">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase mb-2 flex items-center gap-1">
                    <Layers className="h-3 w-3 text-gold-dark" />
                    Perfis Utilizados:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.usedProfiles.map((prof, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded text-[10px] font-mono text-neutral-800 font-medium"
                      >
                        {prof.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Project Zoom / Specifications */}
        <AnimatePresence>
          {activeProjectModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm cursor-pointer"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl z-10 border border-neutral-200 my-8"
                id="project-detail-modal"
              >
                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 z-20 p-2 bg-neutral-900/80 hover:bg-neutral-950 text-white rounded-full transition-all cursor-pointer backdrop-blur-xs"
                  aria-label="Fechar Modal"
                  id="project-modal-close-btn"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Modal Main Image */}
                <div className="relative h-80 sm:h-96 w-full bg-neutral-950">
                  <img
                    src={activeProjectModal.image}
                    alt={activeProjectModal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="px-3 py-1 bg-gold text-neutral-950 font-mono text-xs font-bold uppercase rounded-md mb-2 inline-block">
                      {activeProjectModal.category}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-4xl font-light">
                      {activeProjectModal.title}
                    </h3>
                    <p className="font-mono text-xs text-neutral-300 flex items-center gap-2 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-gold" />
                      <span>{activeProjectModal.location}</span>
                      <span>•</span>
                      <span>Ano de execução: {activeProjectModal.year}</span>
                    </p>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left Details */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h4 className="font-serif font-bold text-neutral-950 text-lg mb-2">Sobre a Execução Luminotécnica</h4>
                        <p className="font-sans text-neutral-700 text-sm leading-relaxed font-light">
                          {activeProjectModal.description}
                        </p>
                      </div>

                      {/* Architecture and LD info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {activeProjectModal.architect && (
                          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                            <span className="text-[10px] font-mono text-neutral-400 uppercase">Arquitetura</span>
                            <p className="text-xs font-bold text-neutral-900 mt-0.5">{activeProjectModal.architect}</p>
                          </div>
                        )}
                        {activeProjectModal.lightingDesigner && (
                          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                            <span className="text-[10px] font-mono text-neutral-400 uppercase">Lighting Designer</span>
                            <p className="text-xs font-bold text-neutral-900 mt-0.5">{activeProjectModal.lightingDesigner}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Profiles Specs */}
                    <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                      <h5 className="font-mono text-xs font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="h-4 w-4 text-gold-dark" />
                        Perfis Especificados
                      </h5>
                      <div className="space-y-2">
                        {activeProjectModal.usedProfiles.map((prof, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-800 font-medium flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                            <span>{prof}</span>
                          </div>
                        ))}
                      </div>

                      <a
                        href="#orcamento"
                        onClick={() => {
                          handleCloseModal();
                          if (onSelectProjectForQuote) {
                            onSelectProjectForQuote(activeProjectModal);
                          }
                        }}
                        className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-gold font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <Compass className="h-4 w-4" />
                        <span>{siteTexts.projectsCtaQuote || 'Cotar Projeto Similar'}</span>
                      </a>
                    </div>

                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
