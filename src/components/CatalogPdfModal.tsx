import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, CheckCircle2, Loader2, Sparkles, ShieldCheck, Mail, User, Phone, Building2, Printer } from 'lucide-react';
import { useData } from '../context/DataContext';

interface CatalogPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CatalogPdfModal({ isOpen, onClose }: CatalogPdfModalProps) {
  const { addLead, profiles, siteTexts } = useData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const generatePrintableCatalog = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rowsHtml = profiles.map((p, idx) => `
      <tr style="border-bottom: 1px solid #e5e5e5; font-size: 11px;">
        <td style="padding: 6px 8px; font-family: monospace; font-weight: bold; color: #171717;">${p.code}</td>
        <td style="padding: 6px 8px; font-weight: 600;">${p.name}</td>
        <td style="padding: 6px 8px; color: #525252;">${p.category || p.type}</td>
        <td style="padding: 6px 8px; text-align: center; font-family: monospace;">${p.width} x ${p.height} mm</td>
        <td style="padding: 6px 8px; color: #525252;">${p.cutoutSize || 'Sobrepor / Sem rasgo'}</td>
        <td style="padding: 6px 8px; text-align: center; font-family: monospace;">${p.maxStripWidth || '12mm'}</td>
        <td style="padding: 6px 8px; font-size: 10px; color: #525252;">${(p.colors || []).join(', ')}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <title>Catálogo Técnico de Perfis de LED — Pasilux</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 24px; color: #171717; }
          .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #d4af37; padding-bottom: 12px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 900; letter-spacing: 2px; }
          .logo span { color: #b8860b; font-weight: 300; }
          .meta { text-align: right; font-size: 11px; color: #737373; font-family: monospace; }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { background: #171717; color: #f5f5f5; padding: 8px; font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px; }
          .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e5e5; font-size: 10px; color: #737373; display: flex; justify-content: space-between; }
          @media print {
            body { margin: 10mm; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">PASI<span>LUX</span></div>
            <div style="font-size: 12px; font-weight: bold; color: #525252; margin-top: 2px;">Catálogo Técnico de Perfis de Alumínio & LED — Linha Industrial</div>
            <div style="font-size: 11px; color: #737373;">Fábrica & Matriz Tecnológica: Catanduva - SP • (17) 99106-6398</div>
          </div>
          <div class="meta">
            <div>Solicitante: ${name || 'Cliente'} (${company || 'Revenda'})</div>
            <div>Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}</div>
            <button onclick="window.print()" style="margin-top: 6px; padding: 4px 10px; background: #b8860b; color: #000; border: none; font-weight: bold; border-radius: 4px; cursor: pointer;">Imprimir / Salvar PDF</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Modelo</th>
              <th>Categoria</th>
              <th style="text-align: center;">Dimensão</th>
              <th>Recorte / Rasgo</th>
              <th style="text-align: center;">Fita Máx.</th>
              <th>Acabamentos</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div>Pasilux Perfis de Alumínio — Produção Própria em Catanduva/SP — Atendimento a Lojas e Revendas em todo o Brasil</div>
          <div>www.pasilux.com.br</div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Register lead
    addLead({
      name,
      email,
      phone: phone || '',
      subject: 'Download do Catálogo Técnico PDF Pasilux',
      message: `Lead realizou o download do Catálogo Técnico Pasilux. Empresa: ${company || 'Não informada'}. Telefone: ${phone || 'Não informado'}.`,
    });

    setTimeout(() => {
      setLoading(false);
      setDownloaded(true);
      generatePrintableCatalog();
    }, 800);
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
              <span>Edição Oficial Atualizada</span>
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
                      Empresa / Loja
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
                      <span>Gerando Download do Catálogo...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 text-gold" />
                      <span>Baixar Catálogo Técnico em PDF</span>
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
                  Catálogo Técnico Gerado com Sucesso!
                </h4>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  A página com todas as 34 fichas técnicas dos perfis Pasilux foi aberta para visualização e impressão em PDF.
                </p>
                <div className="pt-3 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={generatePrintableCatalog}
                    className="px-5 py-2.5 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Reabrir / Imprimir</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Concluir
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
