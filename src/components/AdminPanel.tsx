import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { LEDProfile, Lead, Budget, Representative } from '../types';
import { 
  X, Settings, Edit3, Plus, Trash2, Database, Users, FileText, RefreshCw, Save, Download, Check, Eye, Sliders, Layout, Package, Info, Tag, MapPin, Phone, Mail, Building, PlusCircle, AlertTriangle, Paperclip, BarChart3, TrendingUp, Copy, ExternalLink, FileSpreadsheet, CheckCircle, Clock, Sparkles, Filter, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminPanel() {
  const { 
    profiles, categories, representatives, siteTexts, leads, budgets, isAdminOpen, setIsAdminOpen, 
    addProfile, updateProfile, deleteProfile,
    addCategory, updateCategory, deleteCategory,
    addRepresentative, updateRepresentative, deleteRepresentative,
    updateSiteTexts, updateLeadStatus, updateBudgetStatus, resetToDefaults, uploadFile 
  } = useData();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'texts' | 'products' | 'categories' | 'representatives' | 'leads' | 'budgets'>('overview');
  const [notification, setNotification] = useState('');

  // Lead & Budget Filters
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'Pendente' | 'Respondido' | 'Arquivado' | 'has_attachment'>('all');
  const [budgetStatusFilter, setBudgetStatusFilter] = useState<'all' | 'Pendente' | 'Em Análise' | 'Aprovado' | 'Recusado' | 'has_attachment'>('all');

  // Product editing & filtering states
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [isAddingProfile, setIsAddingProfile] = useState(false);

  // Extremely detailed profile form state
  const [profileForm, setProfileForm] = useState<Omit<LEDProfile, 'placeholderText'>>({
    id: '',
    name: '',
    code: '',
    type: 'embutir',
    category: 'Embutir',
    width: 24,
    height: 14,
    cutoutSize: '',
    description: '',
    applications: [''],
    features: [''],
    maxStripWidth: '12mm',
    diffuser: 'Policarbonato Difusor',
    accessories: '',
    colors: ['Alumínio Natural', 'Branco Anodizado', 'Preto Microtexturizado'],
    lengths: ['2.0m', '3.0m'],
    isCobRecommended: false,
    image: '',
    lumenRecommendation: '',
  });

  const [newColorInput, setNewColorInput] = useState('');
  const [newLengthInput, setNewLengthInput] = useState('');

  // Category management state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryName, setEditingCategoryName] = useState<{ oldName: string; newName: string } | null>(null);

  // Representative management state
  const [repSearch, setRepSearch] = useState('');
  const [editingRepId, setEditingRepId] = useState<string | null>(null);
  const [isAddingRep, setIsAddingRep] = useState(false);
  const [repForm, setRepForm] = useState<Representative>({
    id: '',
    name: '',
    companyName: '',
    region: '',
    states: ['SP'],
    cepRanges: ['01000-000 à 19999-999'],
    city: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    active: true,
  });

  const [textsForm, setTextsForm] = useState(siteTexts);
  const [leadSearch, setLeadSearch] = useState('');
  const [budgetSearch, setBudgetSearch] = useState('');

  // Email / SMTP status & testing state
  const [emailStatus, setEmailStatus] = useState<{
    configured: boolean;
    host: string;
    port: string;
    user: string;
    recipient: string;
    from: string;
  } | null>(null);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [testEmailRecipient, setTestEmailRecipient] = useState('');

  React.useEffect(() => {
    setTextsForm(siteTexts);
  }, [siteTexts]);

  React.useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/email/status')
        .then(res => res.json())
        .then(data => {
          setEmailStatus(data);
          if (data.recipient) setTestEmailRecipient(data.recipient);
        })
        .catch(err => console.warn('Could not fetch email status:', err));
    }
  }, [isAuthenticated, activeTab]);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestEmailLoading(true);
    setTestEmailResult(null);
    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetEmail: testEmailRecipient || undefined }),
      });
      const data = await res.json();
      setTestEmailResult(data);
      if (data.success) {
        showNotification('E-mail de teste enviado com sucesso!');
      }
    } catch (err: any) {
      setTestEmailResult({ success: false, error: err.message || 'Erro ao conectar ao servidor.' });
    } finally {
      setTestEmailLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin' || password === 'pasilux') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Senha incorreta! Use "admin" para acessar.');
    }
  };

  const handleSaveTexts = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteTexts(textsForm);
    showNotification('Textos atualizados com sucesso!');
  };

  // Profile handlers
  const handleStartEditProfile = (p: LEDProfile) => {
    setEditingProfileId(p.id);
    setIsAddingProfile(false);
    setProfileForm({
      id: p.id,
      name: p.name,
      code: p.code,
      type: p.type || 'embutir',
      category: p.category || 'Embutir',
      width: p.width || 0,
      height: p.height || 0,
      cutoutSize: p.cutoutSize || '',
      description: p.description || '',
      applications: p.applications.length > 0 ? [...p.applications] : [''],
      features: p.features.length > 0 ? [...p.features] : [''],
      maxStripWidth: p.maxStripWidth || '12mm',
      diffuser: p.diffuser || 'Policarbonato',
      accessories: p.accessories || '',
      colors: p.colors ? [...p.colors] : ['Alumínio Natural'],
      lengths: p.lengths ? [...p.lengths] : ['2.0m', '3.0m'],
      isCobRecommended: !!p.isCobRecommended,
      image: p.image || '',
      lumenRecommendation: p.lumenRecommendation || '',
    });
  };

  const handleStartAddProfile = () => {
    setIsAddingProfile(true);
    setEditingProfileId(null);
    setProfileForm({
      id: `perfil-${Date.now()}`,
      name: '',
      code: 'PS-',
      type: 'embutir',
      category: categories[0] || 'Embutir',
      width: 20,
      height: 12,
      cutoutSize: '15mm x 12mm',
      description: '',
      applications: ['Marcenaria de alto padrão', 'Iluminação residencial'],
      features: ['Corpo em alumínio extrudado de alta pureza', 'Encaixe sob pressão com difusor leitoso'],
      maxStripWidth: '12mm',
      diffuser: 'Policarbonato Difusor Leitoso',
      accessories: 'Acompanha presilhas de fixação e ponteiras plásticas',
      colors: ['Alumínio Natural', 'Branco Anodizado', 'Preto Microtexturizado'],
      lengths: ['2.0m', '3.0m'],
      isCobRecommended: true,
      image: '',
      lumenRecommendation: 'Recomendado fita LED COB 12W/m a 24W/m para luz contínua sem pontilhados',
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim() || !profileForm.code.trim()) {
      alert('Preencha pelo menos o Nome Comercial e o Código SKU.');
      return;
    }

    const completeProfile: LEDProfile = {
      ...profileForm,
      placeholderText: 'Perfil de alumínio Pasilux com acabamento de alta tolerância dimensional.',
      applications: profileForm.applications.filter(a => a.trim() !== ''),
      features: profileForm.features.filter(f => f.trim() !== ''),
    };

    if (isAddingProfile) {
      addProfile(completeProfile);
      showNotification(`Produto ${completeProfile.code} criado com sucesso!`);
    } else {
      updateProfile(completeProfile);
      showNotification(`Produto ${completeProfile.code} atualizado!`);
    }
    setIsAddingProfile(false);
    setEditingProfileId(null);
  };

  const handleDeleteProfile = (id: string, code: string) => {
    if (confirm(`Tem certeza que deseja excluir permanentemente o produto ${code}?`)) {
      deleteProfile(id);
      showNotification('Produto excluído com sucesso!');
    }
  };

  const handleCloneProfile = (p: LEDProfile) => {
    setIsAddingProfile(true);
    setEditingProfileId(null);
    setProfileForm({
      ...p,
      id: `perfil-${Date.now()}`,
      code: `${p.code}-COP`,
      name: `${p.name} (Cópia)`,
    });
    showNotification(`Perfil ${p.code} clonado no formulário!`);
  };

  const openWhatsAppLead = (l: Lead) => {
    const cleanPhone = l.phone ? l.phone.replace(/\D/g, '') : '';
    if (!cleanPhone) {
      alert('Este lead não possui um número de telefone informado.');
      return;
    }
    const text = encodeURIComponent(`Olá ${l.name}! Recebemos seu contato no site da Pasilux referente ao assunto "${l.subject}". Como podemos lhe ajudar?`);
    window.open(`https://wa.me/55${cleanPhone}?text=${text}`, '_blank');
  };

  const openWhatsAppBudget = (b: Budget) => {
    const cleanPhone = b.phone ? b.phone.replace(/\D/g, '') : '';
    if (!cleanPhone) {
      alert('Este orçamento não possui um número de telefone informado.');
      return;
    }
    const text = encodeURIComponent(`Olá ${b.name}! Recebemos sua solicitação de orçamento técnico para ${b.items.reduce((acc, i) => acc + i.quantity, 0)} barra(s) de perfis de LED Pasilux. Gostaria de confirmar os detalhes e frete para ${b.city}/${b.state}?`);
    window.open(`https://wa.me/55${cleanPhone}?text=${text}`, '_blank');
  };

  // Helper dynamic array form handlers
  const handleAddColor = () => {
    if (newColorInput.trim() && !profileForm.colors.includes(newColorInput.trim())) {
      setProfileForm(prev => ({ ...prev, colors: [...prev.colors, newColorInput.trim()] }));
      setNewColorInput('');
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setProfileForm(prev => ({ ...prev, colors: prev.colors.filter(c => c !== colorToRemove) }));
  };

  const handleAddLength = () => {
    if (newLengthInput.trim() && !profileForm.lengths.includes(newLengthInput.trim())) {
      setProfileForm(prev => ({ ...prev, lengths: [...prev.lengths, newLengthInput.trim()] }));
      setNewLengthInput('');
    }
  };

  const handleRemoveLength = (lengthToRemove: string) => {
    setProfileForm(prev => ({ ...prev, lengths: prev.lengths.filter(l => l !== lengthToRemove) }));
  };

  // Category handlers
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      showNotification(`Filtro/Categoria "${newCategoryName.trim()}" criada!`);
      setNewCategoryName('');
    }
  };

  const handleUpdateCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategoryName && editingCategoryName.newName.trim()) {
      updateCategory(editingCategoryName.oldName, editingCategoryName.newName.trim());
      showNotification(`Categoria atualizada de "${editingCategoryName.oldName}" para "${editingCategoryName.newName.trim()}"!`);
      setEditingCategoryName(null);
    }
  };

  const handleDeleteCategoryClick = (catName: string) => {
    const count = profiles.filter(p => p.category === catName).length;
    if (count > 0) {
      if (!confirm(`A categoria "${catName}" possui ${count} produto(s) vinculados. Deseja realmente excluí-la?`)) {
        return;
      }
    } else {
      if (!confirm(`Excluir a categoria "${catName}"?`)) return;
    }
    deleteCategory(catName);
    showNotification('Categoria removida!');
  };

  // Representative handlers
  const handleStartAddRep = () => {
    setIsAddingRep(true);
    setEditingRepId(null);
    setRepForm({
      id: `rep-${Date.now()}`,
      name: '',
      companyName: '',
      region: 'São Paulo e Região',
      states: ['SP'],
      cepRanges: ['01000-000 à 19999-999'],
      city: '',
      phone: '(17) 99000-0000',
      whatsapp: '5517990000000',
      email: '',
      address: '',
      active: true,
    });
  };

  const handleStartEditRep = (r: Representative) => {
    setEditingRepId(r.id);
    setIsAddingRep(false);
    setRepForm({ ...r });
  };

  const handleSaveRep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repForm.name.trim() || !repForm.phone.trim()) {
      alert('Por favor informe pelo menos o Nome e o Telefone do representante.');
      return;
    }

    if (isAddingRep) {
      addRepresentative(repForm);
      showNotification(`Representante ${repForm.name} adicionado!`);
    } else {
      updateRepresentative(repForm);
      showNotification(`Representante ${repForm.name} atualizado!`);
    }
    setIsAddingRep(false);
    setEditingRepId(null);
  };

  const handleDeleteRep = (id: string, name: string) => {
    if (confirm(`Remover o representante ${name}?`)) {
      deleteRepresentative(id);
      showNotification('Representante removido!');
    }
  };

  // CSV Exports
  const exportLeadsToCSV = () => {
    const headers = ['ID', 'Data', 'Nome', 'Email', 'Telefone', 'Assunto', 'Mensagem', 'Status'];
    const rows = leads.map(l => [l.id, l.date, l.name, l.email, l.phone, l.subject, l.message.replace(/\n/g, ' '), l.status]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "pasilux_leads.csv");
    link.click();
    showNotification('Leads exportados!');
  };

  const exportBudgetsToCSV = () => {
    const headers = ['ID', 'Data', 'Nome', 'Email', 'Cidade', 'Estado', 'Status'];
    const rows = budgets.map(b => [b.id, b.date, b.name, b.email, b.city, b.state, b.status]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "pasilux_orcamentos.csv");
    link.click();
    showNotification('Orçamentos exportados!');
  };

  const handleResetData = () => {
    if (confirm('Atenção: Esta ação irá redefinir produtos, categorias, representantes, leads e textos para os dados originais de fábrica. Confirmar?')) {
      resetToDefaults();
      setTextsForm(siteTexts);
      showNotification('Todos os dados foram restaurados aos padrões!');
    }
  };

  // Filtered lists
  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.code.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.description.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredReps = representatives.filter(r => 
    r.name.toLowerCase().includes(repSearch.toLowerCase()) ||
    r.region.toLowerCase().includes(repSearch.toLowerCase()) ||
    r.city.toLowerCase().includes(repSearch.toLowerCase()) ||
    r.states.some(s => s.toLowerCase().includes(repSearch.toLowerCase()))
  );

  const handleExitAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash.includes('admin') || window.location.pathname.includes('admin')) {
      try {
        window.history.pushState('', '', '/');
      } catch (e) {
        window.location.hash = '';
      }
    }
  };

  if (!isAdminOpen) return null;

  return (
    <div className="min-h-screen w-full bg-[#0a0b0e] text-neutral-100 flex flex-col relative overflow-x-hidden font-sans">
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 text-white px-5 py-2.5 rounded-full border border-gold/50 text-xs font-semibold shadow-2xl flex items-center gap-2">
          <Check className="h-4 w-4 text-gold" />
          {notification}
        </div>
      )}

      {!isAuthenticated ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-6">
          <div className="p-4 bg-gold/10 rounded-2xl border border-gold/30 shadow-lg">
            <Settings className="h-10 w-10 text-gold animate-spin" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase bg-gold/10 text-gold px-3 py-1 rounded-full border border-gold/20 font-bold">
              Painel Standalone • Container Unificado
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight mt-3">Painel Administrativo Pasilux</h2>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Área de Gestão Separada do Site Público. Gerencie o catálogo, categorias, representantes, orçamentos e mensagens do site em tempo real.
            </p>
          </div>
          <form onSubmit={handleLogin} className="w-full space-y-4 bg-[#12141a] p-6 rounded-2xl border border-[#262933] shadow-2xl text-left">
            <div>
              <label className="block text-xs font-mono text-neutral-300 mb-1.5 uppercase font-bold">Senha de Acesso Restrito</label>
              <input 
                type="password"
                placeholder="Senha de acesso (ex: admin)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-800 rounded-xl bg-neutral-900 text-sm font-mono text-white focus:outline-none focus:border-gold shadow-inner"
              />
            </div>
            {authError && <p className="text-xs text-red-400 font-medium">{authError}</p>}
            <div className="flex gap-2 pt-2">
              <button 
                type="button" 
                onClick={handleExitAdmin} 
                className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold rounded-xl cursor-pointer transition-colors text-neutral-300 border border-neutral-700"
              >
                ← Voltar ao Site
              </button>
              <button 
                type="submit" 
                className="flex-1 py-3 bg-gold hover:bg-gold-light text-neutral-950 text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-md font-mono uppercase"
              >
                Entrar no Painel →
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-screen w-full">
          {/* Header */}
          <div className="p-4 sm:px-6 flex justify-between items-center border-b bg-[#14161d] border-[#262933] sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-xl border border-gold/30">
                <Database className="h-5 w-5 text-gold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-bold text-base sm:text-lg">Pasilux Central de Controle</h1>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold hidden sm:inline-block">
                    🟢 Container Conectado
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-400 hidden sm:block">Painel Integrado • Catálogo • Leads • Orçamentos • Representantes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleResetData} className="px-3 py-2 hover:bg-neutral-800 rounded-xl text-neutral-400 text-xs font-mono flex items-center gap-1.5 cursor-pointer border border-neutral-800 transition-colors" title="Restaurar dados originais de fábrica">
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset Padrão</span>
              </button>
              <button 
                onClick={handleExitAdmin} 
                className="px-4 py-2 bg-gold hover:bg-gold-light text-neutral-950 rounded-xl text-xs font-bold font-mono flex items-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <span>← Voltar ao Site Público</span>
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
              
              {/* Sidebar Tabs */}
              <div className="w-full md:w-56 border-b md:border-b-0 md:border-r p-3 space-y-1 shrink-0 bg-[#121318] border-[#262933]">
                <button onClick={() => { setActiveTab('overview'); setIsAddingProfile(false); setEditingProfileId(null); }} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-gold text-neutral-950 font-bold shadow-sm' : 'text-neutral-400 hover:bg-neutral-800'}`}>
                  <BarChart3 className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Visão Geral / Métricas</span>
                </button>

                <button onClick={() => { setActiveTab('products'); setIsAddingProfile(false); setEditingProfileId(null); }} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'products' ? 'bg-gold text-neutral-950 font-bold shadow-sm' : 'text-neutral-400 hover:bg-neutral-800'}`}>
                  <Package className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Produtos / Perfis</span>
                  <span className="text-[10px] font-mono bg-neutral-800 px-1.5 py-0.5 rounded-full text-neutral-300">{profiles.length}</span>
                </button>

                <button onClick={() => { setActiveTab('categories'); setIsAddingProfile(false); setEditingProfileId(null); }} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'categories' ? 'bg-gold text-neutral-950 font-bold shadow-sm' : 'text-neutral-400 hover:bg-neutral-800'}`}>
                  <Tag className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Filtros & Categorias</span>
                  <span className="text-[10px] font-mono bg-neutral-800 px-1.5 py-0.5 rounded-full text-neutral-300">{categories.length}</span>
                </button>

                <button onClick={() => { setActiveTab('representatives'); setIsAddingRep(false); setEditingRepId(null); }} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'representatives' ? 'bg-gold text-neutral-950 font-bold shadow-sm' : 'text-neutral-400 hover:bg-neutral-800'}`}>
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Representantes</span>
                  <span className="text-[10px] font-mono bg-neutral-800 px-1.5 py-0.5 rounded-full text-neutral-300">{representatives.length}</span>
                </button>

                <button onClick={() => { setActiveTab('leads'); }} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'leads' ? 'bg-gold text-neutral-950 font-bold shadow-sm' : 'text-neutral-400 hover:bg-neutral-800'}`}>
                  <Users className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Leads</span>
                  {leads.filter(l => l.status === 'Pendente').length > 0 && (
                    <span className="text-[9px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-1.5 py-0.5 rounded-full">
                      {leads.filter(l => l.status === 'Pendente').length} pend.
                    </span>
                  )}
                  <span className="text-[10px] font-mono bg-neutral-800 px-1.5 py-0.5 rounded-full text-neutral-300">{leads.length}</span>
                </button>

                <button onClick={() => { setActiveTab('budgets'); }} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'budgets' ? 'bg-gold text-neutral-950 font-bold shadow-sm' : 'text-neutral-400 hover:bg-neutral-800'}`}>
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Orçamentos</span>
                  {budgets.filter(b => b.status === 'Pendente').length > 0 && (
                    <span className="text-[9px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-1.5 py-0.5 rounded-full">
                      {budgets.filter(b => b.status === 'Pendente').length} pend.
                    </span>
                  )}
                  <span className="text-[10px] font-mono bg-neutral-800 px-1.5 py-0.5 rounded-full text-neutral-300">{budgets.length}</span>
                </button>

                <button onClick={() => { setActiveTab('texts'); }} className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'texts' ? 'bg-gold text-neutral-950 font-bold shadow-sm' : 'text-neutral-400 hover:bg-neutral-800'}`}>
                  <Layout className="h-4 w-4 shrink-0" />
                  <span className="flex-1">Textos do Site</span>
                </button>
              </div>

              {/* Main Tab View */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                
                {/* 0. OVERVIEW / DASHBOARD METRICS TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-neutral-800">
                      <div>
                        <h3 className="font-serif text-xl font-bold flex items-center gap-2 text-white">
                          <BarChart3 className="h-5 w-5 text-gold" />
                          Painel de Controle & Visão Geral
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">Resumo em tempo real de estatísticas, orçamentos, leads e atalhos rápidos de gestão.</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => setActiveTab('texts')}
                          className={`text-[10px] font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold border transition-all cursor-pointer ${
                            emailStatus?.configured
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                          }`}
                        >
                          <Mail className="h-3 w-3" />
                          {emailStatus?.configured ? 'E-mail SMTP Ativo' : 'E-mail SMTP: Configurar no .env'}
                        </button>
                        <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          Sistema Pasilux Online
                        </span>
                      </div>
                    </div>

                    {/* KPI Stat Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Leads Card */}
                      <div className="p-4 bg-gradient-to-br from-[#181920] to-[#121318] border border-[#262933] rounded-2xl shadow-lg relative overflow-hidden group hover:border-gold/40 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[11px] font-mono text-neutral-400 uppercase font-bold">Leads de Contato</p>
                            <h4 className="text-2xl font-bold text-white mt-1">{leads.length}</h4>
                          </div>
                          <div className="p-2.5 bg-gold/10 rounded-xl border border-gold/30">
                            <Users className="h-5 w-5 text-gold" />
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-neutral-800">
                          <span className="text-amber-400 font-medium font-mono">🟡 {leads.filter(l => l.status === 'Pendente').length} pendentes</span>
                          <button onClick={() => setActiveTab('leads')} className="text-gold hover:underline text-[10px] font-bold cursor-pointer">Ver todos →</button>
                        </div>
                      </div>

                      {/* Budgets Card */}
                      <div className="p-4 bg-gradient-to-br from-[#181920] to-[#121318] border border-[#262933] rounded-2xl shadow-lg relative overflow-hidden group hover:border-gold/40 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[11px] font-mono text-neutral-400 uppercase font-bold">Solicitações de Orçamento</p>
                            <h4 className="text-2xl font-bold text-white mt-1">{budgets.length}</h4>
                          </div>
                          <div className="p-2.5 bg-gold/10 rounded-xl border border-gold/30">
                            <FileText className="h-5 w-5 text-gold" />
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-neutral-800">
                          <span className="text-gold font-medium font-mono">
                            📦 {budgets.reduce((acc, b) => acc + b.items.reduce((sum, item) => sum + item.quantity, 0), 0)} barras solicitadas
                          </span>
                          <button onClick={() => setActiveTab('budgets')} className="text-gold hover:underline text-[10px] font-bold cursor-pointer">Ver todos →</button>
                        </div>
                      </div>

                      {/* Products Card */}
                      <div className="p-4 bg-gradient-to-br from-[#181920] to-[#121318] border border-[#262933] rounded-2xl shadow-lg relative overflow-hidden group hover:border-gold/40 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[11px] font-mono text-neutral-400 uppercase font-bold">Catálogo de Perfis</p>
                            <h4 className="text-2xl font-bold text-white mt-1">{profiles.length} SKUs</h4>
                          </div>
                          <div className="p-2.5 bg-gold/10 rounded-xl border border-gold/30">
                            <Package className="h-5 w-5 text-gold" />
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-neutral-800">
                          <span className="text-neutral-400 font-mono">🏷️ {categories.length} categorias de iluminação</span>
                          <button onClick={() => setActiveTab('products')} className="text-gold hover:underline text-[10px] font-bold cursor-pointer">Gerenciar →</button>
                        </div>
                      </div>

                      {/* Representatives Card */}
                      <div className="p-4 bg-gradient-to-br from-[#181920] to-[#121318] border border-[#262933] rounded-2xl shadow-lg relative overflow-hidden group hover:border-gold/40 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[11px] font-mono text-neutral-400 uppercase font-bold">Representantes Ativos</p>
                            <h4 className="text-2xl font-bold text-white mt-1">{representatives.filter(r => r.active).length}</h4>
                          </div>
                          <div className="p-2.5 bg-gold/10 rounded-xl border border-gold/30">
                            <MapPin className="h-5 w-5 text-gold" />
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-neutral-800">
                          <span className="text-neutral-400 font-mono">
                            🗺️ {Array.from(new Set(representatives.flatMap(r => r.states))).length} estados com cobertura
                          </span>
                          <button onClick={() => setActiveTab('representatives')} className="text-gold hover:underline text-[10px] font-bold cursor-pointer">Ver rede →</button>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Shortcuts Banner */}
                    <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-gold/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gold/20 rounded-xl text-gold shrink-0">
                          <Sparkles className="h-5 w-5 text-gold-dark" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">Ações Rápidas de Gestão Pasilux</h4>
                          <p className="text-xs text-neutral-400">Atalhos diretos para cadastrar produtos, exportar relatórios ou ajustar textos do catálogo.</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <button onClick={() => { setActiveTab('products'); handleStartAddProfile(); }} className="px-3.5 py-2 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all">
                          <Plus className="h-4 w-4" /> Cadastrar Produto
                        </button>
                        <button onClick={exportLeadsToCSV} className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-neutral-700 transition-all">
                          <Download className="h-3.5 w-3.5 text-gold" /> CSV Leads
                        </button>
                        <button onClick={exportBudgetsToCSV} className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border border-neutral-700 transition-all">
                          <Download className="h-3.5 w-3.5 text-gold" /> CSV Orçamentos
                        </button>
                      </div>
                    </div>

                    {/* Pending Submissions / Recent Activity */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif font-bold text-base text-white flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gold" />
                          Últimas Mensagens & Orçamentos Recebidos
                        </h4>
                        <span className="text-[11px] font-mono text-neutral-400">Total acumulado: {leads.length + budgets.length} registros</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Recent Leads Widget */}
                        <div className="p-4 bg-[#14151b] border border-[#262933] rounded-2xl space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                            <span className="font-mono text-xs font-bold text-neutral-300 uppercase flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5 text-gold" /> Leads Recentes ({leads.length})
                            </span>
                            <button onClick={() => setActiveTab('leads')} className="text-[10px] text-gold hover:underline font-mono">Ver todos</button>
                          </div>
                          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                            {leads.slice(0, 3).map(l => (
                              <div key={l.id} className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1.5 text-xs hover:border-gold/30 transition-all">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-neutral-100">{l.name}</span>
                                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                                    l.status === 'Pendente' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                    l.status === 'Respondido' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    'bg-neutral-800 text-neutral-400'
                                  }`}>{l.status}</span>
                                </div>
                                <p className="text-[11px] text-neutral-400 line-clamp-1">Assunto: {l.subject}</p>
                                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-neutral-500">
                                  <span>{l.date}</span>
                                  <button onClick={() => openWhatsAppLead(l)} className="text-emerald-400 hover:underline flex items-center gap-1 font-bold">
                                    <MessageSquare className="h-3 w-3" /> WhatsApp
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent Budgets Widget */}
                        <div className="p-4 bg-[#14151b] border border-[#262933] rounded-2xl space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                            <span className="font-mono text-xs font-bold text-neutral-300 uppercase flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5 text-gold" /> Orçamentos Recentes ({budgets.length})
                            </span>
                            <button onClick={() => setActiveTab('budgets')} className="text-[10px] text-gold hover:underline font-mono">Ver todos</button>
                          </div>
                          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                            {budgets.slice(0, 3).map(b => (
                              <div key={b.id} className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1.5 text-xs hover:border-gold/30 transition-all">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-neutral-100">{b.name} ({b.city}/{b.state})</span>
                                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                                    b.status === 'Pendente' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                    b.status === 'Aprovado' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  }`}>{b.status}</span>
                                </div>
                                <p className="text-[11px] text-gold font-semibold">
                                  {b.items.length} item(ns) • Total: {b.items.reduce((s, i) => s + i.quantity, 0)} barra(s)
                                </p>
                                {b.attachmentName && (
                                  <p className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                                    <Paperclip className="h-3 w-3" /> Possui anexo de projeto
                                  </p>
                                )}
                                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-neutral-500">
                                  <span>{b.date}</span>
                                  <button onClick={() => openWhatsAppBudget(b)} className="text-emerald-400 hover:underline flex items-center gap-1 font-bold">
                                    <MessageSquare className="h-3 w-3" /> WhatsApp
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1. PRODUCTS TAB */}
                {activeTab === 'products' && (
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                      <div>
                        <h3 className="font-serif text-lg font-bold">Gerenciamento de Produtos</h3>
                        <p className="text-xs text-neutral-500">Crie ou edite qualquer modelo de perfil de LED com especificações detalhadas.</p>
                      </div>
                      {!isAddingProfile && !editingProfileId && (
                        <button onClick={handleStartAddProfile} className="px-4 py-2 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer">
                          <Plus className="h-4 w-4" /> Novo Perfil
                        </button>
                      )}
                    </div>

                    {isAddingProfile || editingProfileId ? (
                      /* Extremely Detailed Product Creation/Edit Form */
                      <form onSubmit={handleSaveProfile} className="space-y-5 bg-white dark:bg-neutral-900/60 p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-xs shadow-xl">
                        
                        <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-800">
                          <h4 className="font-serif text-base font-bold text-gold flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            {isAddingProfile ? 'Cadastrar Novo Perfil Pasilux' : `Editar Perfil SKU: ${profileForm.code}`}
                          </h4>
                          <button type="button" onClick={() => { setIsAddingProfile(false); setEditingProfileId(null); }} className="text-neutral-400 hover:text-neutral-200 text-xs font-mono">
                            Cancelar [ESC]
                          </button>
                        </div>

                        {/* Section 1: Basic Info */}
                        <div className="space-y-3">
                          <h5 className="font-mono text-[11px] font-bold text-neutral-400 uppercase tracking-wider">1. Informações Comerciais</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                              <label className="block mb-1 font-semibold text-neutral-400">Código SKU / Referência *</label>
                              <input type="text" required value={profileForm.code} onChange={e => setProfileForm({...profileForm, code: e.target.value})} placeholder="ex: PS-2414E" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 font-mono font-bold text-gold focus:border-gold focus:outline-none" />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block mb-1 font-semibold text-neutral-400">Nome Comercial Completo *</label>
                              <input type="text" required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} placeholder="ex: Perfil LED Embutir Duplo 24mm" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 font-semibold focus:border-gold focus:outline-none" />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold text-neutral-400">Categoria / Filtro *</label>
                              <select value={profileForm.category} onChange={e => setProfileForm({...profileForm, category: e.target.value})} className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none cursor-pointer">
                                {categories.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block mb-1 font-semibold text-neutral-400">Tipo de Aplicação</label>
                              <select value={profileForm.type} onChange={e => setProfileForm({...profileForm, type: e.target.value as LEDProfile['type']})} className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none cursor-pointer">
                                <option value="embutir">Embutir (Gesso / Drywall / Marcenaria)</option>
                                <option value="sobrepor">Sobrepor (Superfície Exposta)</option>
                                <option value="pendente">Pendente / Suspenso</option>
                                <option value="no-frame">No Frame (Trimless / Sem Borda)</option>
                                <option value="movelaria">Movelaria & Armários</option>
                                <option value="especial">Perfis Especiais</option>
                              </select>
                            </div>

                            <div>
                              <label className="block mb-1 font-semibold text-neutral-400">URL ou Imagem do Produto</label>
                              <div className="flex gap-2">
                                <input type="text" value={profileForm.image || ''} onChange={e => setProfileForm({...profileForm, image: e.target.value})} placeholder="https://... ou /uploads/perfil.jpg" className="flex-1 p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 font-mono text-xs focus:border-gold focus:outline-none" />
                                <label className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-gold border border-gold/30 font-mono text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1 shrink-0 transition-colors">
                                  <span>📁 Upload</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={async (e) => {
                                      if (e.target.files?.[0]) {
                                        try {
                                          const res = await uploadFile(e.target.files[0]);
                                          setProfileForm(prev => ({ ...prev, image: res.url }));
                                        } catch (err) {
                                          alert('Erro ao enviar imagem do perfil.');
                                        }
                                      }
                                    }} 
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Dimensions & Technical Specs */}
                        <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                          <h5 className="font-mono text-[11px] font-bold text-neutral-400 uppercase tracking-wider">2. Dimensões & Especificações Técnicas</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block mb-1 font-semibold text-neutral-400">Largura (mm) *</label>
                              <input type="number" step="0.1" required value={profileForm.width} onChange={e => setProfileForm({...profileForm, width: parseFloat(e.target.value) || 0})} className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 font-mono text-center focus:border-gold focus:outline-none" />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold text-neutral-400">Altura (mm) *</label>
                              <input type="number" step="0.1" required value={profileForm.height} onChange={e => setProfileForm({...profileForm, height: parseFloat(e.target.value) || 0})} className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 font-mono text-center focus:border-gold focus:outline-none" />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold text-neutral-400">Rasgo / Recorte de Gesso</label>
                              <input type="text" value={profileForm.cutoutSize || ''} onChange={e => setProfileForm({...profileForm, cutoutSize: e.target.value})} placeholder="ex: 15 mm x 12 mm" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 font-mono focus:border-gold focus:outline-none" />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold text-neutral-400">Largura Máx. da Fita LED</label>
                              <input type="text" value={profileForm.maxStripWidth} onChange={e => setProfileForm({...profileForm, maxStripWidth: e.target.value})} placeholder="ex: 12mm" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 font-mono focus:border-gold focus:outline-none" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block mb-1 font-semibold text-neutral-400">Modelo de Difusor</label>
                              <input type="text" value={profileForm.diffuser} onChange={e => setProfileForm({...profileForm, diffuser: e.target.value})} placeholder="ex: Policarbonato Leitoso Recuado" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none" />
                            </div>
                            <div>
                              <label className="block mb-1 font-semibold text-neutral-400">Tampas & Acessórios Inclusos</label>
                              <input type="text" value={profileForm.accessories || ''} onChange={e => setProfileForm({...profileForm, accessories: e.target.value})} placeholder="ex: Acompanha 2 presilhas + ponteiras plásticas" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none" />
                            </div>
                          </div>

                          <div className="p-3 bg-gold/10 border border-gold/30 rounded-xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Info className="h-4 w-4 text-gold shrink-0" />
                              <div>
                                <p className="font-bold text-neutral-900 dark:text-white">Recomendado para Fita LED COB Sem Pontilhados</p>
                                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Ativa a selo técnico de recomendação COB de alta densidade no catálogo do produto.</p>
                              </div>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={profileForm.isCobRecommended} 
                              onChange={e => setProfileForm({...profileForm, isCobRecommended: e.target.checked})} 
                              className="h-5 w-5 accent-gold rounded cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="block mb-1 font-semibold text-neutral-400">Recomendação Técnica de Iluminação / Potência</label>
                            <input type="text" value={profileForm.lumenRecommendation || ''} onChange={e => setProfileForm({...profileForm, lumenRecommendation: e.target.value})} placeholder="ex: Recomendado fita COB de 12W/m a 24W/m para linha contínua e homogênea" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none" />
                          </div>
                        </div>

                        {/* Section 3: Colors & Lengths */}
                        <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                          <h5 className="font-mono text-[11px] font-bold text-neutral-400 uppercase tracking-wider">3. Opções de Acabamento & Barras</h5>
                          
                          {/* Colors dynamic tags */}
                          <div className="space-y-1.5">
                            <label className="block font-semibold text-neutral-400">Cores / Acabamentos Disponíveis</label>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {profileForm.colors.map(color => (
                                <span key={color} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-medium">
                                  {color}
                                  <button type="button" onClick={() => handleRemoveColor(color)} className="hover:text-red-500 cursor-pointer ml-1">×</button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2 max-w-sm">
                              <input type="text" value={newColorInput} onChange={e => setNewColorInput(e.target.value)} placeholder="Nova cor (ex: Bronze Anodizado)" className="flex-1 p-2 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:outline-none focus:border-gold" />
                              <button type="button" onClick={handleAddColor} className="px-3 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg cursor-pointer">Adicionar</button>
                            </div>
                          </div>

                          {/* Lengths dynamic tags */}
                          <div className="space-y-1.5">
                            <label className="block font-semibold text-neutral-400">Comprimentos de Barra Fornecidos</label>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {profileForm.lengths.map(length => (
                                <span key={length} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-mono font-bold text-gold">
                                  {length}
                                  <button type="button" onClick={() => handleRemoveLength(length)} className="hover:text-red-500 cursor-pointer ml-1 text-white">×</button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2 max-w-sm">
                              <input type="text" value={newLengthInput} onChange={e => setNewLengthInput(e.target.value)} placeholder="Novo tamanho (ex: 6.0m sob pedido)" className="flex-1 p-2 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:outline-none focus:border-gold" />
                              <button type="button" onClick={handleAddLength} className="px-3 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg cursor-pointer">Adicionar</button>
                            </div>
                          </div>
                        </div>

                        {/* Section 4: Descriptions, Features & Applications */}
                        <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                          <h5 className="font-mono text-[11px] font-bold text-neutral-400 uppercase tracking-wider">4. Descrição & Tópicos do Catálogo</h5>
                          <div>
                            <label className="block mb-1 font-semibold text-neutral-400">Descrição Comercial Detalhada</label>
                            <textarea rows={3} required value={profileForm.description} onChange={e => setProfileForm({...profileForm, description: e.target.value})} placeholder="Descrição explicativa do perfil..." className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none resize-none leading-relaxed" />
                          </div>

                          {/* Features list */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="font-semibold text-neutral-400">Destaques / Características Principais</label>
                              <button type="button" onClick={() => setProfileForm(prev => ({ ...prev, features: [...prev.features, ''] }))} className="text-[10px] font-mono text-gold hover:underline flex items-center gap-1 cursor-pointer">
                                + Adicionar Tópico
                              </button>
                            </div>
                            <div className="space-y-2">
                              {profileForm.features.map((feat, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                  <span className="font-mono text-neutral-500 text-[10px] w-4">{idx + 1}.</span>
                                  <input 
                                    type="text" 
                                    value={feat} 
                                    onChange={e => {
                                      const updated = [...profileForm.features];
                                      updated[idx] = e.target.value;
                                      setProfileForm({ ...profileForm, features: updated });
                                    }}
                                    placeholder="ex: Design Slim de alta rigidez estrutural"
                                    className="flex-1 p-2 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none"
                                  />
                                  <button type="button" onClick={() => setProfileForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))} className="p-2 text-neutral-400 hover:text-red-500 cursor-pointer">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Applications list */}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="font-semibold text-neutral-400">Aplicações Sugeridas</label>
                              <button type="button" onClick={() => setProfileForm(prev => ({ ...prev, applications: [...prev.applications, ''] }))} className="text-[10px] font-mono text-gold hover:underline flex items-center gap-1 cursor-pointer">
                                + Adicionar Aplicação
                              </button>
                            </div>
                            <div className="space-y-2">
                              {profileForm.applications.map((app, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                  <span className="font-mono text-neutral-500 text-[10px] w-4">{idx + 1}.</span>
                                  <input 
                                    type="text" 
                                    value={app} 
                                    onChange={e => {
                                      const updated = [...profileForm.applications];
                                      updated[idx] = e.target.value;
                                      setProfileForm({ ...profileForm, applications: updated });
                                    }}
                                    placeholder="ex: Iluminação indireta em sancas de gesso"
                                    className="flex-1 p-2 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none"
                                  />
                                  <button type="button" onClick={() => setProfileForm(prev => ({ ...prev, applications: prev.applications.filter((_, i) => i !== idx) }))} className="p-2 text-neutral-400 hover:text-red-500 cursor-pointer">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Submit actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                          <button type="button" onClick={() => { setIsAddingProfile(false); setEditingProfileId(null); }} className="px-5 py-2.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
                            Cancelar
                          </button>
                          <button type="submit" className="px-6 py-2.5 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-xl cursor-pointer shadow-lg transition-all flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            {isAddingProfile ? 'Salvar Novo Perfil' : 'Atualizar Perfil'}
                          </button>
                        </div>

                      </form>
                    ) : (
                      /* Products List & Search View */
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                          <input 
                            type="text" 
                            placeholder="Buscar por SKU, nome ou descrição..." 
                            value={productSearch} 
                            onChange={e => setProductSearch(e.target.value)} 
                            className="p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-xl text-xs w-full sm:max-w-xs bg-white dark:bg-neutral-900 focus:outline-none focus:border-gold"
                          />

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-xs font-mono text-neutral-400 whitespace-nowrap">Filtrar por Categoria:</span>
                            <select 
                              value={selectedCategoryFilter} 
                              onChange={e => setSelectedCategoryFilter(e.target.value)}
                              className="p-2 border border-neutral-300 dark:border-neutral-800 rounded-xl text-xs bg-white dark:bg-neutral-900 focus:outline-none cursor-pointer flex-1 sm:flex-initial"
                            >
                              <option value="all">Todas as Categorias ({profiles.length})</option>
                              {categories.map(cat => (
                                <option key={cat} value={cat}>
                                  {cat} ({profiles.filter(p => p.category === cat).length})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {filteredProfiles.length === 0 ? (
                          <div className="p-8 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl text-neutral-400">
                            Nenhum produto encontrado com os filtros aplicados.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {filteredProfiles.map(p => (
                              <div key={p.id} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900/40 hover:border-gold/50 transition-all flex justify-between items-start gap-3 shadow-sm">
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] bg-gold/10 text-gold font-mono font-bold px-2 py-0.5 rounded border border-gold/20">{p.code}</span>
                                    <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-mono px-2 py-0.5 rounded uppercase">{p.category}</span>
                                    {p.isCobRecommended && <span className="text-[9px] bg-amber-500/10 text-amber-500 font-mono font-bold px-1.5 py-0.5 rounded">COB OK</span>}
                                  </div>
                                  <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">{p.name}</h4>
                                  <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">{p.description}</p>
                                  <p className="text-[10px] text-neutral-400 font-mono">
                                    {p.width} × {p.height}mm {p.cutoutSize ? `• Cutout: ${p.cutoutSize}` : ''} • Fita até: {p.maxStripWidth}
                                  </p>
                                </div>
                                <div className="flex gap-1 shrink-0 pt-1">
                                  <button onClick={() => handleCloneProfile(p)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-gold transition-colors cursor-pointer" title="Clonar perfil (Duplicar)">
                                    <Copy className="h-4 w-4" />
                                  </button>
                                  <button onClick={() => handleStartEditProfile(p)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-gold transition-colors cursor-pointer" title="Editar este produto">
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button onClick={() => handleDeleteProfile(p.id, p.code)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-red-500 transition-colors cursor-pointer" title="Excluir este produto">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. CATEGORIES / FILTERS TAB */}
                {activeTab === 'categories' && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
                      <h3 className="font-serif text-lg font-bold">Filtros & Categorias de Produtos</h3>
                      <p className="text-xs text-neutral-500">Adicione novas categorias de exibição ou edite os nomes das categorias existentes.</p>
                    </div>

                    {/* Add Category Form */}
                    <form onSubmit={handleAddCategorySubmit} className="p-4 bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex items-center gap-3 shadow-sm">
                      <input 
                        type="text" 
                        placeholder="Nome da nova categoria (ex: Iluminação para Fachadas)" 
                        value={newCategoryName} 
                        onChange={e => setNewCategoryName(e.target.value)}
                        className="flex-1 p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 text-xs focus:outline-none focus:border-gold"
                      />
                      <button type="submit" className="px-4 py-2.5 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Plus className="h-4 w-4" /> Criar Categoria
                      </button>
                    </form>

                    {/* Categories List */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase">Categorias Ativas ({categories.length})</h4>
                      <div className="space-y-2">
                        {categories.map(cat => {
                          const count = profiles.filter(p => p.category === cat).length;
                          const isEditing = editingCategoryName?.oldName === cat;

                          return (
                            <div key={cat} className="p-3 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                              {isEditing ? (
                                <form onSubmit={handleUpdateCategorySubmit} className="flex-1 flex items-center gap-2">
                                  <input 
                                    type="text" 
                                    value={editingCategoryName.newName} 
                                    onChange={e => setEditingCategoryName({ ...editingCategoryName, newName: e.target.value })}
                                    className="flex-1 p-1.5 border border-gold rounded-lg bg-white dark:bg-neutral-900 text-xs font-bold focus:outline-none"
                                    autoFocus
                                  />
                                  <button type="submit" className="p-1.5 bg-gold text-neutral-950 rounded-lg font-bold"><Check className="h-4 w-4" /></button>
                                  <button type="button" onClick={() => setEditingCategoryName(null)} className="p-1.5 text-neutral-400"><X className="h-4 w-4" /></button>
                                </form>
                              ) : (
                                <>
                                  <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-gold shrink-0" />
                                    <span className="font-bold text-sm text-neutral-900 dark:text-white">{cat}</span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-full">
                                      {count} produto(s)
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => setEditingCategoryName({ oldName: cat, newName: cat })} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-400 hover:text-gold cursor-pointer" title="Renomear Categoria">
                                      <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDeleteCategoryClick(cat)} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded text-neutral-400 hover:text-red-500 cursor-pointer" title="Excluir Categoria">
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. REPRESENTATIVES TAB */}
                {activeTab === 'representatives' && (
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
                      <div>
                        <h3 className="font-serif text-lg font-bold">Representantes Comerciais Pasilux</h3>
                        <p className="text-xs text-neutral-500">Cadastre, atualize ou remova os representantes comerciais e escritórios regionais.</p>
                      </div>
                      {!isAddingRep && !editingRepId && (
                        <button onClick={handleStartAddRep} className="px-4 py-2 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer">
                          <Plus className="h-4 w-4" /> Novo Representante
                        </button>
                      )}
                    </div>

                    {isAddingRep || editingRepId ? (
                      /* Add/Edit Representative Form */
                      <form onSubmit={handleSaveRep} className="space-y-4 bg-white dark:bg-neutral-900/60 p-5 sm:p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-xs shadow-xl max-w-3xl">
                        <div className="flex justify-between items-center pb-2 border-b border-neutral-200 dark:border-neutral-800">
                          <h4 className="font-serif text-base font-bold text-gold flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {isAddingRep ? 'Cadastrar Novo Representante Comercial' : `Editar Representante: ${repForm.name}`}
                          </h4>
                          <button type="button" onClick={() => { setIsAddingRep(false); setEditingRepId(null); }} className="text-neutral-400 text-xs font-mono">Cancelar</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block mb-1 font-semibold text-neutral-400">Nome do Representante / Responsável *</label>
                            <input type="text" required value={repForm.name} onChange={e => setRepForm({...repForm, name: e.target.value})} placeholder="ex: Roberto Carlos" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none" />
                          </div>
                          <div>
                            <label className="block mb-1 font-semibold text-neutral-400">Razão Social / Nome da Representação</label>
                            <input type="text" value={repForm.companyName || ''} onChange={e => setRepForm({...repForm, companyName: e.target.value})} placeholder="ex: RC Representações Luminotécnicas" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block mb-1 font-semibold text-neutral-400">Região Atendida *</label>
                            <input type="text" required value={repForm.region} onChange={e => setRepForm({...repForm, region: e.target.value})} placeholder="ex: São Paulo - Capital e ABC" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none" />
                          </div>
                          <div>
                            <label className="block mb-1 font-semibold text-neutral-400">Estados (separados por vírgula) *</label>
                            <input type="text" required value={repForm.states.join(', ')} onChange={e => setRepForm({...repForm, states: e.target.value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)})} placeholder="ex: SP, MG" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 font-mono focus:border-gold focus:outline-none" />
                          </div>
                          <div>
                            <label className="block mb-1 font-semibold text-neutral-400">Cidade Base / Showroom</label>
                            <input type="text" value={repForm.city} onChange={e => setRepForm({...repForm, city: e.target.value})} placeholder="ex: São Paulo - SP" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block mb-1 font-semibold text-neutral-400">Telefone Fixo / Comercial *</label>
                            <input type="text" required value={repForm.phone} onChange={e => setRepForm({...repForm, phone: e.target.value})} placeholder="(11) 3333-4444" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 font-mono focus:border-gold focus:outline-none" />
                          </div>
                          <div>
                            <label className="block mb-1 font-semibold text-neutral-400">WhatsApp (somente números)</label>
                            <input type="text" value={repForm.whatsapp || ''} onChange={e => setRepForm({...repForm, whatsapp: e.target.value.replace(/\D/g, '')})} placeholder="5511999998888" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 font-mono focus:border-gold focus:outline-none" />
                          </div>
                          <div>
                            <label className="block mb-1 font-semibold text-neutral-400">E-mail Comercial</label>
                            <input type="email" value={repForm.email} onChange={e => setRepForm({...repForm, email: e.target.value})} placeholder="representante@pasilux.com.br" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1 font-semibold text-neutral-400">Faixas de CEP Atendidas (separadas por vírgula)</label>
                          <input 
                            type="text" 
                            value={(repForm.cepRanges || []).join(', ')} 
                            onChange={e => setRepForm({...repForm, cepRanges: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} 
                            placeholder="ex: 01000-000 à 19999-999, 14000-000 à 19999-999" 
                            className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 font-mono text-xs focus:border-gold focus:outline-none" 
                          />
                        </div>

                        <div>
                          <label className="block mb-1 font-semibold text-neutral-400">Endereço Comercial / Showroom</label>
                          <input type="text" value={repForm.address || ''} onChange={e => setRepForm({...repForm, address: e.target.value})} placeholder="Rua, número, bairro, cidade - UF" className="w-full p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 focus:border-gold focus:outline-none" />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={repForm.active} onChange={e => setRepForm({...repForm, active: e.target.checked})} className="h-4 w-4 accent-gold cursor-pointer" />
                            <span className="font-bold text-neutral-300">Representante Ativo no Site</span>
                          </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                          <button type="button" onClick={() => { setIsAddingRep(false); setEditingRepId(null); }} className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-xl cursor-pointer">Cancelar</button>
                          <button type="submit" className="px-5 py-2 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-xl cursor-pointer shadow-md">
                            {isAddingRep ? 'Cadastrar Representante' : 'Salvar Alterações'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* Representatives List View */
                      <div className="space-y-4">
                        <input 
                          type="text" 
                          placeholder="Buscar por nome, região, estado ou cidade..." 
                          value={repSearch} 
                          onChange={e => setRepSearch(e.target.value)}
                          className="p-2.5 border border-neutral-300 dark:border-neutral-800 rounded-xl text-xs w-full max-w-sm bg-white dark:bg-neutral-900 focus:outline-none focus:border-gold"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredReps.map(r => (
                            <div key={r.id} className="p-4 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 hover:border-gold transition-all flex justify-between items-start gap-3 shadow-sm">
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${r.active ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700' : 'bg-neutral-100 text-neutral-700 border border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300'}`}>
                                    {r.active ? '🟢 Ativo' : '⚪ Inativo'}
                                  </span>
                                  <span className="text-[10px] bg-amber-100 text-amber-900 dark:bg-gold/20 dark:text-gold font-mono font-bold px-2 py-0.5 rounded border border-amber-300 dark:border-gold/40">
                                    UF: {r.states.join(', ')}
                                  </span>
                                  {r.cepRanges && r.cepRanges.length > 0 && (
                                    <span className="text-[10px] bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 font-mono font-bold px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">
                                      📮 CEP: {r.cepRanges.join(', ')}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-serif font-bold text-sm text-neutral-950 dark:text-white">{r.name}</h4>
                                {r.companyName && <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">{r.companyName}</p>}
                                <p className="text-xs text-amber-800 dark:text-gold font-semibold">📍 {r.region}</p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">{r.city} {r.address ? `• ${r.address}` : ''}</p>
                                <div className="pt-1 flex items-center gap-3 text-xs font-mono text-neutral-700 dark:text-neutral-300">
                                  <span className="font-medium">📞 {r.phone}</span>
                                  {r.email && <span className="font-medium">✉️ {r.email}</span>}
                                </div>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <button onClick={() => handleStartEditRep(r)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-gold transition-colors cursor-pointer" title="Editar este representante">
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDeleteRep(r.id, r.name)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-red-500 transition-colors cursor-pointer" title="Excluir representante">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. LEADS TAB */}
                {activeTab === 'leads' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                          <Users className="h-5 w-5 text-gold" />
                          Leads de Contato Recebidos
                        </h3>
                        <p className="text-xs text-neutral-400">Mensagens enviadas via formulário de contato do site.</p>
                      </div>
                      {leads.length > 0 && (
                        <button onClick={exportLeadsToCSV} className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border border-neutral-700 shadow-sm">
                          <Download className="h-3.5 w-3.5 text-gold" /> Exportar CSV
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                      <input type="text" placeholder="Buscar por nome, e-mail ou assunto..." value={leadSearch} onChange={e => setLeadSearch(e.target.value)} className="p-2.5 border border-neutral-800 rounded-xl text-xs w-full max-w-xs bg-neutral-900 focus:outline-none focus:border-gold text-white" />
                      
                      {/* Filter Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono shrink-0">
                        <button onClick={() => setLeadStatusFilter('all')} className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${leadStatusFilter === 'all' ? 'bg-gold text-neutral-950 font-bold border-gold' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800'}`}>
                          Todos ({leads.length})
                        </button>
                        <button onClick={() => setLeadStatusFilter('Pendente')} className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${leadStatusFilter === 'Pendente' ? 'bg-amber-500/20 text-amber-400 border-amber-500 font-bold' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800'}`}>
                          Pendentes ({leads.filter(l => l.status === 'Pendente').length})
                        </button>
                        <button onClick={() => setLeadStatusFilter('Respondido')} className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${leadStatusFilter === 'Respondido' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 font-bold' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800'}`}>
                          Respondidos ({leads.filter(l => l.status === 'Respondido').length})
                        </button>
                        <button onClick={() => setLeadStatusFilter('has_attachment')} className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${leadStatusFilter === 'has_attachment' ? 'bg-amber-500/20 text-amber-400 border-amber-500 font-bold' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800'}`}>
                          📎 Com Anexo ({leads.filter(l => !!l.attachmentName).length})
                        </button>
                      </div>
                    </div>
                    
                    <div className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/40 text-xs shadow-sm">
                      {leads
                        .filter(l => l.name.toLowerCase().includes(leadSearch.toLowerCase()) || l.subject.toLowerCase().includes(leadSearch.toLowerCase()) || l.email.toLowerCase().includes(leadSearch.toLowerCase()))
                        .filter(l => {
                          if (leadStatusFilter === 'all') return true;
                          if (leadStatusFilter === 'has_attachment') return !!l.attachmentName;
                          return l.status === leadStatusFilter;
                        })
                        .map(l => (
                          <div key={l.id} className="p-4 border-b border-neutral-800/60 flex flex-col md:flex-row justify-between items-start gap-4 hover:bg-neutral-900/60 transition-colors">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-sm">{l.name}</span>
                                <span className="text-[10px] text-neutral-400 font-mono bg-neutral-800 px-2 py-0.5 rounded">{l.date}</span>
                                {l.attachmentName && (
                                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                                    <Paperclip className="h-3 w-3" /> Possui Anexo
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-400 font-mono">{l.email} {l.phone ? `• ${l.phone}` : ''}</p>
                              <p className="font-semibold text-neutral-200 mt-1.5">Assunto: {l.subject}</p>
                              <p className="text-neutral-300 font-light leading-relaxed mt-1 bg-neutral-900/90 p-3 rounded-xl border border-neutral-800">{l.message}</p>
                              {l.attachmentName && (
                                <div className="mt-2 flex items-center gap-2 p-2 bg-neutral-900 rounded-xl border border-gold/30 w-fit">
                                  <Paperclip className="h-3.5 w-3.5 text-gold" />
                                  <span className="text-[11px] font-mono text-neutral-200 font-semibold">{l.attachmentName} ({l.attachmentSize})</span>
                                  {l.attachmentUrl && (
                                    <a
                                      href={l.attachmentUrl}
                                      download={l.attachmentName}
                                      className="ml-2 text-[11px] text-gold hover:underline font-bold flex items-center gap-1"
                                    >
                                      <Download className="h-3 w-3" />
                                      Baixar Projeto
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-row md:flex-col items-end gap-2 shrink-0 w-full md:w-auto justify-between md:justify-start pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
                              <select 
                                value={l.status} 
                                onChange={e => updateLeadStatus(l.id, e.target.value as Lead['status'])}
                                className="text-[11px] p-2 border border-neutral-800 rounded-xl bg-neutral-900 text-white font-mono focus:outline-none cursor-pointer"
                              >
                                <option value="Pendente">🟡 Pendente</option>
                                <option value="Respondido">🟢 Respondido</option>
                                <option value="Arquivado">⚪ Arquivado</option>
                              </select>

                              {l.phone && (
                                <button 
                                  onClick={() => openWhatsAppLead(l)} 
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  Responder WhatsApp
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 5. BUDGETS TAB */}
                {activeTab === 'budgets' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gold" />
                          Solicitações de Orçamentos Técnicos
                        </h3>
                        <p className="text-xs text-neutral-400">Orçamentos solicitados pelo montador/cliente no configurador.</p>
                      </div>
                      {budgets.length > 0 && (
                        <button onClick={exportBudgetsToCSV} className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border border-neutral-700 shadow-sm">
                          <Download className="h-3.5 w-3.5 text-gold" /> Exportar CSV
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                      <input type="text" placeholder="Buscar por cliente, cidade ou e-mail..." value={budgetSearch} onChange={e => setBudgetSearch(e.target.value)} className="p-2.5 border border-neutral-800 rounded-xl text-xs w-full max-w-xs bg-neutral-900 focus:outline-none focus:border-gold text-white" />

                      {/* Filter Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono shrink-0">
                        <button onClick={() => setBudgetStatusFilter('all')} className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${budgetStatusFilter === 'all' ? 'bg-gold text-neutral-950 font-bold border-gold' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800'}`}>
                          Todos ({budgets.length})
                        </button>
                        <button onClick={() => setBudgetStatusFilter('Pendente')} className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${budgetStatusFilter === 'Pendente' ? 'bg-amber-500/20 text-amber-400 border-amber-500 font-bold' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800'}`}>
                          Pendentes ({budgets.filter(b => b.status === 'Pendente').length})
                        </button>
                        <button onClick={() => setBudgetStatusFilter('Em Análise')} className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${budgetStatusFilter === 'Em Análise' ? 'bg-blue-500/20 text-blue-400 border-blue-500 font-bold' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800'}`}>
                          Em Análise ({budgets.filter(b => b.status === 'Em Análise').length})
                        </button>
                        <button onClick={() => setBudgetStatusFilter('Aprovado')} className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${budgetStatusFilter === 'Aprovado' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 font-bold' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800'}`}>
                          Aprovados ({budgets.filter(b => b.status === 'Aprovado').length})
                        </button>
                        <button onClick={() => setBudgetStatusFilter('has_attachment')} className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${budgetStatusFilter === 'has_attachment' ? 'bg-amber-500/20 text-amber-400 border-amber-500 font-bold' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800'}`}>
                          📎 Com Anexo ({budgets.filter(b => !!b.attachmentName).length})
                        </button>
                      </div>
                    </div>

                    <div className="border border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900/40 text-xs shadow-sm">
                      {budgets
                        .filter(b => b.name.toLowerCase().includes(budgetSearch.toLowerCase()) || b.city.toLowerCase().includes(budgetSearch.toLowerCase()) || b.email.toLowerCase().includes(budgetSearch.toLowerCase()))
                        .filter(b => {
                          if (budgetStatusFilter === 'all') return true;
                          if (budgetStatusFilter === 'has_attachment') return !!b.attachmentName;
                          return b.status === budgetStatusFilter;
                        })
                        .map(b => (
                          <div key={b.id} className="p-4 border-b border-neutral-800/60 flex flex-col md:flex-row justify-between items-start gap-4 hover:bg-neutral-900/60 transition-colors">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-sm">{b.name}</span>
                                <span className="text-[10px] text-neutral-400 font-mono bg-neutral-800 px-2 py-0.5 rounded">{b.date}</span>
                                {b.attachmentName && (
                                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                                    <Paperclip className="h-3 w-3" /> Projeto Anexo
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-400 font-mono">{b.email} {b.phone ? `• ${b.phone}` : ''} {b.company ? `• Empresa: ${b.company}` : ''}</p>
                              <p className="text-[11px] font-semibold text-gold flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {b.city} - {b.state.toUpperCase()}
                              </p>
                              
                              <div className="space-y-1.5 mt-2.5 max-w-xl">
                                <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Itens do Orçamento ({b.items.reduce((s, i) => s + i.quantity, 0)} barras totais):</span>
                                {b.items.map((item, idx) => (
                                  <div key={idx} className="p-2 bg-neutral-900/90 border border-neutral-800 rounded-xl text-[11px] flex justify-between items-center">
                                    <span className="font-bold text-neutral-200">{item.quantity}x Barra {item.profileCode} ({item.length}m)</span>
                                    <span className="font-mono text-[10px] text-neutral-400">{item.color} • {item.lightTemp}</span>
                                  </div>
                                ))}
                              </div>

                              {b.notes && (
                                <p className="text-[11px] text-neutral-400 italic bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 max-w-xl mt-2">
                                  " Observações do Cliente: {b.notes} "
                                </p>
                              )}

                              {b.attachmentName && (
                                <div className="mt-2 flex items-center gap-2 p-2 bg-neutral-900 rounded-xl border border-gold/30 w-fit">
                                  <Paperclip className="h-3.5 w-3.5 text-gold" />
                                  <span className="text-[11px] font-mono text-neutral-200 font-semibold">{b.attachmentName} ({b.attachmentSize})</span>
                                  {b.attachmentUrl && (
                                    <a
                                      href={b.attachmentUrl}
                                      download={b.attachmentName}
                                      className="ml-2 text-[11px] text-gold hover:underline font-bold flex items-center gap-1"
                                    >
                                      <Download className="h-3 w-3" />
                                      Baixar Projeto
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-row md:flex-col items-end gap-2 shrink-0 w-full md:w-auto justify-between md:justify-start pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
                              <select 
                                value={b.status} 
                                onChange={e => updateBudgetStatus(b.id, e.target.value as Budget['status'])}
                                className="text-[11px] p-2 border border-neutral-800 rounded-xl bg-neutral-900 text-white font-mono focus:outline-none cursor-pointer"
                              >
                                <option value="Pendente">🟡 Pendente</option>
                                <option value="Em Análise">🔵 Em Análise</option>
                                <option value="Aprovado">🟢 Aprovado</option>
                                <option value="Recusado">🔴 Recusado</option>
                              </select>

                              {b.phone && (
                                <button 
                                  onClick={() => openWhatsAppBudget(b)} 
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  Atender via WhatsApp
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 6. SITE TEXTS & CONTACT INFO TAB */}
                {activeTab === 'texts' && (
                  <form onSubmit={handleSaveTexts} className="space-y-6 max-w-3xl">
                    <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                          <Layout className="h-5 w-5 text-gold" />
                          Textos Globais &amp; Informações de Contato
                        </h3>
                        <p className="text-xs text-neutral-400">Edite os telefones de contato, WhatsApp central, e-mails, endereços e textos do site.</p>
                      </div>
                      <button type="submit" className="px-5 py-2.5 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2 shadow-md">
                        <Save className="h-4 w-4" /> Salvar Alterações
                      </button>
                    </div>

                    {/* SECTION 1: CONTACT & WHATSAPP CHANNELS */}
                    <div className="p-5 bg-neutral-900/80 border border-gold/30 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                        <h4 className="font-mono text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          1. Central de Contato &amp; WhatsApp Oficial
                        </h4>
                        <span className="text-[10px] font-mono text-neutral-400">Direcionamento central do site</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-neutral-300 font-mono mb-1 font-semibold">
                            WhatsApp Formatado (Exibição Visual) *
                          </label>
                          <input 
                            type="text" 
                            value={textsForm.contactWhatsapp || ''} 
                            onChange={e => {
                              const val = e.target.value;
                              const rawDigits = val.replace(/\D/g, '');
                              const rawFormatted = rawDigits.startsWith('55') ? rawDigits : `55${rawDigits}`;
                              setTextsForm({
                                ...textsForm, 
                                contactWhatsapp: val,
                                contactWhatsappRaw: rawFormatted
                              });
                            }} 
                            placeholder="(17) 99106-6398"
                            className="w-full p-2.5 border border-neutral-700 rounded-xl bg-neutral-950 text-white focus:outline-none focus:border-gold font-mono" 
                          />
                          <p className="text-[10px] text-neutral-400 mt-1">Exibido nos botões, cabeçalho e rodapé.</p>
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-mono mb-1 font-semibold">
                            WhatsApp Numérico (Link wa.me com DDI) *
                          </label>
                          <input 
                            type="text" 
                            value={textsForm.contactWhatsappRaw || ''} 
                            onChange={e => setTextsForm({...textsForm, contactWhatsappRaw: e.target.value})} 
                            placeholder="5517991066398"
                            className="w-full p-2.5 border border-neutral-700 rounded-xl bg-neutral-950 text-white focus:outline-none focus:border-gold font-mono" 
                          />
                          <p className="text-[10px] text-neutral-400 mt-1">Código internacional + DDD + Número (ex: 5517991066398).</p>
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-mono mb-1 font-semibold">
                            Telefone Fixo / Comercial
                          </label>
                          <input 
                            type="text" 
                            value={textsForm.contactPhone || ''} 
                            onChange={e => setTextsForm({...textsForm, contactPhone: e.target.value})} 
                            placeholder="(17) 99106-6398"
                            className="w-full p-2.5 border border-neutral-700 rounded-xl bg-neutral-950 text-white focus:outline-none focus:border-gold font-mono" 
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-mono mb-1 font-semibold">
                            E-mail Corporativo de Atendimento *
                          </label>
                          <input 
                            type="email" 
                            value={textsForm.contactEmail || ''} 
                            onChange={e => setTextsForm({...textsForm, contactEmail: e.target.value})} 
                            placeholder="contato@pasilux.com.br"
                            className="w-full p-2.5 border border-neutral-700 rounded-xl bg-neutral-950 text-white focus:outline-none focus:border-gold font-mono" 
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-mono mb-1 font-semibold">
                            Endereço / Localização da Fábrica
                          </label>
                          <input 
                            type="text" 
                            value={textsForm.contactAddress || ''} 
                            onChange={e => setTextsForm({...textsForm, contactAddress: e.target.value})} 
                            placeholder="Catanduva, São Paulo, Brasil"
                            className="w-full p-2.5 border border-neutral-700 rounded-xl bg-neutral-950 text-white focus:outline-none focus:border-gold" 
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-mono mb-1 font-semibold">
                            Horário de Suporte Técnico
                          </label>
                          <input 
                            type="text" 
                            value={textsForm.contactHours || ''} 
                            onChange={e => setTextsForm({...textsForm, contactHours: e.target.value})} 
                            placeholder="Seg a Sex: 08:00 às 18:00"
                            className="w-full p-2.5 border border-neutral-700 rounded-xl bg-neutral-950 text-white focus:outline-none focus:border-gold" 
                          />
                        </div>
                      </div>

                      {/* Test link preview */}
                      <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
                        <span className="text-neutral-400 font-mono">
                          Link direto WhatsApp ativo: <strong className="text-emerald-400">https://wa.me/{(textsForm.contactWhatsappRaw || '5517991066398').replace(/\D/g, '')}</strong>
                        </span>
                        <a
                          href={`https://wa.me/${(textsForm.contactWhatsappRaw || '5517991066398').replace(/\D/g, '')}?text=Teste%20de%20contato%20Pasilux`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-mono text-[11px] font-bold flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" /> Testar Link
                        </a>
                      </div>
                    </div>

                    {/* SECTION 2: SMTP & AUTOMATIC EMAIL DISPATCH STATUS */}
                    <div className="p-5 bg-neutral-900/80 border border-sky-500/30 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-sky-400" />
                          <h4 className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                            2. Envio Automático de E-mails (SMTP &amp; Notificações)
                          </h4>
                        </div>
                        {emailStatus?.configured ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle className="h-3 w-3" /> SMTP Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <AlertTriangle className="h-3 w-3" /> Variáveis Pendentes no .env
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed">
                        Quando um cliente envia um formulário de <strong className="text-white">Contato</strong> ou solicitação de <strong className="text-white">Orçamento Sob Medida</strong>, o sistema salva o registro no banco de dados e dispara automaticamente um e-mail com todos os dados preenchidos, plantas em anexo e links diretos para resposta.
                      </p>

                      {/* Status Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">Servidor SMTP Atual:</span>
                          <p className="font-mono font-bold text-white">{emailStatus?.host || 'smtp.gmail.com'}</p>
                        </div>
                        <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">Destinatário dos Formulários (EMAIL_TO):</span>
                          <p className="font-mono font-bold text-gold">{emailStatus?.recipient || textsForm.contactEmail || 'contato@pasilux.com.br'}</p>
                        </div>
                      </div>

                      {/* Guide of Environment Variables */}
                      <div className="p-3.5 bg-neutral-950/70 rounded-xl border border-neutral-800 text-[11px] font-mono space-y-2">
                        <div className="flex items-center justify-between text-neutral-400 font-bold uppercase text-[10px]">
                          <span>Variáveis de Ambiente (.env)</span>
                          <span className="text-sky-400">Configuração de Produção</span>
                        </div>
                        <div className="text-neutral-300 space-y-1 text-[10px] leading-relaxed">
                          <div><code className="text-gold font-bold">SMTP_HOST</code>: Host do servidor (ex: <em>smtp.gmail.com</em>, <em>smtp.hostinger.com</em>, <em>smtp.resend.com</em>)</div>
                          <div><code className="text-gold font-bold">SMTP_PORT</code>: Porta de envio (ex: <em>587</em> para TLS ou <em>465</em> para SSL)</div>
                          <div><code className="text-gold font-bold">SMTP_USER</code>: Usuário ou e-mail de autenticação</div>
                          <div><code className="text-gold font-bold">SMTP_PASS</code>: Senha ou App Password do provedor de e-mail</div>
                          <div><code className="text-gold font-bold">EMAIL_TO</code>: E-mail que receberá as mensagens (ex: <em>{textsForm.contactEmail || 'contato@pasilux.com.br'}</em>)</div>
                        </div>
                      </div>

                      {/* Interactive Test Tool */}
                      <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-neutral-200 flex items-center gap-1.5 font-mono">
                            <Sparkles className="h-3.5 w-3.5 text-gold" />
                            Testar Envio de E-mail de Notificação
                          </label>
                          <span className="text-[10px] text-neutral-400">Verifique a conexão SMTP</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="email"
                            value={testEmailRecipient}
                            onChange={e => setTestEmailRecipient(e.target.value)}
                            placeholder="seu-email@exemplo.com"
                            className="flex-1 p-2.5 border border-neutral-700 rounded-xl bg-neutral-900 text-white text-xs font-mono focus:outline-none focus:border-sky-400"
                          />
                          <button
                            type="button"
                            onClick={handleSendTestEmail}
                            disabled={testEmailLoading}
                            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:bg-neutral-800 text-white font-bold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                          >
                            {testEmailLoading ? (
                              <>
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Mail className="h-3.5 w-3.5" />
                                Enviar E-mail de Teste
                              </>
                            )}
                          </button>
                        </div>

                        {testEmailResult && (
                          <div className={`p-3 rounded-xl border text-xs leading-relaxed ${testEmailResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                            {testEmailResult.success ? (
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                                <span>{testEmailResult.message || 'E-mail de teste disparado com sucesso! Verifique sua caixa de entrada.'}</span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 font-bold">
                                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                                  <span>Resultado do Teste:</span>
                                </div>
                                <p className="font-mono text-[11px] text-red-200">{testEmailResult.error}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* SECTION 3: HERO & LANDING PAGE TEXTS */}
                    <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4">
                      <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-neutral-800">
                        <Sparkles className="h-4 w-4 text-gold" />
                        2. Textos do Hero (Topo da Página)
                      </h4>

                      <div className="space-y-3.5 text-xs">
                        <div>
                          <label className="block text-neutral-400 font-mono mb-1">Tagline Superior do Hero</label>
                          <input type="text" value={textsForm.heroTagline} onChange={e => setTextsForm({...textsForm, heroTagline: e.target.value})} className="w-full p-2.5 border border-neutral-700 rounded-xl bg-neutral-950 text-white focus:outline-none focus:border-gold" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-neutral-400 font-mono mb-1">Título Hero (Linha 1)</label>
                            <input type="text" value={textsForm.heroTitle1} onChange={e => setTextsForm({...textsForm, heroTitle1: e.target.value})} className="w-full p-2.5 border border-neutral-700 rounded-xl bg-neutral-950 text-white focus:outline-none focus:border-gold" />
                          </div>
                          <div>
                            <label className="block text-neutral-400 font-mono mb-1">Título Hero (Linha 2)</label>
                            <input type="text" value={textsForm.heroTitle2} onChange={e => setTextsForm({...textsForm, heroTitle2: e.target.value})} className="w-full p-2.5 border border-neutral-700 rounded-xl bg-neutral-950 text-white focus:outline-none focus:border-gold" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-neutral-400 font-mono mb-1">Descrição do Hero</label>
                          <textarea rows={3} value={textsForm.heroDescription} onChange={e => setTextsForm({...textsForm, heroDescription: e.target.value})} className="w-full p-2.5 border border-neutral-700 rounded-xl bg-neutral-950 text-white resize-none leading-relaxed focus:outline-none focus:border-gold" />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: ABOUT / INSTITUCIONAL */}
                    <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4">
                      <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-neutral-800">
                        <Building className="h-4 w-4 text-gold" />
                        3. Seção Quem Somos / Institucional
                      </h4>

                      <div className="space-y-3.5 text-xs">
                        <div>
                          <label className="block text-neutral-400 font-mono mb-1">Título Seção Quem Somos</label>
                          <input type="text" value={textsForm.aboutTitle} onChange={e => setTextsForm({...textsForm, aboutTitle: e.target.value})} className="w-full p-2.5 border border-neutral-700 rounded-xl bg-neutral-950 text-white focus:outline-none focus:border-gold" />
                        </div>
                        <div>
                          <label className="block text-neutral-400 font-mono mb-1">Subtítulo Quem Somos</label>
                          <input type="text" value={textsForm.aboutSubtitle || ''} onChange={e => setTextsForm({...textsForm, aboutSubtitle: e.target.value})} className="w-full p-2.5 border border-neutral-700 rounded-xl bg-neutral-950 text-white focus:outline-none focus:border-gold" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button type="submit" className="px-6 py-3 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2 shadow-lg shadow-gold/20 transition-all hover:scale-[1.01]">
                        <Save className="h-4 w-4" /> Salvar Todos os Textos e Contatos
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>
          </div>
        )}
    </div>
  );
}
