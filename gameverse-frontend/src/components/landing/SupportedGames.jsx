import React from 'react';
import { useNavigate } from 'react-router-dom';

export function SupportedGames() {
  const navigate = useNavigate();

  const games = [
    { id: 'bgmi', name: 'BGMI', active: 42, icon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'ff', name: 'Free Fire MAX', active: 28, icon: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=200&h=200' },
    { id: 'pubg', name: 'PUBG Mobile', active: 15, icon: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=200&h=200' },
  ];

  return (
    <section className="py-24 bg-transparent relative z-10">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        
        <h2 className="text-3xl font-bold text-white mb-4">Engines Supported</h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-12">
          Battle-tested scoring engines tailored specifically for Battle Royale point systems and API integrations.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {games.map(game => (
            <div 
              key={game.id}
              onClick={() => navigate(`/explore?game=${game.id}`)}
              className="flex flex-col items-center gap-4 cursor-pointer group"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-blue-500 transition-all group-hover:scale-105 shadow-xl">
                <img src={game.icon} alt={game.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-white font-bold group-hover:text-blue-400 transition-colors">{game.name}</h4>
                <p className="text-sm text-slate-500 mt-1">{game.active} Active Tournaments</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
