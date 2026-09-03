import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, Paperclip, FileText, X, MessageSquare, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContactMessage } from '../types';
import { useData } from '../context/DataContext';

export default function ContactSection() {
  const { siteTexts, addLead, uploadFile } = useData();
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [fileData, setFileData] = useState<{ name: string; url: string; size: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const cleanWhatsapp = (siteTexts.contactWhatsappRaw || '5517991066398').replace(/\D/g, '');
  const displayWhatsapp = siteTexts.contactWhatsapp || '(17) 99106-6398';
  const displayPhone = siteTexts.contactPhone || '(17) 99106-6398';
  const displayEmail = siteTexts.contactEmail || 'contato@pasilux.com.br';
  const displayAddress = siteTexts.contactAddress || 'Catanduva, São Paulo, Brasil';
  const displayHours = siteTexts.contactHours || 'Segunda a Sexta: 08:00 às 18:00';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
        alert('Erro ao enviar o arquivo.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveFile = () => {
    setFileData(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Add to leads context and simulate delay
    setTimeout(() => {
      addLead({
        ...formData,
        attachmentName: fileData?.name,
        attachmentUrl: fileData?.url,
        attachmentSize: fileData?.size,
      });
      setLoading(false);
      setSubmitted(true);
      setFileData(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 1000);
  };

  return (
    <section id="contato" className="py-24 md:py-32 bg-[#f8f8f7] text-neutral-900 border-t border-neutral-200 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-gold-dark uppercase tracking-widest font-bold">Atendimento Pasilux</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-950 tracking-tight mt-2 mb-6">
            Fale com Nossos Consultores
          </h2>
          <p className="font-sans text-neutral-700 text-base md:text-lg font-normal leading-relaxed">
            Estamos prontos para atender você! Fale diretamente com nossa equipe técnica pelo WhatsApp oficial, telefone ou envie sua mensagem abaixo.
          </p>
          <div className="h-0.5 w-20 bg-gold mx-auto mt-6" />
        </div>

        {/* Layout split: Contact info cards vs Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Contact details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-neutral-950 text-2xl tracking-tight">Canais Oficiais de Contato</h3>
              <p className="text-sm text-neutral-600 font-normal leading-relaxed">
                {siteTexts.contactSubtitle}
              </p>
            </div>

            {/* Central WhatsApp Highlight Card */}
            <div className="p-6 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white rounded-2xl border border-neutral-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp Oficial Direto</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Atendimento Ágil
                </span>
              </div>

              <div>
                <p className="font-serif text-2xl font-bold text-white tracking-wide">{displayWhatsapp}</p>
                <p className="text-xs text-neutral-400 font-sans mt-1">
                  Atendimento técnico centralizado para arquitetos, marceneiros, engenheiros e lojistas de todo o Brasil.
                </p>
              </div>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Olá! Gostaria de falar com um consultor da Pasilux para tirar dúvidas e solicitar informações sobre perfis de LED.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.01]"
                id="contact-whatsapp-btn"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Conversar no WhatsApp Agora</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="space-y-3.5 pt-2">
              {/* Phone */}
              <a 
                href={`tel:${displayPhone.replace(/\D/g, '')}`}
                className="flex items-start gap-4 p-4 bg-white border border-neutral-200 rounded-xl shadow-xs hover:border-gold transition-colors block group"
              >
                <Phone className="h-5 w-5 text-gold-dark shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-serif font-bold text-neutral-950 text-sm">Central Telefônica</h4>
                  <p className="text-xs text-neutral-700 font-mono mt-0.5">{displayPhone}</p>
                </div>
              </a>

              {/* Email */}
              <a 
                href={`mailto:${displayEmail}`}
                className="flex items-start gap-4 p-4 bg-white border border-neutral-200 rounded-xl shadow-xs hover:border-gold transition-colors block group"
              >
                <Mail className="h-5 w-5 text-gold-dark shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-serif font-bold text-neutral-950 text-sm">E-mail Comercial & Projetos</h4>
                  <p className="text-xs text-neutral-700 font-mono mt-0.5">{displayEmail}</p>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-start gap-4 p-4 bg-white border border-neutral-200 rounded-xl shadow-xs">
                <MapPin className="h-5 w-5 text-gold-dark shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-neutral-950 text-sm">Matriz Fabril & Atendimento</h4>
                  <p className="text-xs text-neutral-600 font-normal mt-0.5">{displayAddress}</p>
                </div>
              </div>

              {/* Work hours */}
              <div className="flex items-start gap-4 p-4 bg-white border border-neutral-200 rounded-xl shadow-xs">
                <Clock className="h-5 w-5 text-gold-dark shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-neutral-950 text-sm">Horário de Atendimento</h4>
                  <p className="text-xs text-neutral-600 font-normal mt-0.5">{displayHours}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-100 rounded-xl border border-neutral-200 text-xs text-neutral-800 leading-normal shadow-xs">
              🏭 <strong className="text-neutral-950 font-bold">Presença Fabril & Logística:</strong> Matriz tecnológica em Catanduva/SP, com capacidade industrial e logística para fornecimento ágil em todo o território nacional.
            </div>

          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white border border-neutral-200/90 p-8 rounded-2xl shadow-xl flex flex-col justify-center">
            
            <AnimatePresence mode="wait">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4" id="contact-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-neutral-700 font-bold uppercase">Seu Nome *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ex: João Silva"
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:border-gold focus:ring-1 focus:ring-gold/30 placeholder-neutral-400 focus:outline-none transition-colors"
                        id="contact-name"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-neutral-700 font-bold uppercase">Seu E-mail *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="joao@exemplo.com"
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:border-gold focus:ring-1 focus:ring-gold/30 placeholder-neutral-400 focus:outline-none transition-colors"
                        id="contact-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-neutral-700 font-bold uppercase">Telefone / WhatsApp (Opcional)</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(17) 99106-6398"
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:border-gold focus:ring-1 focus:ring-gold/30 placeholder-neutral-400 focus:outline-none transition-colors"
                        id="contact-phone"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-neutral-700 font-bold uppercase">Assunto *</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Ex: Dúvida técnica de difusor"
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:border-gold focus:ring-1 focus:ring-gold/30 placeholder-neutral-400 focus:outline-none transition-colors"
                        id="contact-subject"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-700 font-bold uppercase">Sua Mensagem *</label>
                    <textarea
                      name="message"
                      rows={3}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Escreva suas perguntas, sugestões ou especificações do projeto..."
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:border-gold focus:ring-1 focus:ring-gold/30 placeholder-neutral-400 focus:outline-none transition-colors resize-none"
                      id="contact-message"
                    />
                  </div>

                  {/* Attachment Upload Field */}
                  <div className="space-y-1 pt-1">
                    <label className="text-[10px] font-mono text-neutral-700 font-bold uppercase flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Paperclip className="h-3.5 w-3.5 text-gold-dark" />
                        Anexar Arquivo / Projeto (Opcional)
                      </span>
                      <span className="text-[10px] text-neutral-400 font-normal">DWG, PDF, PNG, JPG, ZIP (Máx 25MB)</span>
                    </label>

                    {!fileData ? (
                      <label className="border-2 border-dashed border-neutral-300 hover:border-gold hover:bg-gold/5 rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                        <Paperclip className="h-5 w-5 text-neutral-400 group-hover:text-gold transition-colors mb-1" />
                        <span className="text-xs font-semibold text-neutral-700 group-hover:text-neutral-900">Clique ou arraste um arquivo para anexar</span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">Plantas de arquitetura, croquis ou memoriais descritivos</span>
                        <input
                          type="file"
                          accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.zip,.rar"
                          onChange={handleFileChange}
                          className="hidden"
                          id="contact-file-input"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-neutral-100 border border-neutral-300 rounded-xl">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-gold/20 rounded-lg shrink-0">
                            <FileText className="h-5 w-5 text-gold-dark" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-neutral-900 truncate">{fileData.name}</p>
                            <p className="text-[10px] font-mono text-neutral-500">{fileData.size}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
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
                    className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-gold font-bold rounded-lg text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer mt-4"
                    id="contact-submit-btn"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Mensagem
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-4"
                  id="contact-success-screen"
                >
                  <CheckCircle2 className="h-14 w-14 text-gold-dark mx-auto" />
                  <h3 className="font-serif font-bold text-neutral-950 text-xl">Mensagem Recebida com Sucesso!</h3>
                  <p className="font-sans text-neutral-700 text-sm max-w-md mx-auto leading-relaxed">
                    Agradecemos seu contato. Sua mensagem foi recebida no painel administrativo Pasilux e nossa equipe retornará em até <strong className="text-neutral-950 font-bold">24 horas úteis</strong> via WhatsApp ou E-mail.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 bg-neutral-950 text-gold hover:bg-neutral-800 text-xs rounded-lg cursor-pointer font-bold transition-colors"
                    id="contact-reset-btn"
                  >
                    Enviar Outra Mensagem
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
