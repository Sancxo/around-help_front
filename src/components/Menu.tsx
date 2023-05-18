import React, { MouseEventHandler, ReactComponentElement, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../shared/context";
import { useMenu } from "../shared/hooks";

export default function Menu({ logOut }: {
  logOut: MouseEventHandler<HTMLAnchorElement>
}): ReactComponentElement<React.JSXElementConstructor<HTMLDivElement>, Pick<React.ComponentProps<React.JSXElementConstructor<HTMLDivElement>>, keyof HTMLDivElement>> {
  const { pathname } = useLocation();

  const { toggleMenu } = useMenu();

  const user_id: number = useContext(UserContext).user.id;

  // Pathnames
  const needs = "/needs";
  const messages = "/messages";
  const profile = `/user/${user_id}`;
  const login = "/login";
  const register = "/register";

  return (
    <div className="column flex align-center justify-end" data-testid="desktop-menu">
      {
        user_id ?
          <div className="flex gap-3 menu">
            <Link to={profile} title="Your profile" onClick={() => toggleMenu(false)} className={`${pathname === profile && "active"}`}>My profile</Link >
            <Link to={needs} onClick={() => toggleMenu(false)} className={`${pathname === needs && "active"}`}>Needs</Link>
            <Link to={messages} onClick={() => toggleMenu(false)} className={`${pathname === messages && "active"}`}>Messages</Link>
            <Link to="/" onClick={e => { logOut(e); toggleMenu(false); }}>Log out</Link>
          </div>
          :
          <div className="flex gap-3 menu">
            <Link to={login} title="Sign in form" onClick={() => toggleMenu(false)} className={`${pathname === login && "active"}`}>Log in</Link>
            <Link to={register} title="Sign up form" onClick={() => toggleMenu(false)} className={`${pathname === register && "active"}`}>Register</Link>
          </div>
      }
    </div >
  )
}