import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MeetingTimerShell } from "@/components/MeetingTimerShell";

function getTotalCostElement() {
  const costSection = screen.getByText("Total Cost").parentElement as HTMLElement;
  return within(costSection).getByText(/^\$\d+\.\d{2}$/);
}

describe("MeetingTimerShell", () => {
  it("renders default role labels and the primary displays", () => {
    render(<MeetingTimerShell />);

    expect(screen.getByText("Senior Leader")).toBeInTheDocument();
    expect(screen.getByText("Leader / Manager")).toBeInTheDocument();
    expect(screen.getByText("Individual Contributor")).toBeInTheDocument();

    expect(screen.getByText("Time Elapsed")).toBeInTheDocument();
    expect(screen.getByText("Total Cost")).toBeInTheDocument();
  });

  it("switches from start to pause state when the timer begins", async () => {
    render(<MeetingTimerShell />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /start/i }));

    expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
  });

  it("keeps role counts after reset while clearing time and cost", async () => {
    vi.useFakeTimers();

    try {
      render(<MeetingTimerShell />);

      const roleCard =
        screen.getByText("Senior Leader").closest("div")?.parentElement as HTMLElement;
      const addButton = within(roleCard).getByRole("button", { name: /add senior leader/i });
      act(() => {
        fireEvent.click(addButton);
      });
      expect(within(roleCard).getByText("1")).toBeInTheDocument();

      const initialCost = getTotalCostElement().textContent;

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: /start/i }));
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(getTotalCostElement().textContent).not.toBe(initialCost);

      act(() => {
        fireEvent.click(screen.getByRole("button", { name: /reset/i }));
      });

      expect(screen.getByText("00:00:00")).toBeInTheDocument();
      expect(getTotalCostElement().textContent).toBe("$0.00");
      expect(within(roleCard).getByText("1")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
