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
  heroTagline: 'Tradição & Inovação em Alumínio',
  heroTitle1: 'Moldando o alumínio,',
  heroTitle2: 'iluminando o futuro.',
  heroDescription: 'Catanduva, SP — Derivada de um grupo metalúrgico consolidado com mais de 60 anos de herança, a Pasilux revoluciona ambientes através de perfis de LED de alta precisão.',
  aboutTitle: 'Uma Herança de Confiança, Comprometimento e Inovação.',
  aboutTab1Label: 'Nossa Origem (60+ Anos)',
  aboutTab2Label: 'Expertise em Alumínio (20+ Anos)',
  contactPhone: '(17) 99106-6398',
  contactWhatsapp: '(17) 99106-6398',
  contactWhatsappRaw: '5517991066398',
  contactEmail: 'contato@pasilux.com.br',
  contactAddress: 'Catanduva, São Paulo, Brasil',
  contactHours: 'Segunda a Sexta: 08:00 às 18:00',
  contactSubtitle: 'Nossa matriz de atendimento ao cliente e parque tecnológico de extrusão e moldagem estão estrategicamente situados em Catanduva, atendendo com agilidade todo o estado de São Paulo e o Brasil.',
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
        if (data.siteTexts) setSiteTexts(data.siteTexts);
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
