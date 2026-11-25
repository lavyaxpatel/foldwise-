import React, { useRef, useState } from 'react';
import {
  Award,
  Check,
  Download,
  Flame,
  RotateCcw,
  Sparkles,
  Trash2,
  Trophy,
  Upload,
} from 'lucide-react';
import {
  getRankForXp,
  GRADE_LEVELS,
  LEADERBOARD_PEERS,
  PAPER_SKINS,
  RANK_THRESHOLDS,
} from '../data/curriculum';
import { useFoldWise } from '../store/useFoldWiseStore';
import type { GradeLevel } from '../types/foldwise';

export const LeaderboardPage: React.FC = () => {
  const { state } = useFoldWise();
  const myRank = getRankForXp(state.xp).current.rank;
  const completedCount = state.topics.filter((t) => t.status === 'completed').length;

  const board = [
    ...LEADERBOARD_PEERS,
    {
      name: `${state.studentName} (You)`,
      rank: myRank,
      xp: state.xp,
      streak: state.streak,
      models: completedCount,
      isMe: true,
    },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-8 space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-widest text-gold">
          Artisan Standings
        </div>
        <h1 className="font-display text-4xl sm:text-5xl mt-1">FoldWise Leaderboard</h1>
        <p className="text-charcoal/75 mt-1">
          Ranking rewards conceptual mastery, deep explanations, and steady daily streaks.
        </p>
      </div>

      <div className="paper-card rounded-sm overflow-x-auto">
        <table className="w-full min-w-[540px] text-left text-sm">
          <thead className="bg-paper/75 border-b border-charcoal/10 text-xs font-mono uppercase">
            <tr>
              <th className="py-3.5 px-4">#</th>
              <th className="py-3.5 px-4">Scholar</th>
              <th className="py-3.5 px-4">Rank</th>
              <th className="py-3.5 px-4">Streak</th>
              <th className="py-3.5 px-4">Topics</th>
              <th className="py-3.5 px-4 text-right">Fold XP</th>
            </tr>
          </thead>
          <tbody>
            {board.map((row, idx) => (
              <tr
                key={row.name}
                className={`border-b border-charcoal/10 ${
                  'isMe' in row && row.isMe ? 'bg-gold/15 font-semibold' : ''
                }`}
              >
                <td className="py-3.5 px-4 font-mono">{idx + 1}</td>
                <td className="py-3.5 px-4 flex items-center gap-2">
                  {idx === 0 && <Trophy className="w-4 h-4 text-gold" />}
                  {row.name}
                </td>
                <td className="py-3.5 px-4">{row.rank}</td>
                <td className="py-3.5 px-4 font-mono">
                  <span className="inline-flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-vermilion" /> {row.streak}d
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono">{row.models}</td>
                <td className="py-3.5 px-4 text-right font-mono">{row.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AnalyticsPage: React.FC = () => {
  const { state } = useFoldWise();
  const avgAcc =
    state.accuracyHistory.length > 0
      ? Math.round(
          state.accuracyHistory.reduce((a, b) => a + b, 0) / state.accuracyHistory.length
        )
      : null;

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-8 space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-widest text-dusty">
          Adaptive Telemetry • {state.studentGrade}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl mt-1">Learning Analytics</h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div className="paper-card rounded-sm p-5">
          <div className="text-xs font-mono text-charcoal/60">ROLLING ACCURACY</div>
          <div className="font-serif text-3xl font-bold mt-2">
            {avgAcc !== null ? `${avgAcc}%` : '—'}
          </div>
        </div>
        <div className="paper-card rounded-sm p-5">
          <div className="text-xs font-mono text-charcoal/60">ADAPTIVE LEVEL</div>
          <div className="font-serif text-2xl font-bold mt-2">{state.difficulty}</div>
        </div>
        <div className="paper-card rounded-sm p-5">
          <div className="text-xs font-mono text-charcoal/60">SILENT FOLD EXAM BEST</div>
          <div className="font-serif text-3xl font-bold mt-2">
            {state.examBestScore !== null ? `${state.examBestScore}%` : '—'}
          </div>
        </div>
      </div>

      <div className="paper-card rounded-sm p-6">
        <h2 className="font-serif text-2xl font-bold mb-4">Accuracy Trajectory</h2>
        {state.accuracyHistory.length === 0 ? (
          <p className="text-sm text-charcoal/65">
            Complete your first Challenge Arena round to start plotting accuracy telemetry.
          </p>
        ) : (
          <div className="flex items-end gap-4 h-40">
            {state.accuracyHistory.map((acc, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                <span className="text-[11px] font-mono">{acc}%</span>
                <div
                  className="w-full bg-sage/85 border border-charcoal/15 rounded-t-sm"
                  style={{ height: `${acc}%` }}
                />
                <span className="text-[10px] font-mono text-charcoal/55">S{i + 1}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="paper-card rounded-sm p-6">
        <h2 className="font-serif text-2xl font-bold mb-3">Arena Breakdown</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(state.challengesCompleted).map(([mode, count]) => (
            <div key={mode} className="p-3 bg-paper/50 border border-charcoal/10 rounded-sm">
              <div className="text-xs font-mono uppercase text-charcoal/60">{mode}</div>
              <div className="font-serif text-2xl font-bold mt-1">{count} wins</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const {
    state,
    unlockSkin,
    setStudentName,
    setStudentGrade,
    importUserState,
    deleteAccount,
    syncNow,
  } = useFoldWise();
  const rankInfo = getRankForXp(state.xp);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foldwise-${state.studentName.toLowerCase().replace(/\s+/g, '-')}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice('Exported stored scholar data as JSON.');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importUserState(String(reader.result || ''));
      setNotice(res.ok ? 'Imported backup into your active account.' : res.error || 'Import failed.');
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-8 space-y-6">
      <div className="paper-card rounded-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-charcoal/55">Origami Scholar Profile</div>
          <h1 className="font-serif text-3xl font-bold mt-1">{state.studentName}</h1>
          <p className="text-sm text-charcoal/70">
            {state.studentGrade} • {rankInfo.current.rank} • {state.xp} Fold XP
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={state.studentName}
            onChange={(e) => setStudentName(e.target.value)}
            aria-label="Student display name"
            className="px-3 py-2 text-sm bg-ivory border border-charcoal/20 rounded-sm"
          />
          <select
            value={state.studentGrade}
            onChange={(e) => setStudentGrade(e.target.value as GradeLevel)}
            aria-label="Student grade level"
            className="px-3 py-2 text-sm bg-ivory border border-charcoal/20 rounded-sm"
          >
            {GRADE_LEVELS.map((g) => (
              <option key={g} value={g}>
                {g === 'College' ? 'College / University' : g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rank Progression */}
      <div className="paper-card rounded-sm p-6 space-y-4">
        <h2 className="font-serif text-2xl font-bold">Rank Ladder</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RANK_THRESHOLDS.map((r) => {
            const reached = state.xp >= r.minXp;
            return (
              <div
                key={r.rank}
                className={`p-3.5 rounded-sm border ${
                  reached ? 'bg-sage/20 border-sage' : 'bg-paper/45 border-charcoal/10 opacity-70'
                }`}
              >
                <div className="font-serif font-bold">{r.rank}</div>
                <div className="text-xs font-mono text-charcoal/65">
                  {r.minXp} XP • {r.badge}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collectible Paper Skins */}
      <div className="paper-card rounded-sm p-6 space-y-4">
        <h2 className="font-serif text-2xl font-bold">Collectible Paper Skins</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {PAPER_SKINS.map((skin) => {
            const unlocked = state.unlockedSkins.includes(skin.id);
            const active = state.settings.activeSkin === skin.id;
            return (
              <div
                key={skin.id}
                className="p-4 bg-paper/45 border border-charcoal/15 rounded-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-sm border border-charcoal/25 shrink-0"
                    style={{ backgroundColor: skin.swatch }}
                  />
                  <div>
                    <div className="font-semibold text-sm">{skin.name}</div>
                    <div className="text-xs text-charcoal/65">{skin.subtitle}</div>
                  </div>
                </div>
                <button
                  onClick={() => unlockSkin(skin.id, skin.unlockCostXp)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-sm ${
                    active
                      ? 'bg-charcoal text-ivory'
                      : unlocked
                      ? 'bg-ivory border border-charcoal/20'
                      : 'bg-paper border border-charcoal/15 text-charcoal/60'
                  }`}
                >
                  {active ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  ) : unlocked ? (
                    'Equip'
                  ) : (
                    `Unlock (${skin.unlockCostXp} XP)`
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stored Data Management */}
      <div className="paper-card rounded-sm p-6 space-y-4">
        <h2 className="font-serif text-2xl font-bold">Manage Stored Account Data</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              void syncNow();
              setNotice('Synced progress to your saved scholar record.');
            }}
            className="px-4 py-2 text-xs font-mono bg-paper border border-charcoal/20 rounded-sm hover:bg-charcoal hover:text-ivory inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Sync Now
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-xs font-mono bg-paper border border-charcoal/20 rounded-sm hover:bg-charcoal hover:text-ivory inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-xs font-mono bg-paper border border-charcoal/20 rounded-sm hover:bg-charcoal hover:text-ivory inline-flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" /> Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => void deleteAccount()}
            className="px-4 py-2 text-xs font-mono border border-vermilion text-vermilion rounded-sm hover:bg-vermilion hover:text-ivory inline-flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Account Data
          </button>
        </div>
        {notice && <p className="text-xs font-mono text-sage">{notice}</p>}
      </div>

      {/* Badges */}
      <div className="paper-card rounded-sm p-6">
        <h2 className="font-serif text-2xl font-bold mb-3">Achievement Badges</h2>
        {state.badges.length === 0 ? (
          <p className="text-sm text-charcoal/65">
            No badges unfolded yet — earn your first Fold XP in the Arena or AI Tutor!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {state.badges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold/20 border border-gold/50 rounded-sm text-xs font-medium"
              >
                <Award className="w-3.5 h-3.5 text-gold" /> {b}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const SettingsPage: React.FC<{
  aiMode: 'live' | 'simulated';
  providerLabel: string;
}> = ({ aiMode, providerLabel }) => {
  const { state, updateSettings, resetProgress } = useFoldWise();

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-6 py-8 space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-widest text-charcoal/55">
          Studio Preferences
        </div>
        <h1 className="font-display text-4xl sm:text-5xl mt-1">Settings</h1>
      </div>

      <div className="paper-card rounded-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">AI Tutor Persona</div>
            <div className="text-xs text-charcoal/65">
              Choose the origami guide that leads your unfolding sessions
            </div>
          </div>
          <select
            value={state.settings.tutorPersona}
            onChange={(e) =>
              updateSettings({ tutorPersona: e.target.value as 'crane' | 'fox' })
            }
            className="px-3 py-2 text-sm bg-ivory border border-charcoal/20 rounded-sm"
          >
            <option value="crane">Origami Crane (Tsuru)</option>
            <option value="fox">Origami Fox (Kitsune)</option>
          </select>
        </div>

        <div className="crease-divider" />

        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Reduced Motion</div>
            <div className="text-xs text-charcoal/65">
              Minimise floating motion and folding animations
            </div>
          </div>
          <input
            type="checkbox"
            checked={state.settings.reducedMotion}
            onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
            className="w-4 h-4 accent-charcoal"
          />
        </div>

        <div className="crease-divider" />

        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Daily Learning Goal (minutes)</div>
            <div className="text-xs text-charcoal/65">Target daily practice time</div>
          </div>
          <input
            type="number"
            min={10}
            max={120}
            value={state.settings.dailyGoalMinutes}
            onChange={(e) => updateSettings({ dailyGoalMinutes: Number(e.target.value) || 30 })}
            className="w-24 px-3 py-1.5 text-sm bg-ivory border border-charcoal/20 rounded-sm font-mono"
          />
        </div>
      </div>

      <div className="paper-card rounded-sm p-6 space-y-3">
        <div className="flex items-center gap-2 font-serif text-xl font-bold">
          <Sparkles className="w-4 h-4 text-vermilion" /> Secure Backend LLM Connection
        </div>
        <p className="text-sm text-charcoal/75">
          Status: <strong>{aiMode === 'live' ? `Live (${providerLabel})` : 'Simulated AI Fallback'}</strong>.
          API keys are never stored in browser code — configure <code>GEMINI_API_KEY</code> or{' '}
          <code>OPENAI_API_KEY</code> in your server <code>.env</code> file.
        </p>
      </div>

      <div className="paper-card rounded-sm p-6 flex items-center justify-between">
        <div>
          <div className="font-semibold text-vermilion">Reset Local Progress</div>
          <div className="text-xs text-charcoal/65">
            Restore FoldWise XP, topics, and badges to 0 XP starter state
          </div>
        </div>
        <button
          onClick={resetProgress}
          className="px-4 py-2 text-xs font-mono border border-vermilion text-vermilion rounded-sm hover:bg-vermilion hover:text-ivory inline-flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
    </div>
  );
};
