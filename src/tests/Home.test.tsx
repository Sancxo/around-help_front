import { render, screen } from "@testing-library/react"
import Home from "../pages/Home"
import { MemoryRouter } from "react-router-dom"
import AppProvider from "../shared/context"

describe("Home", () => {
  it('should return a "Login" button', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <Home />
        </AppProvider>
      </MemoryRouter>
    )

    expect(screen.getByText('Log in')).toBeTruthy();
  })
})