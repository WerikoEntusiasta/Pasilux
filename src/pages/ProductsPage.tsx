import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Sparkles, 
  Ruler, 
  Check, 
  Grid, 
  List, 
  ArrowUpRight, 
  ChevronRight, 
  Layers, 
  Maximize2,
  Info,
  CheckCircle2,
  RotateCcw,
  ArrowLeft,
  HelpCircle,
  SlidersHorizontal,
  Compass,
  Lightbulb,
  Building2,
  CheckSquare
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { LEDProfile } from '../types';

interface ProductsPageProps {
  onNavigateHome: () => void;
  onSelectProfileForQuote: (profileCode: string) => void;
  onNavigateToProduct?: (profileCode: string) => void;
  initialProfileCode?: string | null;
}

export default function ProductsPage({ 
  onNavigateHome, 
  onSelectProfileForQuote, 
  onNavigateToProduct,
  initialProfileCode 
}: ProductsPageProps) {
  const { profiles, categories: dataCategories } = useData();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedApplication, setSelectedApplication] = useState<string>('Todas');
  const [selectedColor, setSelectedColor] = useState<string>('Todos');
  const [selectedLength, setSelectedLength] = useState<string>('Todos');
  const [selectedWidth, setSelectedWidth] = useState<string>('Todas');
  const [selectedHeight, setSelectedHeight] = useState<string>('Todas');
  const [onlyCobRecommended, setOnlyCobRecommended] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'code-asc' | 'width-asc' | 'width-desc' | 'name-asc'>('code-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State for Technical Data Sheet
  const [selectedProfile, setSelectedProfile] = useState<LEDProfile | null>(null);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Auto-select profile if initialProfileCode is passed
  React.useEffect(() => {
    if (initialProfileCode && profiles.length > 0) {
      const found = profiles.find(p => p.code.toLowerCase() === initialProfileCode.toLowerCase());
      if (found) {
        setSelectedProfile(found);
      }
    }
  }, [initialProfileCode, profiles]);

  // Categories list
  const categoriesList = ['Todos', ...dataCategories];

  const categoryDescriptions: Record<string, string> = {
    Movelaria: 'Perfis compactos ultra-finos (9x13mm, 24x7mm) ideais para marcenaria, nichos, gavetas e closets.',
    Embutir: 'Modelos com abas laterais para embutir em rasgos de gesso, drywall e painéis com acabamento impecável.',
    Sobrepor: 'Fixação direta sobre lajes, concreto aparente, móveis e paredes sem corte na estrutura.',
    Pendente: 'Perfis robustos para luminárias suspensas por cabos de aço em ilhas de cozinha e escritórios.',
    'No Frame': 'Instalação 100% invisível em forros de gesso sem bordas metálicas aparentes.',
    'Perfis Especiais': 'Perfis para painéis ripados de alumínio/madeira com iluminação direta ou indireta.'
  };

  const applicationsOptions = [
    'Todas',
    'Marcenaria fina e armários',
    'Rasgos de luz em teto de gesso e drywall',
    'Sancas perimetrais integradas',
    'Móveis de cozinha aéreos',
    'Ilhas de cozinha e bancadas americanas',
    'Fachadas residenciais e comerciais',
    'Rodapé iluminado em corredores e salas',
  ];

  const colorsOptions = [
    'Todos',
    'Preto Microtexturizado',
    'Branco Texturizado',
    'Alumínio Natural',
    'Linheiro Claro',
    'Jequitibá'
  ];

  const lengthsOptions = ['Todos', '1 metro', '2 metros', '3 metros', '6 metros'];

  // Extract unique widths and heights from profiles dynamically and sort numerically
  const availableWidths = useMemo(() => {
    const uniqueWidths = Array.from(new Set<number>(profiles.map(p => Number(p.width))));
    const sorted = uniqueWidths.sort((a, b) => a - b);
    return ['Todas', ...sorted.map(w => `${w}mm`)];
  }, [profiles]);

  const availableHeights = useMemo(() => {
    const uniqueHeights = Array.from(new Set<number>(profiles.map(p => Number(p.height))));
    const sorted = uniqueHeights.sort((a, b) => a - b);
    return ['Todas', ...sorted.map(h => `${h}mm`)];
  }, [profiles]);

  // Filter Logic
  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term || 
        profile.code.toLowerCase().includes(term) ||
        profile.name.toLowerCase().includes(term) ||
        profile.description.toLowerCase().includes(term) ||
        profile.category.toLowerCase().includes(term) ||
        `${profile.width}x${profile.height}`.includes(term) ||
        profile.applications.some(app => app.toLowerCase().includes(term));

      const matchesCategory = selectedCategory === 'Todos' || profile.category === selectedCategory;

      const matchesApplication = selectedApplication === 'Todas' || 
        profile.applications.some(app => app.toLowerCase().includes(selectedApplication.toLowerCase()));

      const matchesColor = selectedColor === 'Todos' || 
        profile.colors.some(c => c.toLowerCase() === selectedColor.toLowerCase());

      const matchesLength = selectedLength === 'Todos' || 
        profile.lengths?.some(l => l.toLowerCase() === selectedLength.toLowerCase());

      const matchesWidth = selectedWidth === 'Todas' || 
        profile.width === parseInt(selectedWidth.replace('mm', ''), 10);

      const matchesHeight = selectedHeight === 'Todas' || 
        profile.height === parseInt(selectedHeight.replace('mm', ''), 10);

      const matchesCob = !onlyCobRecommended || profile.isCobRecommended;

      return matchesSearch && matchesCategory && matchesApplication && matchesColor && matchesLength && matchesWidth && matchesHeight && matchesCob;
    }).sort((a, b) => {
      if (sortBy === 'code-asc') return a.code.localeCompare(b.code);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'width-asc') return a.width - b.width;
      if (sortBy === 'width-desc') return b.width - a.width;
      return 0;
    });
  }, [profiles, searchTerm, selectedCategory, selectedApplication, selectedColor, selectedLength, selectedWidth, selectedHeight, onlyCobRecommended, sortBy]);

  const activeFiltersCount = (selectedCategory !== 'Todos' ? 1 : 0) +
    (selectedApplication !== 'Todas' ? 1 : 0) +
    (selectedColor !== 'Todos' ? 1 : 0) +
    (selectedLength !== 'Todos' ? 1 : 0) +
    (selectedWidth !== 'Todas' ? 1 : 0) +
    (selectedHeight !== 'Todas' ? 1 : 0) +
    (onlyCobRecommended ? 1 : 0) +
    (searchTerm.trim() !== '' ? 1 : 0);

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setSelectedApplication('Todas');
    setSelectedColor('Todos');
    setSelectedLength('Todos');
    setSelectedWidth('Todas');
    setSelectedHeight('Todas');
    setOnlyCobRecommended(false);
    setSortBy('code-asc');
  };

  const handleSimulateQuote = (profileCode: string) => {
    setSelectedProfile(null);
    onSelectProfileForQuote(profileCode);
  };

  const faqs = [
    {
      q: 'Qual a diferença entre perfil de Embutir e perfil de Sobrepor?',
      a: 'O perfil de Embutir possui abas laterais projetadas para encaixar em cavidades ou rasgos previamente cortados em gesso, drywall ou MDF, cobrindo eventuais imperfeições no corte. O perfil de Sobrepor possui corpo plano ou fixação traseira por presilhas, sendo parafusado diretamente sobre a superfície existente (concreto, laje, madeira) sem necessidade de corte.'
    },
    {
      q: 'Quando devo usar a fita de LED COB nos perfis Pasilux?',
      a: 'Em perfis ultra-slim de baixa profundidade (como 7mm ou 9mm de altura), as fitas LED tradicionais (ex: 60 ou 120 LEDs/m) podem marcar pequenos pontos de luz visíveis no difusor. As fitas de LED COB possuem luz contínua 100% sem pontos visíveis, sendo altamente recomendadas para perfis finos de movelaria.'
    },
    {
      q: 'Como funciona a instalação do Perfil No Frame no gesso?',
      a: 'O perfil No Frame é parafusado e chumbado com massa de gesso antes da pintura final. As bordas perfuradas do perfil ficam totalmente cobertas pela massa. Após a pintura, resta apenas o difusor leitoso acoplado à calha, resultando em uma linha de luz contínua totalmente integrada à arquitetura.'
    },
    {
      q: 'Qual a durabilidade dos perfis em alumínio anodizado Pasilux?',
      a: 'Todos os perfis Pasilux são fabricados em alumínio de altíssima pureza com tratamento de anodização ou pintura eletrostática microtexturizada. Não oxidam, dissipam com eficiência o calor das fitas LED aumentando sua vida útil e possuem garantia de fábrica.'
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen text-neutral-900 font-sans">
      
      {/* --- TOP BREADCRUMB & HERO HEADER --- */}
      <div className="bg-neutral-950 text-white relative overflow-hidden py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 hero-grid-bg bg-[size:3rem_3rem]" />
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Breadcrumb & Navigation Back */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <button 
                type="button" 
                onClick={onNavigateHome}
                className="hover:text-gold transition-colors flex items-center gap-1 cursor-pointer"
              >
                Início
              </button>
              <ChevronRight className="h-3 w-3 text-neutral-600" />
              <span className="text-gold font-bold">Catálogo de Produtos</span>
            </div>

            <button
              type="button"
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Voltar para Página Inicial</span>
            </button>
          </div>

          {/* Title & Headline */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Página Oficial de Produtos Pasilux 2026</span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Catálogo de Perfis de LED Industriais
            </h1>
            
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
              Explore toda a linha de extrusão técnica Pasilux. Soluções completas para iluminação de marcenaria, forros de gesso, lajes maciças, sancas perimetrais e painéis ripados.
            </p>
          </div>

          {/* Value Proposition Highlights Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-neutral-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-gold">
                <Ruler className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-white block">34+ Perfis</span>
                <span className="text-neutral-400 text-[11px]">De 8x9mm até 115mm</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-gold">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-white block">100% Alumínio</span>
                <span className="text-neutral-400 text-[11px]">Anodizado & Texturizado</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-gold">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-white block">Difusor PMMA</span>
                <span className="text-neutral-400 text-[11px]">Acrílico Leitoso Anti-UV</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-gold">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-white block">Corte Sob Medida</span>
                <span className="text-neutral-400 text-[11px]">Pronta entrega em fábrica</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- CATEGORY QUICK SELECT CARDS --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoriesList.slice(1).map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = profiles.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat === selectedCategory ? 'Todos' : cat)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer shadow-sm flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-neutral-950 text-white border-gold shadow-md'
                    : 'bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-gold text-neutral-950' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {count} {count === 1 ? 'modelo' : 'modelos'}
                  </span>
                  <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
                    isSelected ? 'text-gold' : 'text-neutral-400'
                  }`} />
                </div>

                <div>
                  <h3 className={`font-serif font-bold text-sm leading-tight ${isSelected ? 'text-gold' : 'text-neutral-950'}`}>
                    {cat}
                  </h3>
                  <p className={`text-[10px] line-clamp-1 mt-1 ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {categoryDescriptions[cat] || 'Perfis de LED Pasilux'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- MAIN CATALOG FILTER AND SEARCH SUITE --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Filter Panel Container */}
        <div className="bg-neutral-50 border border-neutral-200/90 rounded-2xl p-5 sm:p-6 mb-8 shadow-xs space-y-5">
          
          {/* Header & Controls Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                <Search className="h-5 w-5 text-gold-dark" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar perfil por código (ex: PSL0020), modelo, largura, aplicação..."
                className="w-full pl-11 pr-10 py-3.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 font-sans shadow-xs transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* View Mode & Result Counter */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-mono text-neutral-600 font-bold bg-white border border-neutral-200 px-3 py-2.5 rounded-xl shadow-2xs">
                Exibindo <span className="text-neutral-950 font-extrabold">{filteredProfiles.length}</span> de {profiles.length} modelos
              </span>

              <div className="flex items-center bg-white p-1 rounded-xl border border-neutral-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'grid'
                      ? 'bg-neutral-950 text-gold shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                  title="Visualização em Cards / Grade"
                >
                  <Grid className="h-4 w-4" />
                  <span className="hidden sm:inline">Grade</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'table'
                      ? 'bg-neutral-950 text-gold shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                  title="Visualização em Tabela Planilha"
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Tabela</span>
                </button>
              </div>
            </div>

          </div>

          {/* Category Tabs Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-neutral-200/60 overflow-x-auto">
            <span className="text-xs font-mono text-neutral-400 font-bold uppercase mr-2 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-neutral-500" />
              Filtrar Categoria:
            </span>
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = cat === 'Todos' ? profiles.length : profiles.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-neutral-950 text-gold shadow-xs'
                      : 'bg-white text-neutral-700 border border-neutral-200/80 hover:bg-neutral-100'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-gold/20 text-gold' : 'bg-neutral-100 text-neutral-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filters Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
            
            {/* Filter: Largura (mm) */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-600 font-bold uppercase block truncate">
                Largura (mm)
              </label>
              <select
                value={selectedWidth}
                onChange={(e) => setSelectedWidth(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-gold cursor-pointer"
              >
                {availableWidths.map((w, idx) => (
                  <option key={idx} value={w}>
                    {w === 'Todas' ? 'Todas Larguras' : w}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter: Altura (mm) */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-600 font-bold uppercase block truncate">
                Altura (mm)
              </label>
              <select
                value={selectedHeight}
                onChange={(e) => setSelectedHeight(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-gold cursor-pointer"
              >
                {availableHeights.map((h, idx) => (
                  <option key={idx} value={h}>
                    {h === 'Todas' ? 'Todas Alturas' : h}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter: Aplicação */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-600 font-bold uppercase block truncate">
                Aplicação
              </label>
              <select
                value={selectedApplication}
                onChange={(e) => setSelectedApplication(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-gold cursor-pointer"
              >
                {applicationsOptions.map((app, idx) => (
                  <option key={idx} value={app}>
                    {app}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter: Cor de Acabamento */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-600 font-bold uppercase block truncate">
                Acabamento / Cor
              </label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-gold cursor-pointer"
              >
                {colorsOptions.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter: Comprimento */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-600 font-bold uppercase block truncate">
                Comprimento
              </label>
              <select
                value={selectedLength}
                onChange={(e) => setSelectedLength(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-gold cursor-pointer"
              >
                {lengthsOptions.map((l, idx) => (
                  <option key={idx} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-600 font-bold uppercase block truncate">
                Ordenar Por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value="code-asc">Código (PSL0001 → PSL0035)</option>
                <option value="name-asc">Nome do Modelo (A-Z)</option>
                <option value="width-asc">Largura (Menor → Maior)</option>
                <option value="width-desc">Largura (Maior → Menor)</option>
              </select>
            </div>

          </div>

          {/* Bottom Bar: Checkbox & Reset Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200/60 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-mono font-semibold text-neutral-700 hover:text-neutral-950 transition-colors">
              <input
                type="checkbox"
                checked={onlyCobRecommended}
                onChange={(e) => setOnlyCobRecommended(e.target.checked)}
                className="rounded border-neutral-300 text-gold focus:ring-gold accent-gold h-4 w-4 cursor-pointer"
              />
              <span>Recomendados para Fita LED COB (Sem pontos de luz)</span>
            </label>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-3 py-1.5 bg-neutral-200/80 hover:bg-neutral-300 text-neutral-800 rounded-lg font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 text-xs ml-auto"
              >
                <RotateCcw className="h-3.5 w-3.5 text-neutral-600" />
                <span>Limpar Filtros ({activeFiltersCount})</span>
              </button>
            )}
          </div>

        </div>

        {/* --- PRODUCTS PRESENTATION (GRID VS TABLE) --- */}
        {filteredProfiles.length === 0 ? (
          /* Empty State */
          <div className="bg-neutral-50 border border-dashed border-neutral-300 rounded-2xl p-12 text-center space-y-4 my-8">
            <Info className="h-10 w-10 text-neutral-400 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-neutral-900">Nenhum perfil corresponde à busca</h3>
            <p className="text-xs text-neutral-600 max-w-md mx-auto">
              Não encontramos nenhum modelo com os parâmetros aplicados. Tente ajustar os filtros ou redefinir a busca.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-4 py-2 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Ver Todos os Perfis do Catálogo</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProfiles.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gold/40 transition-all duration-300 flex flex-col group relative"
                >
                  {/* Card Banner */}
                  <div 
                    className="relative h-48 bg-neutral-900 overflow-hidden cursor-pointer" 
                    onClick={() => {
                      if (onNavigateToProduct) {
                        onNavigateToProduct(p.code);
                      } else {
                        setSelectedProfile(p);
                      }
                    }}
                  >
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop'}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                    
                    {/* Code & Category Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      <span className="px-2.5 py-1 rounded-md bg-neutral-950/90 backdrop-blur-md text-xs font-mono font-bold text-gold border border-gold/30">
                        {p.code}
                      </span>
                      <span className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-mono uppercase text-white font-semibold">
                        {p.category}
                      </span>
                    </div>

                    {/* Dimensions Badge */}
                    <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-neutral-700 text-xs font-mono font-bold text-neutral-200 flex items-center gap-1">
                      <Ruler className="h-3.5 w-3.5 text-gold" />
                      <span>{p.width}x{p.height}mm</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 
                        onClick={() => {
                          if (onNavigateToProduct) {
                            onNavigateToProduct(p.code);
                          } else {
                            setSelectedProfile(p);
                          }
                        }}
                        className="font-serif font-bold text-neutral-950 text-base leading-snug group-hover:text-gold-dark transition-colors cursor-pointer mb-2"
                      >
                        {p.name}
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    {/* Technical details list */}
                    <div className="space-y-1.5 pt-2 border-t border-neutral-100 text-[11px]">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-neutral-400">Largura fita:</span>
                        <span className="font-bold text-neutral-800">{p.maxStripWidth}</span>
                      </div>
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-neutral-400">Difusor:</span>
                        <span className="font-bold text-neutral-800 truncate max-w-[130px]">{p.diffuser.split(' ')[0]} PMMA</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onNavigateToProduct) {
                            onNavigateToProduct(p.code);
                          } else {
                            setSelectedProfile(p);
                          }
                        }}
                        className="flex-1 py-2 px-3 bg-neutral-950 hover:bg-neutral-800 text-gold font-bold rounded-xl text-xs font-mono flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Maximize2 className="h-3.5 w-3.5 text-gold" />
                        <span>Ver Página Completa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSimulateQuote(p.code)}
                        className="p-2 bg-gold hover:bg-gold-light text-neutral-950 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center"
                        title="Simular no Orçamento"
                      >
                        <ArrowUpRight className="h-4 w-4 font-bold" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-neutral-950 text-gold uppercase font-mono text-[11px] font-bold border-b border-neutral-800">
                  <tr>
                    <th className="py-3.5 px-4">Código</th>
                    <th className="py-3.5 px-4">Modelo / Nome</th>
                    <th className="py-3.5 px-4">Categoria</th>
                    <th className="py-3.5 px-4">Dimensões (L x A)</th>
                    <th className="py-3.5 px-4">Fita LED Máx</th>
                    <th className="py-3.5 px-4">Acabamentos</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredProfiles.map((p) => (
                    <tr key={p.id} className="hover:bg-gold/5 transition-colors group">
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-950">
                        <span className="px-2 py-1 rounded bg-neutral-100 group-hover:bg-gold/20 text-neutral-900 group-hover:text-gold-dark">
                          {p.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-neutral-900 text-sm">
                        {p.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] uppercase font-semibold">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-800">
                        {p.width}mm x {p.height}mm
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 font-mono">
                        {p.maxStripWidth}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 text-[11px]">
                        {p.colors.join(', ')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (onNavigateToProduct) {
                                onNavigateToProduct(p.code);
                              } else {
                                setSelectedProfile(p);
                              }
                            }}
                            className="px-2.5 py-1.5 bg-neutral-950 text-gold hover:bg-neutral-800 rounded-lg font-mono font-bold text-[11px] cursor-pointer"
                          >
                            Página
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSimulateQuote(p.code)}
                            className="px-2.5 py-1.5 bg-gold hover:bg-gold-light text-neutral-950 rounded-lg font-mono font-bold text-[11px] cursor-pointer"
                          >
                            Orçamento
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* --- FAQ & TECHNICAL SUPPORT SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-neutral-50 border border-neutral-200/90 rounded-3xl p-8 sm:p-12">
          
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold-dark text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Suporte Técnico e Especificação</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950">
              Perguntas Frequentes sobre Perfis de LED
            </h2>
            <p className="text-neutral-600 text-xs sm:text-sm mt-1">
              Esclareça dúvidas frequentes de arquitetos, marceneiros e engenheiros ao projetar com a linha Pasilux.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif font-bold text-neutral-900 text-sm sm:text-base hover:text-gold-dark cursor-pointer transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`h-5 w-5 text-neutral-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90 text-gold' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Direct Technical Consultation CTA */}
          <div className="mt-8 pt-8 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-950 text-white p-6 rounded-2xl">
            <div>
              <h3 className="font-serif font-bold text-base text-white">Precisa de especificação sob medida para seu projeto?</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Envie a planta do seu projeto para receber apoio técnico direto dos consultores Pasilux.
              </p>
            </div>

            <button
              type="button"
              onClick={onNavigateHome}
              className="px-6 py-3 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shadow-md shadow-gold/20"
            >
              Falar com Nossos Consultores
            </button>
          </div>

        </div>
      </div>

      {/* --- TECHNICAL DATA SHEET LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {selectedProfile && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedProfile(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xl text-neutral-900 my-8"
            >
              {/* Modal Header */}
              <div className="relative h-64 bg-neutral-950 overflow-hidden">
                <img
                  src={selectedProfile.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop'}
                  alt={selectedProfile.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                <button
                  type="button"
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-950/80 hover:bg-gold text-neutral-300 hover:text-neutral-950 transition-colors cursor-pointer border border-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-gold text-neutral-950 text-xs font-mono font-bold">
                      {selectedProfile.code}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white/20 text-white text-xs font-mono uppercase">
                      Linha {selectedProfile.category}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                    {selectedProfile.name}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                
                {/* Tech Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">Dimensão Exata</span>
                    <span className="font-mono font-bold text-sm text-neutral-900">{selectedProfile.width}x{selectedProfile.height} mm</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">Fita LED Máx</span>
                    <span className="font-mono font-bold text-sm text-neutral-900">{selectedProfile.maxStripWidth}</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">Difusor</span>
                    <span className="font-mono font-bold text-xs text-neutral-900 truncate block">{selectedProfile.diffuser.split(' ')[0]} PMMA</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">Proteção IP</span>
                    <span className="font-mono font-bold text-sm text-neutral-900">IP20 Interno</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-serif font-bold text-neutral-900 text-sm uppercase mb-1">Descrição Técnica</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {selectedProfile.description}
                  </p>
                </div>

                {/* Applications & Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-neutral-100">
                  <div>
                    <h4 className="font-serif font-bold text-neutral-900 text-sm uppercase mb-2">Aplicações Recomendadas</h4>
                    <ul className="space-y-1.5 text-xs text-neutral-600">
                      {selectedProfile.applications.map((app, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-gold-dark shrink-0 mt-0.5" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-neutral-900 text-sm uppercase mb-2">Destaques Construtivos</h4>
                    <ul className="space-y-1.5 text-xs text-neutral-600">
                      {selectedProfile.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-neutral-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Finishes & Lengths */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 text-xs font-mono">
                  <div>
                    <span className="text-neutral-500 font-bold block mb-1">Acabamentos Disponíveis:</span>
                    <span className="text-neutral-900 font-bold">{selectedProfile.colors.join(' • ')}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-bold block mb-1">Comprimentos Disponíveis:</span>
                    <span className="text-neutral-900 font-bold">1m • 2m • 3m</span>
                    <span className="text-[10px] text-neutral-600 block font-normal font-sans mt-0.5">Outras medidas sob consulta, mediante verificação de disponibilidade</span>
                  </div>
                </div>

              </div>

              {/* Modal Footer CTA */}
              <div className="p-5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-4">
                <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
                  Corte sob medida e suporte direto de fábrica Pasilux.
                </span>

                <button
                  type="button"
                  onClick={() => handleSimulateQuote(selectedProfile.code)}
                  className="w-full sm:w-auto px-6 py-3 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-gold/20"
                >
                  <span>Simular no Orçamento</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
