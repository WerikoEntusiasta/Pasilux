import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Ruler, 
  ArrowUpRight, 
  Layers, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface ProductsSectionProps {
  onNavigateToProducts?: (profileCode?: string) => void;
}

export default function ProductsSection({ onNavigateToProducts }: ProductsSectionProps) {
  const { profiles } = useData();

  // Select the 6 main featured products
  const featuredCodes = ['PSL0018', 'PSL0020', 'PSL0022', 'PSL0002', 'PSL0011', 'PSL0032'];
  
  const mainProducts = profiles
    .filter(p => featuredCodes.includes(p.code))
    .sort((a, b) => featuredCodes.indexOf(a.code) - featuredCodes.indexOf(b.code));

  // Fallback to first 6 if filter returns less than 6
  const displayProducts = mainProducts.length >= 6 ? mainProducts.slice(0, 6) : profiles.slice(0, 6);

  const handleProductClick = (profileCode?: string) => {
    if (onNavigateToProducts) {
      onNavigateToProducts(profileCode);
    }
  };

  return (
    <section id="produtos" className="py-24 bg-neutral-950 text-white border-t border-neutral-800 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span>Destaques de Extrusão Pasilux 2026</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              6 Principais Perfis de LED
            </h2>
            <p className="text-neutral-400 text-sm mt-2 leading-relaxed">
              Conheça os modelos industriais mais especificados por arquitetos, marceneiros e lighting designers em todo o Brasil.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleProductClick()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gold hover:bg-gold-light text-neutral-950 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-gold/20 hover:scale-[1.02] shrink-0"
          >
            <span>Ver Catálogo Completo (34+ Modelos)</span>
            <ChevronRight className="h-4 w-4 text-neutral-950" />
          </button>
        </div>

        {/* --- GRID OF 6 MAIN PRODUCTS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayProducts.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleProductClick(p.code)}
              className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-gold transition-all duration-300 flex flex-col group cursor-pointer relative shadow-xl"
            >
              {/* Product Image Header */}
              <div className="relative h-56 bg-neutral-900 overflow-hidden">
                <img
                  src={p.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop'}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                  <span className="px-2.5 py-1 rounded-md bg-neutral-950/90 backdrop-blur-md text-xs font-mono font-bold text-gold border border-gold/40 shadow-sm">
                    {p.code}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-mono uppercase text-white font-bold">
                    {p.category}
                  </span>
                </div>

                {/* Dimension Badge */}
                <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-neutral-700 text-xs font-mono font-bold text-neutral-200 flex items-center gap-1.5 shadow-sm">
                  <Ruler className="h-3.5 w-3.5 text-gold" />
                  <span>{p.width}x{p.height}mm</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-white">
                <div>
                  <h3 className="font-serif font-bold text-neutral-950 text-lg leading-snug group-hover:text-gold-dark transition-colors mb-2">
                    {p.name}
                  </h3>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-normal">
                    {p.description}
                  </p>
                </div>

                {/* Specs highlights */}
                <div className="space-y-2 pt-3 border-t border-neutral-200 text-[11px] font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Largura Fita LED:</span>
                    <span className="font-bold text-neutral-900">{p.maxStripWidth}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Tipo de Difusor:</span>
                    <span className="font-bold text-neutral-900">{p.diffuser.split(' ')[0]} Anti-UV</span>
                  </div>
                </div>

                {/* Hover CTA Trigger */}
                <div className="pt-2 flex items-center justify-between text-xs font-mono font-bold text-neutral-900 group-hover:text-gold-dark transition-colors">
                  <span className="flex items-center gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5 text-gold-dark" />
                    <span>Ver Ficha Técnica</span>
                  </span>
                  <div className="p-2 rounded-xl bg-neutral-100 group-hover:bg-neutral-950 group-hover:text-gold transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- BOTTOM CTA PROMOTION BANNER --- */}
        <div className="mt-14 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-3xl p-8 sm:p-10 border border-neutral-800 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-wider">
                <Layers className="h-3.5 w-3.5" />
                <span>Catálogo Completo em Alta Definição</span>
              </div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                Procurando outros modelos, No Frame, Ripados ou Pendentes?
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm font-light">
                Acesse a página dedicada com todos os 34+ modelos industriais, fichas técnicas completas, tabelas dimensionais e comparador de fita LED COB.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleProductClick()}
              className="px-8 py-4 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-gold/25 hover:scale-105 shrink-0 flex items-center gap-2"
            >
              <span>Explorar Todos os Produtos</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
