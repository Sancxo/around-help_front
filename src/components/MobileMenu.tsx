import React, { MouseEventHandler, ReactComponentElement } from "react";
import Menu from "./Menu";

export default function MobileMenu({ logOut, isMobileMenuOpen, setIsMobileMenuOpen }: {
  logOut: MouseEventHandler<HTMLAnchorElement>,
  isMobileMenuOpen: boolean,
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}): ReactComponentElement<React.JSXElementConstructor<HTMLDivElement>, Pick<React.ComponentProps<React.JSXElementConstructor<HTMLDivElement>>, keyof HTMLDivElement>> {
  return (
    <div className="flex align-center">
      <button type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="menu-icon flex align-center mb-0">
        {isMobileMenuOpen ?
          // Cross icon
          <svg className="w-3 h-3" fill="#fff" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          :
          // Hamburger icon
          <svg className="w-3 h-3" fill="#fff" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
        }
      </button>
      {isMobileMenuOpen && <Menu logOut={logOut} setIsMobileMenuOpen={setIsMobileMenuOpen} />}
    </div >
  )
}