import { fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "../pages/auth/Login";
import { registeredUserTest, wrapRouteAndRender, registeredAddressTest, serverEvents } from "./test-helpers";
import { setupServer } from "msw/lib/node";
import { rest } from "msw";

const successUserMessage = {
  message: "You're logged in!",
  user: registeredUserTest,
  avatar: null
}

const server = setupServer(
  rest.post(
    `${process.env.REACT_APP_BACKEND_URL}/users/sign_in`,
    (req, res, ctx) => {
      return res(ctx.json(successUserMessage));
    }),
  rest.get(
    `${process.env.REACT_APP_BACKEND_URL}/addresses/${registeredUserTest.address_id}`,
    (req, res, ctx) => {
      return res(ctx.json(registeredAddressTest));
    })
);
serverEvents(server);

describe('Login page', () => {
  it('should log user in', async () => {
    wrapRouteAndRender(<Login />);

    const emailInput: HTMLInputElement = screen.getByLabelText('Email:');
    const passwordInput: HTMLInputElement = screen.getByLabelText('Password:');

    fireEvent.change(emailInput, { target: { value: "harry.potter@hogwarts.com" } });
    expect(emailInput.value).toBe("harry.potter@hogwarts.com");

    fireEvent.change(passwordInput, { target: { value: "Levi0s4" } });
    expect(passwordInput.value).toBe("Levi0s4");

    const submitBtn = screen.getByRole('button');

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(localStorage.getItem("connection_state")).toBe("connected")
    })
  })
})