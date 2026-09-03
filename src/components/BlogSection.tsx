import React, { useState, useEffect } from 'react';
import { ARTICLES } from '../data';
import { BlogArticle } from '../types';
import { BookOpen, Calendar, Clock, ArrowRight, X, Sparkles, ChevronLeft, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlogSectionProps {
  onNavigateToBlogPage?: (slug?: string) => void;
}

export default function BlogSection({ onNavigateToBlogPage }: BlogSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  const handleOpenArticle = (article: BlogArticle) => {
    setSelectedArticle(article);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseArticle();
      }
    };
    if (selectedArticle) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArticle]);

  return (
    <section id="blog" className="py-24 md:py-32 bg-stone-100/90 border-t border-stone-200 relative">
      <div className="absolute top-1/2 left-0 w-84 h-84 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-gold-dark uppercase tracking-widest font-bold">Informativos &amp; Insights</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-950 tracking-tight mt-2 mb-4">
            Blog Pasilux
          </h2>
          <p className="font-sans text-neutral-700 text-base md:text-lg font-light leading-relaxed">
            Fique por dentro das novidades tecnológicas, guias de economia de consumo e soluções sustentáveis ligadas à iluminação de LED.
          </p>
          <div className="h-0.5 w-20 bg-gold mx-auto mt-6" />
        </div>

        {/* Articles List Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <div
              key={article.id}
              onClick={() => handleOpenArticle(article)}
              className="group bg-white border border-stone-200/90 rounded-2xl p-6 transition-all duration-300 hover:border-gold hover:shadow-xl cursor-pointer flex flex-col justify-between h-[360px] relative overflow-hidden"
              id={`blog-card-${article.id}`}
            >
              <div className="space-y-4">
                {/* Meta details */}
                <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500 uppercase">
                  <span className="text-gold-dark font-bold">{article.category}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>

                <h3 className="font-serif font-semibold text-neutral-950 group-hover:text-gold-dark transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                <p className="font-sans text-xs text-neutral-600 leading-relaxed font-light line-clamp-4">
                  {article.excerpt}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-500 group-hover:text-gold-dark transition-all">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-neutral-400" />
                  {article.readTime} de leitura
                </span>
                
                <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ler Artigo
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View all articles CTA */}
        {onNavigateToBlogPage && (
          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigateToBlogPage()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-neutral-300 hover:border-gold text-neutral-900 font-mono text-xs uppercase font-bold rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <span>Ver Todos os Artigos do Blog</span>
              <ArrowRight className="h-4 w-4 text-gold-dark" />
            </button>
          </div>
        )}

      </div>

      {/* Centered Modal Reader for full article content */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseArticle}
              className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md cursor-pointer"
            />

            {/* Centered Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col justify-between z-10 overflow-hidden my-auto"
              id="blog-reader-panel"
            >
              {/* Header navigation bar */}
              <div className="p-5 sm:p-6 border-b border-neutral-100 bg-neutral-50/70 flex items-center justify-between">
                <button
                  onClick={handleCloseArticle}
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-600 hover:text-neutral-950 transition-all cursor-pointer"
                  id="blog-back-to-list-btn"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Fechar Leitura (Esc)
                </button>

                <div className="flex items-center gap-2">
                  {onNavigateToBlogPage && (
                    <button
                      onClick={() => {
                        const slug = selectedArticle.slug || selectedArticle.id;
                        handleCloseArticle();
                        onNavigateToBlogPage(slug);
                      }}
                      className="text-xs font-mono text-neutral-600 hover:text-neutral-950 flex items-center gap-1 px-3 py-1 bg-white border border-neutral-200 rounded-lg cursor-pointer transition-colors"
                      title="Abrir em página própria com URL direta"
                    >
                      <span>Página Própria</span>
                      <ExternalLink className="h-3.5 w-3.5 text-gold-dark" />
                    </button>
                  )}

                  <button
                    onClick={handleCloseArticle}
                    className="p-1.5 bg-white border border-neutral-200 hover:bg-neutral-200 rounded-lg text-neutral-700 hover:text-neutral-950 transition-all cursor-pointer shadow-xs"
                    id="blog-close-reader-btn"
                    aria-label="Fechar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Main scrollable body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
                <div className="space-y-4">
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 uppercase">
                    <span className="text-gold-dark font-bold bg-gold/10 px-2.5 py-1 rounded">{selectedArticle.category}</span>
                    <span>•</span>
                    <span>{selectedArticle.date}</span>
                  </div>

                  <h1 className="font-serif font-light text-neutral-950 text-2xl sm:text-3xl tracking-tight leading-snug">
                    {selectedArticle.title}
                  </h1>

                  <div className="inline-flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    Aproximadamente {selectedArticle.readTime} de leitura profunda
                  </div>
                </div>

                {/* Formatted Text Content */}
                <div className="prose prose-stone max-w-none font-sans text-neutral-700 text-sm sm:text-base leading-relaxed space-y-4 font-light pt-4 border-t border-neutral-100">
                  {selectedArticle.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={index} className="font-serif font-semibold text-neutral-950 text-lg sm:text-xl pt-4 pb-1 border-t border-neutral-100">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    return (
                      <p key={index} className="text-neutral-700 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Footer and author info */}
              <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50 flex justify-between items-center text-xs font-mono text-neutral-500">
                <span>Autor: Engenharia Pasilux</span>
                <span>Copyright © 2026 Pasilux</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
