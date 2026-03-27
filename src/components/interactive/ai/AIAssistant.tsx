import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import siteData from '@/data/site.json';

const TOUR_STEPS = siteData.tourSteps;

const TOUR_COMPLETED_KEY = 'kavya-tour-completed';
const AUTO_ADVANCE_MS = 5000;

function readTourCompleted(): boolean {
  try {
    return localStorage.getItem(TOUR_COMPLETED_KEY) === 'true';
  } catch {
    return false;
  }
}

function saveTourCompleted(): void {
  try {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
  } catch {}
}

export default function AIAssistant() {
  const [tourActive, setTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speechText, setSpeechText] = useState('');
  const [speechVisible, setSpeechVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSteps = TOUR_STEPS.length;
  const isLastStep = currentStep === totalSteps - 1;

  // Scroll to the target section for the current step
  const scrollToTarget = useCallback((stepIndex: number) => {
    const step = TOUR_STEPS[stepIndex];
    const el = document.querySelector(step.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Clear any running auto-advance timer
  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceRef.current !== null) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
  }, []);

  // Schedule the next auto-advance
  const scheduleAutoAdvance = useCallback(() => {
    clearAutoAdvance();
    autoAdvanceRef.current = setTimeout(() => {
      setCurrentStep((prev) => {
        if (prev < totalSteps - 1) {
          return prev + 1;
        }
        // Last step reached via auto-advance: end tour
        return prev;
      });
    }, AUTO_ADVANCE_MS);
  }, [clearAutoAdvance, totalSteps]);

  // When the current step changes while tour is active, scroll + show text + schedule next
  useEffect(() => {
    if (!tourActive) return;

    const step = TOUR_STEPS[currentStep];
    setSpeechText(step.text);
    setSpeechVisible(true);
    scrollToTarget(currentStep);
    scheduleAutoAdvance();

    return () => {
      clearAutoAdvance();
    };
  }, [tourActive, currentStep, scrollToTarget, scheduleAutoAdvance, clearAutoAdvance]);

  const clearCompletionTimer = useCallback(() => {
    if (completionTimerRef.current !== null) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
  }, []);

  // End the tour
  const endTour = useCallback(
    (showCompletion: boolean) => {
      clearAutoAdvance();
      clearCompletionTimer();
      setTourActive(false);
      setCurrentStep(0);

      if (showCompletion) {
        setSpeechText('Tour complete! Feel free to explore on your own.');
        setSpeechVisible(true);
        saveTourCompleted();

        completionTimerRef.current = setTimeout(() => {
          setSpeechVisible(false);
        }, 3000);
      } else {
        setSpeechVisible(false);
      }
    },
    [clearAutoAdvance, clearCompletionTimer],
  );

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current !== null) clearTimeout(autoAdvanceRef.current);
      if (completionTimerRef.current !== null) clearTimeout(completionTimerRef.current);
    };
  }, []);

  // Start the tour
  const startTour = useCallback(() => {
    setCurrentStep(0);
    setTourActive(true);
  }, []);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (isLastStep) {
      endTour(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [isLastStep, endTour]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleSkip = useCallback(() => {
    endTour(false);
  }, [endTour]);

  // Orb click handler
  const handleOrbClick = useCallback(() => {
    if (tourActive) return;
    startTour();
  }, [tourActive, startTour]);

  // Hover handlers (only when not touring)
  const handleMouseEnter = useCallback(() => {
    if (tourActive) return;
    setHovered(true);
    if (readTourCompleted()) {
      setSpeechText('Welcome back! Click for another tour.');
    } else {
      setSpeechText('Click me for a guided tour!');
    }
    setSpeechVisible(true);
  }, [tourActive]);

  const handleMouseLeave = useCallback(() => {
    if (tourActive) return;
    setHovered(false);
    setSpeechVisible(false);
  }, [tourActive]);

  return (
    <div
      className="ai-assistant"
      id="ai-assistant"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`ai-orb${tourActive ? ' touring' : ''}`}
        onClick={handleOrbClick}
        role="button"
        tabIndex={0}
        aria-label="AI Assistant - click to start guided tour"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOrbClick();
          }
        }}
      >
        <div className="ai-ring" />
        <Bot size={24} />
      </div>

      <div
        className="ai-speech"
        style={{ opacity: speechVisible ? 1 : 0, pointerEvents: speechVisible ? 'auto' : 'none' }}
      >
        <p className="ai-speech-text">{speechText}</p>

        {tourActive && (
          <div className="tour-controls active">
            <button
              className="tour-btn"
              onClick={handleBack}
              disabled={currentStep === 0}
              aria-label="Previous step"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="tour-progress">
              {currentStep + 1}/{totalSteps}
            </span>

            <button
              className="tour-btn"
              onClick={handleNext}
              aria-label={isLastStep ? 'Complete tour' : 'Next step'}
            >
              {isLastStep ? <Check size={16} /> : <ChevronRight size={16} />}
            </button>

            <button
              className="tour-btn"
              onClick={handleSkip}
              aria-label="Skip tour"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
