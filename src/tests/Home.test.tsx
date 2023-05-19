import { render, screen } from "@testing-library/react"
import Home from "../pages/Home"
import { registeredUserTest, serverEvents, wrapAndRenderRoute } from "./test-helpers"
import { UserContext } from "../shared/context";
import { MemoryRouter } from "react-router-dom";
import { setupServer } from "msw/lib/node";
import { rest } from "msw";

const server = setupServer(
  rest.get(
    `${process.env.REACT_APP_BACKEND_URL}/unfulfilled_needs`,
    (req, res, ctx) => {
      return res(ctx.json(404));
    }
  )
);
serverEvents(server);

describe("Home", () => {
  it('should return a "Login" button', () => {
    wrapAndRenderRoute(<Home />);

    expect(screen.getByText('Log in')).toBeTruthy();
  });

  it('should return a button link to Needs page', async () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: registeredUserTest, setUser: (user) => user }}>
          <Home />
        </UserContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Answer to a Need')).toBeTruthy();
  })
})