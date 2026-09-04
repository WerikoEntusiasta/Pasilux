import React, { createContext, useContext, useState, useEffect } from 'react';
import { LEDProfile, Lead, Budget, Representative, SiteTexts } from '../types';
import { PROFILES as DEFAULT_PROFILES } from '../data';

export type { SiteTexts };

const DEFAULT_CATEGORIES: string[] = [
  'Movelaria',
  'Embutir',
  'Sobrepor',
  'Pendente',
  'No Frame',
  'Perfis Especiais',
];

const DEFAULT_TEXTS: SiteTexts = {
  // Navigation
  navBrandSubtitle: 'Perfis de LED & Alumínio',
  navLinkHome: 'Início',
  navLinkAbout: 'Quem Somos',
  navLinkProducts: 'Produtos',
  navLinkProjects: 'Projetos',
  navLinkBlog: 'Blog',
  navLinkContact: 'Contato',
  navCtaButton: 'Quero ser revendedor',
  navWhatsappText: 'WhatsApp Direto',

  // Hero Section
  heroTagline: 'Direto de Fábrica • Catanduva - SP',
  heroTitle1: 'Perfis de LED em alumínio direto de fábrica —',
  heroTitle2: 'para lojas e distribuidores em todo o Brasil.',
  heroDescription: 'Catálogo com 34+ modelos industriais, condições especiais de revenda e suporte técnico para grandes lotes.',
  heroExploreBtn: 'Quero ser revendedor',
  heroWhatsappBtn: 'Tenho um projeto grande / Falar com consultor',
  heroWhatsappMessage: 'Olá! Tenho um projeto de grande volume / compra em lote de perfis de LED e gostaria de falar com um consultor comercial da Pasilux.',
  heroScrollText: 'Deslize para ver mais',

  // About Section (Quem Somos)
  aboutBadge: 'Quem Somos',
  aboutTitle: 'Há 4 anos no mercado, com 60 anos de know-how em alumínio por trás.',
  aboutSubtitle: 'Nossa história e infraestrutura tecnológica em Catanduva - SP',
  aboutTab1Label: 'Nossa Origem (60+ Anos)',
  aboutTab2Label: 'Expertise em Alumínio (20+ Anos)',
  about60Badge: 'CATANDUVA - SP • GRUPO METALÚRGICO FUNDADOR',
  about60Title: 'Tradição, Precisão e Fornecimento Estável',
  about60P1: 'Se você tem uma loja, distribuidora ou marcenaria e já cansou de depender de importação com prazo incerto, ou de fornecedor que entrega variação de qualidade lote a lote, a Pasilux existe pra resolver isso. Estamos no mercado há 4 anos, mas carregamos mais de 60 anos de know-how em extrusão de alumínio herdados do grupo metalúrgico que nos originou, e mais de 20 anos de expertise específica em perfis técnicos.',
  about60P2: 'Na prática, isso significa fornecimento estável direto de fábrica, tolerância dimensional que não varia de lote a lote, e um catálogo de 34+ modelos pra você ampliar seu mix sem perder qualidade.',
  about60P3: 'Se o seu negócio é revender ou aplicar perfil de LED com qualidade e previsibilidade, é pra isso que a Pasilux existe.',
  aboutCard1Title: 'Fornecimento Estável',
  aboutCard1Desc: 'Produção própria em Catanduva/SP, sem depender de importação ou de terceiros. Seu estoque não fica refém de prazo internacional.',
  aboutCard2Title: 'Condições de Revenda Sob Medida',
  aboutCard2Desc: 'Preço e prazo pensados pra fazer sentido na sua operação, com condições comerciais que acompanham o volume da sua loja ou distribuidora.',
  aboutCard3Title: 'Suporte Técnico pro Seu Cliente Final',
  aboutCard3Desc: 'Ficha técnica completa, comparador de fita LED e equipe disponível pra tirar a dúvida técnica que o seu cliente trouxer até você.',
  about20Badge: 'CATANDUVA - SP • ESPECIALISTAS EM EXTRUSÃO',
  about20Title: 'Duas Décadas Dedicadas ao Alumínio',
  about20P1: 'Situada em Catanduva, no interior do Estado de São Paulo, a Pasilux é a mais recente adição a um grupo consolidado que atua há mais de 20 anos no mercado de alumínio. Embora a Pasilux seja uma nova marca, carregamos conosco a rica tradição, experiência e expertise desse grupo renomado.',
  about20P2: 'Nossa paixão por inovação e excelência nos guia em cada passo. Acreditamos que o alumínio, quando moldado com precisão e inovação, tem o poder de revolucionar ambientes e experiências. É essa convicção que nos motiva a explorar constantemente novas técnicas, designs e soluções para atender às demandas dinâmicas de nossos clientes.',
  about20P3: 'Ao optar pela Pasilux, você não está apenas escolhendo produtos de alta qualidade, mas também uma herança de confiança e comprometimento que vem sendo construída ao longo de duas décadas. Estamos aqui para iluminar, inovar e inspirar.',
  about20StatNumber: '20+',
  about20StatTitle: 'Anos de Mercado em Alumínio',
  about20StatDesc: 'Nossa liga de alumínio passa por processos rigorosos de têmpera e anodização, garantindo dissipação térmica excepcional para fitas de LED de alta potência. Uma verdadeira revolução de design estrutural.',

  // Products Highlights Section
  productsBadge: 'Destaques Pasilux',
  productsTitle: '6 Principais Perfis de LED',
  productsSubtitle: 'Conheça os modelos industriais mais especificados por arquitetos, marceneiros e lighting designers em todo o Brasil.',
  productsCtaCatalog: 'Ver Catálogo Completo (34+ Modelos)',
  productsCatalogBadge: 'Página Oficial de Produtos Pasilux 2026',
  productsCatalogTitle: 'Catálogo de Perfis de LED Industriais',
  productsCatalogSubtitle: 'Consulte especificações técnicas, tolerâncias, abas de embutir e medidas nominais para projetos luminotécnicos de alta precisão.',

  // Projects Section
  projectsBadge: 'Portfólio & Obras Entregues',
  projectsTitle: 'Projetos Realizados com Pasilux',
  projectsSubtitle: 'Inspire-se com obras de arquitetura residencial, corporativa e marcenaria fina de alto padrão especificadas com nossos perfis de alumínio e tecnologia LED.',
  projectsCtaQuote: 'Solicitar Orçamento deste Projeto',

  // Budget Section
  budgetBadge: 'Cotação Direta de Fábrica',
  budgetTitle: 'Solicite um Orçamento Sob Medida',
  budgetSubtitle: 'Envie as necessidades do seu projeto, medidas lineares ou anexe sua planta luminotécnica para receber uma cotação detalhada direto da fábrica Pasilux.',
  budgetFormTitle: 'Dados para Solicitação de Orçamento',
  budgetButtonText: 'Solicitar Orçamento',
  budgetSuccessTitle: 'Recebemos sua Solicitação!',
  budgetSuccessMessage: 'Nossa equipe técnica e comercial entrará em contato em até 24 horas úteis via WhatsApp ou E-mail com a sua cotação personalizada direto de fábrica.',
  budgetHowItWorksTitle: 'Como Funciona',
  budgetStep1: 'Você envia as dimensões, modelo desejado ou anexe o arquivo do projeto.',
  budgetStep2: 'Nossa equipe calcula a cotação exata de fábrica e valida o dimensionamento.',
  budgetStep3: 'Entregamos com corte sob medida e suporte técnico em todo o Brasil.',
  budgetProNoticeTitle: 'Atendimento a Profissionais',
  budgetProNoticeDesc: 'Arquitetos, lighting designers, engenheiros e marcenarias contam com suporte técnico dedicado e condições de faturamento direto de fábrica para grandes lotes.',
  budgetSpecialMeasuresNotice: 'Medidas Especiais: Comprimentos fora da lista padrão (1m, 2m, 3m) são atendidos sob encomenda mediante verificação de viabilidade técnica.',

  // Blog Section
  blogBadge: 'Informativos & Insights',
  blogTitle: 'Blog Pasilux',
  blogSubtitle: 'Fique por dentro das novidades tecnológicas, guias de economia de consumo e soluções sustentáveis ligadas à iluminação de LED.',
  blogCtaViewAll: 'Ver Todos os Artigos Técnicos',
  blogPageTitle: 'Artigos Técnicos e Guias Luminotécnicos',
  blogPageSubtitle: 'Conteúdo aprofundado sobre iluminação linear de LED, eficiência energética, cálculo luminotécnico e marcenaria de alto padrão.',

  // Catalog PDF Modal
  catalogModalBadge: 'Download Imediato',
  catalogModalTitle: 'Baixar Catálogo Técnico 2026 (PDF)',
  catalogModalSubtitle: 'Receba a versão técnica completa com todas as 34 geometrias, cotas de embutir e recomendações de dissipação térmica.',
  catalogModalButtonText: 'Baixar Catálogo Técnico Grátis',

  // Contact Section
  contactBadge: 'Atendimento Pasilux',
  contactTitle: 'Fale com Nossos Consultores',
  contactDescription: 'Estamos prontos para atender você! Fale diretamente com nossa equipe técnica pelo WhatsApp oficial, telefone ou envie sua mensagem abaixo.',
  contactPhone: '(17) 99106-6398',
  contactWhatsapp: '(17) 99106-6398',
  contactWhatsappRaw: '5517991066398',
  contactEmail: 'contato@pasilux.com.br',
  contactAddress: 'Catanduva, São Paulo, Brasil',
  contactHours: 'Segunda a Sexta: 07:30 às 17:30',
  contactSubtitle: 'Nossa matriz de atendimento ao cliente e parque tecnológico de moldagem estão estrategicamente situados em Catanduva, atendendo com agilidade todo o estado de São Paulo e o Brasil.',
  contactFormTitle: 'Envie uma Mensagem Direta',
  contactButtonText: 'Enviar Mensagem',
  contactSuccessTitle: 'Mensagem Enviada com Sucesso!',
  contactSuccessMessage: 'Agradecemos o seu contato. Nossa equipe retornará o mais rápido possível através do seu WhatsApp ou E-mail.',

  // Footer
  footerSlogan: 'Tradição metalúrgica de mais de 60 anos unida à inovação da extrusão de perfis de alumínio. Elevando o padrão de projetos luminotécnicos residenciais e corporativos.',
  footerLocationNotice: 'Catanduva, São Paulo, Brasil — Polo Metalúrgico de Alumínio',
  footerCopyright: 'Copyright © 2026 Pasilux – Todos os direitos reservados.',
  footerBackToTop: 'Voltar ao topo',
};

const INITIAL_REPRESENTATIVES: Representative[] = [
  {
    id: 'rep-1',
    name: 'Márcio Rossi',
    companyName: 'Rossi Representações Luminotécnicas',
    region: 'São Paulo — Interior e Região Central',
    states: ['SP'],
    cepRanges: ['14000-000 à 19999-999'],
    city: 'Catanduva / Ribeirão Preto',
    phone: '(17) 99765-4321',
    whatsapp: '5517997654321',
    email: 'marcio.rossi@pasilux.com.br',
    address: 'Av. Engenheiro José Nelson Macheroni, Catanduva - SP',
    active: true,
  },
  {
    id: 'rep-2',
    name: 'Carolina Fonseca',
    companyName: 'Luce & Design Representações',
    region: 'São Paulo — Capital e Grande SP',
    states: ['SP'],
    cepRanges: ['01000-000 à 13999-999'],
    city: 'São Paulo / Campinas',
    phone: '(11) 98456-7890',
    whatsapp: '5511984567890',
    email: 'carolina.fonseca@pasilux.com.br',
    address: 'Alameda Gabriel Monteiro da Silva, São Paulo - SP',
    active: true,
  },
  {
    id: 'rep-3',
    name: 'Eduardo Silveira',
    companyName: 'Sul Perfis Representações',
    region: 'Região Sul (PR, SC, RS)',
    states: ['PR', 'SC', 'RS'],
    cepRanges: ['80000-000 à 99999-999'],
    city: 'Curitiba - PR',
    phone: '(41) 99123-8877',
    whatsapp: '5541991238877',
    email: 'eduardo.silveira@pasilux.com.br',
    address: 'Rua Marechal Deodoro, Curitiba - PR',
    active: true,
  },
  {
    id: 'rep-4',
    name: 'Renata Albuquerque',
    companyName: 'Nordeste LED & Arquitetura',
    region: 'Região Nordeste',
    states: ['PE', 'BA', 'CE'],
    cepRanges: ['40000-000 à 65999-999'],
    city: 'Recife - PE',
    phone: '(81) 98765-1122',
    whatsapp: '5581987651122',
    email: 'renata.albuquerque@pasilux.com.br',
    address: 'Av. Boa Viagem, Recife - PE',
    active: true,
  },
];

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@construtorasul.com.br',
    phone: '(17) 99823-1122',
    subject: 'Solicitação de Catálogo em PDF',
    message: 'Gostaria de receber a especificação em PDF do perfil de embutir PS-2414E para inserir em nosso projeto de acabamento em gesso.',
    status: 'Pendente',
    date: '30/06/2026',
  },
  {
    id: 'lead-2',
    name: 'Ana Júlia Ramos',
    email: 'anajulia@decorinteriores.design',
    phone: '(11) 98112-4433',
    subject: 'Parceria de Arquitetura',
    message: 'Trabalho com design residencial de alto padrão em SP capital. Gostaria de saber as condições de faturamento direto para clientes finais de marcenaria.',
    status: 'Respondido',
    date: '29/06/2026',
  }
];

const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'orc-1',
    name: 'Roberto Silveira',
    email: 'roberto@moveisplanejadoscatanduva.com',
    phone: '(17) 3522-9011',
    company: 'Silveira Móveis Planejados',
    city: 'Catanduva',
    state: 'sp',
    status: 'Em Análise',
    date: '30/06/2026',
    items: [
      {
        profileCode: 'PS-1707S',
        length: 2.5,
        quantity: 12,
        color: 'Alumínio Natural',
        lightTemp: '3000K',
      },
      {
        profileCode: 'PS-2407E',
        length: 1.8,
        quantity: 8,
        color: 'Preto Microtexturizado',
        lightTemp: '4000K',
      }
    ]
  }
];

interface DataContextType {
  profiles: LEDProfile[];
  categories: string[];
  representatives: Representative[];
  siteTexts: SiteTexts;
  leads: Lead[];
  budgets: Budget[];
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  addProfile: (profile: LEDProfile) => Promise<void>;
  updateProfile: (profile: LEDProfile) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  addCategory: (category: string) => Promise<void>;
  updateCategory: (oldName: string, newName: string) => Promise<void>;
  deleteCategory: (category: string) => Promise<void>;
  addRepresentative: (rep: Representative) => Promise<void>;
  updateRepresentative: (rep: Representative) => Promise<void>;
  deleteRepresentative: (id: string) => Promise<void>;
  updateSiteTexts: (texts: SiteTexts) => Promise<void>;
  addLead: (lead: Omit<Lead, 'id' | 'status' | 'date'>) => Promise<void>;
  updateLeadStatus: (id: string, status: Lead['status']) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id' | 'status' | 'date'>) => Promise<void>;
  updateBudgetStatus: (id: string, status: Budget['status']) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  uploadFile: (file: File) => Promise<{ url: string; name: string; size: string }>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<LEDProfile[]>(DEFAULT_PROFILES);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [representatives, setRepresentatives] = useState<Representative[]>(INITIAL_REPRESENTATIVES);
  const [siteTexts, setSiteTexts] = useState<SiteTexts>(DEFAULT_TEXTS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Fetch SQLite database state from server
  const loadServerData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        if (data.profiles && data.profiles.length > 0) setProfiles(data.profiles);
        if (data.categories && data.categories.length > 0) setCategories(data.categories);
        if (data.representatives) setRepresentatives(data.representatives);
        if (data.siteTexts) setSiteTexts(prev => ({ ...DEFAULT_TEXTS, ...data.siteTexts }));
        if (data.leads) setLeads(data.leads);
        if (data.budgets) setBudgets(data.budgets);
      }
    } catch (e) {
      console.warn('Could not sync with server SQLite API:', e);
    }
  };

  useEffect(() => {
    loadServerData();
  }, []);

  const addProfile = async (profile: LEDProfile) => {
    setProfiles(prev => [...prev, profile]);
    try {
      await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const updateProfile = async (profile: LEDProfile) => {
    setProfiles(prev => prev.map(p => p.id === profile.id ? profile : p));
    try {
      await fetch(`/api/profiles/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteProfile = async (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`/api/profiles/${id}`, { method: 'DELETE' });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const addCategory = async (category: string) => {
    const trimmed = category.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories(prev => [...prev, trimmed]);
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const updateCategory = async (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setCategories(prev => prev.map(c => c === oldName ? trimmed : c));
    setProfiles(prev => prev.map(p => p.category === oldName ? { ...p, category: trimmed } : p));
    try {
      await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldName, newName: trimmed }),
      });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCategory = async (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
    try {
      await fetch(`/api/categories/${encodeURIComponent(category)}`, { method: 'DELETE' });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const addRepresentative = async (rep: Representative) => {
    setRepresentatives(prev => [...prev, rep]);
    try {
      await fetch('/api/representatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rep),
      });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const updateRepresentative = async (rep: Representative) => {
    setRepresentatives(prev => prev.map(r => r.id === rep.id ? rep : r));
    try {
      await fetch(`/api/representatives/${rep.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rep),
      });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteRepresentative = async (id: string) => {
    setRepresentatives(prev => prev.filter(r => r.id !== id));
    try {
      await fetch(`/api/representatives/${id}`, { method: 'DELETE' });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const updateSiteTexts = async (texts: SiteTexts) => {
    setSiteTexts(texts);
    try {
      await fetch('/api/texts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(texts),
      });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const addLead = async (lead: Omit<Lead, 'id' | 'status' | 'date'>) => {
    const tempLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      status: 'Pendente',
      date: new Date().toLocaleDateString('pt-BR'),
    };
    setLeads(prev => [tempLead, ...prev]);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const updateLeadStatus = async (id: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id' | 'status' | 'date'>) => {
    const tempBudget: Budget = {
      ...budget,
      id: `orc-${Date.now()}`,
      status: 'Pendente',
      date: new Date().toLocaleDateString('pt-BR'),
    };
    setBudgets(prev => [tempBudget, ...prev]);
    try {
      await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget),
      });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const updateBudgetStatus = async (id: string, status: Budget['status']) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    try {
      await fetch(`/api/budgets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const resetToDefaults = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
      await loadServerData();
    } catch (e) {
      console.error(e);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      throw new Error('Falha no upload do arquivo.');
    }
    const data = await res.json();
    return {
      url: data.url,
      name: data.originalName,
      size: data.size,
    };
  };

  return (
    <DataContext.Provider value={{
      profiles, categories, representatives, siteTexts, leads, budgets, isAdminOpen, setIsAdminOpen,
      addProfile, updateProfile, deleteProfile,
      addCategory, updateCategory, deleteCategory,
      addRepresentative, updateRepresentative, deleteRepresentative,
      updateSiteTexts, addLead, updateLeadStatus, addBudget, updateBudgetStatus, resetToDefaults, uploadFile
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
