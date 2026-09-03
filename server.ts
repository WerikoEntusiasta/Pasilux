import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import initSqlJs, { Database } from 'sql.js';
import dotenv from 'dotenv';
import { PROFILES as DEFAULT_PROFILES } from './src/data';
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
  contactSubtitle: 'Nossa matriz de atendimento ao cliente, showroom e parque tecnológico de moldagem estão estrategicamente situados em Catanduva, atendendo com agilidade todo o estado de São Paulo e o Brasil.',
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
