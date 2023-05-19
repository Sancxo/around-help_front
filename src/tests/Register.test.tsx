import { fireEvent, screen, waitFor } from "@testing-library/react"
import Register from "../pages/auth/Register"
import { mockPostRequest, registeredUserTest, serverEvents, userFormTest, wrapAndRenderRoute } from "./test-helpers"

const server = mockPostRequest(
  `${process.env.REACT_APP_BACKEND_URL}/users`,
  {
    message: "Signed up successfully!",
    user: registeredUserTest,
    avatar: null
  });
serverEvents(server);

describe('Register page', () => {
  it('should render registration form component', async () => {
    wrapAndRenderRoute(<Register />)

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
      expect(localStorage.getItem("connection_state")).toBe("connected")
    })
  })
})