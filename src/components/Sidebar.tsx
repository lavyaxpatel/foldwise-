import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  Compass,
  Flame,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  Swords,
  Trophy,
  User,
  X,
} from 'lucide-react';
import { useFoldWise } from '../store/useFoldWiseStore';
import { getRankForXp } from '../data/curriculum';
import { OrigamiSVG } from './OrigamiSVG';
import type { NavRoute } from '../types/foldwise';

export interface NavItem {
  id: NavRoute;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'Discover' | 'Practice' | 'Progress';
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', shortLabel: 'Home', icon: Home, group: 'Discover' },
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'Sanctuary', icon: LayoutDashboard, group: 'Discover' },
  { id: 'tutor', label: 'AI Tutor', shortLabel: 'Tutor', icon: MessageSquareText, group: 'Practice' },
  { id: 'learn', label: 'Learn', shortLabel: 'Learn', icon: BookOpen, group: 'Practice' },
  { id: 'arena', label: 'Challenge Arena', shortLabel: 'Arena', icon: Swords, group: 'Practice' },
  { id: 'map', label: 'Progress Map', shortLabel: 'Map', icon: Compass, group: 'Practice' },
  { id: 'leaderboard', label: 'Leaderboard', shortLabel: 'Ranks', icon: Trophy, group: 'Progress' },
  { id: 'analytics', label: 'Analytics', shortLabel: 'Stats', icon: BarChart3, group: 'Progress' },
  { id: 'profile', label: 'Profile & Data', shortLabel: 'Profile', icon: User, group: 'Progress' },
  { id: 'settings', label: 'Settings', shortLabel: 'Settings', icon: Settings, group: 'Progress' },
];

const GROUPS: NavItem['group'][] = ['Discover', 'Practice', 'Progress'];

export const Sidebar: React.FC<{
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  aiMode: 'live' | 'simulated';
}> = ({ collapsed, onToggle, mobileOpen, onCloseMobile, aiMode }) => {
  const { route, setRoute, state, syncStatus, logoutAccount } = useFoldWise();
  const rankInfo = getRankForXp(state.xp);

  const navigate = (id: NavRoute) => {
    setRoute(id);
    onCloseMobile();
  };

  const renderNavGroups = (isCompact: boolean) => (
    <div className="space-y-4">
      {GROUPS.map((group) => (
        <div key={group} className="space-y-1">
          {!isCompact && (
            <div className="px-3 text-[10px] font-mono uppercase tracking-widest text-charcoal/45">
              {group}
            </div>
          )}
          {NAV_ITEMS.filter((item) => item.group === group).map((item) => {
            const Icon = item.icon;
            const active = route === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                title={isCompact ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-all relative ${
                  active
                    ? 'bg-charcoal text-ivory shadow-sm'
                    : 'text-charcoal/75 hover:text-charcoal hover:bg-paper/65'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-vermilion rounded-r-sm" />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-gold' : ''}`} />
                {!isCompact && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );

  const footerCard = (isCompact: boolean) =>
    !isCompact ? (
      <div className="p-3 rounded-sm bg-paper/60 border border-charcoal/10">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-charcoal/85 truncate">{state.studentName}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-ivory border border-charcoal/15 rounded-sm">
            {state.studentGrade}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-charcoal/65 mt-1">
          <span>{rankInfo.current.rank}</span>
          <span className="flex items-center gap-1 text-vermilion font-mono">
            <Flame className="w-3 h-3" /> {state.streak}d
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full bg-charcoal/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-500"
            style={{ width: `${Math.max(4, rankInfo.progressPct)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5 text-[11px] text-charcoal/65 font-mono">
          <span>{state.xp} Fold XP</span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-vermilion" />
            {aiMode === 'live' ? 'Live AI' : 'Simulated'}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-charcoal/10 flex items-center justify-between text-[11px] font-mono">
          <span className="text-charcoal/65">{syncStatus === 'synced' ? 'Synced' : 'Local'}</span>
          <button
            onClick={() => void logoutAccount()}
            className="text-vermilion hover:underline inline-flex items-center gap-1"
          >
            <LogOut className="w-3 h-3" /> Log Out
          </button>
        </div>
      </div>
    ) : (
      <button
        onClick={() => void logoutAccount()}
        title="Log Out"
        className="w-full flex flex-col items-center gap-1 text-[10px] font-mono text-charcoal/75 hover:text-vermilion"
      >
        <LogOut className="w-4 h-4" />
        <span>{state.xp}</span>
      </button>
    );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex ${
          collapsed ? 'w-[76px]' : 'w-64'
        } shrink-0 border-r border-charcoal/10 bg-ivory/95 backdrop-blur-sm flex-col justify-between transition-all duration-300 sticky top-0 h-screen z-30`}
      >
        <div>
          <div className="px-4 py-4 flex items-center justify-between border-b border-charcoal/10">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-sm bg-paper/80 border border-charcoal/15 flex items-center justify-center shrink-0">
                <OrigamiSVG shape="crane" className="w-7 h-7" accent="#C8433A" />
              </div>
              {!collapsed && (
                <div>
                  <div className="font-serif text-lg font-bold tracking-tight text-charcoal leading-none">
                    FoldWise
                  </div>
                  <div className="text-[11px] text-charcoal/60 mt-0.5">Where learning takes shape</div>
                </div>
              )}
            </button>
            <button
              onClick={onToggle}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-1.5 rounded-sm text-charcoal/60 hover:text-charcoal hover:bg-paper/60"
            >
              {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          <nav className="p-2.5 overflow-y-auto max-h-[calc(100vh-215px)]" aria-label="Primary">
            {renderNavGroups(collapsed)}
          </nav>
        </div>

        <div className="p-3 border-t border-charcoal/10">{footerCard(collapsed)}</div>
      </aside>

      {/* Mobile Slide-Over Origami Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-charcoal/40 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={state.settings.reducedMotion ? false : { x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-72 max-w-[85vw] h-full bg-ivory border-r border-charcoal/15 flex flex-col justify-between z-10 shadow-2xl"
            >
              <div>
                <div className="px-4 py-4 flex items-center justify-between border-b border-charcoal/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-sm bg-paper border border-charcoal/15 flex items-center justify-center">
                      <OrigamiSVG shape="crane" className="w-7 h-7" accent="#C8433A" />
                    </div>
                    <div>
                      <div className="font-serif text-lg font-bold leading-none">FoldWise</div>
                      <div className="text-[11px] text-charcoal/60 mt-0.5">{state.studentGrade}</div>
                    </div>
                  </div>
                  <button
                    onClick={onCloseMobile}
                    aria-label="Close navigation menu"
                    className="p-2 text-charcoal/70 hover:text-charcoal rounded-sm hover:bg-paper/60"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="p-3 overflow-y-auto max-h-[calc(100vh-225px)]" aria-label="Mobile navigation">
                  {renderNavGroups(false)}
                </nav>
              </div>

              <div className="p-3 border-t border-charcoal/10">{footerCard(false)}</div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
