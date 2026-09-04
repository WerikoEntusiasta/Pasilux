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
  // Navigation
  navBrandSubtitle?: string;
  navLinkHome?: string;
  navLinkAbout?: string;
  navLinkProducts?: string;
  navLinkProjects?: string;
  navLinkBlog?: string;
  navLinkContact?: string;
  navCtaButton?: string;
  navWhatsappText?: string;

  // Hero Section
  heroTagline: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDescription: string;
  heroExploreBtn?: string;
  heroWhatsappBtn?: string;
  heroWhatsappMessage?: string;
  heroScrollText?: string;

  // About Section (Quem Somos)
  aboutBadge?: string;
  aboutTitle: string;
  aboutSubtitle?: string;
  aboutTab1Label: string;
  aboutTab2Label: string;
  about60Badge?: string;
  about60Title?: string;
  about60P1?: string;
  about60P2?: string;
  about60P3?: string;
  aboutCard1Title?: string;
  aboutCard1Desc?: string;
  aboutCard2Title?: string;
  aboutCard2Desc?: string;
  aboutCard3Title?: string;
  aboutCard3Desc?: string;
  about20Badge?: string;
  about20Title?: string;
  about20P1?: string;
  about20P2?: string;
  about20P3?: string;
  about20StatNumber?: string;
  about20StatTitle?: string;
  about20StatDesc?: string;

  // Products Section
  productsBadge?: string;
  productsTitle?: string;
  productsSubtitle?: string;
  productsCtaCatalog?: string;
  productsCatalogBadge?: string;
  productsCatalogTitle?: string;
  productsCatalogSubtitle?: string;

  // Projects Section
  projectsBadge?: string;
  projectsTitle?: string;
  projectsSubtitle?: string;
  projectsCtaQuote?: string;

  // Budget Section
  budgetBadge?: string;
  budgetTitle?: string;
  budgetSubtitle?: string;
  budgetFormTitle?: string;
  budgetButtonText?: string;
  budgetSuccessTitle?: string;
  budgetSuccessMessage?: string;
  budgetHowItWorksTitle?: string;
  budgetStep1?: string;
  budgetStep2?: string;
  budgetStep3?: string;
  budgetProNoticeTitle?: string;
  budgetProNoticeDesc?: string;
  budgetSpecialMeasuresNotice?: string;

  // Blog Section
  blogBadge?: string;
  blogTitle?: string;
  blogSubtitle?: string;
  blogCtaViewAll?: string;
  blogPageTitle?: string;
  blogPageSubtitle?: string;

  // Catalog PDF Modal
  catalogModalBadge?: string;
  catalogModalTitle?: string;
  catalogModalSubtitle?: string;
  catalogModalButtonText?: string;

  // Contact Section
  contactBadge?: string;
  contactTitle?: string;
  contactDescription?: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactWhatsappRaw: string;
  contactEmail: string;
  contactAddress: string;
  contactHours: string;
  contactSubtitle: string;
  contactFormTitle?: string;
  contactButtonText?: string;
  contactSuccessTitle?: string;
  contactSuccessMessage?: string;

  // Footer
  footerSlogan?: string;
  footerLocationNotice?: string;
  footerCopyright?: string;
  footerBackToTop?: string;

  // Dynamic texts index signature
  [key: string]: string | undefined;
}
