import React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import FocusWorkspace from "../components/focus-workspace";
import { FOCUS_DURATION_MS } from "../lib/focus-timer";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-05T12:00:00Z"));
});

it("starts, pauses, resumes, and resets from accessible controls", () => {
  render(<FocusWorkspace />);
  expect(screen.getByRole("timer")).toHaveTextContent("25:00");
  expect(screen.getByRole("button", { name: "Reset" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Start session" }));
  act(() => vi.advanceTimersByTime(10_000));
  expect(screen.getByRole("timer")).toHaveTextContent("24:50");
  fireEvent.click(screen.getByRole("button", { name: "Pause session" }));
  act(() => vi.advanceTimersByTime(60_000));
  expect(screen.getByRole("timer")).toHaveTextContent("24:50");
  fireEvent.click(screen.getByRole("button", { name: "Resume session" }));
  act(() => vi.advanceTimersByTime(2000));
  expect(screen.getByRole("timer")).toHaveTextContent("24:48");
  fireEvent.click(screen.getByRole("button", { name: "Reset" }));
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByRole("timer")).toHaveTextContent("25:00");
  expect(screen.getByRole("button", { name: "Start session" })).toBeInTheDocument();
});

it("catches up when a background tab becomes visible and announces completion", () => {
  render(<FocusWorkspace />);
  fireEvent.click(screen.getByRole("button", { name: "Start session" }));
  act(() => {
    vi.setSystemTime(Date.now() + FOCUS_DURATION_MS + 1000);
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(screen.getByRole("timer")).toHaveTextContent("00:00");
  expect(screen.getByRole("status")).toHaveTextContent("Session complete");
  expect(screen.getByRole("timer")).toHaveAttribute("aria-live", "off");
  fireEvent.click(screen.getByRole("button", { name: "Start again" }));
  expect(screen.getByRole("timer")).toHaveTextContent("25:00");
});

it("keeps the current intention when a new timer session is requested", () => {
  render(<FocusWorkspace />);
  fireEvent.change(screen.getByRole("textbox", { name: "Your intention" }), { target: { value: "Read a chapter" } });
  expect(within(screen.getByRole("complementary", { name: "Current focus session" })).getByText("Read a chapter")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Start session" }));
  act(() => vi.advanceTimersByTime(5000));
  fireEvent.click(screen.getByRole("button", { name: "New session" }));
  expect(screen.getByRole("timer")).toHaveTextContent("25:00");
  expect(screen.getByRole("textbox", { name: "Your intention" })).toHaveValue("Read a chapter");
});

it("cleans up running timer callbacks when the page unmounts", () => {
  const { unmount } = render(<FocusWorkspace />);
  fireEvent.click(screen.getByRole("button", { name: "Start session" }));
  expect(vi.getTimerCount()).toBeGreaterThan(0);
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
