import React, { useState, useEffect } from 'react';
import { ARTICLES } from '../data';
import { BlogArticle } from '../types';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Share2, 
  Check, 
  Calendar, 
  Tag, 
  Sparkles,
  ChevronRight,
  Home
} from 'lucide-react';
import { motion } from 'motion/react';

interface BlogPageProps {
  initialSlug?: string | null;
  onNavigateHome: () => void;
  onNavigateToCatalog?: () => void;
}

export default function BlogPage({ initialSlug, onNavigateHome, onNavigateToCatalog }: BlogPageProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialSlug) {
      setSelectedSlug(initialSlug);
    }
  }, [initialSlug]);

  const currentArticle = ARTICLES.find(
    (a) => a.slug === selectedSlug || a.id === selectedSlug
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenArticle = (article: BlogArticle) => {
    setSelectedSlug(article.slug || article.id);
    window.history.pushState({}, '', `/blog/${article.slug || article.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedSlug(null);
    window.history.pushState({}, '', '/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 pt-28 pb-20">
      
      {/* Breadcrumb Navigation */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 mb-8">
        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-500 flex-wrap">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="h-3 w-3 text-neutral-400" />
          
          <button
            onClick={handleBackToList}
            className={`hover:text-neutral-950 transition-colors cursor-pointer ${
              !currentArticle ? 'text-gold-dark font-bold' : ''
            }`}
          >
            Blog &amp; Insights
          </button>

          {currentArticle && (
            <>
              <ChevronRight className="h-3 w-3 text-neutral-400" />
              <span className="text-neutral-900 font-bold truncate max-w-[200px] sm:max-w-md">
                {currentArticle.title}
              </span>
            </>
          )}
        </nav>
      </div>

      {currentArticle ? (
        /* ================= SINGLE ARTICLE VIEW ================= */
        <article className="max-w-4xl mx-auto px-6 md:px-12">
          
          {/* Back Button */}
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-neutral-600 hover:text-neutral-950 mb-8 px-4 py-2 bg-white border border-neutral-200 rounded-xl transition-all shadow-xs cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar para todos os artigos</span>
          </button>

          {/* Article Header */}
          <header className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-500 uppercase">
              <span className="px-3 py-1 bg-gold/15 text-gold-dark font-bold rounded-md">
                {currentArticle.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {currentArticle.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {currentArticle.readTime} de leitura
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-950 tracking-tight leading-tight">
              {currentArticle.title}
            </h1>

            <p className="font-sans text-neutral-600 text-base sm:text-lg font-light leading-relaxed">
              {currentArticle.excerpt}
            </p>
          </header>

          {/* Article Featured Image */}
          {currentArticle.image && (
            <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden mb-10 shadow-lg border border-neutral-200">
              <img
                src={currentArticle.image}
                alt={currentArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-neutral-200 shadow-sm space-y-6">
            <div className="prose prose-stone max-w-none font-sans text-neutral-800 text-base leading-relaxed space-y-5 font-light">
              {currentArticle.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3
                      key={index}
                      className="font-serif font-bold text-neutral-950 text-xl sm:text-2xl pt-6 pb-1 border-t border-neutral-100"
                    >
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                return (
                  <p key={index} className="text-neutral-700 leading-relaxed text-sm sm:text-base">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Share and Footer Actions */}
            <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-neutral-500">
                Publicado por: <strong className="text-neutral-900">Engenharia e P&amp;D Pasilux</strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Link Copiado!' : 'Compartilhar'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Other Articles Recommendation */}
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <h3 className="font-serif font-light text-2xl text-neutral-950 mb-6">
              Outros Artigos Relacionados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ARTICLES.filter(a => a.id !== currentArticle.id).map((art) => (
                <div
                  key={art.id}
                  onClick={() => handleOpenArticle(art)}
                  className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-gold transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-gold-dark font-bold uppercase">{art.category}</span>
                    <h4 className="font-serif font-bold text-neutral-950 text-base line-clamp-2">{art.title}</h4>
                    <p className="text-xs text-neutral-600 font-light line-clamp-2">{art.excerpt}</p>
                  </div>
                  <span className="text-xs font-semibold text-gold-dark flex items-center gap-1 mt-4">
                    Ler artigo <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>

        </article>
      ) : (
        /* ================= ARTICLES INDEX VIEW ================= */
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs text-gold-dark uppercase tracking-widest font-bold">Informativos &amp; Engenharia</span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-neutral-950 tracking-tight mt-2 mb-4">
              Blog &amp; Insights <span className="font-normal italic text-gold-dark">Pasilux</span>
            </h1>
            <p className="font-sans text-neutral-600 text-base md:text-lg font-light leading-relaxed">
              Guias técnicos, inovações em iluminação linear, soluções sustentáveis e especificações para arquitetura e iluminação.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTICLES.map((article) => (
              <div
                key={article.id}
                onClick={() => handleOpenArticle(article)}
                className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between cursor-pointer hover:border-gold/60 transform hover:-translate-y-1"
                id={`blog-page-card-${article.id}`}
              >
                <div>
                  {article.image && (
                    <div className="relative h-48 overflow-hidden bg-neutral-900">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-neutral-950/80 backdrop-blur-xs text-gold font-mono text-[10px] font-bold uppercase rounded">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 uppercase">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="font-serif font-bold text-neutral-950 group-hover:text-gold-dark transition-colors text-lg line-clamp-2 leading-snug">
                      {article.title}
                    </h3>

                    <p className="font-sans text-xs text-neutral-600 font-light line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between text-xs font-semibold text-neutral-500 group-hover:text-gold-dark transition-all">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {article.readTime}
                  </span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Ler Artigo Completo
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
