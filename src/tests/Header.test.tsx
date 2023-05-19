import { fireEvent, render, screen } from "@testing-library/react"
import Header from "../components/Header"
import AppProvider from "../shared/context"
import { MemoryRouter } from "react-router-dom"

describe('Header', () => {
  it('should render desktop menu', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <Header isDesktop={true} />
        </AppProvider>
      </MemoryRouter>
    )

    expect(screen.getByTestId("desktop-menu")).toBeTruthy();
  });

  it('should render mobile menu with correct svg and then open it and close it', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <Header isDesktop={false} />
        </AppProvider>
      </MemoryRouter>
    )

    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeTruthy();

    const button = screen.getByRole('button');
    // expected to be an "hamburger" svg icon
    expect(button.innerHTML).toBe('<svg class="w-3 h-3" fill="#fff" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>')

    fireEvent.click(button);
    // expected to be a "times" cross svg icon
    expect(button.innerHTML).toBe('<svg class="w-3 h-3" fill="#fff" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>')

    fireEvent.click(button);
    // again expected to be an "hamburger" svg icon
    expect(button.innerHTML).toBe('<svg class="w-3 h-3" fill="#fff" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>')
  });
})