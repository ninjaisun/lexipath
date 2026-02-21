import React, { useState, useEffect } from 'react';
import { LayoutGrid, BookOpen, Settings, LogOut, Zap, Globe, Menu, X, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocalizationAgent } from './agents/LocalizationAgent';
import { AuthView } from './agents/AuthView';
import { StudyView } from './agents/StudyView';
import { ManageView } from './agents/ManageView';

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, manage, settings
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lang, setLang] = useState(localStorage.getItem('lexipath_lang') || 'zh');

  const t = LocalizationAgent.t(lang);

  const toggleLanguage = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    setLang(newLang);
    localStorage.setItem('lexipath_lang', newLang);
  };

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('lexipath_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticate = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('lexipath_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('lexipath_user');
  };

  if (!isAuthenticated) {
    return (
      <div className="App">
        <AuthView onAuthenticate={handleAuthenticate} lang={lang} />
      </div>
    );
  }

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveView(id)}
      className={cn(
        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden",
        activeView === id
          ? "bg-primary text-white shadow-lg shadow-primary/20"
          : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
      )}
    >
      <Icon size={22} className={cn("transition-transform group-hover:scale-110", activeView === id && "animate-pulse")} />
      <span className="font-bold tracking-tight">{label}</span>
      {activeView === id && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/40 rounded-r-full" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex font-sans">
      {/* Sidebar Overlay for Mobile */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl lg:hidden text-primary"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Persistent Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-900 transition-transform duration-500 lg:relative lg:translate-x-0 flex flex-col justify-between",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div>
          {/* Logo Section */}
          <div className="p-8 pb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Globe size={20} />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                LexiPath <span className="text-primary tracking-normal">2026</span>
              </span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 space-y-2">
            <div className="px-6 mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('nav.protocol')}</p>
            </div>
            <NavItem id="dashboard" icon={LayoutGrid} label={t('nav.dashboard')} />
            <NavItem id="manage" icon={BookOpen} label={t('nav.manage')} />

            <div className="px-6 mt-10 mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('nav.preferences')}</p>
            </div>
            <NavItem id="settings" icon={Settings} label={t('nav.settings')} />

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="w-full mt-4 flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-primary group"
            >
              <Languages size={22} className="group-hover:rotate-12 transition-transform" />
              <div className="flex flex-col items-start translate-y-px">
                <span className="font-bold tracking-tight">{lang === 'zh' ? 'Mandarin (ZH)' : 'English (EN)'}</span>
                <span className="text-[8px] font-black uppercase tracking-widest opacity-50">{t('nav.dashboard') === '神经网络仪表盘' ? '切换为英文' : 'Switch to Chinese'}</span>
              </div>
            </button>
          </nav>
        </div>

        {/* User Card / Footer */}
        <div className="p-6">
          <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black italic shadow-inner">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate uppercase tracking-tight">{user?.email?.split('@')[0]}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">Neural Tier 1</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-950 text-slate-400 hover:text-accent rounded-xl border border-slate-100 dark:border-slate-800 transition-colors shadow-sm text-[10px] font-black uppercase tracking-widest"
            >
              <LogOut size={14} /> {t('nav.logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen relative overflow-y-auto">
        <div className="max-w-[1600px] mx-auto min-h-full">
          {activeView === 'dashboard' && <StudyView lang={lang} />}
          {activeView === 'manage' && <ManageView lang={lang} />}
          {activeView === 'settings' && (
            <div className="h-full flex items-center justify-center p-20 text-center">
              <div>
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Settings size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">System Core Configuration</h2>
                <p className="text-slate-500 font-medium">Neural settings are currently undergoing optimization. Check back soon for tier 2 unlocks.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
