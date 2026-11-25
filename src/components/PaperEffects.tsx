import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X } from 'lucide-react';
import { OrigamiSVG } from './OrigamiSVG';

export const PaperConfettiBanner: React.FC<{
  message: string | null;
  onDismiss: () => void;
  reducedMotion?: boolean;
}> = ({ message, onDismiss, reducedMotion }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -24, rotateX: -25 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="fixed top-5 right-5 z-50 max-w-sm paper-card rounded-sm p-4 border-l-4 border-l-gold"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gold/15 rounded-sm text-gold">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-serif text-base font-semibold text-charcoal">
                Paper Birds Take Flight
              </p>
              <p className="text-sm text-charcoal/80 mt-0.5">{message}</p>
            </div>
            <button
              onClick={onDismiss}
              aria-label="Dismiss celebration"
              className="text-charcoal/50 hover:text-charcoal p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {!reducedMotion && (
            <div className="flex gap-2 mt-2 opacity-80">
              <OrigamiSVG shape="crane" className="w-6 h-6 animate-bounce" accent="#D9534F" />
              <OrigamiSVG shape="butterfly" className="w-6 h-6 animate-pulse" accent="#C5A46D" />
              <OrigamiSVG shape="crane" className="w-6 h-6 animate-bounce" accent="#8FAEC5" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
