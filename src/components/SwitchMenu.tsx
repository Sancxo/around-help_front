import { MouseEventHandler, ReactElement } from "react";
import { Link } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import Menu from "./Menu";

export default function SwitchMenu({ logOut, isDesktop, isMobileMenuOpen, setIsMobileMenuOpen }: {
    logOut: MouseEventHandler<HTMLAnchorElement>,
    isDesktop: boolean,
    isMobileMenuOpen: boolean,
    setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement {

    return (
        <nav>
            <div className="container mt-05">
                <div className="row">
                    <h1 className="column logo mb-0">
                        <Link to="/" title="Home" onClick={() => setIsMobileMenuOpen(false)}>AroundHelp</Link>
                    </h1>
                    {isDesktop ?
                        <Menu logOut={logOut} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                        :
                        <MobileMenu logOut={logOut} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                    }
                </div>
            </div >
        </nav >
    )
}