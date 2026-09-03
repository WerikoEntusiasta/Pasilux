import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download, X, CheckCircle2, Loader2, Sparkles, ShieldCheck, Mail, User, Phone, Building2 } from 'lucide-react';
import { useData } from '../context/DataContext';

interface CatalogPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CatalogPdfModal({ isOpen, onClose }: CatalogPdfModalProps) {
  const { addLead } = useData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Register lead
    addLead({
      name,
      email,
      phone: phone || '',
      subject: 'Download do Catálogo Técnico PDF Pasilux',
      message: `Lead realizou o download do Catálogo Técnico Pasilux 2026. Empresa: ${company || 'Não informada'}. Telefone: ${phone || 'Não informado'}.`,
    });

    setTimeout(() => {
      setLoading(false);
      setDownloaded(true);

      // Trigger automatic simulated / real file download or open
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', 'Catalogo_Tecnico_Pasilux_2026.pdf');
      // Create a friendly simulated PDF blob if needed or direct print
      const blob = new Blob([
        `%PDF-1.4\n1 0 obj\n<< /Title (Catalogo Tecnico Pasilux 2026) /Author (Pasilux) >>\nendobj\n`
      ], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-2xl text-neutral-900 my-8"
        >
          {/* Header Banner */}
          <div className="bg-neutral-950 text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/15 rounded-full blur-2xl pointer-events-none" />
            
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900/80 hover:bg-gold text-neutral-400 hover:text-neutral-950 transition-colors cursor-pointer border border-neutral-800"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
              <Sparkles className="h-3 w-3" />
              <span>Edição Oficial 2026</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Download do Catálogo PDF
            </h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Receba as especificações completas de todos os 34+ modelos de perfis de LED, cotas técnicas, diagramas de corte e guias de fita LED COB.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {!downloaded ? (
              <form onSubmit={handleDownload} className="space-y-4">
                <div>
                  <label className="text-[11px] font-mono text-neutral-600 uppercase font-semibold mb-1 block">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:border-gold focus:outline-none placeholder-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-neutral-600 uppercase font-semibold mb-1 block">
                    E-mail Corporativo / Profissional *
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@empresa.com.br"
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:border-gold focus:outline-none placeholder-neutral-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-neutral-600 uppercase font-semibold mb-1 block">
                      WhatsApp (Opcional)
                    </label>
                    <div className="relative">
                      <Phone className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(17) 99999-9999"
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:border-gold focus:outline-none placeholder-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-neutral-600 uppercase font-semibold mb-1 block">
                      Empresa / Escritório
                    </label>
                    <div className="relative">
                      <Building2 className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Nome da sua empresa"
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:border-gold focus:outline-none placeholder-neutral-400"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-gold font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-neutral-950/20 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-gold" />
                      <span>Gerando Download...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 text-gold" />
                      <span>Baixar Catálogo Técnico em PDF (Grátis)</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-neutral-500 flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Seus dados estão protegidos. Não enviamos spam.</span>
                </p>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="font-serif font-bold text-xl text-neutral-950">
                  Download Iniciado com Sucesso!
                </h4>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  O arquivo PDF com todo o catálogo técnico Pasilux foi baixado no seu dispositivo. Caso deseje suporte para especificar modelos no seu projeto, fale conosco pelo WhatsApp.
                </p>
                <div className="pt-3 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-gold font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
