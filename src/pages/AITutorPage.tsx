import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Send, Sparkles } from 'lucide-react';
import { OrigamiSVG } from '../components/OrigamiSVG';
import { sendTutorMessage } from '../services/aiClient';
import { useFoldWise } from '../store/useFoldWiseStore';
import type { TutorQuickAction } from '../types/foldwise';

const QUICK_ACTIONS: TutorQuickAction[] = [
  'Simplify this',
  'Give me an example',
  'Explain step by step',
  'Test my knowledge',
  'Give me a hint',
  'Summarise this',
  'Explain my mistake',
];

export const AITutorPage: React.FC<{ aiMode: 'live' | 'simulated'; providerLabel: string }> = ({
  aiMode,
  providerLabel,
}) => {
  const { state, appendTutorMessage, awardXp, selectedTopicId } = useFoldWise();
  const activeTopic = state.topics.find((t) => t.id === selectedTopicId) || state.topics[0];

  const [input, setInput] = useState('');
  const [topicInput, setTopicInput] = useState(activeTopic.title);
  const [loading, setLoading] = useState(false);

  const handleSend = async (customMessage?: string, action?: TutorQuickAction) => {
    const promptText = (customMessage ?? input).trim();
    if (!promptText && !action) return;

    const finalText = promptText || `${action} on ${topicInput}`;
    if (!customMessage) setInput('');

    appendTutorMessage({
      id: `user-${Date.now()}`,
      role: 'user',
      text: action ? `[${action}] ${finalText}` : finalText,
      timestamp: new Date().toISOString(),
    });

    setLoading(true);
    const reply = await sendTutorMessage({
      message: finalText,
      action,
      topic: topicInput,
      difficulty: state.difficulty,
      persona: state.settings.tutorPersona,
      grade: state.studentGrade,
    });
    setLoading(false);

    appendTutorMessage({
      id: `tutor-${Date.now()}`,
      role: 'tutor',
      text: `Unfolded ${reply.folds.length} steps for ${topicInput}:`,
      folds: reply.folds,
      reflectionPrompt: reply.reflectionPrompt,
      weakConceptDetected: reply.weakConceptDetected,
      mode: reply.mode,
      provider: reply.provider,
      timestamp: new Date().toISOString(),
    });
    awardXp(15, 'Tutor Fold');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="paper-card rounded-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            animate={state.settings.reducedMotion ? undefined : { rotate: [0, -3, 3, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="p-2.5 bg-paper/70 border border-charcoal/15 rounded-sm"
          >
            <OrigamiSVG
              shape={state.settings.tutorPersona}
              className="w-12 h-12"
              accent="#D9534F"
            />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                Origami {state.settings.tutorPersona === 'fox' ? 'Kitsune' : 'Crane'} Tutor
              </h1>
              <span
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-sm border ${
                  aiMode === 'live'
                    ? 'bg-sage/25 border-sage text-charcoal'
                    : 'bg-gold/20 border-gold/50 text-charcoal'
                }`}
              >
                {aiMode === 'live' ? `Live AI (${providerLabel})` : 'Simulated AI Mode'}
              </span>
            </div>
            <p className="text-sm text-charcoal/70 mt-0.5">
              Tailored for <strong>{state.studentGrade}</strong> • Current tier:{' '}
              <strong>{state.difficulty}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-charcoal/60" htmlFor="tutor-topic">
            Topic:
          </label>
          <select
            id="tutor-topic"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            className="px-3 py-1.5 text-sm bg-ivory border border-charcoal/20 rounded-sm"
          >
            {state.topics.map((t) => (
              <option key={t.id} value={t.title}>
                {t.title} ({t.subject})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conversation Unfolding Cards */}
      <div className="space-y-4">
        {state.tutorHistory.map((msg) =>
          msg.role === 'user' ? (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-xl bg-charcoal text-ivory px-4 py-3 rounded-sm text-sm shadow-paper">
                {msg.text}
              </div>
            </div>
          ) : (
            <motion.div
              key={msg.id}
              initial={state.settings.reducedMotion ? false : { opacity: 0, y: 12, rotateX: -8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.35 }}
              className="paper-card rounded-sm p-5 space-y-4"
            >
              <div className="flex items-center justify-between text-xs font-mono text-charcoal/55">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-vermilion" />
                  {msg.provider || 'FoldWise AI'} • {msg.mode === 'live' ? 'Live LLM' : 'Simulated'}
                </span>
                {msg.weakConceptDetected && (
                  <span className="inline-flex items-center gap-1 text-vermilion">
                    <AlertCircle className="w-3.5 h-3.5" /> Weak crease: {msg.weakConceptDetected}
                  </span>
                )}
              </div>

              {msg.folds && msg.folds.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-3">
                  {msg.folds.map((fold, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-paper/55 border border-charcoal/10 rounded-sm space-y-1.5"
                    >
                      <div className="font-serif font-bold text-charcoal text-base">{fold.title}</div>
                      <p className="text-sm text-charcoal/85 leading-relaxed">{fold.content}</p>
                      <div className="text-xs font-mono text-charcoal/65 pt-1 border-t border-charcoal/10">
                        Crease Tip: {fold.creaseTip}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-charcoal/85">{msg.text}</p>
              )}

              {msg.reflectionPrompt && (
                <div className="p-3 bg-dusty/15 border-l-2 border-dusty text-sm text-charcoal">
                  <strong>Explain your reasoning:</strong> {msg.reflectionPrompt}
                </div>
              )}
            </motion.div>
          )
        )}

        {loading && (
          <div className="paper-card rounded-sm p-4 text-sm font-mono text-charcoal/70">
            Creasing paper folds...
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="paper-card rounded-sm p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              disabled={loading}
              onClick={() => handleSend(input || `Help me with ${topicInput}`, action)}
              className="px-3 py-1.5 text-xs font-medium bg-paper/75 border border-charcoal/15 rounded-sm hover:bg-charcoal hover:text-ivory transition-colors disabled:opacity-50"
            >
              {action}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or explain your reasoning..."
            className="flex-1 px-4 py-2.5 bg-ivory border border-charcoal/20 rounded-sm text-sm focus:outline-none focus:border-charcoal"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-charcoal text-ivory text-sm font-medium rounded-sm hover:bg-vermilion transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            Unfold <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
