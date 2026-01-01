
import React from 'react';
import TokenIssuanceView from './views/TokenIssuancePlatform';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-900/50">TF</div>
            <span className="text-xl font-bold tracking-tight text-slate-100">Token<span className="text-cyan-500">Forge</span></span>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Tutorials</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Support</a>
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-100 px-4 py-1.5 rounded-lg border border-slate-700 transition-all">Connect Wallet</button>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-10 w-full">
        <TokenIssuanceView />
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 space-y-4 md:space-y-0">
          <div>© 2024 TokenForge AI. Built for the decentralized future.</div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
