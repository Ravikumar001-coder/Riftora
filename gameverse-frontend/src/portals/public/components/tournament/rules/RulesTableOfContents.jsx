import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../../../../lib/utils';

export function RulesTableOfContents({ sections }) {
  const [activeSection, setActiveSection] = useState('');

  // Handle scroll spy to highlight the active section in the TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header if applicable
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (!sections || sections.length === 0) return null;

  return (
    <div className="gameverse-card p-6 border border-white/5 rounded-xl sticky top-24">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
        On This Page
      </h3>
      <nav className="flex flex-col gap-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "flex items-center text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 group",
              activeSection === section.id
                ? "bg-blue-600/10 text-blue-400 font-medium"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <ChevronRight 
              className={cn(
                "w-4 h-4 mr-2 transition-transform duration-200",
                activeSection === section.id ? "opacity-100 translate-x-0 text-blue-400" : "opacity-0 -translate-x-2 group-hover:opacity-50"
              )} 
            />
            <span className={cn(
              "transition-transform duration-200",
              activeSection === section.id ? "translate-x-0" : "-translate-x-4 group-hover:-translate-x-2"
            )}>
              {section.title}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
