import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Compass, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Paperclip, 
  FileText, 
  X, 
  ShieldAlert 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectSpecs {
  name: string;
  email: string;
  phone: string;
  company?: string;
  city: string;
  state: string;
  specifications: string;
}

interface ProjectsSectionProps {
  prefilledProfile?: string;
}

export default function ProjectsSection({ prefilledProfile }: ProjectsSectionProps) {
  const { addBudget, uploadFile, siteTexts } = useData();

  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [fileData, setFileData] = useState<{ name: string; url: string; size: string } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 25 * 1024 * 1024) {
        alert('O arquivo selecionado deve ter no máximo 25MB.');
        return;
      }
      try {
        setLoading(true);
        const res = await uploadFile(selectedFile);
        setFileData(res);
      } catch (err) {
        alert('Erro ao enviar o arquivo do projeto.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveFile = () => {
    setFileData(null);
  };

  // Simplified Client Info State
  const [formData, setFormData] = useState<ProjectSpecs>(() => ({
    name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    state: '',
    specifications: prefilledProfile ? `Perfil Selecionado: ${prefilledProfile}\nFavor enviar cotação com valor e prazo de entrega.` : '',
  }));

  React.useEffect(() => {
    if (prefilledProfile) {
      setFormData(prev => ({
        ...prev,
        specifications: `Perfil Selecionado: ${prefilledProfile}\nFavor enviar cotação com valor e prazo de entrega.`
      }));
    }
  }, [prefilledProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const budgetData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      company: formData.company || '',
      city: formData.city,
      state: formData.state.toUpperCase(),
      notes: formData.specifications || 'Solicitação de cotação via formulário simplificado.',
      items: [
        {
          profileCode: 'Projeto / Cotação Sob Medida',
          length: 1,
          quantity: 1,
          color: 'A Definir',
          lightTemp: 'A Definir',
        }
      ],
      attachmentName: fileData?.name,
      attachmentUrl: fileData?.url,
      attachmentSize: fileData?.size,
    };

    setTimeout(() => {
      addBudget(budgetData);
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="orcamento" className="py-20 bg-[#f4f3f0] text-neutral-900 border-t border-neutral-200 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Simple Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono text-gold-dark uppercase font-bold tracking-wider">{siteTexts.budgetBadge || 'Cotação Direta de Fábrica'}</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 tracking-tight mt-1 mb-3">
            {siteTexts.budgetTitle || 'Solicite um Orçamento Sob Medida'}
          </h2>
          <p className="text-neutral-600 text-sm leading-relaxed">
            {siteTexts.budgetSubtitle || 'Envie as necessidades do seu projeto, medidas lineares ou anexe sua planta luminotécnica para receber uma cotação detalhada direto da fábrica Pasilux.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Simplified Form */}
          <div className="lg:col-span-8 bg-white border border-neutral-200/90 p-6 sm:p-8 rounded-2xl shadow-xl">
            
            <AnimatePresence mode="wait">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                    <h3 className="font-serif font-bold text-neutral-950 text-base flex items-center gap-2">
                      <Compass className="h-4 w-4 text-gold-dark" />
                      Dados para Solicitação de Orçamento
                    </h3>
                    <span className="text-xs font-mono text-neutral-500">Contato &amp; Especificações</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-neutral-600 uppercase font-semibold mb-1 block">Nome Completo *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ex: João da Silva"
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:border-gold focus:outline-none placeholder-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-neutral-600 uppercase font-semibold mb-1 block">E-mail *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Ex: joao@email.com"
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:border-gold focus:outline-none placeholder-neutral-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-neutral-600 uppercase font-semibold mb-1 block">WhatsApp *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(17) 99999-9999"
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:border-gold focus:outline-none placeholder-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-neutral-600 uppercase font-semibold mb-1 block">Cidade *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Ex: Catanduva"
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:border-gold focus:outline-none placeholder-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-neutral-600 uppercase font-semibold mb-1 block">Estado (UF) *</label>
                      <input
                        type="text"
                        name="state"
                        required
                        maxLength={2}
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="SP"
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:border-gold focus:outline-none uppercase placeholder-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-neutral-600 uppercase font-semibold mb-1 block">
                      Empresa / Marcenaria / Estúdio (Opcional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company || ''}
                      onChange={handleInputChange}
                      placeholder="Nome da sua empresa ou escritório"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:border-gold focus:outline-none placeholder-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-neutral-600 uppercase font-semibold mb-1 block">
                      Descrição do Projeto / Perfis Desejados
                    </label>
                    <textarea
                      name="specifications"
                      rows={3}
                      value={formData.specifications}
                      onChange={handleInputChange}
                      placeholder="Descreva os modelos de perfil que precisa, metragens estimadas, acabamentos (Preto, Branco, Alumínio) ou dúvidas técnicas..."
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:border-gold focus:outline-none resize-none placeholder-neutral-400"
                    />
                  </div>

                  {/* File Attachment Upload */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-neutral-700 font-bold uppercase flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Paperclip className="h-3.5 w-3.5 text-gold-dark" />
                        Anexar Arquivo / Planta do Projeto (Opcional)
                      </span>
                      <span className="text-[10px] text-neutral-400 font-normal">PDF, DWG, PNG, ZIP (Máx 25MB)</span>
                    </label>

                    {!fileData ? (
                      <label className="border-2 border-dashed border-neutral-300 hover:border-gold hover:bg-gold/5 rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                        <Paperclip className="h-4 w-4 text-neutral-400 group-hover:text-gold transition-colors mb-1" />
                        <span className="text-xs font-semibold text-neutral-700 group-hover:text-neutral-900">Clique ou arraste um arquivo do seu projeto</span>
                        <span className="text-[10px] text-neutral-400">Plantas luminotécnicas, PDFs ou fotos do local</span>
                        <input
                          type="file"
                          accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.zip,.rar"
                          onChange={handleFileChange}
                          className="hidden"
                          id="project-file-input"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-2.5 bg-neutral-100 border border-neutral-300 rounded-xl">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="p-1.5 bg-gold/20 rounded-lg shrink-0">
                            <FileText className="h-4 w-4 text-gold-dark" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-neutral-900 truncate">{fileData.name}</p>
                            <p className="text-[10px] font-mono text-neutral-500">{fileData.size}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1 text-neutral-400 hover:text-red-500 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                          title="Remover arquivo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-gold font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <span>{siteTexts.budgetSubmitButton || 'Solicitar Orçamento'}</span>
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>

                </form>
              ) : (
                /* Success Message */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <CheckCircle2 className="h-14 w-14 text-gold-dark mx-auto" />
                  <h3 className="font-serif font-bold text-xl text-neutral-950">Recebemos sua Solicitação!</h3>
                  <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Obrigado, <strong className="text-neutral-900">{formData.name}</strong>. Nossa equipe técnica e comercial entrará em contato em até <strong className="text-neutral-900 font-bold">24 horas úteis</strong> via WhatsApp ou E-mail com a sua cotação personalizada direto de fábrica.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        city: '',
                        state: '',
                        specifications: '',
                      });
                      setFileData(null);
                    }}
                    className="px-5 py-2.5 bg-neutral-950 text-gold hover:bg-neutral-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Enviar Outra Solicitação
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right Column: Clean Steps & Quick Notice */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-xl space-y-4">
              <h4 className="font-serif font-bold text-neutral-950 text-sm uppercase tracking-wider">Como Funciona</h4>
              <ul className="space-y-3.5 text-xs text-neutral-700">
                <li className="flex gap-2.5">
                  <span className="font-mono text-xs font-bold text-neutral-950 bg-gold/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">1</span>
                  <span>Você envia as dimensões, modelo desejado ou anexa o arquivo do projeto.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="font-mono text-xs font-bold text-neutral-950 bg-gold/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">2</span>
                  <span>Nossa equipe calcula a cotação exata de fábrica e valida o dimensionamento.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="font-mono text-xs font-bold text-neutral-950 bg-gold/20 h-5 w-5 rounded-full flex items-center justify-center shrink-0">3</span>
                  <span>Entregamos com corte sob medida e suporte técnico em todo o Brasil.</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 leading-relaxed">
                💡 <strong className="text-neutral-700">Medidas Especiais:</strong> Comprimentos fora da lista padrão (1m, 2m, 3m) são atendidos sob encomenda mediante verificação de viabilidade técnica.
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/80 p-5 rounded-2xl space-y-2 text-xs text-amber-900 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Atendimento a Profissionais</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed font-normal">
                Arquitetos, lighting designers, engenheiros e marcenarias contam com suporte técnico dedicado e condições de faturamento direto de fábrica para grandes lotes.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
