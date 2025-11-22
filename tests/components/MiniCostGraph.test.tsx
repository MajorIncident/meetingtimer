import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MiniCostGraph } from "@/components/MiniCostGraph";
import { type CostHistoryPoint } from "@/hooks/useMeetingTimer";

describe("MiniCostGraph", () => {
  it("shows a placeholder until enough samples exist", () => {
    render(<MiniCostGraph history={[]} />);

    expect(screen.getByText("Cost over time")).toBeInTheDocument();
    expect(screen.getByText("Not enough data yet")).toBeInTheDocument();
  });

  it("renders a polyline when history data is provided", () => {
    const history: CostHistoryPoint[] = [
      { elapsedSeconds: 1, totalCost: 1, costPerSecond: 1 },
      { elapsedSeconds: 2, totalCost: 2, costPerSecond: 1 },
      { elapsedSeconds: 3, totalCost: 3, costPerSecond: 1 },
    ];

    render(<MiniCostGraph history={history} />);

    const graph = screen.getByRole("img", { name: /mini cost graph/i });
    const polyline = within(graph).getByRole("presentation", { hidden: true });

    expect(graph.tagName.toLowerCase()).toBe("svg");
    expect(polyline.tagName.toLowerCase()).toBe("polyline");
  });
});
