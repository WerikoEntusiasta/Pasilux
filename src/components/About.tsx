import React, { useState } from 'react';
import { ShieldCheck, Target, Award, Compass, Factory, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';

export default function About() {
  const { siteTexts } = useData();
  const [activeTab, setActiveTab] = useState<'60anos' | '20anos'>('60anos');

  return (
    <section id="quemsomos" className="py-24 md:py-32 bg-[#f9f8f6] text-neutral-900 border-t border-neutral-200 relative overflow-hidden">
      {/* Decorative vector assets & subtle architectural texture backdrop */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-5 pointer-events-none mix-blend-multiply" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-stone-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-gold-dark uppercase tracking-widest font-bold">Quem Somos</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-950 tracking-tight mt-2 mb-6">
            {siteTexts.aboutTitle}
          </h2>
          <div className="h-0.5 w-20 bg-gold mx-auto" />
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white p-1.5 rounded-xl border border-neutral-300 shadow-sm">
            <button
              onClick={() => setActiveTab('60anos')}
              className={`px-6 py-3 rounded-lg text-xs md:text-sm font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === '60anos'
                  ? 'bg-neutral-950 text-gold font-bold shadow-md'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
              id="about-tab-60"
            >
              <Factory className="h-4 w-4" />
              {siteTexts.aboutTab1Label}
            </button>
            <button
              onClick={() => setActiveTab('20anos')}
              className={`px-6 py-3 rounded-lg text-xs md:text-sm font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === '20anos'
                  ? 'bg-neutral-950 text-gold font-bold shadow-md'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
              id="about-tab-20"
            >
              <Layers className="h-4 w-4" />
              {siteTexts.aboutTab2Label}
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-8 md:p-12 shadow-xl backdrop-blur-md">
          <AnimatePresence mode="wait">
            {activeTab === '60anos' ? (
              <motion.div
                key="60anos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
              >
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-gold-dark font-bold uppercase tracking-wider">
                    <span>CATANDUVA - SP</span>
                    <span>•</span>
                    <span>GRUPO METALÚRGICO FUNDADOR</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-neutral-950">
                    Tradição e Expertise de 6 Décadas
                  </h3>
                  
                  <div className="space-y-4 font-sans text-neutral-700 text-base md:text-lg leading-relaxed font-normal">
                    <p>
                      Situada em Catanduva, no interior do Estado de São Paulo, a <strong className="text-neutral-950 font-bold">Pasilux</strong> é a mais recente adição a um grupo consolidado que atua há mais de <strong className="text-gold-dark font-bold">60 anos no ramo de metalúrgica</strong>. Embora a Pasilux seja uma nova marca, carregamos conosco a rica tradição, experiência e expertise desse grupo renomado.
                    </p>
                    <p>
                      Nossa paixão por inovação e excelência nos guia em cada passo. Acreditamos que o alumínio, quando moldado com precisão e inovação, tem o poder de revolucionar ambientes e experiências. É essa convicção que nos motiva a explorar constantemente novas técnicas, designs e soluções para atender às demandas dinâmicas de nossos clientes.
                    </p>
                    <p>
                      Ao optar pela Pasilux, você não está apenas escolhendo produtos de alta qualidade, mas também uma herança de confiança e comprometimento que vem sendo construída ao longo de décadas. Estamos aqui para iluminar, inovar e inspirar.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-stone-50 border border-neutral-200/90 shadow-xs rounded-xl flex flex-col items-start hover:border-gold transition-all">
                    <Award className="h-8 w-8 text-gold-dark mb-4" />
                    <h4 className="font-serif font-bold text-neutral-950 text-lg mb-2">Qualidade Inabalável</h4>
                    <p className="text-xs text-neutral-600 font-normal leading-relaxed">Controle rígido de precisão e processos herdados da metalúrgica pesada.</p>
                  </div>
                  <div className="p-6 bg-stone-50 border border-neutral-200/90 shadow-xs rounded-xl flex flex-col items-start hover:border-gold transition-all">
                    <ShieldCheck className="h-8 w-8 text-gold-dark mb-4" />
                    <h4 className="font-serif font-bold text-neutral-950 text-lg mb-2">Confiança e Credibilidade</h4>
                    <p className="text-xs text-neutral-600 font-normal leading-relaxed">Parcerias duradouras construídas ao longo de mais de meio século de mercado.</p>
                  </div>
                  <div className="p-6 bg-stone-50 border border-neutral-200/90 shadow-xs rounded-xl flex flex-col items-start md:col-span-2 hover:border-gold transition-all">
                    <Compass className="h-8 w-8 text-gold-dark mb-4" />
                    <h4 className="font-serif font-bold text-neutral-950 text-lg mb-2">Inspirando Ambientes</h4>
                    <p className="text-xs text-neutral-600 font-normal leading-relaxed">Perfis desenhados milimetricamente para que arquitetos e designers alcancem a iluminação perfeita.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="20anos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
              >
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-gold-dark font-bold uppercase tracking-wider">
                    <span>CATANDUVA - SP</span>
                    <span>•</span>
                    <span>ESPECIALISTAS EM EXTRUSÃO</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-neutral-950">
                    Duas Décadas Dedicadas ao Alumínio
                  </h3>
                  
                  <div className="space-y-4 font-sans text-neutral-700 text-base md:text-lg leading-relaxed font-normal">
                    <p>
                      Situada em Catanduva, no interior do Estado de São Paulo, a <strong className="text-neutral-950 font-bold">Pasilux</strong> é a mais recente adição a um grupo consolidado que atua há mais de <strong className="text-gold-dark font-bold">20 anos no mercado de alumínio</strong>. Embora a Pasilux seja uma nova marca, carregamos conosco a rica tradição, experiência e expertise desse grupo renomado.
                    </p>
                    <p>
                      Nossa paixão por inovação e excelência nos guia em cada passo. Acreditamos que o alumínio, quando moldado com precisão e inovação, tem o poder de revolucionar ambientes e experiências. É essa convicção que nos motiva a explorar constantemente novas técnicas, designs e soluções para atender às demandas dinâmicas de nossos clientes.
                    </p>
                    <p>
                      Ao optar pela Pasilux, você não está apenas escolhendo produtos de alta qualidade, mas também uma herança de confiança e comprometimento que vem sendo construída ao longo de duas décadas. Estamos aqui para iluminar, inovar e inspirar.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-stone-50 border border-neutral-200 shadow-sm rounded-xl p-8 relative overflow-hidden flex flex-col justify-center hover:border-gold transition-all">
                  <div className="absolute -right-16 -bottom-16 w-48 h-48 border border-gold/20 rounded-full" />
                  <h4 className="font-serif text-gold-dark font-bold text-5xl md:text-6xl mb-2">20+</h4>
                  <p className="font-serif text-lg font-bold text-neutral-950 mb-4">Anos de Mercado em Alumínio</p>
                  <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                    Nossa liga de alumínio passa por processos rigorosos de têmpera e anodização, garantindo dissipação térmica excepcional para fitas de LED de alta potência. Uma verdadeira revolução de design estrutural.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
