import { render, screen } from "@testing-library/react";

import { CostDisplay } from "@/components/CostDisplay";

describe("CostDisplay", () => {
  it("shows a working year total instead of a continuous yearly total", () => {
    render(<CostDisplay totalCost={0} costPerSecond={120 / 3600} />);

    expect(screen.getByText(/\$249600\.00 \/ yr/)).toBeInTheDocument();
  });
});
