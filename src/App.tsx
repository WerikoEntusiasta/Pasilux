import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProductsSection from './components/ProductsSection';
import ResellerSection from './components/ResellerSection';
import ProjectsGallery from './components/ProjectsGallery';
import ProjectsSection from './components/ProjectsSection';
import BlogSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import CatalogPdfModal from './components/CatalogPdfModal';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BlogPage from './pages/BlogPage';
import { useData } from './context/DataContext';

export default function App() {
  const { isAdminOpen, setIsAdminOpen } = useData();
  const [currentPage, setCurrentPage] = useState<'home' | 'produtos' | 'produto-detalhe' | 'blog'>('home');
  const [selectedProfileCode, setSelectedProfileCode] = useState<string | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [selectedQuoteProfile, setSelectedQuoteProfile] = useState<string>('');
  const [activeSection, setActiveSection] = useState('home');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Track scroll position for subtle parallax
  const { scrollY } = useScroll();
  const ambientY1 = useTransform(scrollY, [0, 5000], [0, 400]);
  const ambientY2 = useTransform(scrollY, [0, 5000], [0, -300]);
  const ambientY3 = useTransform(scrollY, [0, 5000], [0, 150]);
  const ambientY4 = useTransform(scrollY, [0, 5000], [0, 200]);

  // URL parsing on initial load and popstate
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.startsWith('/produtos/')) {
        const code = path.replace('/produtos/', '').replace('/', '').toUpperCase();
        if (code) {
          setSelectedProfileCode(code);
          setCurrentPage('produto-detalhe');
          return;
        }
      }

      if (path === '/produtos' || path === '/produtos/') {
        setSelectedProfileCode(null);
        setCurrentPage('produtos');
        return;
      }

      if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '').replace('/', '');
        setSelectedBlogSlug(slug || null);
        setCurrentPage('blog');
        return;
      }

      if (path === '/blog' || path === '/blog/') {
        setSelectedBlogSlug(null);
        setCurrentPage('blog');
        return;
      }

      // Default to home
      if (path === '/' || path === '') {
        setCurrentPage('home');
        if (hash) {
          const sectionId = hash.replace('#', '');
          setActiveSection(sectionId);
          setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) {
              const offset = 80;
              const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
              window.scrollTo({ top: pos, behavior: 'smooth' });
            }
          }, 150);
        }
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Scroll spy when on Home page
  useEffect(() => {
    if (currentPage !== 'home') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      const sections = ['home', 'quemsomos', 'produtos', 'projetos', 'orcamento', 'blog', 'contato'];

      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  // Route & shortcut detection for admin panel
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        path.includes('admin') || 
        hash.includes('admin') || 
        search.includes('admin') ||
        path.includes('adminpanelacessrestrito') || 
        hash.includes('adminpanelacessrestrito')
      ) {
        setIsAdminOpen(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setIsAdminOpen]);

  const handleSelectProfileForQuote = (profileCode: string) => {
    setSelectedQuoteProfile(profileCode);
    setCurrentPage('home');
    setActiveSection('orcamento');
    window.history.pushState({}, '', '/#orcamento');
    setTimeout(() => {
      const element = document.getElementById('orcamento');
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 150);
  };

  const handleNavigateToCatalog = () => {
    setSelectedProfileCode(null);
    setCurrentPage('produtos');
    window.history.pushState({}, '', '/produtos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToBlog = (slug?: string) => {
    setSelectedBlogSlug(slug || null);
    setCurrentPage('blog');
    window.history.pushState({}, '', slug ? `/blog/${slug}` : '/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentPage('home');
    setSelectedProfileCode(null);
    setSelectedBlogSlug(null);
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render standalone Admin Panel application when active
  if (isAdminOpen) {
    return <AdminPanel />;
  }

  return (
    <div className="bg-white min-h-screen text-neutral-900 font-sans overflow-x-hidden selection:bg-gold selection:text-neutral-950 relative">
      {/* Subtle Parallax Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          style={{ y: ambientY1 }}
          className="absolute top-[15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold/3 blur-[130px]"
        />
        <motion.div
          style={{ y: ambientY2 }}
          className="absolute top-[45%] right-[-10%] w-[600px] h-[600px] rounded-full bg-neutral-200/2 blur-[150px]"
        />
        <motion.div
          style={{ y: ambientY3 }}
          className="absolute top-[75%] left-[10%] w-[450px] h-[450px] rounded-full bg-gold/2 blur-[120px]"
        />
        <motion.div
          style={{ y: ambientY4 }}
          className="absolute inset-0 bg-[radial-gradient(#fae013_0.5px,transparent_0.5px)] bg-[size:32px_32px] opacity-10"
        />
      </div>

      <div className="relative z-10">
        {/* Sticky Premium Navbar */}
        <Navbar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onNavigateToCatalog={handleNavigateToCatalog}
          onNavigateToBlog={() => handleNavigateToBlog()}
          onOpenPdfModal={() => setIsPdfModalOpen(true)}
        />
        
        {currentPage === 'blog' ? (
          /* DEDICATED BLOG AND ARTICLE PAGE */
          <BlogPage 
            initialSlug={selectedBlogSlug}
            onNavigateHome={handleNavigateHome}
            onNavigateToCatalog={handleNavigateToCatalog}
          />
        ) : currentPage === 'produto-detalhe' ? (
          /* DEDICATED INDIVIDUAL PRODUCT DETAIL PAGE */
          <ProductDetailPage 
            profileCode={selectedProfileCode || 'PSL0018'}
            onBack={handleNavigateToCatalog}
            onSelectProfileForQuote={handleSelectProfileForQuote}
            onNavigateToProduct={(code) => {
              setSelectedProfileCode(code);
              setCurrentPage('produto-detalhe');
              window.history.pushState({}, '', `/produtos/${code.toLowerCase()}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToCatalog={handleNavigateToCatalog}
          />
        ) : currentPage === 'produtos' ? (
          /* DEDICATED SEPARATE PRODUCTS CATALOG PAGE */
          <ProductsPage 
            onNavigateHome={handleNavigateHome}
            onSelectProfileForQuote={handleSelectProfileForQuote}
            onNavigateToProduct={(code) => {
              setSelectedProfileCode(code);
              setCurrentPage('produto-detalhe');
              window.history.pushState({}, '', `/produtos/${code.toLowerCase()}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            initialProfileCode={selectedProfileCode}
            onOpenPdfModal={() => setIsPdfModalOpen(true)}
          />
        ) : (
          /* MAIN HOME VIEW WITH ALL SECTIONS */
          <>
            {/* 1. 🏠 HOME Section */}
            <Hero />
            
            {/* 2. 👥 QUEM SOMOS Section */}
            <About />

            {/* 3. 🏢 SEJA UM REVENDEDOR PASILUX (PARCERIA COMERCIAL B2B) */}
            <ResellerSection />
            
            {/* 4. 📦 PRINCIPAIS PRODUTOS Section */}
            <div className="relative">
              {/* Dedicated Page Promotion Banner over Products Section */}
              <div className="bg-neutral-950 text-white py-4 px-6 border-y border-neutral-800">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2 py-0.5 rounded bg-gold text-neutral-950 font-bold uppercase text-[10px]">Página Exclusiva</span>
                    <span className="text-neutral-300">Conheça o catálogo completo com todos os modelos industriais da Pasilux</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsPdfModalOpen(true)}
                      className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-gold border border-neutral-700 font-bold rounded-lg font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                    >
                      Baixar Catálogo PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleNavigateToCatalog}
                      className="px-4 py-1.5 bg-gold hover:bg-gold-light text-neutral-950 font-bold rounded-lg font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                    >
                      Abrir Catálogo de Produtos →
                    </button>
                  </div>
                </div>
              </div>

              <ProductsSection 
                onNavigateToProducts={(profileCode) => {
                  if (profileCode) {
                    setSelectedProfileCode(profileCode);
                    setCurrentPage('produto-detalhe');
                    window.history.pushState({}, '', `/produtos/${profileCode.toLowerCase()}`);
                  } else {
                    handleNavigateToCatalog();
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
              />
            </div>
            
            {/* 5. 🏢 PORTFÓLIO DE PROJETOS REALIZADOS (PROVA SOCIAL) */}
            <ProjectsGallery 
              onSelectProjectForQuote={() => {
                const el = document.getElementById('orcamento');
                if (el) {
                  const offset = 80;
                  const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
                  window.scrollTo({ top: pos, behavior: 'smooth' });
                }
              }}
              onNavigateToCatalog={handleNavigateToCatalog}
            />

            {/* 6. 🏗️ SOLICITAÇÃO DE ORÇAMENTO SOB MEDIDA */}
            <ProjectsSection prefilledProfile={selectedQuoteProfile} />
            
            {/* 7. 📝 BLOG Section */}
            <BlogSection onNavigateToBlogPage={handleNavigateToBlog} />
            
            {/* 8. 📞 CONTATO Section */}
            <ContactSection />
          </>
        )}
        
        {/* Footers & Legal Disclaimers */}
        <Footer 
          onNavigateToProducts={handleNavigateToCatalog}
          onNavigateHome={handleNavigateHome}
        />

        {/* Global Catalog PDF Lead & Download Modal */}
        <CatalogPdfModal 
          isOpen={isPdfModalOpen} 
          onClose={() => setIsPdfModalOpen(false)} 
        />
      </div>
    </div>
  );
}
