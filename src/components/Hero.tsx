import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, Compass, MessageCircle, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

interface HeroProps {
  onExploreProducts?: () => void;
}

export default function Hero({ onExploreProducts }: HeroProps) {
  const { siteTexts } = useData();

  // Scroll parallax tracking
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 100]);
  const opacityText = useTransform(scrollY, [0, 400], [1, 0]);

  const handleScrollToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('orcamento') || document.getElementById('projetos');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contato');
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
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#faf9f6] px-6 md:px-12 pt-28 pb-20 text-neutral-900"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 hero-grid-bg bg-[size:4rem_4rem]" />
      </div>

      {/* Floating Soft Warm Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Centered Hero Content */}
      <div className="relative max-w-4xl mx-auto w-full z-10 text-center">
        <motion.div
          style={{ y: textY, opacity: opacityText }}
          className="flex flex-col items-center"
        >
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs tracking-widest uppercase mb-8 font-mono shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-dark" />
            </span>
            <span className="font-bold">{siteTexts.heroTagline}</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-neutral-950 tracking-tight leading-[1.1] mb-8">
            {siteTexts.heroTitle1}<br />
            <span className="font-normal italic text-amber-800 dark:text-gold-dark">{siteTexts.heroTitle2}</span>
          </h1>

          {/* Description */}
          <p className="font-sans text-neutral-700 text-base md:text-xl font-light max-w-2xl leading-relaxed mb-10">
            {siteTexts.heroDescription}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap justify-center gap-4 items-center">
            <button
              onClick={handleScrollToQuote}
              className="px-8 py-4 bg-gold hover:bg-gold-dark text-neutral-950 font-bold rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-all duration-300 flex items-center gap-2 cursor-pointer uppercase text-xs tracking-wider group hover:scale-[1.02]"
              id="hero-explore-btn"
            >
              <Compass className="h-4 w-4" />
              <span>Simular Projeto &amp; Orçamento</span>
            </button>

            <a
              href={`https://wa.me/${(siteTexts.contactWhatsappRaw || '5517991066398').replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Gostaria de falar com um consultor especialista da Pasilux sobre projetos de iluminação com perfis de LED.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer uppercase text-xs tracking-wider shadow-md shadow-emerald-600/20 hover:scale-[1.02]"
              id="hero-whatsapp-consultor-btn"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Falar com Consultor no WhatsApp</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity z-10">
        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-2">Deslize para ver mais</span>
        <ChevronDown className="h-4 w-4 text-neutral-500 animate-bounce" />
      </div>
    </section>
  );
}
