import { ChangeEvent, Dispatch, ReactElement, SetStateAction, useContext, useState } from "react";
import { FlashMessageContext, UserContext } from "../shared/context";
import { clearFlash } from "../shared/helpers/misc.helper";
import { registerUser } from "../shared/helpers/user.helper";
import { FlashMessage, setContext } from "../shared/interfaces/misc.interfaces";
import User, { RegistrationValues } from "../shared/interfaces/user.interfaces";

export default function UserRegistration({ setIsUserCreated }: { setIsUserCreated: Dispatch<SetStateAction<boolean>> }): ReactElement {

  const [registrationValues, setRegistrationValues] = useState<RegistrationValues>({
    first_name: "",
    last_name: "",
    password: "",
    password_confirmation: "",
    email: ""
  });

  const setFlashMessage: setContext<FlashMessage> = useContext(FlashMessageContext).setFlashMessage;
  const setUser: setContext<User> = useContext(UserContext).setUser;

  function handleInputs(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setRegistrationValues(registrationValues => ({ ...registrationValues, [name]: value }));
  }

  function handleImages(e: ChangeEvent<HTMLInputElement>) {
    (e.target.id === "avatar-input") && setRegistrationValues(registrationValues => ({ ...registrationValues, 'avatar': e.target.files![0] }));
    e.target.id === "id-card-input" && setRegistrationValues(registrationValues => ({ ...registrationValues, 'id_card': e.target.files![0] }));
  }

  async function handleSubmit() {
    clearFlash(setFlashMessage);

    const userForm: any = { registrationValues };
    const userFormData = new FormData(); // we use FormData object because of images (id_card and avatar)

    for (const field in userForm.registrationValues) {
      if (Object.prototype.hasOwnProperty.call(userForm.registrationValues, field)) {
        userFormData.append(`user[${field}]`, userForm.registrationValues[field]);
      }
    }

    await registerUser(userFormData, setUser, setFlashMessage) && setIsUserCreated(true);
  }

  return (
    <form name="user-registration-form" id="user-registration" className="container">
      <h3>Register: </h3>
      <fieldset>
        <legend>About you:</legend>

        <label htmlFor="first-name-input">First name <small>(mandatory)</small>:</label>
        <input type="text" name="first_name" id="first-name-input" onChange={handleInputs} required />
        <br />

        <label htmlFor="last-name-input">Last name <small>(mandatory)</small>:</label>
        <input type="text" name="last_name" id="last-name-input" onChange={handleInputs} required />
        <br />

        <label htmlFor="email-input">Email <small>(mandatory)</small>:</label>
        <input type="email" name="email" id="email-input" onChange={handleInputs} required />
        <br />

        <label htmlFor="avatar-input">Profile picture:</label>
        <input type="file" name="avatar" id="avatar-input" accept="image/png, image/jpeg, image/gif, image/webp, image/avif" onChange={handleImages} />
        <br />

        <label htmlFor="id-card-input">Id card <small>(mandatory)</small>:</label>
        <input type="file" name="id_card" id="id-card-input" accept="application/pdf, image/png, image/jpeg, image/gif, image/webp, image/avif" onChange={handleImages} required />
        <br />

        <label htmlFor="password-input">Password <small>(mandatory)</small>:</label>
        <input type="password" name="password" id="password-input" onChange={handleInputs} required />
        <br />

        <label htmlFor="password-confirmation-input">Confirm password <small>(mandatory)</small>:</label>
        <input type="password" name="password_confirmation" id="password-confirmation-input" onChange={handleInputs} required />
        <br />

        <label htmlFor="birthdate-input">Birthdate:</label>
        <input type="date" name="birthdate" id="birthdate-input" onChange={handleInputs} />
        <br />

        <label htmlFor="about-input">About:</label>
        <textarea name="about" id="about-input" cols={30} rows={10} onChange={handleInputs} ></textarea>
        <br />

      </fieldset>

      <input type="button" className="btn-prim" value="Submit" onClick={handleSubmit} />
    </form>
  )
}