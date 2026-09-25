import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Camera, Video, MessagesSquare } from 'lucide-react';
import logo from '../../assets/logo.png';
import { motion } from 'framer-motion';

const AnimatedLink = ({ to, href, children, className }) => {
  const content = (
    <span className="relative group inline-block">
      <span className={className}>{children}</span>
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
    </span>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  return <a href={href}>{content}</a>;
};

export function GlobalFooter() {
  return (
    <footer className="border-t border-white/10 pt-16 pb-8 relative z-10 bg-transparent">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand & Socials */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <motion.img 
                whileHover={{ rotate: [-5, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
                src={logo} 
                alt="Riftora Logo" 
                className="h-10 w-auto object-contain" 
              />
            </Link>
            <p className="text-slate-400 mb-8 max-w-sm">
              The ultimate platform for esports tournaments. Organize, compete, broadcast, and win.
            </p>
            <div className="flex items-center gap-4">
              <motion.a whileHover={{ y: -3, backgroundColor: "#2563EB", color: "#fff" }} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 transition-colors">
                <MessagesSquare className="w-5 h-5" />
              </motion.a>
              <motion.a whileHover={{ y: -3, backgroundColor: "#2563EB", color: "#fff" }} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 transition-colors">
                <Video className="w-5 h-5" />
              </motion.a>
              <motion.a whileHover={{ y: -3, backgroundColor: "#2563EB", color: "#fff" }} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 transition-colors">
                <Camera className="w-5 h-5" />
              </motion.a>
              <motion.a whileHover={{ y: -3, backgroundColor: "#2563EB", color: "#fff" }} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Product Links -> Platform */}
          <div>
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="flex flex-col gap-4">
              <li><AnimatedLink to="/explore" className="text-slate-400 hover:text-white transition-colors">Explore Tournaments</AnimatedLink></li>
              <li><AnimatedLink href="#live" className="text-slate-400 hover:text-white transition-colors">Live Tournaments</AnimatedLink></li>
              <li><AnimatedLink href="#organizations" className="text-slate-400 hover:text-white transition-colors">Organizations</AnimatedLink></li>
              <li><AnimatedLink href="#teams" className="text-slate-400 hover:text-white transition-colors">Teams</AnimatedLink></li>
              <li><AnimatedLink href="#players" className="text-slate-400 hover:text-white transition-colors">Players</AnimatedLink></li>
            </ul>
          </div>

          {/* Platform Links -> Organizers */}
          <div>
            <h4 className="text-white font-semibold mb-6">Organizers</h4>
            <ul className="flex flex-col gap-4">
              <li><AnimatedLink href="/auth/register" className="text-slate-400 hover:text-white transition-colors">Create Tournament</AnimatedLink></li>
              <li><AnimatedLink href="#organizers" className="text-slate-400 hover:text-white transition-colors">Command Center</AnimatedLink></li>
              <li><AnimatedLink href="#scoring" className="text-slate-400 hover:text-white transition-colors">Scoring</AnimatedLink></li>
              <li><AnimatedLink href="#broadcast" className="text-slate-400 hover:text-white transition-colors">Broadcast</AnimatedLink></li>
              <li><AnimatedLink to="/docs" className="text-slate-400 hover:text-white transition-colors">Documentation</AnimatedLink></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-6">Resources</h4>
            <ul className="flex flex-col gap-4">
              <li><AnimatedLink to="/docs" className="text-slate-400 hover:text-white transition-colors">Docs</AnimatedLink></li>
              <li><AnimatedLink href="#" className="text-slate-400 hover:text-white transition-colors">Rules</AnimatedLink></li>
              <li><AnimatedLink href="#" className="text-slate-400 hover:text-white transition-colors">Help</AnimatedLink></li>
              <li><AnimatedLink href="#" className="text-slate-400 hover:text-white transition-colors">API</AnimatedLink></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="flex flex-col gap-4">
              <li><AnimatedLink href="#" className="text-slate-400 hover:text-white transition-colors">About</AnimatedLink></li>
              <li><AnimatedLink href="#" className="text-slate-400 hover:text-white transition-colors">Contact</AnimatedLink></li>
              <li><AnimatedLink href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</AnimatedLink></li>
              <li><AnimatedLink href="#" className="text-slate-400 hover:text-white transition-colors">Terms</AnimatedLink></li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Riftora. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-slate-400 text-sm">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
