import React from 'react';
import { Lightbulb, Mail, Phone, MessageSquare, ArrowUp, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';

interface FooterProps {
  onNavigateToProducts?: () => void;
  onNavigateHome?: () => void;
}

export default function Footer({ onNavigateToProducts, onNavigateHome }: FooterProps = {}) {
  const { siteTexts } = useData();

  const cleanWhatsapp = (siteTexts.contactWhatsappRaw || '5517991066398').replace(/\D/g, '');
  const displayWhatsapp = siteTexts.contactWhatsapp || '(17) 99106-6398';
  const displayEmail = siteTexts.contactEmail || 'contato@pasilux.com.br';
  const displayAddress = siteTexts.contactAddress || 'Catanduva, São Paulo, Brasil';

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNavClick = (id: string) => {
    if (id === 'produtos' && onNavigateToProducts) {
      onNavigateToProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 pt-16 pb-8 text-neutral-400 relative overflow-hidden animate-fade-in">
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gold opacity-50" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-12">
        {/* Upper tier layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Logo & Slogan Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Lightbulb className="h-5 w-5 text-gold" />
              <span className="font-serif tracking-widest text-lg font-light">
                PASI<span className="text-gold font-normal">LUX</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light max-w-sm">
              Tradição metalúrgica de mais de 60 anos unida à inovação da extrusão de perfis de alumínio. Elevando o padrão de projetos luminotécnicos residenciais e corporativos.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-serif font-semibold text-white text-xs uppercase tracking-wider">Acesso Rápido</h5>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {['home', 'quemsomos', 'produtos', 'projetos', 'blog', 'contato'].map((sect) => (
                <button
                  key={sect}
                  onClick={() => handleNavClick(sect)}
                  className="text-left text-neutral-400 hover:text-gold transition-colors capitalize cursor-pointer focus:outline-none"
                  id={`footer-nav-${sect}`}
                >
                  {sect === 'quemsomos' ? 'Quem Somos' : sect}
                </button>
              ))}
            </div>
          </div>

          {/* Plant & Central info */}
          <div className="md:col-span-5 space-y-3">
            <h5 className="font-serif font-semibold text-white text-xs uppercase tracking-wider">Matriz & Atendimento Oficial</h5>
            <p className="text-xs text-neutral-300 leading-relaxed font-light flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <span>{displayAddress} — Polo Metalúrgico de Alumínio</span>
            </p>
            <div className="space-y-1.5 pt-1">
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Olá! Gostaria de falar com um consultor da Pasilux.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                id="footer-whatsapp-link"
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>WhatsApp Consultor: {displayWhatsapp}</span>
              </a>
              <a 
                href={`mailto:${displayEmail}`}
                className="flex items-center gap-2 text-xs text-neutral-300 hover:text-gold transition-colors block"
              >
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <span>{displayEmail}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright disclaimer requested */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] font-mono tracking-wide text-neutral-500 text-center sm:text-left">
            Copyright © 2026 Pasilux – Todos os direitos reservados.
          </span>

          <button
            onClick={handleScrollToTop}
            className="group px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded border border-neutral-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            id="footer-back-to-top"
          >
            Voltar ao topo
            <ArrowUp className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
