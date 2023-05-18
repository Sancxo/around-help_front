import { ReactElement, useContext } from "react";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import Menu from "./Menu";
import { useMenu } from "../shared/hooks";
import { signOut } from "../shared/helpers/user.helper";
import { AddressContext, FlashMessageContext, UserContext } from "../shared/context";
import { getFlash } from "../shared/helpers/misc.helper";

export default function Header({ isDesktop }: {
    isDesktop: boolean
}): ReactElement {
    const { setUser } = useContext(UserContext);
    const { setAddress } = useContext(AddressContext);
    const { setFlashMessage } = useContext(FlashMessageContext);
    const { toggleMenu } = useMenu();

    async function logOut() {
        signOut(setUser, setAddress)
            .then(resp => getFlash(setFlashMessage, resp));
    }

    return (
        <nav>
            <div className="container mt-05">
                <div className="row">
                    <h1 className="column logo mb-0">
                        <Link to="/" title="Home" onClick={() => toggleMenu(false)}>AroundHelp</Link>
                    </h1>
                    {isDesktop ?
                        <Menu logOut={logOut} />
                        :
                        <MobileMenu logOut={logOut} />
                    }
                </div>
            </div>
        </nav>
    )
}