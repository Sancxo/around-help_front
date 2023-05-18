import React, { MouseEventHandler, ReactComponentElement } from "react";
import Menu from "./Menu";
import { useMenu } from "../shared/hooks";

export default function MobileMenu({ logOut }: {
  logOut: MouseEventHandler<HTMLAnchorElement>
}): ReactComponentElement<React.JSXElementConstructor<HTMLDivElement>, Pick<React.ComponentProps<React.JSXElementConstructor<HTMLDivElement>>, keyof HTMLDivElement>> {
  const { isMenuOpen, toggleMenu } = useMenu();

  return (
    <div className="flex align-center" data-testid="mobile-menu">
      <button type="button" onClick={() => toggleMenu(!isMenuOpen)} className="menu-icon flex align-center mb-0">
        {isMenuOpen ?
          // Cross icon
          <svg className="w-3 h-3" fill="#fff" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          :
          // Hamburger icon
          <svg className="w-3 h-3" fill="#fff" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
        }
      </button>
      {isMenuOpen && <Menu logOut={logOut} />}
    </div >
  )
}