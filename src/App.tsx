import { ComponentType, lazy, ReactElement, Suspense, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import Header from "./components/Header";
import Flash from './components/Flash';
import { defaultUser, signInWithToken } from './shared/helpers/user.helper';
import { AddressContext, FlashMessageContext, UserContext } from './shared/context';
import { Address, FlashMessage, setContext } from './shared/interfaces/misc.interfaces';
import User from './shared/interfaces/user.interfaces';
import { useJsApiLoader } from '@react-google-maps/api';
import { useMenu } from './shared/hooks';

const Home = lazy((): Promise<{ default: ComponentType<any> }> => import('./pages/Home'));
const Register = lazy((): Promise<{ default: ComponentType<any> }> => import('./pages/auth/Register'));
const Login = lazy((): Promise<{ default: ComponentType<any> }> => import('./pages/auth/Login'));
const UserProfile = lazy((): Promise<{ default: ComponentType<any> }> => import('./pages/user/UserProfile'));
const EditProfile = lazy((): Promise<{ default: ComponentType<any> }> => import('./pages/user/EditProfile'));
const Needs = lazy((): Promise<{ default: ComponentType<any> }> => import('./pages/needs/Needs'));
const CreateNeed = lazy((): Promise<{ default: ComponentType<any> }> => import('./pages/needs/CreateNeed'));
const ShowNeed = lazy((): Promise<{ default: ComponentType<any> }> => import('./pages/needs/ShowNeed'));
const MessageBox = lazy((): Promise<{ default: ComponentType<any> }> => import('./pages/chat/MessageBox'));
const Conversation = lazy((): Promise<{ default: ComponentType<any> }> => import('./pages/chat/Conversation'));

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization' | 'localContext')[] = ['places'];

export function isUserLoggedIn(route: ReactElement) {
  return localStorage.getItem("connection_state") === "connected" ? route : <Navigate to="/" />;
}

function App(): ReactElement {
  // Media queries sizes based on Milligram library 
  const mediaQueryTablet: MediaQueryList = window.matchMedia("(min-width: 400px)");
  const mediaQueryDesktop: MediaQueryList = window.matchMedia("(min-width: 800px)");

  // Context
  const setUser: setContext<User> = useContext(UserContext).setUser;
  const { flashMessage, setFlashMessage }: { flashMessage: FlashMessage, setFlashMessage: setContext<FlashMessage> } = useContext(FlashMessageContext);
  const setAddress: setContext<Address> = useContext(AddressContext).setAddress;

  // State
  const [isDesktop, setIsDesktop] = useState(mediaQueryDesktop.matches ? true : false)
  const { isMenuOpen, toggleMenu } = useMenu();

  // Google Maps API JS Loader
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: libraries
  })

  // Used to automatically login or out the user depending on the token presence
  useEffect(() => {
    localStorage.getItem("connection_state") && signInWithToken(setUser, setAddress);
  }, [setUser, setAddress]);

  // Handle the switch between desktop or mobile menu dependeing on the mediaquery
  useEffect(() => {
    mediaQueryDesktop.addEventListener('change', _ => {
      setIsDesktop(!isDesktop);
      isDesktop && toggleMenu(false);
    })

    return mediaQueryDesktop.removeEventListener('change', _ => {
      setIsDesktop(!isDesktop);
      isDesktop && toggleMenu(false);
    });
  })

  return (
    <div className="text-center" data-testid='app-container'>
      <Router>
        <header className="App-header">
          <Header isDesktop={isDesktop} />
        </header>


        <main className={`${(isMenuOpen && mediaQueryTablet.matches) ? "pt-4" : ""}`} >
          <Suspense fallback="Loading app ...">
            <Routes>
              <Route element={<Home />} path='/' />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path="/user/:id" element={isUserLoggedIn(<UserProfile defaultUser={defaultUser} />)} />
              <Route path="/profile-edit" element={isUserLoggedIn(<EditProfile />)} />
              <Route path='/needs' element={isUserLoggedIn(<Needs isLoaded={isLoaded} />)} />
              <Route path='/new-need' element={isUserLoggedIn(<CreateNeed />)} />
              <Route path='/needs/:id' element={isUserLoggedIn(<ShowNeed />)} />
              <Route path='/messages' element={isUserLoggedIn(<MessageBox />)} />
              <Route path='/conversation/:id' element={isUserLoggedIn(<Conversation />)} />
            </Routes>
          </Suspense>
        </main>

        <Flash flashMessage={flashMessage} setFlashMessage={setFlashMessage} />

        <footer></footer>
      </Router>
    </div>
  );
}

export default App;
