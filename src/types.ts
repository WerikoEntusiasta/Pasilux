export interface LEDProfile {
  id: string;
  name: string;
  code: string;
  type: 'embutir' | 'sobrepor' | 'pendente' | 'no-frame' | 'especial' | 'movelaria';
  category: string;
  width: number;
  height: number;
  cutoutSize?: string;
  description: string;
  applications: string[];
  features: string[];
  maxStripWidth: string;
  diffuser: string;
  accessories?: string;
  colors: string[];
  lengths: string[];
  isCobRecommended?: boolean;
  image?: string;
  cadDrawing?: string;
  placeholderText?: string;
  lumenRecommendation?: string;
}

export interface Representative {
  id: string;
  name: string;
  companyName?: string;
  region: string;
  states: string[];
  cepRanges?: string[];
  city: string;
  phone: string;
  whatsapp?: string;
  email: string;
  address?: string;
  active: boolean;
}

export interface BlogArticle {
  id: string;
  slug?: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  image?: string;
}

export interface ProjectPortfolioItem {
  id: string;
  title: string;
  category: 'Residencial' | 'Comercial' | 'Corporativo' | 'Marcenaria';
  location: string;
  architect?: string;
  lightingDesigner?: string;
  usedProfiles: string[];
  description: string;
  image: string;
  year: string;
}

export interface ProjectSpecs {
  name: string;
  email: string;
  phone: string;
  company?: string;
  city: string;
  state: string;
  profileId: string;
  length: number; // in meters
  quantity: number;
  specifications: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentSize?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Pendente' | 'Respondido' | 'Arquivado';
  date: string;
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentSize?: string;
}

export interface BudgetItem {
  profileCode: string;
  length: number;
  quantity: number;
  color: string;
  lightTemp: string;
}

export interface Budget {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  city: string;
  state: string;
  notes?: string;
  status: 'Pendente' | 'Em Análise' | 'Aprovado' | 'Recusado';
  date: string;
  items: BudgetItem[];
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentSize?: string;
}

export interface SiteTexts {
  heroTagline: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDescription: string;
  aboutTitle: string;
  aboutTab1Label: string;
  aboutTab2Label: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactWhatsappRaw: string;
  contactEmail: string;
  contactAddress: string;
  contactHours: string;
  contactSubtitle: string;
}
