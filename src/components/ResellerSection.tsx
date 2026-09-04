import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Store, Building2, MapPin, Phone, User, FileText, CheckCircle2, ShieldCheck, ArrowRight, Loader2, Sparkles, Layers } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function ResellerSection() {
  const { addLead, siteTexts } = useData();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cityState, setCityState] = useState('');
  const [volume, setVolume] = useState('R$ 5.000 a R$ 20.000/mês');
  const [whatsapp, setWhatsapp] = useState('');
  const [interestLines, setInterestLines] = useState<string[]>(['Embutir', 'Sobrepor', 'Movelaria']);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const availableLines = ['Embutir', 'Sobrepor', 'Movelaria', 'Pendente', 'No Frame', 'Perfis Especiais'];

  const toggleLine = (line: string) => {
    setInterestLines(prev => 
      prev.includes(line) ? prev.filter(item => item !== line) : [...prev, line]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const leadMessage = `SOLICITAÇÃO DE CADASTRO DE REVENDEDOR PASILUX:
Empresa: ${company}
CNPJ: ${cnpj}
Responsável: ${name}
Cidade/UF: ${cityState}
Volume Estimado: ${volume}
Linhas de Interesse: ${interestLines.join(', ') || 'Todas'}`;

    addLead({
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@${company.toLowerCase().replace(/[^a-z0-9]/g, '') || 'revenda'}.com.br`,
      phone: whatsapp,
      subject: `Cadastro de Revendedor: ${company} (${cityState})`,
      message: leadMessage,
    });

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const cleanWhatsapp = (siteTexts.contactWhatsappRaw || '5517991066398').replace(/\D/g, '');

  return (
    <section id="revenda" className="py-20 md:py-28 bg-white border-t border-neutral-200 relative overflow-hidden text-neutral-900">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold-dark text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Store className="h-3.5 w-3.5" />
            <span>Parceria Comercial Direto de Fábrica</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-950 tracking-tight mb-5">
            Seja um Revendedor <span className="font-normal text-amber-900 dark:text-gold-dark">Pasilux</span>
          </h2>

          <p className="font-sans text-neutral-700 text-base md:text-lg font-light leading-relaxed">
            Amplie seu mix com perfis de LED de fábrica própria. Trabalhamos com lojas, distribuidores e marcenarias em todo o Brasil, com condições de revenda direto de fábrica, entrega ágil e suporte técnico pra você e pro seu cliente.
          </p>
          <div className="h-0.5 w-20 bg-gold mx-auto mt-6" />
        </div>

        {/* 2-Column Presentation: Benefits vs Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Commercial Advantages */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#faf9f6] border border-neutral-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-dark block">
                Por que revender Pasilux?
              </span>

              <div className="space-y-5 text-sm text-neutral-700">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-950 text-base mb-1">Preço Competitivo Direto de Fábrica</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">Sem intermediários ou atravessadores. Margem garantida para a sua operação de atacado ou varejo.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0 mt-0.5">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-950 text-base mb-1">Estabilidade de Estoque</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">Fabricação própria em Catanduva/SP. Sua revenda não fica esperando navios ou sujeita a atrasos internacionais.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0 mt-0.5">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-950 text-base mb-1">Mix Completo de 34+ Modelos</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">Linhas de embutir, sobrepor, movelaria fina, pendentes e no frame para atender projetos do básico ao alto padrão.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-900 shrink-0 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-950 text-base mb-1">Liberdade Total com a Fita LED</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">Vendemos o perfil de alumínio e difusor de alto desempenho. Você escolhe e precifica as fitas LED da sua preferência.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Contact Block */}
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">Atendimento Imediato</span>
                <span className="text-xs font-semibold text-emerald-950">Dúvidas rápidas sobre compras em lote?</span>
              </div>
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Olá! Tenho uma loja/distribuidora e gostaria de saber as condições de revenda dos perfis de LED Pasilux.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-mono inline-flex items-center gap-1.5 shadow-xs"
              >
                <Phone className="h-3.5 w-3.5" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Right Column: Reseller Onboarding Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#faf9f6] border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-lg relative">
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-neutral-200 pb-3 mb-4">
                    <h3 className="font-serif text-xl font-bold text-neutral-950">
                      Cadastre sua Empresa para Condições de Revenda
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1">
                      Preencha os dados abaixo e nosso time comercial entrará em contato com a tabela exclusiva de revendedor.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        Nome do Responsável *
                      </label>
                      <div className="relative">
                        <User className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: Carlos Silva"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        Razão Social ou Nome da Loja *
                      </label>
                      <div className="relative">
                        <Building2 className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Ex: Eletro Luz Distribuidora"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        CNPJ da Empresa *
                      </label>
                      <div className="relative">
                        <FileText className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={cnpj}
                          onChange={(e) => setCnpj(e.target.value)}
                          placeholder="00.000.000/0001-00"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:border-gold focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        Cidade / UF *
                      </label>
                      <div className="relative">
                        <MapPin className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={cityState}
                          onChange={(e) => setCityState(e.target.value)}
                          placeholder="Ex: São Paulo / SP"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        WhatsApp Comercial *
                      </label>
                      <div className="relative">
                        <Phone className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="(11) 99999-9999"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        Volume Estimado de Compra
                      </label>
                      <select
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:border-gold focus:outline-none cursor-pointer"
                      >
                        <option value="Até R$ 5.000/mês">Até R$ 5.000 / mês</option>
                        <option value="R$ 5.000 a R$ 20.000/mês">R$ 5.000 a R$ 20.000 / mês</option>
                        <option value="Acima de R$ 20.000/mês">Acima de R$ 20.000 / mês</option>
                        <option value="Cotação Pontual / Primeiro Lote">Cotação Pontual / Primeiro Lote</option>
                      </select>
                    </div>
                  </div>

                  {/* Linhas de interesse */}
                  <div>
                    <label className="text-[11px] font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-2">
                      Linhas de Perfis com Maior Interesse:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableLines.map((line) => {
                        const isChecked = interestLines.includes(line);
                        return (
                          <button
                            type="button"
                            key={line}
                            onClick={() => toggleLine(line)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
                              isChecked
                                ? 'bg-neutral-950 text-gold border-neutral-950 shadow-xs'
                                : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                            }`}
                          >
                            {isChecked ? '✓ ' : '+ '}{line}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gold hover:bg-gold-dark disabled:bg-neutral-300 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-gold/20 transition-all cursor-pointer"
                      id="submit-reseller-form-btn"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
                          <span>Enviando Dados...</span>
                        </>
                      ) : (
                        <>
                          <span>QUERO SER REVENDEDOR</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-neutral-500 flex items-center justify-center gap-1.5 pt-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Seus dados comerciais estão protegidos e serão utilizados exclusivamente pela nossa equipe de vendas.</span>
                  </p>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-neutral-950">
                    Solicitação Recebida com Sucesso!
                  </h3>
                  <p className="text-xs text-neutral-700 max-w-md mx-auto leading-relaxed">
                    Obrigado pelo interesse na parceria comercial Pasilux. Nosso consultor de revenda entrará em contato via WhatsApp nas próximas horas com o catálogo e condições especiais de fábrica.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                    <a
                      href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Olá! Acabei de enviar o cadastro de revendedor no site para a empresa ${company} (CNPJ: ${cnpj}). Gostaria de agilizar o atendimento.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" /> Agilizar no WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      Novo Cadastro
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
