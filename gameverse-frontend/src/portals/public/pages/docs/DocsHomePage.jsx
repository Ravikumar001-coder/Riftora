import React, { useEffect } from 'react';
import { DocsHero } from '../../components/docs/DocsHero';
import { CategoryGrid } from '../../components/docs/CategoryGrid';
import { FeaturedGuides } from '../../components/docs/FeaturedGuides';
import { RoleSelector } from '../../components/docs/RoleSelector';
import { QuickAccess } from '../../components/docs/QuickAccess';

export function DocsHomePage() {
  // Set SEO metadata
  useEffect(() => {
    document.title = "Riftora Documentation | Help Center";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Guides, technical documentation, API references, tournament operations, broadcasting, and help resources for Riftora.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <DocsHero />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <CategoryGrid />
        <FeaturedGuides />
        <RoleSelector />
        <QuickAccess />
      </div>
    </div>
  );
}
