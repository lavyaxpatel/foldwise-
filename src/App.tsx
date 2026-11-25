import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, LogOut, Menu, MessageSquareText, Sparkles, Swords } from 'lucide-react';
import { NAV_ITEMS, Sidebar } from './components/Sidebar';
import { PaperConfettiBanner } from './components/PaperEffects';
import { OrigamiSVG } from './components/OrigamiSVG';
import { fetchAiHealth } from './services/aiClient';
import { FoldWiseProvider, useFoldWise } from './store/useFoldWiseStore';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AITutorPage } from './pages/AITutorPage';
import { LearnPage } from './pages/LearnPage';
import { ArenaPage } from './pages/ArenaPage';
import { KnowledgeMapPage } from './pages/KnowledgeMapPage';
import {
  AnalyticsPage,
  LeaderboardPage,
  ProfilePage,
  SettingsPage,
} from './pages/SecondaryPages';
import type { NavRoute } from './types/foldwise';

const MOBILE_BOTTOM_TABS: NavRoute[] = ['home', 'dashboard', 'tutor', 'arena', 'map'];

const FoldWiseShell: React.FC = () => {
  const {
    route,
    setRoute,
    state,
    authUser,
    authReady,
    logoutAccount,
    levelUpBanner,
    dismissLevelUp,
  } = useFoldWise();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [aiMode, setAiMode] = useState<'live' | 'simulated'>('simulated');
  const [providerLabel, setProviderLabel] = useState('Simulated Origami AI');

  useEffect(() => {
    void fetchAiHealth().then((h) => {
      setAiMode(h.mode);
      setProviderLabel(h.model);
    });
  }, []);

  if (!authReady) {
    return (
      <div className="min-h-screen washi-surface flex items-center justify-center font-mono text-xs text-charcoal/60">
        Unfolding FoldWise...
      </div>
    );
  }

  // Login gate at the start of the website
  if (!authUser) {
    return <LoginPage />;
  }

  const currentNav = NAV_ITEMS.find((n) => n.id === route) || NAV_ITEMS[0];

  return (
    <div className="min-h-screen flex flex-col md:flex-row washi-surface text-charcoal">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
        aiMode={aiMode}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Sticky Top Utility & Quick-Jump Bar */}
        <header className="sticky top-0 z-20 bg-ivory/90 backdrop-blur-md border-b border-charcoal/10 px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open menu"
              className="md:hidden p-2 -ml-1 rounded-sm border border-charcoal/15 bg-paper/60 text-charcoal"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="md:hidden flex items-center gap-2">
              <OrigamiSVG shape="crane" className="w-6 h-6" accent="#C8433A" />
              <span className="font-serif font-bold text-base">FoldWise</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-charcoal/60">
              <span>FoldWise</span>
              <span>/</span>
              <span className="text-charcoal font-semibold">{currentNav.label}</span>
              <span className="ml-2 px-2 py-0.5 bg-paper border border-charcoal/15 rounded-sm text-[11px] text-charcoal">
                {state.studentGrade}
              </span>
            </div>
          </div>

          {/* Quick-Navigation Shortcuts */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 mr-1">
              <button
                onClick={() => setRoute('tutor')}
                className={`px-2.5 py-1.5 text-xs rounded-sm border transition-colors inline-flex items-center gap-1.5 ${
                  route === 'tutor'
                    ? 'bg-charcoal text-ivory border-charcoal'
                    : 'bg-paper/60 border-charcoal/15 hover:bg-paper'
                }`}
              >
                <MessageSquareText className="w-3.5 h-3.5" /> AI Tutor
              </button>
              <button
                onClick={() => setRoute('arena')}
                className={`px-2.5 py-1.5 text-xs rounded-sm border transition-colors inline-flex items-center gap-1.5 ${
                  route === 'arena'
                    ? 'bg-charcoal text-ivory border-charcoal'
                    : 'bg-paper/60 border-charcoal/15 hover:bg-paper'
                }`}
              >
                <Swords className="w-3.5 h-3.5 text-vermilion" /> Bug Hunt
              </button>
              <button
                onClick={() => setRoute('map')}
                className={`px-2.5 py-1.5 text-xs rounded-sm border transition-colors inline-flex items-center gap-1.5 ${
                  route === 'map'
                    ? 'bg-charcoal text-ivory border-charcoal'
                    : 'bg-paper/60 border-charcoal/15 hover:bg-paper'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-dusty" /> Progress Map
              </button>
            </div>

            <span className="px-2.5 py-1 text-xs font-mono bg-gold/20 border border-gold/40 rounded-sm inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold" /> {state.xp} XP
            </span>

            <button
              onClick={() => void logoutAccount()}
              title="Log Out"
              className="px-3 py-1.5 text-xs font-medium bg-ivory border border-charcoal/20 text-charcoal rounded-sm hover:bg-vermilion hover:text-ivory hover:border-vermilion transition-colors inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </header>

        {/* Active Page Canvas */}
        <main className="flex-1 min-w-0 overflow-x-hidden pb-20 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={route}
              initial={state.settings.reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={state.settings.reducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {route === 'home' && <LandingPage />}
              {route === 'dashboard' && <DashboardPage />}
              {route === 'tutor' && <AITutorPage aiMode={aiMode} providerLabel={providerLabel} />}
              {route === 'learn' && <LearnPage />}
              {route === 'arena' && <ArenaPage />}
              {route === 'map' && <KnowledgeMapPage />}
              {route === 'leaderboard' && <LeaderboardPage />}
              {route === 'analytics' && <AnalyticsPage />}
              {route === 'profile' && <ProfilePage />}
              {route === 'settings' && (
                <SettingsPage aiMode={aiMode} providerLabel={providerLabel} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Quick-Tab Navigation */}
      <nav
        aria-label="Mobile quick tabs"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-ivory/95 backdrop-blur-md border-t border-charcoal/15 grid grid-cols-5 h-16 px-1"
      >
        {MOBILE_BOTTOM_TABS.map((id) => {
          const item = NAV_ITEMS.find((n) => n.id === id)!;
          const Icon = item.icon;
          const active = route === id;
          return (
            <button
              key={id}
              onClick={() => setRoute(id)}
              className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${
                active ? 'text-vermilion font-semibold' : 'text-charcoal/65'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>

      <PaperConfettiBanner
        message={levelUpBanner}
        onDismiss={dismissLevelUp}
        reducedMotion={state.settings.reducedMotion}
      />
    </div>
  );
};

export function App() {
  return (
    <FoldWiseProvider>
      <FoldWiseShell />
    </FoldWiseProvider>
  );
}

export default App;
