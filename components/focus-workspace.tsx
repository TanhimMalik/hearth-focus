"use client";

import { Check, Circle, Leaf, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import AppShell from "./app-shell";
import FocusOrb from "./focus-orb";
import { useFocusTimer } from "@/lib/use-focus-timer";
import type { TimerStatus } from "@/lib/focus-timer";

const sessionCopy: Record<TimerStatus, { title: string; message: string; label: string }> = {
  ready: {
    title: "Ready when you are.",
    message: "Choose a small intention, settle in, and begin whenever you're ready.",
    label: "Ready to begin",
  },
  running: {
    title: "A little room, just for this.",
    message: "You don't have to do everything. Just come back to the thing in front of you.",
    label: "Focusing now",
  },
  paused: {
    title: "Take your time.",
    message: "Your timer is paused. Come back when you have a little space again.",
    label: "Session paused",
  },
  complete: {
    title: "You made a little space.",
    message: "Your focus session is complete. Take a breath before choosing what comes next.",
    label: "Session complete",
  },
};

export default function FocusWorkspace() {
  const timer = useFocusTimer();
  const [intention, setIntention] = useState("");
  const copy = sessionCopy[timer.status];
  const startLabel = timer.status === "paused" ? "Resume session" : timer.status === "complete" ? "Start again" : "Start session";

  return (
    <AppShell onNewSession={timer.reset}>
      <div className="focus-layout">
        <section className="focus-content" aria-labelledby="focus-heading">
          <div className="focus-heading">
            <p className="eyebrow"><span /> Make space for what matters</p>
            <h1 id="focus-heading">A little room to focus.</h1>
            <p>One thing at a time. You&apos;ve got this.</p>
          </div>
          <div className="timer-section">
            <span className="session-mode">Deep work</span>
            <FocusOrb remainingMs={timer.remainingMs} running={timer.status === "running"} />
            <p className="orb-caption">a little less noise, a little more space</p>
            <div className="timer-controls">
              {timer.status === "running" ? (
                <button className="button primary" onClick={timer.pause}><Pause size={16} fill="currentColor" /> Pause session</button>
              ) : (
                <button className="button primary" onClick={timer.start}><Play size={16} fill="currentColor" /> {startLabel}</button>
              )}
              <button className="button secondary" onClick={timer.reset} disabled={timer.status === "ready"}>
                <RotateCcw size={15} /> Reset
              </button>
            </div>
            <p className={`session-announcement ${timer.status === "complete" ? "complete" : ""}`} role="status" aria-live="polite">
              {timer.status === "complete" ? "Session complete. Take a breath—you made time for this." : copy.label}
            </p>
          </div>
          <div className="intention-card">
            <label className="eyebrow" htmlFor="intention">Your intention</label>
            <div className="intention-input">
              <Leaf size={21} strokeWidth={1.5} />
              <textarea
                id="intention"
                value={intention}
                onChange={(event) => setIntention(event.target.value)}
                maxLength={140}
                rows={2}
                placeholder="What would you like to make space for?"
                aria-describedby="intention-help"
              />
            </div>
            <p id="intention-help">A small thing is a good place to start. Kept in this tab for this session.</p>
          </div>
        </section>
        <aside className="session-panel" aria-label="Current focus session">
          <div className="session-panel-heading">
            <p className="eyebrow">This moment</p>
            <h2>Your session.</h2>
            <span className={`session-status ${timer.status}`}><span />{copy.label}</span>
          </div>
          <div className="session-summary">
            <div><span>Session length</span><strong>25 minutes</strong></div>
            <div><span>One intention</span><p>{intention.trim() || "A fresh page, ready for your intention."}</p></div>
          </div>
          <div className="session-steps" aria-label="Session progress">
            <div><span className={intention.trim() ? "step done" : "step"}>{intention.trim() ? <Check size={12} /> : <Circle size={10} />}</span><span>Choose one thing</span></div>
            <div><span className={timer.status === "running" || timer.status === "paused" ? "step current" : timer.status === "complete" ? "step done" : "step"}>{timer.status === "complete" ? <Check size={12} /> : <Circle size={10} />}</span><span>Give it a little time</span></div>
            <div><span className={timer.status === "complete" ? "step current" : "step"}><Circle size={10} /></span><span>Leave room for a breath</span></div>
          </div>
          <div className="gentle-note">
            <Sparkles size={21} strokeWidth={1.3} />
            <h3>{copy.title}</h3>
            <p>{copy.message}</p>
          </div>
          <p className="session-footnote">No perfect sessions required.<br />A little attention is enough.</p>
        </aside>
      </div>
    </AppShell>
  );
}
