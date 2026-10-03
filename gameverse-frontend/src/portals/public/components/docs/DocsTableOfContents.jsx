import React from 'react';

export function DocsTableOfContents({ headings }) {
  if (!headings || headings.length === 0) return null;

  return (
    <div className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-24">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">On This Page</h4>
        <nav className="space-y-2">
          {headings.map((heading, index) => (
            <a
              key={index}
              href={`#${heading.id}`}
              className={`block text-sm transition-colors ${
                heading.level === 3 ? 'pl-4' : ''
              } text-slate-400 hover:text-blue-400`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
