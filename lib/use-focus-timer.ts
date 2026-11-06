"use client";

import { useEffect, useReducer } from "react";
import { initialTimerState, timerReducer } from "./focus-timer";

export function useFocusTimer() {
  const [state, dispatch] = useReducer(timerReducer, undefined, initialTimerState);

  useEffect(() => {
    if (state.status !== "running") return;
    const update = () => dispatch({ type: "tick", now: Date.now() });
    const interval = window.setInterval(update, 250);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("focus", update);
    };
  }, [state.status]);

  return {
    ...state,
    start: () => dispatch({ type: "start", now: Date.now() }),
    pause: () => dispatch({ type: "pause", now: Date.now() }),
    reset: () => dispatch({ type: "reset" }),
  };
}
