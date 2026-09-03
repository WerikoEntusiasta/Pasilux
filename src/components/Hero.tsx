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
  const textY = useTransform(scrollY, [0, 500], [0, 60]);
  const opacityText = useTransform(scrollY, [0, 450], [1, 0]);

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
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#faf9f6] px-6 md:px-12 pt-32 pb-20 text-neutral-900"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 hero-grid-bg bg-[size:4rem_4rem]" />
      </div>

      {/* Floating Soft Warm Ambient Radial Glows */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-gold/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[400px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Hero Content - Two Columns on Desktop */}
      <div className="relative max-w-7xl mx-auto w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <motion.div
            style={{ y: textY, opacity: opacityText }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs tracking-widest uppercase mb-6 font-mono shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
              </span>
              <span className="font-bold">{siteTexts.heroTagline}</span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-neutral-950 tracking-tight leading-[1.08] mb-6">
              {siteTexts.heroTitle1}<br />
              <span className="font-normal italic text-amber-800 selection:bg-amber-100">{siteTexts.heroTitle2}</span>
            </h1>

            {/* Description */}
            <p className="font-sans text-neutral-700 text-base md:text-lg lg:text-xl font-light max-w-xl leading-relaxed mb-8">
              {siteTexts.heroDescription}
            </p>

            {/* Call to Actions with High Contrast Golden Yellow */}
            <div className="flex flex-wrap gap-4 items-center w-full sm:w-auto mb-10">
              <button
                onClick={handleScrollToQuote}
                className="w-full sm:w-auto px-7 py-4 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer uppercase text-xs tracking-wider group hover:scale-[1.02]"
                id="hero-explore-btn"
              >
                <Compass className="h-4 w-4 text-neutral-950" />
                <span>Simular Projeto &amp; Orçamento</span>
              </button>

              <a
                href={`https://wa.me/${(siteTexts.contactWhatsappRaw || '5517991066398').replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Gostaria de falar com um consultor especialista da Pasilux sobre projetos de iluminação com perfis de LED.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer uppercase text-xs tracking-wider shadow-md shadow-emerald-600/20 hover:scale-[1.02]"
                id="hero-whatsapp-consultor-btn"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Falar com Consultor</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-neutral-200/90 w-full grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block font-serif text-2xl font-bold text-neutral-950">60+ Anos</span>
                <span className="text-[11px] text-neutral-600 font-sans leading-tight">Herança Metalúrgica</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-neutral-950">34+ Perfis</span>
                <span className="text-[11px] text-neutral-600 font-sans leading-tight">Linhas Técnicas de LED</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold text-neutral-950">100%</span>
                <span className="text-[11px] text-neutral-600 font-sans leading-tight">Alumínio de Precisão</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Architectural Render / Foto de Ambiente com Perfil Aceso */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative w-full"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative halo */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/20 to-neutral-300/40 rounded-3xl blur-xl opacity-70" />

              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden bg-white border border-neutral-200/90 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"
                  alt="Ambiente arquitetônico sofisticado iluminado com perfis de LED de alta precisão Pasilux"
                  className="w-full h-[400px] lg:h-[480px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Light glow gradient on edge */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

                {/* Floating Product Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-950 font-serif">Linhas Embutidas &amp; Sobrepostas</p>
                      <p className="text-[10px] text-neutral-600 font-sans">Luz difusa linear sem pontos aparentes</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 text-[10px] font-mono font-bold uppercase">
                    3000K / 4000K
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity z-10">
        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-1">Deslize para ver mais</span>
        <ChevronDown className="h-4 w-4 text-neutral-500 animate-bounce" />
      </div>
    </section>
  );
}
