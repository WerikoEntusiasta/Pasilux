import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Ruler, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  Building2, 
  Truck, 
  ArrowUpRight, 
  Maximize2, 
  FileText, 
  Download, 
  Search, 
  Clock, 
  ShieldCheck, 
  SlidersHorizontal,
  Layers,
  HelpCircle,
  Share2,
  Copy,
  CheckCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { LEDProfile } from '../types';
import { useSEO } from '../utils/seo';

interface ProductDetailPageProps {
  profileCode: string;
  onBack: () => void;
  onSelectProfileForQuote: (profileCode: string) => void;
  onNavigateToProduct: (profileCode: string) => void;
  onNavigateToCatalog: () => void;
}

export default function ProductDetailPage({ 
  profileCode, 
  onBack, 
  onSelectProfileForQuote,
  onNavigateToProduct,
  onNavigateToCatalog
}: ProductDetailPageProps) {
  const { profiles, siteTexts } = useData();

  // Find the target product by code or fallback to first
  const product: LEDProfile | undefined = profiles.find(p => p.code.toLowerCase() === profileCode.toLowerCase()) || profiles[0];

  // Dynamic SEO for individual product page
  useSEO({
    title: product ? `${product.name} (${product.code})` : 'Perfil de LED',
    description: product 
      ? `${product.description} Dimensões: ${product.width}x${product.height}mm. Difusor: ${product.diffuser}. Fabricado em Catanduva - SP pela Pasilux.`
      : 'Perfil de LED em alumínio extrudado de alta precisão Pasilux.',
    canonicalPath: product ? `/produtos/${product.code.toLowerCase()}` : '/produtos',
    ogType: 'product',
    ogImage: product?.image,
    jsonLd: product ? {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.name,
      'sku': product.code,
      'mpn': product.code,
      'image': [product.image],
      'description': product.description,
      'brand': {
        '@type': 'Brand',
        'name': 'Pasilux'
      },
      'category': product.category,
      'material': 'Alumínio de Alta Pureza',
      'manufacturer': {
        '@type': 'Organization',
        'name': 'Pasilux Perfis de LED',
        'url': 'https://pasilux.com.br'
      }
    } : undefined
  });

  // Gallery state
  const galleryImages = [
    {
      id: 'main',
      title: 'Fotografia do Produto',
      url: product?.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'technical',
      title: 'Desenho Técnico & Cotas',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'ambient',
      title: 'Aplicação Real no Projeto',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'finish',
      title: 'Detalhes de Acabamento',
      url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop'
    }
  ];

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);

  // Selected Options
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0] || 'Preto Microtexturizado');
  const [selectedLength, setSelectedLength] = useState<string>(product?.lengths?.[0] || '2 metros');
  const [quantity, setQuantity] = useState<number>(1);

  // Copy notification
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [profileCode]);

  if (!product) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center">
        <h2 className="font-serif text-2xl font-bold">Produto não encontrado</h2>
        <button 
          onClick={onNavigateToCatalog}
          className="mt-4 px-6 py-2 bg-gold text-neutral-950 font-bold rounded-xl text-xs uppercase"
        >
          Voltar ao Catálogo
        </button>
      </div>
    );
  }

  // Related Products
  const relatedProducts = profiles
    .filter(p => p.category === product.category && p.code !== product.code)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const whatsappRaw = (siteTexts.contactWhatsappRaw || '5517991066398').replace(/\D/g, '');
  const whatsappDisplay = siteTexts.contactWhatsapp || '(17) 99106-6398';
  const emailDisplay = siteTexts.contactEmail || 'contato@pasilux.com.br';
  const addressDisplay = siteTexts.contactAddress || 'Catanduva, São Paulo, Brasil';

  const whatsappMessage = encodeURIComponent(
    `Olá Consultor Pasilux! Gostaria de solicitar informações técnicas e cotação do perfil *${product.code} (${product.name})* com acabamento *${selectedColor}* e comprimento *${selectedLength}*.`
  );

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen text-neutral-900 font-sans">
      
      {/* BREADCRUMB & HEADER NAV */}
      <div className="bg-neutral-950 text-white border-b border-neutral-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <button 
              type="button" 
              onClick={onBack}
              className="hover:text-gold transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Voltar</span>
            </button>
            <ChevronRight className="h-3 w-3 text-neutral-600" />
            <button 
              type="button" 
              onClick={onNavigateToCatalog}
              className="hover:text-gold transition-colors cursor-pointer"
            >
              Catálogo de Produtos
            </button>
            <ChevronRight className="h-3 w-3 text-neutral-600" />
            <span className="text-gold font-bold">{product.code}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              {copiedLink ? <CheckCheck className="h-3.5 w-3.5 text-gold" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToCatalog}
              className="px-3.5 py-1.5 bg-gold text-neutral-950 font-bold rounded-xl text-xs font-mono uppercase transition-all cursor-pointer hover:bg-gold-light"
            >
              Ver Outros Perfis
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* --- PRODUCT MAIN SECTION (GALLERY + SPECS PANEL) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: IMAGE GALLERY (7 Columns on LG) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative h-80 sm:h-[480px] bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-200/80 shadow-md group">
              <img
                src={galleryImages[selectedImageIndex].url}
                alt={galleryImages[selectedImageIndex].title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Zoom Trigger Button */}
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="absolute top-4 right-4 p-3 bg-neutral-950/80 hover:bg-gold text-white hover:text-neutral-950 rounded-xl backdrop-blur-md border border-neutral-700/80 transition-all cursor-pointer shadow-lg"
                title="Ampliar Imagem em Alta Resolução"
              >
                <Maximize2 className="h-4 w-4" />
              </button>

              {/* Code Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                <span className="px-3 py-1 bg-neutral-950/90 text-gold text-xs font-mono font-bold rounded-lg border border-gold/40 backdrop-blur-md">
                  {product.code}
                </span>
                <span className="px-3 py-1 bg-white/20 text-white text-xs font-mono font-bold uppercase rounded-lg backdrop-blur-md">
                  {product.category}
                </span>
              </div>

              {/* Image Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-mono text-gold uppercase font-bold tracking-widest">
                  Visualização {selectedImageIndex + 1} de {galleryImages.length}
                </p>
                <h3 className="font-serif font-bold text-lg text-white">
                  {galleryImages[selectedImageIndex].title}
                </h3>
              </div>
            </div>

            {/* Gallery Thumbnails Carousel */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => {
                const isActive = selectedImageIndex === idx;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isActive 
                        ? 'border-gold ring-2 ring-gold/30 shadow-md scale-[1.02]' 
                        : 'border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-400'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt={img.title}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-neutral-950/20" />
                    <span className="absolute bottom-1 left-1 right-1 text-[9px] font-mono font-bold text-white truncate bg-neutral-950/80 px-1 py-0.5 rounded text-center">
                      {img.title.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Constructive Highlights Bar */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-xl border border-neutral-200/60 shadow-2xs">
                <ShieldCheck className="h-4 w-4 text-gold-dark mx-auto mb-1" />
                <span className="font-bold text-neutral-900 block text-[11px]">Garantia de Fábrica</span>
                <span className="text-[10px] text-neutral-500">Alumínio Anodizado</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-neutral-200/60 shadow-2xs">
                <Truck className="h-4 w-4 text-gold-dark mx-auto mb-1" />
                <span className="font-bold text-neutral-900 block text-[11px]">Pronta Entrega</span>
                <span className="text-[10px] text-neutral-500">Corte Sob Medida</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-neutral-200/60 shadow-2xs">
                <Sparkles className="h-4 w-4 text-gold-dark mx-auto mb-1" />
                <span className="font-bold text-neutral-900 block text-[11px]">Difusor Anti-UV</span>
                <span className="text-[10px] text-neutral-500">Acrílico PMMA Leitoso</span>
              </div>
            </div>

          </div>

          {/* RIGHT: SPECS & BUY / QUOTE PANEL (5 Columns on LG) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title & Headline */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-xs font-mono font-bold text-neutral-500 uppercase mt-1">
                Código do Perfil: <span className="text-neutral-950 font-extrabold">{product.code}</span>
              </p>
            </div>

            {/* Quick Spec Metrics Box */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-neutral-950 text-white rounded-2xl border border-neutral-800 shadow-sm">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">Dimensões Exatas</span>
                <span className="font-mono font-bold text-lg text-gold flex items-center gap-1">
                  <Ruler className="h-4 w-4 text-gold" />
                  <span>{product.width} × {product.height} mm</span>
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">Fita LED Recomendada</span>
                <span className="font-mono font-bold text-sm text-neutral-100 block">
                  {product.maxStripWidth} (Até 10mm)
                </span>
              </div>

              <div className="space-y-0.5 pt-2 border-t border-neutral-800">
                <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">Material do Corpo</span>
                <span className="font-mono font-bold text-xs text-neutral-200">Alumínio 100% Extrudado</span>
              </div>

              <div className="space-y-0.5 pt-2 border-t border-neutral-800">
                <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">Índice de Proteção</span>
                <span className="font-mono font-bold text-xs text-neutral-200">IP20 Uso Interno</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-neutral-900 text-sm uppercase tracking-wide">
                Descrição do Perfil
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                {product.description}
              </p>
            </div>

            {/* Color Finish Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-900 uppercase block">
                Acabamento / Cor Disponível:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-neutral-950 text-gold border-2 border-gold shadow-xs' 
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200'
                      }`}
                    >
                      <span className={`h-3 w-3 rounded-full border ${
                        color.toLowerCase().includes('preto') ? 'bg-neutral-900 border-neutral-700' :
                        color.toLowerCase().includes('branco') ? 'bg-white border-neutral-300' :
                        color.toLowerCase().includes('cinza') || color.toLowerCase().includes('alumínio') ? 'bg-neutral-400 border-neutral-500' :
                        'bg-amber-700 border-amber-900'
                      }`} />
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Length Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neutral-900 uppercase block">
                Comprimentos Disponíveis:
              </label>
              <div className="flex flex-wrap gap-2">
                {(product.lengths || ['1 metro', '2 metros', '3 metros']).map((len) => {
                  const isSelected = selectedLength === len;
                  return (
                    <button
                      key={len}
                      type="button"
                      onClick={() => setSelectedLength(len)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-gold text-neutral-950 font-extrabold shadow-xs' 
                          : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {len}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-neutral-600 font-sans mt-1">
                Outras medidas sob consulta, mediante verificação de disponibilidade.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => onSelectProfileForQuote(`${product.code} — ${selectedColor} — ${selectedLength}`)}
                className="w-full py-4 bg-gold hover:bg-gold-light text-neutral-950 font-extrabold rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-gold/25 hover:scale-[1.01]"
              >
                <span>Simular Este Perfil no Orçamento</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <a
                href={`https://wa.me/${whatsappRaw}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                id="product-detail-whatsapp-btn"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Falar com Consultor no WhatsApp ({whatsappDisplay})</span>
              </a>
            </div>

          </div>

        </div>

        {/* --- FACTORY & TECHNICAL CONSULTANT DIRECT ASSISTANCE BANNER --- */}
        <div className="mt-16 bg-neutral-950 text-white rounded-3xl p-6 sm:p-10 border border-neutral-800 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Consultoria Técnica Especializada Pasilux</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                Atendimento Direto da Fábrica para Todo o Brasil
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl mx-auto">
                Precisa de suporte na especificação de perfis de alumínio, compatibilidade de fitas LED COB, cortes sob medida ou envio de memorial descritivo para sua obra?
              </p>
            </div>

            {/* Direct Consultor Info Box */}
            <div className="bg-neutral-900/90 border border-gold/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                <div className="md:col-span-6 space-y-3">
                  <span className="px-2.5 py-0.5 rounded bg-gold/20 text-gold text-[10px] font-mono font-bold uppercase block w-max">
                    Atendimento Oficial
                  </span>
                  <h3 className="font-serif font-bold text-xl text-white">
                    Equipe de Engenharia &amp; Vendas Pasilux
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    Suporte personalizado para arquitetos, designers de interiores, light designers, engenheiros e instaladores com fornecimento ágil em escala industrial.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 pt-1">
                    <MapPin className="h-4 w-4 text-gold shrink-0" />
                    <span>{addressDisplay}</span>
                  </div>
                </div>

                <div className="md:col-span-6 space-y-3 text-xs font-mono bg-neutral-950 p-5 rounded-xl border border-neutral-800">
                  <div className="flex items-center justify-between py-1 border-b border-neutral-800">
                    <span className="text-neutral-400">Canal WhatsApp Oficial:</span>
                    <span className="text-emerald-400 font-bold">{whatsappDisplay}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-neutral-800">
                    <span className="text-neutral-400">E-mail Corporativo:</span>
                    <span className="text-neutral-200">{emailDisplay}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-neutral-400">Horário de Suporte:</span>
                    <span className="text-gold">{siteTexts.contactHours || 'Seg a Sex: 07:30 às 17:30'}</span>
                  </div>
                </div>

              </div>

              {/* Direct CTA to Contact */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
                <span className="text-xs text-neutral-400 font-sans">
                  Envie a planta ou o código do perfil <strong>{product.code}</strong> para cotação imediata.
                </span>

                <a
                  href={`https://wa.me/${whatsappRaw}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs uppercase font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25"
                  id="product-detail-banner-whatsapp-btn"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Falar com Consultor no WhatsApp</span>
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* --- DETAILED TECHNICAL SPECIFICATIONS & APPLICATIONS TABULAR LIST --- */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Applications list */}
          <div className="bg-neutral-50 border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="font-serif font-bold text-xl text-neutral-950 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-gold-dark" />
              <span>Aplicações Recomendadas para o {product.code}</span>
            </h3>
            <ul className="space-y-3">
              {product.applications.map((app, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-700 bg-white p-3 rounded-xl border border-neutral-200/60 shadow-2xs">
                  <Check className="h-4 w-4 text-gold-dark shrink-0 mt-0.5" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Construction Features list */}
          <div className="bg-neutral-50 border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="font-serif font-bold text-xl text-neutral-950 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-gold-dark" />
              <span>Destaques Técnicos e Construtivos</span>
            </h3>
            <ul className="space-y-3">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-700 bg-white p-3 rounded-xl border border-neutral-200/60 shadow-2xs">
                  <Check className="h-4 w-4 text-gold-dark shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* --- SIMILAR / RELATED PRODUCTS CAROUSEL --- */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-neutral-200/80 pt-12 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-2xl text-neutral-950">
                  Outros Perfis da Linha {product.category}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Modelos complementares para projetos luminotécnicos integrados.
                </p>
              </div>

              <button
                type="button"
                onClick={onNavigateToCatalog}
                className="text-xs font-mono font-bold text-gold-dark hover:underline flex items-center gap-1"
              >
                <span>Ver Todos ({profiles.length})</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigateToProduct(rel.code)}
                  className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gold/50 transition-all duration-300 cursor-pointer group flex flex-col"
                >
                  <div className="relative h-44 bg-neutral-950 overflow-hidden">
                    <img 
                      src={rel.image} 
                      alt={rel.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85" 
                    />
                    <div className="absolute top-3 left-3 bg-neutral-950/90 text-gold text-xs font-mono font-bold px-2.5 py-1 rounded border border-gold/30">
                      {rel.code}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-serif font-bold text-neutral-950 text-base group-hover:text-gold-dark transition-colors">
                        {rel.name}
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
                        {rel.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400">{rel.width}x{rel.height}mm</span>
                      <span className="text-gold-dark font-bold flex items-center gap-0.5">
                        Ver Detalhes <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* --- LIGHTBOX IMAGE ZOOM MODAL --- */}
      <AnimatePresence>
        {isZoomOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md"
            onClick={() => setIsZoomOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-4 text-white"
            >
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-neutral-900 hover:bg-gold text-white hover:text-neutral-950 rounded-full border border-neutral-700 transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="h-[70vh] w-full flex items-center justify-center">
                <img
                  src={galleryImages[selectedImageIndex].url}
                  alt={galleryImages[selectedImageIndex].title}
                  className="max-h-full max-w-full object-contain rounded-2xl"
                />
              </div>

              <div className="p-4 text-center border-t border-neutral-800">
                <h4 className="font-serif font-bold text-lg text-gold">
                  {product.code} - {galleryImages[selectedImageIndex].title}
                </h4>
                <p className="text-xs font-mono text-neutral-400 mt-0.5">
                  Extrusão Pasilux • {product.name} ({product.width}x{product.height}mm)
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
