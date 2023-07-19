import { fireEvent, renderHook, screen, waitFor } from "@testing-library/react";
import Register from "../pages/auth/Register";
import { registeredAddressTest, registeredUserTest, serverEvents, userFormTest, wrapAndRenderRoute } from "./test-helpers";
import { setupServer } from "msw/lib/node";
import { rest } from "msw";

const server = setupServer(
  rest.post(
    `${process.env.REACT_APP_BACKEND_URL}/users`,
    (req, res, ctx) => {
      return res(ctx.json(
        {
          message: "Signed up successfully!",
          user: registeredUserTest,
          avatar: null
        }
      ))
    }
  ),
  rest.post(
    `${process.env.REACT_APP_BACKEND_URL}/addresses`,
    (req, res, ctx) => {
      return res(ctx.json({
        address: registeredAddressTest,
        message: "Address succesfully created!"
      }), ctx.status(201))
    }
  )
);
serverEvents(server);


describe('Register page', () => {
  it('should register and log user in, then render AddressRegistration component', async () => {
    wrapAndRenderRoute(<Register />)

    // Create the script tag, set the appropriate attributes
    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;

    // Attach your callback function to the `window` object
    // @ts-ignore
    window.initMap = function () {
      // JS API is loaded and available
    };

    // Append the 'script' element to 'head'
    document.head.appendChild(script);


    const firstNameInput: HTMLInputElement = screen.getByLabelText(/First name/i);
    const lastNameInput: HTMLInputElement = screen.getByLabelText(/Last name/i);
    const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i);
    const idCardInput: HTMLInputElement = screen.getByLabelText(/Id card/i);
    const passwordInputs: HTMLInputElement[] = screen.getAllByLabelText(/Password/i);

    fireEvent.change(firstNameInput, { target: { value: userFormTest.first_name } })
    fireEvent.change(lastNameInput, { target: { value: userFormTest.last_name } })
    fireEvent.change(emailInput, { target: { value: userFormTest.email } })
    fireEvent.change(idCardInput, { target: { value: userFormTest.id_card } })
    fireEvent.change(passwordInputs[0], { target: { value: userFormTest.password } })
    fireEvent.change(passwordInputs[1], { target: { value: userFormTest.password } })

    expect(firstNameInput.value).toBe(userFormTest.first_name);
    expect(lastNameInput.value).toBe(userFormTest.last_name);
    expect(emailInput.value).toBe(userFormTest.email);
    expect(idCardInput.value).toBe(userFormTest.id_card);
    expect(passwordInputs[0].value).toBe(userFormTest.password);
    expect(passwordInputs[1].value).toBe(userFormTest.password);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(localStorage.getItem("connection_state")).toBe("connected");
    })

    const addressInput = screen.getByLabelText(/Address search engine/);
    expect(addressInput).toBeTruthy();

    renderHook(() => { return { ready: true, suggestion: { status: 'OK', data: ["Test !"] } } })
    fireEvent.change(addressInput, { target: { value: registeredAddressTest.address } });

    const addressInputValue = addressInput.getAttribute("value");

    expect(addressInputValue).toBe(registeredAddressTest.address);

    fireEvent.click(screen.getByRole('button'));
  })
})