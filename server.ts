import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import initSqlJs, { Database } from 'sql.js';
import dotenv from 'dotenv';
import { PROFILES as DEFAULT_PROFILES, ARTICLES as DEFAULT_ARTICLES } from './src/data';
import { sendLeadEmail, sendBudgetEmail, sendTestEmail, getEmailConfigStatus } from './server/email';

dotenv.config();

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const DB_PATH = path.join(DATA_DIR, 'pasilux.db');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage setup for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

const DEFAULT_CATEGORIES: string[] = [
  'Movelaria',
  'Embutir',
  'Sobrepor',
  'Pendente',
  'No Frame',
  'Perfis Especiais',
];

const DEFAULT_TEXTS = {
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

const INITIAL_REPRESENTATIVES = [
  {
    id: 'rep-1',
    name: 'Márcio Rossi',
    companyName: 'Rossi Representações Luminotécnicas',
    region: 'São Paulo — Interior e Região Central',
    states: JSON.stringify(['SP']),
    cepRanges: JSON.stringify(['14000-000 à 19999-999']),
    city: 'Catanduva / Ribeirão Preto',
    phone: '(17) 99765-4321',
    whatsapp: '5517997654321',
    email: 'marcio.rossi@pasilux.com.br',
    address: 'Av. Engenheiro José Nelson Macheroni, Catanduva - SP',
    active: 1,
  },
  {
    id: 'rep-2',
    name: 'Carolina Fonseca',
    companyName: 'Luce & Design Representações',
    region: 'São Paulo — Capital e Grande SP',
    states: JSON.stringify(['SP']),
    cepRanges: JSON.stringify(['01000-000 à 13999-999']),
    city: 'São Paulo / Campinas',
    phone: '(11) 98456-7890',
    whatsapp: '5511984567890',
    email: 'carolina.fonseca@pasilux.com.br',
    address: 'Alameda Gabriel Monteiro da Silva, São Paulo - SP',
    active: 1,
  },
  {
    id: 'rep-3',
    name: 'Eduardo Silveira',
    companyName: 'Sul Perfis Representações',
    region: 'Região Sul (PR, SC, RS)',
    states: JSON.stringify(['PR', 'SC', 'RS']),
    cepRanges: JSON.stringify(['80000-000 à 99999-999']),
    city: 'Curitiba - PR',
    phone: '(41) 99123-8877',
    whatsapp: '5541991238877',
    email: 'eduardo.silveira@pasilux.com.br',
    address: 'Rua Marechal Deodoro, Curitiba - PR',
    active: 1,
  },
  {
    id: 'rep-4',
    name: 'Renata Albuquerque',
    companyName: 'Nordeste LED & Arquitetura',
    region: 'Região Nordeste',
    states: JSON.stringify(['PE', 'BA', 'CE']),
    cepRanges: JSON.stringify(['40000-000 à 65999-999']),
    city: 'Recife - PE',
    phone: '(81) 98765-1122',
    whatsapp: '5581987651122',
    email: 'renata.albuquerque@pasilux.com.br',
    address: 'Av. Boa Viagem, Recife - PE',
    active: 1,
  },
];

const INITIAL_LEADS = [
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
  },
];

const INITIAL_BUDGETS = [
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
    items: JSON.stringify([
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
      },
    ]),
  },
];

let db: Database;

function saveDb() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function queryAll(sql: string, params: any[] = []): any[] {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows: any[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function runSql(sql: string, params: any[] = []) {
  db.run(sql, params);
  saveDb();
}

async function initDb() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const filebuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      code TEXT,
      name TEXT,
      type TEXT,
      category TEXT,
      width REAL,
      height REAL,
      description TEXT,
      applications TEXT,
      features TEXT,
      maxStripWidth TEXT,
      diffuser TEXT,
      colors TEXT,
      lengths TEXT,
      isCobRecommended INTEGER,
      image TEXT,
      cadDrawing TEXT
    );

    CREATE TABLE IF NOT EXISTS categories (
      name TEXT PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS representatives (
      id TEXT PRIMARY KEY,
      name TEXT,
      companyName TEXT,
      region TEXT,
      states TEXT,
      cepRanges TEXT,
      city TEXT,
      phone TEXT,
      whatsapp TEXT,
      email TEXT,
      address TEXT,
      active INTEGER
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      subject TEXT,
      message TEXT,
      file TEXT,
      attachmentName TEXT,
      attachmentUrl TEXT,
      attachmentSize TEXT,
      status TEXT,
      date TEXT
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      company TEXT,
      city TEXT,
      state TEXT,
      notes TEXT,
      items TEXT,
      attachmentName TEXT,
      attachmentUrl TEXT,
      attachmentSize TEXT,
      status TEXT,
      date TEXT
    );

    CREATE TABLE IF NOT EXISTS site_texts (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Ensure tables have all modern columns even if existing pasilux.db was loaded
  try { db.run('ALTER TABLE leads ADD COLUMN attachmentName TEXT'); } catch(e) {}
  try { db.run('ALTER TABLE leads ADD COLUMN attachmentUrl TEXT'); } catch(e) {}
  try { db.run('ALTER TABLE leads ADD COLUMN attachmentSize TEXT'); } catch(e) {}
  try { db.run('ALTER TABLE budgets ADD COLUMN attachmentName TEXT'); } catch(e) {}
  try { db.run('ALTER TABLE budgets ADD COLUMN attachmentUrl TEXT'); } catch(e) {}
  try { db.run('ALTER TABLE budgets ADD COLUMN attachmentSize TEXT'); } catch(e) {}
  try { db.run('ALTER TABLE budgets ADD COLUMN notes TEXT'); } catch(e) {}

  // Seed default categories if empty
  const catRows = queryAll('SELECT COUNT(*) as count FROM categories');
  if (catRows[0]?.count === 0) {
    for (const cat of DEFAULT_CATEGORIES) {
      db.run('INSERT INTO categories (name) VALUES (?)', [cat]);
    }
  }

  // Seed profiles if empty
  const profRows = queryAll('SELECT COUNT(*) as count FROM profiles');
  if (profRows[0]?.count === 0) {
    for (const p of DEFAULT_PROFILES) {
      db.run(
        `INSERT INTO profiles (id, code, name, type, category, width, height, description, applications, features, maxStripWidth, diffuser, colors, lengths, isCobRecommended, image, cadDrawing)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id,
          p.code,
          p.name,
          p.type,
          p.category,
          p.width,
          p.height,
          p.description,
          JSON.stringify(p.applications || []),
          JSON.stringify(p.features || []),
          p.maxStripWidth || '',
          p.diffuser || '',
          JSON.stringify(p.colors || []),
          JSON.stringify(p.lengths || []),
          p.isCobRecommended ? 1 : 0,
          p.image || '',
          p.cadDrawing || '',
        ]
      );
    }
  }

  // Seed representatives if empty
  const repRows = queryAll('SELECT COUNT(*) as count FROM representatives');
  if (repRows[0]?.count === 0) {
    for (const r of INITIAL_REPRESENTATIVES) {
      db.run(
        `INSERT INTO representatives (id, name, companyName, region, states, cepRanges, city, phone, whatsapp, email, address, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [r.id, r.name, r.companyName, r.region, r.states, r.cepRanges, r.city, r.phone, r.whatsapp, r.email, r.address, r.active]
      );
    }
  }

  // Seed site_texts if empty or insert missing default keys
  for (const [key, value] of Object.entries(DEFAULT_TEXTS)) {
    const existing = queryAll('SELECT value FROM site_texts WHERE key=?', [key]);
    if (existing.length === 0) {
      db.run('INSERT INTO site_texts (key, value) VALUES (?, ?)', [key, value]);
    }
  }

  // Seed leads if empty
  const leadRows = queryAll('SELECT COUNT(*) as count FROM leads');
  if (leadRows[0]?.count === 0) {
    for (const l of INITIAL_LEADS) {
      db.run(
        `INSERT INTO leads (id, name, email, phone, subject, message, status, date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [l.id, l.name, l.email, l.phone, l.subject, l.message, l.status, l.date]
      );
    }
  }

  // Seed budgets if empty
  const budgetRows = queryAll('SELECT COUNT(*) as count FROM budgets');
  if (budgetRows[0]?.count === 0) {
    for (const b of INITIAL_BUDGETS) {
      db.run(
        `INSERT INTO budgets (id, name, email, phone, company, city, state, status, date, items)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [b.id, b.name, b.email, b.phone, b.company, b.city, b.state, b.status, b.date, b.items]
      );
    }
  }

  saveDb();
}

async function startServer() {
  await initDb();
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve file uploads directory
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Health check endpoint for Easypanel / Docker / Uptime monitors
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
  });

  // ==========================================
  // SEO, LLMS & AI AGENT DISCOVERY ENDPOINTS
  // ==========================================
  
  const resolveStaticFile = (filename: string): string => {
    const distPath = path.join(process.cwd(), 'dist', filename);
    if (fs.existsSync(distPath)) return distPath;
    return path.join(process.cwd(), 'public', filename);
  };

  // robots.txt
  app.get('/robots.txt', (req, res) => {
    const robotsPath = resolveStaticFile('robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.type('text/plain; charset=utf-8').sendFile(robotsPath);
    } else {
      res.type('text/plain; charset=utf-8').send(
        `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: https://${req.get('host') || 'pasilux.com.br'}/sitemap.xml\n`
      );
    }
  });

  // Dynamic sitemap.xml with all pages, product codes, and individual blog articles
  app.get('/sitemap.xml', (req, res) => {
    try {
      const host = req.get('host') || 'pasilux.com.br';
      const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
      const baseUrl = `${protocol}://${host}`;
      const today = new Date().toISOString().split('T')[0];

      let profileList: any[] = [];
      try {
        profileList = queryAll('SELECT code FROM profiles');
      } catch (e) {
        profileList = DEFAULT_PROFILES;
      }
      if (!profileList || profileList.length === 0) {
        profileList = DEFAULT_PROFILES;
      }

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

      // Static core routes
      xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
      xml += `  <url>\n    <loc>${baseUrl}/produtos</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      xml += `  <url>\n    <loc>${baseUrl}/blog</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

      // Individual blog articles
      for (const article of DEFAULT_ARTICLES) {
        const slug = article.slug || article.id;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/blog/${slug}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.85</priority>\n`;
        if (article.image) {
          xml += `    <image:image>\n      <image:loc>${article.image}</image:loc>\n      <image:title>${article.title.replace(/&/g, '&amp;')}</image:title>\n    </image:image>\n`;
        }
        xml += `  </url>\n`;
      }

      // Individual product detail pages
      for (const p of profileList) {
        const code = (p.code || '').toLowerCase();
        if (code) {
          xml += `  <url>\n    <loc>${baseUrl}/produtos/${code}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        }
      }

      xml += `</urlset>`;
      res.type('application/xml; charset=utf-8').send(xml);
    } catch (err: any) {
      const staticPath = resolveStaticFile('sitemap.xml');
      if (fs.existsSync(staticPath)) {
        res.type('application/xml; charset=utf-8').sendFile(staticPath);
      } else {
        res.status(500).send('Error generating sitemap');
      }
    }
  });

  // llms.txt & llms-full.txt (LLM & AI Assistant documentation)
  app.get('/llms.txt', (req, res) => {
    const filePath = resolveStaticFile('llms.txt');
    res.type('text/plain; charset=utf-8').sendFile(filePath);
  });

  app.get('/llms-full.txt', (req, res) => {
    const filePath = resolveStaticFile('llms-full.txt');
    res.type('text/plain; charset=utf-8').sendFile(filePath);
  });

  // agent.txt & ai.txt (AI Autonomous Crawler discovery)
  app.get('/agent.txt', (req, res) => {
    const filePath = resolveStaticFile('agent.txt');
    res.type('text/plain; charset=utf-8').sendFile(filePath);
  });

  app.get('/ai.txt', (req, res) => {
    const filePath = resolveStaticFile('agent.txt');
    res.type('text/plain; charset=utf-8').sendFile(filePath);
  });

  // File Upload Endpoint
  app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
    });
  });

  // GET ALL DATA
  app.get('/api/data', (req, res) => {
    try {
      const rawProfiles = queryAll('SELECT * FROM profiles');
      const profiles = rawProfiles.map(p => ({
        ...p,
        applications: p.applications ? JSON.parse(p.applications) : [],
        features: p.features ? JSON.parse(p.features) : [],
        colors: p.colors ? JSON.parse(p.colors) : [],
        lengths: p.lengths ? JSON.parse(p.lengths) : [],
        isCobRecommended: Boolean(p.isCobRecommended),
      }));

      const rawCategories = queryAll('SELECT name FROM categories');
      const categories = rawCategories.map(c => c.name);

      const rawReps = queryAll('SELECT * FROM representatives');
      const representatives = rawReps.map(r => ({
        ...r,
        states: r.states ? JSON.parse(r.states) : [],
        cepRanges: r.cepRanges ? JSON.parse(r.cepRanges) : [],
        active: Boolean(r.active),
      }));

      const rawTexts = queryAll('SELECT * FROM site_texts');
      const siteTexts: Record<string, string> = { ...DEFAULT_TEXTS };
      rawTexts.forEach(t => {
        siteTexts[t.key] = t.value;
      });

      const leads = queryAll('SELECT * FROM leads ORDER BY rowid DESC');

      const rawBudgets = queryAll('SELECT * FROM budgets ORDER BY rowid DESC');
      const budgets = rawBudgets.map(b => ({
        ...b,
        items: b.items ? JSON.parse(b.items) : [],
      }));

      res.json({
        profiles,
        categories,
        representatives,
        siteTexts,
        leads,
        budgets,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // PROFILES API
  app.post('/api/profiles', (req, res) => {
    try {
      const p = req.body;
      const id = p.id || `psl-${Date.now()}`;
      runSql(
        `INSERT INTO profiles (id, code, name, type, category, width, height, description, applications, features, maxStripWidth, diffuser, colors, lengths, isCobRecommended, image, cadDrawing)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          p.code,
          p.name,
          p.type,
          p.category,
          p.width,
          p.height,
          p.description,
          JSON.stringify(p.applications || []),
          JSON.stringify(p.features || []),
          p.maxStripWidth || '',
          p.diffuser || '',
          JSON.stringify(p.colors || []),
          JSON.stringify(p.lengths || []),
          p.isCobRecommended ? 1 : 0,
          p.image || '',
          p.cadDrawing || '',
        ]
      );
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/profiles/:id', (req, res) => {
    try {
      const p = req.body;
      runSql(
        `UPDATE profiles SET code=?, name=?, type=?, category=?, width=?, height=?, description=?, applications=?, features=?, maxStripWidth=?, diffuser=?, colors=?, lengths=?, isCobRecommended=?, image=?, cadDrawing=?
         WHERE id=?`,
        [
          p.code,
          p.name,
          p.type,
          p.category,
          p.width,
          p.height,
          p.description,
          JSON.stringify(p.applications || []),
          JSON.stringify(p.features || []),
          p.maxStripWidth || '',
          p.diffuser || '',
          JSON.stringify(p.colors || []),
          JSON.stringify(p.lengths || []),
          p.isCobRecommended ? 1 : 0,
          p.image || '',
          p.cadDrawing || '',
          req.params.id,
        ]
      );
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/profiles/:id', (req, res) => {
    try {
      runSql('DELETE FROM profiles WHERE id=?', [req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // CATEGORIES API
  app.post('/api/categories', (req, res) => {
    try {
      const { name } = req.body;
      if (name) {
        runSql('INSERT OR IGNORE INTO categories (name) VALUES (?)', [name.trim()]);
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/categories', (req, res) => {
    try {
      const { oldName, newName } = req.body;
      if (oldName && newName) {
        runSql('UPDATE categories SET name=? WHERE name=?', [newName.trim(), oldName]);
        runSql('UPDATE profiles SET category=? WHERE category=?', [newName.trim(), oldName]);
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/categories/:name', (req, res) => {
    try {
      runSql('DELETE FROM categories WHERE name=?', [req.params.name]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // REPRESENTATIVES API
  app.post('/api/representatives', (req, res) => {
    try {
      const r = req.body;
      const id = r.id || `rep-${Date.now()}`;
      runSql(
        `INSERT INTO representatives (id, name, companyName, region, states, cepRanges, city, phone, whatsapp, email, address, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          r.name,
          r.companyName || '',
          r.region,
          JSON.stringify(r.states || []),
          JSON.stringify(r.cepRanges || []),
          r.city,
          r.phone,
          r.whatsapp || '',
          r.email || '',
          r.address || '',
          r.active !== false ? 1 : 0,
        ]
      );
      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/representatives/:id', (req, res) => {
    try {
      const r = req.body;
      runSql(
        `UPDATE representatives SET name=?, companyName=?, region=?, states=?, cepRanges=?, city=?, phone=?, whatsapp=?, email=?, address=?, active=?
         WHERE id=?`,
        [
          r.name,
          r.companyName || '',
          r.region,
          JSON.stringify(r.states || []),
          JSON.stringify(r.cepRanges || []),
          r.city,
          r.phone,
          r.whatsapp || '',
          r.email || '',
          r.address || '',
          r.active !== false ? 1 : 0,
          req.params.id,
        ]
      );
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/representatives/:id', (req, res) => {
    try {
      runSql('DELETE FROM representatives WHERE id=?', [req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // LEADS API
  app.post('/api/leads', async (req, res) => {
    try {
      const l = req.body;
      const id = `lead-${Date.now()}`;
      const date = new Date().toLocaleDateString('pt-BR');
      const status = 'Pendente';
      runSql(
        `INSERT INTO leads (id, name, email, phone, subject, message, file, attachmentName, attachmentUrl, attachmentSize, status, date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          l.name,
          l.email,
          l.phone,
          l.subject,
          l.message,
          l.file || '',
          l.attachmentName || '',
          l.attachmentUrl || '',
          l.attachmentSize || '',
          status,
          date
        ]
      );

      // Trigger asynchronous email dispatch
      const rawEmailRow = queryAll('SELECT value FROM site_texts WHERE key="contactEmail"');
      const defaultEmail = rawEmailRow[0]?.value || 'contato@pasilux.com.br';

      sendLeadEmail({
        name: l.name,
        email: l.email,
        phone: l.phone,
        subject: l.subject,
        message: l.message,
        attachmentName: l.attachmentName,
        attachmentUrl: l.attachmentUrl,
        attachmentSize: l.attachmentSize,
      }, defaultEmail).catch(err => {
        console.error('[Leads API] Erro no envio de e-mail:', err);
      });

      res.json({ success: true, id, status, date });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/leads/:id', (req, res) => {
    try {
      const { status } = req.body;
      runSql('UPDATE leads SET status=? WHERE id=?', [status, req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/leads/:id', (req, res) => {
    try {
      runSql('DELETE FROM leads WHERE id=?', [req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // BUDGETS API
  app.post('/api/budgets', async (req, res) => {
    try {
      const b = req.body;
      const id = `orc-${Date.now()}`;
      const date = new Date().toLocaleDateString('pt-BR');
      const status = 'Pendente';
      runSql(
        `INSERT INTO budgets (id, name, email, phone, company, city, state, notes, items, attachmentName, attachmentUrl, attachmentSize, status, date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          b.name,
          b.email,
          b.phone,
          b.company || '',
          b.city,
          b.state,
          b.notes || '',
          JSON.stringify(b.items || []),
          b.attachmentName || '',
          b.attachmentUrl || '',
          b.attachmentSize || '',
          status,
          date,
        ]
      );

      // Trigger asynchronous email dispatch
      const rawEmailRow = queryAll('SELECT value FROM site_texts WHERE key="contactEmail"');
      const defaultEmail = rawEmailRow[0]?.value || 'contato@pasilux.com.br';

      sendBudgetEmail({
        name: b.name,
        email: b.email,
        phone: b.phone,
        company: b.company,
        city: b.city,
        state: b.state,
        notes: b.notes,
        items: b.items || [],
        attachmentName: b.attachmentName,
        attachmentUrl: b.attachmentUrl,
        attachmentSize: b.attachmentSize,
      }, defaultEmail).catch(err => {
        console.error('[Budgets API] Erro no envio de e-mail:', err);
      });

      res.json({ success: true, id, status, date });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/budgets/:id', (req, res) => {
    try {
      const { status } = req.body;
      runSql('UPDATE budgets SET status=? WHERE id=?', [status, req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/budgets/:id', (req, res) => {
    try {
      runSql('DELETE FROM budgets WHERE id=?', [req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // EMAIL DIAGNOSTICS & TESTING API
  app.get('/api/email/status', (req, res) => {
    try {
      const rawEmailRow = queryAll('SELECT value FROM site_texts WHERE key="contactEmail"');
      const defaultEmail = rawEmailRow[0]?.value || 'contato@pasilux.com.br';
      const status = getEmailConfigStatus(defaultEmail);
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/email/test', async (req, res) => {
    try {
      const { targetEmail } = req.body;
      const result = await sendTestEmail(targetEmail);
      if (result.success) {
        res.json({ success: true, message: result.message });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // SITE TEXTS API
  app.put('/api/texts', (req, res) => {
    try {
      const texts = req.body;
      for (const [key, value] of Object.entries(texts)) {
        db.run('INSERT OR REPLACE INTO site_texts (key, value) VALUES (?, ?)', [key, String(value)]);
      }
      saveDb();
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // RESET DATABASE API
  app.post('/api/reset', (req, res) => {
    try {
      db.run('DELETE FROM profiles');
      db.run('DELETE FROM categories');
      db.run('DELETE FROM representatives');
      db.run('DELETE FROM site_texts');
      db.run('DELETE FROM leads');
      db.run('DELETE FROM budgets');

      for (const cat of DEFAULT_CATEGORIES) {
        db.run('INSERT INTO categories (name) VALUES (?)', [cat]);
      }
      for (const p of DEFAULT_PROFILES) {
        db.run(
          `INSERT INTO profiles (id, code, name, type, category, width, height, description, applications, features, maxStripWidth, diffuser, colors, lengths, isCobRecommended, image, cadDrawing)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.id, p.code, p.name, p.type, p.category, p.width, p.height, p.description,
            JSON.stringify(p.applications || []), JSON.stringify(p.features || []),
            p.maxStripWidth || '', p.diffuser || '', JSON.stringify(p.colors || []),
            JSON.stringify(p.lengths || []), p.isCobRecommended ? 1 : 0, p.image || '', p.cadDrawing || ''
          ]
        );
      }
      for (const r of INITIAL_REPRESENTATIVES) {
        db.run(
          `INSERT INTO representatives (id, name, companyName, region, states, cepRanges, city, phone, whatsapp, email, address, active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [r.id, r.name, r.companyName, r.region, r.states, r.cepRanges, r.city, r.phone, r.whatsapp, r.email, r.address, r.active]
        );
      }
      for (const [key, value] of Object.entries(DEFAULT_TEXTS)) {
        db.run('INSERT INTO site_texts (key, value) VALUES (?, ?)', [key, value]);
      }
      for (const l of INITIAL_LEADS) {
        db.run(
          `INSERT INTO leads (id, name, email, phone, subject, message, status, date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [l.id, l.name, l.email, l.phone, l.subject, l.message, l.status, l.date]
        );
      }
      for (const b of INITIAL_BUDGETS) {
        db.run(
          `INSERT INTO budgets (id, name, email, phone, company, city, state, status, date, items)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [b.id, b.name, b.email, b.phone, b.company, b.city, b.state, b.status, b.date, b.items]
        );
      }
      saveDb();
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development / Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
