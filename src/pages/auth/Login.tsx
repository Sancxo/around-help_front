import { ReactElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddressContext, FlashMessageContext, UserContext } from "../../shared/context";
import { clearFlash, getFlash } from "../../shared/helpers/misc.helper";
import { signIn } from "../../shared/helpers/user.helper";
import { Address, FlashMessage, setContext } from "../../shared/interfaces/misc.interfaces";
import User from "../../shared/interfaces/user.interfaces";

export default function Login(): ReactElement {
    const setFlashMessage: setContext<FlashMessage> = useContext(FlashMessageContext).setFlashMessage;
    const setUser: setContext<User> = useContext(UserContext).setUser;
    const setAddress: setContext<Address> = useContext(AddressContext).setAddress;

    const [email, setEmail] = useState<String>();
    const [password, setPassword] = useState<String>();

    const navigate = useNavigate();

    async function handleSubmit() {
        clearFlash(setFlashMessage);
        const resp: [symbol, string] = await signIn(email, password, setUser, setAddress, navigate);
        getFlash(setFlashMessage, resp);
    }

    return (
        <form name="login" id="login-form" className="container">
            <h3>Login:</h3>
            <fieldset>
                <label htmlFor="email-input">Email:</label>
                <input type="email" name="email" id="email-input" onChange={e => setEmail(e.target.value)} />
                <br />

                <label htmlFor="password-input">Password:</label>
                <input type="password" name="password" id="password-input" onChange={e => setPassword(e.target.value)} />
                <br />

                <input type="button" className="btn-prim" value="Login" onClick={handleSubmit} />
            </fieldset>
        </form>
    )
}