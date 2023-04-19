import React, { MouseEventHandler, ReactComponentElement, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../shared/context";

export default function Menu({ logOut, setIsMobileMenuOpen }: {
  logOut: MouseEventHandler<HTMLAnchorElement>,
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}): ReactComponentElement<React.JSXElementConstructor<HTMLDivElement>, Pick<React.ComponentProps<React.JSXElementConstructor<HTMLDivElement>>, keyof HTMLDivElement>> {
  const { pathname } = useLocation();

  const user_id: number = useContext(UserContext).user.id;

  // Pathnames
  const needs = "/needs";
  const messages = "/messages";
  const profile = `/user/${user_id}`;
  const login = "/login";
  const register = "/register";

  return (
    <div className="column flex align-center justify-end ">
      {
        user_id ?
          <div className="flex gap-3 menu">
            <Link to={profile} title="Your profile" onClick={() => setIsMobileMenuOpen(false)} className={`${pathname === profile && "active"}`}>My profile</Link >
            <Link to={needs} onClick={() => setIsMobileMenuOpen(false)} className={`${pathname === needs && "active"}`}>Needs</Link>
            <Link to={messages} onClick={() => setIsMobileMenuOpen(false)} className={`${pathname === messages && "active"}`}>Messages</Link>
            <Link to="/" onClick={e => { logOut(e); setIsMobileMenuOpen(false); }}>Log out</Link>
          </div>
          :
          <div className="flex gap-3 menu">
            <Link to={login} title="Sign in form" onClick={() => setIsMobileMenuOpen(false)} className={`${pathname === login && "active"}`}>Log in</Link>
            <Link to={register} title="Sign up form" onClick={() => setIsMobileMenuOpen(false)} className={`${pathname === register && "active"}`}>Register</Link>
          </div>
      }
    </div >
  )
}