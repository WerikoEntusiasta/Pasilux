import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = 'Pasilux — Perfis de LED e Alumínio de Alta Precisão';
const DEFAULT_DESCRIPTION = 'Fábrica de perfis de LED e extrusão de alumínio de alta precisão em Catanduva - SP. Mais de 60 anos de herança metalúrgica, 34+ perfis para marcenaria, arquitetura e gesso.';
const SITE_URL = 'https://pasilux.com.br';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop';

/**
 * Hook to manage page-level SEO meta tags, Open Graph, Twitter Cards, and JSON-LD schema
 */
export function useSEO({
  title,
  description,
  canonicalPath = '',
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    // 1. Title
    const fullTitle = title ? `${title} | Pasilux` : DEFAULT_TITLE;
    document.title = fullTitle;

    // 2. Meta description
    const metaDesc = description || DEFAULT_DESCRIPTION;
    updateMetaTag('name', 'description', metaDesc);

    // 3. Canonical URL
    const canonicalUrl = `${SITE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
    let linkCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 4. Open Graph Tags
    updateMetaTag('property', 'og:title', fullTitle);
    updateMetaTag('property', 'og:description', metaDesc);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:site_name', 'Pasilux Iluminação Linear');
    updateMetaTag('property', 'og:locale', 'pt_BR');

    // 5. Twitter Card
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', fullTitle);
    updateMetaTag('name', 'twitter:description', metaDesc);
    updateMetaTag('name', 'twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    const SCRIPT_ID = 'seo-dynamic-jsonld';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = SCRIPT_ID;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Optional cleanup on unmount: restore default title
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, canonicalPath, ogType, ogImage, JSON.stringify(jsonLd)]);
}

function updateMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}
