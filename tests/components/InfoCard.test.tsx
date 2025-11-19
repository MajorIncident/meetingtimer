import { render, screen } from "@testing-library/react";
import { InfoCard } from "@/components/InfoCard";

describe("InfoCard", () => {
  it("renders the provided title and content", () => {
    render(
      <InfoCard title="Timer">
        <p>Placeholder copy</p>
      </InfoCard>,
    );

    expect(screen.getByRole("heading", { name: /timer/i })).toBeVisible();
    expect(screen.getByText(/placeholder copy/i)).toBeInTheDocument();
  });
});
