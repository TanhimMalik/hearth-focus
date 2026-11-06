import { ChevronRight, Leaf, LockKeyhole, Plus, ShieldCheck, Target } from "lucide-react";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  onNewSession: () => void;
};

export default function AppShell({ children, onNewSession }: AppShellProps) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#focus">Skip to focus timer</a>
      <aside className="sidebar" aria-label="Workspace navigation">
        <a className="brand" href="#focus" aria-label="Hearth Focus home">
          <span className="brand-icon"><Leaf size={23} strokeWidth={1.5} /></span>
          <span>hearth<span className="brand-dot">.</span></span>
        </a>
        <p className="workspace-label">Focus workspace</p>
        <button className="new-session" onClick={onNewSession} title="Reset the timer to 25 minutes">
          <Plus size={17} /> New session
        </button>
        <nav aria-label="Main navigation">
          <a className="nav-link active" href="#focus" aria-current="page">
            <Target size={19} strokeWidth={1.5} /> Focus
          </a>
        </nav>
        <div className="sidebar-guide">
          <p className="eyebrow">A small ritual</p>
          <ol>
            <li><span>01</span> Choose one thing.</li>
            <li><span>02</span> Give it a little space.</li>
            <li><span>03</span> Take a breath afterward.</li>
          </ol>
        </div>
        <div className="sidebar-bottom">
          <div className="privacy-note">
            <ShieldCheck size={21} strokeWidth={1.5} />
            <div><strong>Yours, and only yours.</strong><p>A quiet moment on this device.</p></div>
          </div>
          <div className="workspace-status"><span /> Local workspace <LockKeyhole size={11} /></div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <span>Your space</span><ChevronRight size={13} /><strong>Focus</strong>
          </nav>
          <span className="local-pill"><span /> On this device</span>
        </header>
        <main id="focus" tabIndex={-1}>{children}</main>
        <footer className="app-footer">
          <span><Leaf size={13} strokeWidth={1.5} /> A little more present.</span>
          <span>One thing at a time</span>
        </footer>
      </div>
    </div>
  );
}
