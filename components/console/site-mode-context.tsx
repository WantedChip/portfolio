"use client";

/**
 * components/console/site-mode-context.tsx
 *
 * Global context for experience mode and sound state.
 * Every component that adds motion or audio MUST consume this context —
 * never decide independently whether to animate (agent-guidelines.md Rule 6).
 *
 * experienceMode: "full" | "calm"
 *   - "full"  → ambient motion + sound permitted
 *   - "calm"  → reduced motion, silent
 *
 * soundEnabled: boolean
 *   - Can be toggled at any time regardless of experienceMode
 *   - Separate from experienceMode so a Calm user can still opt into sound
 *
 * On mount:
 *   1. Check prefers-reduced-motion — if true, force "calm" and skip modal entirely.
 *   2. Otherwise check sessionStorage for prior calibration.
 *   3. If no prior calibration found, show the Calibration modal.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ExperienceMode = "full" | "calm";

interface SiteModeState {
  experienceMode: ExperienceMode;
  soundEnabled: boolean;
  calibrated: boolean;      // false = show modal
  setExperienceMode: (mode: ExperienceMode) => void;
  setSoundEnabled: (enabled: boolean) => void;
  calibrate: (mode: ExperienceMode, sound: boolean) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const SiteModeContext = createContext<SiteModeState | null>(null);

// ── Storage key ───────────────────────────────────────────────────────────────

const SESSION_KEY = "calibrated";

// ── Provider ──────────────────────────────────────────────────────────────────

export function SiteModeProvider({ children }: { children: ReactNode }) {
  // Start as calibrated + calm (safe default for SSR / before hydration)
  const [experienceMode, setExperienceModeState] =
    useState<ExperienceMode>("calm");
  const [soundEnabled, setSoundEnabledState] = useState(false);
  const [calibrated, setCalibratedState] = useState(true); // suppress modal during SSR

  useEffect(() => {
    // 1. Hard floor: OS-level reduced-motion preference
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      // Force calm, skip modal entirely — respect the user's OS decision
      setExperienceModeState("calm");
      setSoundEnabledState(false);
      setCalibratedState(true);
      return;
    }

    // 2. Check sessionStorage for prior calibration in this session
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const { mode, sound } = JSON.parse(stored) as {
          mode: ExperienceMode;
          sound: boolean;
        };
        setExperienceModeState(mode);
        setSoundEnabledState(sound);
        setCalibratedState(true);
      } catch {
        // Corrupted storage — show modal again
        setCalibratedState(false);
      }
    } else {
      // No prior calibration — trigger modal
      setCalibratedState(false);
    }
  }, []);

  // Called by the Calibration modal on user choice
  const calibrate = useCallback((mode: ExperienceMode, sound: boolean) => {
    setExperienceModeState(mode);
    setSoundEnabledState(sound);
    setCalibratedState(true);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ mode, sound }));
    } catch {
      // sessionStorage unavailable (private browsing extreme settings) — silently ignore
    }
  }, []);

  const setExperienceMode = useCallback((mode: ExperienceMode) => {
    setExperienceModeState(mode);
    // Persist updated choice so a page refresh remembers it
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      const existing = stored ? JSON.parse(stored) : {};
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ ...existing, mode }),
      );
    } catch {
      /* ignore */
    }
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      const existing = stored ? JSON.parse(stored) : {};
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ ...existing, sound: enabled }),
      );
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <SiteModeContext.Provider
      value={{
        experienceMode,
        soundEnabled,
        calibrated,
        setExperienceMode,
        setSoundEnabled,
        calibrate,
      }}
    >
      {children}
    </SiteModeContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useSiteMode(): SiteModeState {
  const ctx = useContext(SiteModeContext);
  if (!ctx) {
    throw new Error("useSiteMode must be used inside <SiteModeProvider>");
  }
  return ctx;
}
