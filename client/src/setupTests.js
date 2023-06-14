import { render } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  const { queryByText } = render(<App />);
  const linkElement = queryByText(/learn react/i);

  // Assert that the element is either found or null
  expect(linkElement).toBeInTheDocument();

  if (linkElement) {
    // Additional assertions when the element is found
    expect(linkElement).toHaveTextContent(/learn react/i);
    // Add more assertions if needed
  }
});
