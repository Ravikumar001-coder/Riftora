import React from 'react';

export function RuleSection({ section }) {
  const renderBlock = (block, index) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} className="text-slate-300 leading-relaxed mb-4 last:mb-0">
            {block.content}
          </p>
        );
      case 'heading3':
        return (
          <h3 key={index} className="text-xl font-semibold text-white mt-8 mb-4">
            {block.content}
          </h3>
        );
      case 'list':
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-slate-300 ml-2">
            {block.items.map((item, i) => (
              <li key={i} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        );
      case 'table':
        return (
          <div key={index} className="overflow-x-auto mb-4 border border-white/10 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50">
                  {block.headers.map((header, i) => (
                    <th key={i} className="px-4 py-3 text-sm font-semibold text-slate-300 border-b border-white/10">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-sm text-slate-300">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id={section.id} className="scroll-mt-32 pb-12 border-b border-white/10 last:border-0">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        {section.title}
      </h2>
      <div className="prose prose-invert max-w-none">
        {section.blocks.map((block, index) => renderBlock(block, index))}
      </div>
    </section>
  );
}
