import { formatRemainingTime } from "@/lib/focus-timer";

type FocusOrbProps = {
  remainingMs: number;
  running: boolean;
};

export default function FocusOrb({ remainingMs, running }: FocusOrbProps) {
  return (
    <div className={`orb-stage ${running ? "is-running" : ""}`}>
      <div className="orb-halo" aria-hidden="true" />
      <div className="orb-halo second" aria-hidden="true" />
      <span className="orbit-dot first" aria-hidden="true" />
      <span className="orbit-dot second" aria-hidden="true" />
      <div className="orb" aria-hidden="true"><div className="orb-shine" /></div>
      <div className="timer-face">
        <span className="timer-value" role="timer" aria-live="off" aria-label="Time remaining">
          {formatRemainingTime(remainingMs)}
        </span>
        <span className="timer-duration">of 25 minutes</span>
      </div>
    </div>
  );
}
