# FoldWise

> **Where learning takes shape.**  
> An origami-themed, grade-adaptive, gamified AI tutor powered by React, TypeScript, Tailwind CSS, Framer Motion, and Express + Gemini / OpenAI.

## Key Features
- **Grade-Adaptive Entry (`Grade 1` – `Grade 12` & `College`):** Unified login at startup persisting scholar progress per user (`server/data/users.json` + local fallback), starting at `0 Fold XP`.
- **Sequential AI Tutor:** Unfolding paper cards (*Folds*) with 7 Socratic quick actions and Crane/Fox personas.
- **7-Mode Origami Challenge Arena:**
  - **Bug Hunt — Broken Fold:** Find the single hidden mistake in solved Maths, Physics, Chemistry, and Programming problems.
  - **Speed Hunt — Swift Fold:** Timed rapid-fire conceptual blitz.
  - **Truth or Trap — Hidden Crease:** Unmask common misconceptions.
  - **Boss Battle — Grand Fold:** Multi-stage synthesis trials.
  - **Code Detective — Paper Trails:** Trace logic defects across paper evidence cards.
  - **Exam Mode — Silent Fold:** Timed assessment with AI hints disabled.
  - **Explain Your Reasoning — Deep Fold:** Open-ended conceptual grading.
- **Progress Map:** Interactive paper-island skill tree with red crease indicators for weak topics.
- **Live LLM + Simulated Fallback:** Uses `GEMINI_API_KEY` or `OPENAI_API_KEY` securely via the Express backend, or falls back cleanly to Simulated Origami AI.
 
