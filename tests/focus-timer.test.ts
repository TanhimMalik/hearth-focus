import { describe, expect, it } from "vitest";
import { FOCUS_DURATION_MS, formatRemainingTime, initialTimerState, timerReducer } from "../lib/focus-timer";

describe("focus timer", () => {
  it("uses elapsed time rather than the number of ticks", () => {
    const running = timerReducer(initialTimerState(), { type: "start", now: 1000 });
    const delayedTick = timerReducer(running, { type: "tick", now: 91_000 });
    expect(delayedTick.remainingMs).toBe(FOCUS_DURATION_MS - 90_000);
    expect(formatRemainingTime(delayedTick.remainingMs)).toBe("23:30");
  });

  it("preserves partial seconds through pause and resume", () => {
    let state = timerReducer(initialTimerState(), { type: "start", now: 0 });
    state = timerReducer(state, { type: "pause", now: 5500 });
    expect(state.status).toBe("paused");
    expect(state.remainingMs).toBe(FOCUS_DURATION_MS - 5500);
    expect(timerReducer(state, { type: "tick", now: 180_000 })).toBe(state);
    state = timerReducer(state, { type: "start", now: 180_000 });
    state = timerReducer(state, { type: "tick", now: 180_500 });
    expect(formatRemainingTime(state.remainingMs)).toBe("24:54");
  });

  it("completes after sleep or a delayed callback and can start again", () => {
    const running = timerReducer(initialTimerState(), { type: "start", now: 0 });
    const complete = timerReducer(running, { type: "tick", now: FOCUS_DURATION_MS + 60_000 });
    expect(complete).toEqual({ status: "complete", remainingMs: 0, endsAt: null });
    expect(timerReducer(complete, { type: "start", now: 2_000_000 })).toEqual({
      status: "running", remainingMs: FOCUS_DURATION_MS, endsAt: 2_000_000 + FOCUS_DURATION_MS,
    });
  });

  it("marks an expired session complete even when pause happens before the next tick", () => {
    const running = timerReducer(initialTimerState(), { type: "start", now: 100 });
    expect(timerReducer(running, { type: "pause", now: FOCUS_DURATION_MS + 100 }).status).toBe("complete");
  });

  it("resets the deadline and stops a running session", () => {
    const running = timerReducer(initialTimerState(), { type: "start", now: 0 });
    const reset = timerReducer(running, { type: "reset" });
    expect(reset).toEqual(initialTimerState());
    expect(timerReducer(reset, { type: "tick", now: FOCUS_DURATION_MS * 2 })).toBe(reset);
  });

  it("does not restart an already running timer", () => {
    const running = timerReducer(initialTimerState(), { type: "start", now: 0 });
    expect(timerReducer(running, { type: "start", now: 1000 })).toBe(running);
  });
});
