import { ReactElement, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlashMessageContext, TokenContext, UserContext } from "../../shared/context";
import { clearFlash, getFlash } from "../../shared/helpers/misc.helper";
import { defaultUser, updateUser } from "../../shared/helpers/user.helper";

import { RegistrationValues } from "../../shared/interfaces/user.interfaces";

export default function EditProfile(): ReactElement {
  const [registrationValues, setRegistrationValues] = useState<RegistrationValues>({
    first_name: "",
    last_name: "",
    email: "",
    // avatar: undefined,
    current_password: ""
  });
  const { user, setUser } = useContext(UserContext);
  const { token, setToken } = useContext(TokenContext);
  const setFlashMessage = useContext(FlashMessageContext).setFlashMessage;

  const [avatar, setAvatar] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const notPermittedFields = ["id", "id_card", "avatar", "password", "password_confirmation", "created_at", "updated_at"]
    for (const key in user) {
      if (!notPermittedFields.includes(key) && Object.prototype.hasOwnProperty.call(user, key)) {
        setRegistrationValues(registrationValues => ({ ...registrationValues, [key]: user[key] }))
      }
    }
  }, [setRegistrationValues, user])

  function handleInputs(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setRegistrationValues(registrationValues => ({ ...registrationValues, [name]: value }));
  }
  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const imgFile: File = e.target.files![0];
    e.target.id === "avatar-input" && setRegistrationValues(registrationValues => ({ ...registrationValues, 'avatar': imgFile }));
    setAvatar(URL.createObjectURL(imgFile));
  }

  async function handleSubmit() {
    clearFlash(setFlashMessage);

    const user: any = { registrationValues }
    const formData = new FormData();

    for (const field in user.registrationValues) {
      if (Object.prototype.hasOwnProperty.call(user.registrationValues, field)) {
        formData.append(`user[${field}]`, user.registrationValues[field]);
      }
    }
    const resp = await updateUser(formData, setUser, setFlashMessage);
    getFlash(setFlashMessage, resp);
  }

  return (
    <form name="user" id="user-infos" encType='multipart/form-data' className="container">
      <h3>Register: </h3>
      <fieldset>
        <legend>About you: </legend>

        <label htmlFor="first-name-input">First name:</label>
        <input type="text" name="first_name" id="first-name-input" value={registrationValues.first_name as string} onChange={handleInputs} />

        <label htmlFor="last-name-input">Last name:</label>
        <input type="text" name="last_name" id="last-name-input" value={registrationValues.last_name as string} onChange={handleInputs} />

        {/* <img src={`${avatar ? avatar : (user.avatar ? user.avatar : defaultUser.avatar)}`} alt="avatar" width={200} height={200} />

        <label htmlFor="avatar-input">Profile picture:</label>
        <input type="file" name="avatar" id="avatar-input" accept="image/png, image/jpeg, image/gif, image/webp, image/avif" onChange={handleImages} /> */}

        {/* <label htmlFor="birthdate-input">Birthdate:</label>
        <input type="date" name="birthdate" id="birthdate-input" value={user.birthdate } onChange={handleInputs} /> */}

        <label htmlFor="about-input">About:</label>
        <textarea name="about" id="about" cols={30} rows={10} onChange={handleInputs} value={registrationValues.about as string} ></textarea>

        <label htmlFor="email-input">Email:</label>
        <input type="email" name="email" id="email-input" value={registrationValues.email as string} onChange={handleInputs} />

        <label>Current password: <small>(mandatory)</small></label>
        <input type="password" name="current_password" id="check-password" onChange={handleInputs} />

        <input type="button" className="btn-prim" value="Submit" onClick={handleSubmit} />
      </fieldset>
    </form>
  )
}