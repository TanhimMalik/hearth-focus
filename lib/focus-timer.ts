export const FOCUS_DURATION_MS = 25 * 60 * 1000;

export type TimerStatus = "ready" | "running" | "paused" | "complete";

export type TimerState = {
  status: TimerStatus;
  remainingMs: number;
  endsAt: number | null;
};

export type TimerAction =
  | { type: "start"; now: number }
  | { type: "pause"; now: number }
  | { type: "tick"; now: number }
  | { type: "reset" };

export function initialTimerState(): TimerState {
  return { status: "ready", remainingMs: FOCUS_DURATION_MS, endsAt: null };
}

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "reset":
      return initialTimerState();
    case "start": {
      if (state.status === "running") return state;
      const remainingMs = state.status === "complete" ? FOCUS_DURATION_MS : state.remainingMs;
      return { status: "running", remainingMs, endsAt: action.now + remainingMs };
    }
    case "pause":
    case "tick": {
      if (state.status !== "running" || state.endsAt === null) return state;
      // Use the deadline, not tick counts, so a background tab cannot stretch a session.
      const remainingMs = Math.max(0, state.endsAt - action.now);
      if (remainingMs === 0) return { status: "complete", remainingMs: 0, endsAt: null };
      if (action.type === "pause") return { status: "paused", remainingMs, endsAt: null };
      return { ...state, remainingMs };
    }
  }
}

export function formatRemainingTime(remainingMs: number): string {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
