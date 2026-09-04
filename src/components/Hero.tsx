import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Store, MessageCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

interface HeroProps {
  onExploreProducts?: () => void;
}

export default function Hero({ onExploreProducts }: HeroProps) {
  const { siteTexts } = useData();

  const handleScrollToReseller = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('revenda') || document.getElementById('orcamento');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#faf9f6] px-6 md:px-12 pt-28 pb-16 text-neutral-900"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 hero-grid-bg bg-[size:4rem_4rem]" />
      </div>

      {/* Floating Soft Warm Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-gold/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto w-full z-10 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Commercial Headline & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs tracking-wider uppercase mb-6 font-mono shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-dark" />
              </span>
              <span className="font-bold">{siteTexts.heroTagline || 'Direto de Fábrica • Catanduva - SP'}</span>
            </div>

            {/* Main Commercial Title */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-light text-neutral-950 tracking-tight leading-[1.15] mb-6">
              {siteTexts.heroTitle1 || 'Perfis de LED em alumínio direto de fábrica —'}{' '}
              <span className="font-normal text-amber-900 dark:text-gold-dark block mt-1">
                {siteTexts.heroTitle2 || 'para lojas e distribuidores em todo o Brasil.'}
              </span>
            </h1>

            {/* Description / Subtitle */}
            <p className="font-sans text-neutral-700 text-base sm:text-lg font-light max-w-xl leading-relaxed mb-8">
              {siteTexts.heroDescription || 'Catálogo com 34+ modelos industriais, condições especiais de revenda e suporte técnico para grandes lotes.'}
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center w-full sm:w-auto mb-8">
              <button
                onClick={handleScrollToReseller}
                className="px-7 py-4 bg-gold hover:bg-gold-dark text-neutral-950 font-bold rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider group hover:scale-[1.02]"
                id="hero-reseller-btn"
              >
                <Store className="h-4 w-4" />
                <span>{siteTexts.heroExploreBtn || 'Quero ser revendedor'}</span>
              </button>

              <a
                href={`https://wa.me/${(siteTexts.contactWhatsappRaw || '5517991066398').replace(/\D/g, '')}?text=${encodeURIComponent(siteTexts.heroWhatsappMessage || 'Olá! Tenho um projeto de grande volume / compra em lote de perfis de LED e gostaria de falar com um consultor comercial da Pasilux.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider shadow-xs hover:border-neutral-400 hover:scale-[1.02]"
                id="hero-whatsapp-consultor-btn"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>{siteTexts.heroWhatsappBtn || 'Tenho um projeto grande / Falar com consultor'}</span>
              </a>
            </div>

            {/* Trust Bullet Items */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-600 font-mono pt-2 border-t border-neutral-200/80 w-full">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-gold-dark" />
                <span>34+ Modelos de Perfis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-gold-dark" />
                <span>Fábrica em Catanduva/SP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-gold-dark" />
                <span>Envio para Todo o Brasil</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Architectural Photo / Render of Profile in Application */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-neutral-300/80 shadow-2xl shadow-neutral-900/10 group bg-neutral-900">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
                alt="Ambiente de alto padrão com iluminação contínua por perfil de LED Pasilux"
                className="w-full h-[360px] sm:h-[440px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent pointer-events-none" />

              {/* Floating Architectural Badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950/70 backdrop-blur-md border border-neutral-800 text-gold text-[11px] font-mono font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Perfil Pasilux em Aplicação Real</span>
              </div>

              {/* Bottom Card Annotation */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-lg text-neutral-900">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-gold-dark block">Linhas de Alta Precisão</span>
                    <h4 className="font-serif font-bold text-sm text-neutral-950">Acabamento Impecável & Dissipação Térmica</h4>
                  </div>
                  {onExploreProducts && (
                    <button
                      type="button"
                      onClick={onExploreProducts}
                      className="text-[11px] font-mono font-bold text-neutral-950 hover:text-gold-dark underline cursor-pointer"
                    >
                      Ver Catálogo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity z-10">
        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-1">{siteTexts.heroScrollText || 'Deslize para ver mais'}</span>
        <ChevronDown className="h-4 w-4 text-neutral-500 animate-bounce" />
      </div>
    </section>
  );
}
