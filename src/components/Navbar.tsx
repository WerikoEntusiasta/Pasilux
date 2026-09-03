import React, { useState, useEffect } from 'react';
import { Menu, X, Lightbulb, Compass, MessageSquare, FileDown } from 'lucide-react';
import { useData } from '../context/DataContext';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  currentPage: 'home' | 'produtos' | 'blog' | 'produto-detalhe';
  setCurrentPage: (page: 'home' | 'produtos' | 'blog' | 'produto-detalhe') => void;
  onNavigateToCatalog?: () => void;
  onNavigateToBlog?: () => void;
  onOpenQuoteModal?: () => void;
  onOpenPdfModal?: () => void;
}

export default function Navbar({ 
  activeSection, 
  setActiveSection, 
  currentPage,
  setCurrentPage,
  onNavigateToCatalog,
  onNavigateToBlog,
  onOpenPdfModal,
}: NavbarProps) {
  const { siteTexts } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cleanWhatsapp = (siteTexts.contactWhatsappRaw || '5517991066398').replace(/\D/g, '');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'quemsomos', label: 'Quem Somos' },
    { id: 'produtos', label: 'Produtos' },
    { id: 'projetos', label: 'Projetos' },
    { id: 'blog', label: 'Blog' },
    { id: 'contato', label: 'Contato' },
  ];

  const handleNavClick = (id: string) => {
    setIsOpen(false);

    if (id === 'produtos') {
      if (onNavigateToCatalog) {
        onNavigateToCatalog();
      } else {
        setCurrentPage('produtos');
      }
      setActiveSection('produtos');
      window.history.pushState({}, '', '/produtos');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (id === 'blog') {
      if (currentPage === 'blog') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (currentPage === 'home') {
        setActiveSection('blog');
        const element = document.getElementById('blog');
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      } else {
        if (onNavigateToBlog) {
          onNavigateToBlog();
        } else {
          setCurrentPage('blog');
        }
        window.history.pushState({}, '', '/blog');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Navigating to Home or a section on Home
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setActiveSection(id);
      window.history.pushState({}, '', id === 'home' ? '/' : `/#${id}`);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      setActiveSection(id);
      window.history.pushState({}, '', id === 'home' ? '/' : `/#${id}`);
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleQuoteClick = () => {
    setIsOpen(false);
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setActiveSection('orcamento');
      window.history.pushState({}, '', '/#orcamento');
      setTimeout(() => {
        const element = document.getElementById('orcamento') || document.getElementById('projetos');
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      setActiveSection('orcamento');
      window.history.pushState({}, '', '/#orcamento');
      const element = document.getElementById('orcamento') || document.getElementById('projetos');
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  const isLinkActive = (id: string) => {
    if (currentPage === 'produtos' || currentPage === 'produto-detalhe') {
      return id === 'produtos';
    }
    if (currentPage === 'blog') {
      return id === 'blog';
    }
    return activeSection === id && currentPage === 'home';
  };

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white ${
        scrolled
          ? 'border-b border-neutral-200/80 py-3.5 shadow-sm'
          : 'py-5 border-b border-neutral-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 group text-left focus:outline-none cursor-pointer"
          id="nav-logo"
        >
          <div className="relative">
            <Lightbulb className="h-6 w-6 text-gold-dark transition-all duration-500 group-hover:scale-110" />
            <div className="absolute -inset-1 rounded-full bg-gold/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <span className="font-display text-xl font-bold tracking-widest text-neutral-900 group-hover:text-black transition-colors border-b-2 border-gold pb-0.5">
            PASI<span className="text-gold-dark font-light">LUX</span>
          </span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {menuItems.map((item) => {
            const active = isLinkActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-sans text-xs uppercase tracking-widest transition-all duration-300 relative py-1 focus:outline-none cursor-pointer ${
                  active
                    ? 'text-gold-dark font-bold'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
                id={`nav-link-${item.id}`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full" />
                )}
              </button>
            );
          })}

          {/* PDF Download Button */}
          {onOpenPdfModal && (
            <button
              type="button"
              onClick={onOpenPdfModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded-full text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer"
              id="nav-pdf-download-btn"
              title="Download do Catálogo Técnico PDF"
            >
              <FileDown className="h-3.5 w-3.5 text-gold-dark" />
              <span>Catálogo PDF</span>
            </button>
          )}

          {/* Quick WhatsApp button */}
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Olá! Gostaria de falar com um consultor da Pasilux.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full text-xs font-bold tracking-wide transition-all shadow-xs"
            id="nav-whatsapp-btn"
          >
            <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={handleQuoteClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-gold hover:bg-gold-light text-neutral-950 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 transform hover:scale-105 shadow-md shadow-gold/20 cursor-pointer"
            id="nav-project-btn"
          >
            <Compass className="h-3.5 w-3.5" />
            Solicitar Orçamento
          </button>
        </div>

        {/* Right side controls on Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {onOpenPdfModal && (
            <button
              type="button"
              onClick={onOpenPdfModal}
              className="p-2 text-neutral-700 hover:text-neutral-950 focus:outline-none"
              aria-label="Download Catálogo PDF"
              title="Catálogo PDF"
            >
              <FileDown className="h-5 w-5 text-gold-dark" />
            </button>
          )}

          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Olá! Gostaria de falar com um consultor da Pasilux.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-emerald-600 hover:text-emerald-700 focus:outline-none"
            aria-label="WhatsApp Pasilux"
            id="mobile-nav-whatsapp-icon"
          >
            <MessageSquare className="h-5 w-5" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-neutral-700 hover:text-neutral-950 p-1.5 focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
            id="mobile-menu-toggle"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden fixed inset-x-0 bg-white/98 backdrop-blur-md border-b border-neutral-200 transition-all duration-300 overflow-hidden ${
          isOpen ? 'top-[65px] max-h-screen py-6 shadow-xl' : 'top-[65px] max-h-0'
        }`}
        id="mobile-menu-dropdown"
      >
        <div className="px-6 flex flex-col gap-4">
          {menuItems.map((item) => {
            const active = isLinkActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left font-sans text-lg tracking-wide py-2 border-b border-neutral-100 focus:outline-none cursor-pointer ${
                  active ? 'text-gold-dark font-bold' : 'text-neutral-600'
                }`}
                id={`mobile-nav-link-${item.id}`}
              >
                {item.label}
              </button>
            );
          })}

          {onOpenPdfModal && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenPdfModal();
              }}
              className="flex items-center justify-center gap-2 w-full py-3 bg-neutral-100 border border-neutral-300 text-neutral-900 rounded-xl text-sm font-bold tracking-wide uppercase transition-all shadow-xs cursor-pointer"
            >
              <FileDown className="h-4 w-4 text-gold-dark" />
              Download Catálogo Técnico PDF
            </button>
          )}

          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Olá! Gostaria de falar com um consultor da Pasilux.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold tracking-wide uppercase transition-all shadow-sm cursor-pointer"
            id="mobile-nav-whatsapp-direct-btn"
          >
            <MessageSquare className="h-4 w-4" />
            Falar no WhatsApp: {siteTexts.contactWhatsapp || '(17) 99106-6398'}
          </a>

          <button
            onClick={handleQuoteClick}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gold hover:bg-gold-light text-neutral-950 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-md cursor-pointer"
            id="mobile-nav-project-btn"
          >
            <Compass className="h-4 w-4" />
            Solicitar Orçamento
          </button>
        </div>
      </div>
    </nav>
  );
}
