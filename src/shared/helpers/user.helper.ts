// Handles all the functions needed to manage User login/out and registration
import axios, { AxiosResponse } from "axios";
import { NavigateFunction } from "react-router-dom";
import { Address, Error, FlashMessage, Ok, setContext } from "../interfaces/misc.interfaces";
import User from "../interfaces/user.interfaces";
import defaultUserAvatar from "../imgs/default-user.png";
import { getFlash } from "./misc.helper";
import { defaultAddress, getAddress } from "./address.helper";

const infos_user = "connection_state";

export const defaultUser: User = {
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    avatar: defaultUserAvatar
}

function setAvatarToUser(user: User, avatar: string) {
    Object.assign(user, { avatar: avatar ? process.env.REACT_APP_BACKEND_URL + avatar : null });
}

async function signIn(
    email: String | undefined,
    password: String | undefined,
    setUser: setContext<User>,
    setAddress: setContext<Address>,
    navigate: NavigateFunction
): Promise<[symbol, string]> {
    return await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/users/sign_in`, { "user": { "email": email, "password": password } }, { withCredentials: true })
        .then((resp): [symbol, string] => {
            if (resp.status === 200) {
                setAvatarToUser(resp.data.user, resp.data.avatar);

                setUserInfos(resp.data.user, setUser);

                getAddress(resp.data.user.address_id, setAddress);

                navigate(`/user/${resp.data.user.id}`);
                return [Ok, resp.data.message];
            } else {
                console.error(resp);
                return [Error, resp.data.message];
            };
        })
        .catch((err): [symbol, string] => { return [Error, err.message] });
}

async function signInWithToken(
    setUser: setContext<User>,
    setAddress: setContext<Address>
): Promise<[symbol, string]> {
    return await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/user`, { withCredentials: true })
        .then((resp): [symbol, string] => {
            if (resp.status === 200) {
                setUserInfos(resp.data.user, setUser);

                setAvatarToUser(resp.data.user, resp.data.avatar);

                resp.data.user.address_id !== null && getAddress(resp.data.user.address_id, setAddress);

                return [Ok, resp.data.message];
            } else {
                console.error(resp);
                return [Error, resp.data.message];
            }
        })
        .catch((err): [symbol, string] => { return [Error, err.message] });
}

async function registerUser(
    registrationValues: FormData,
    setUser: setContext<User>,
    setFlashMessage: setContext<FlashMessage>,
): Promise<any> {
    return await axios
        .post<FormData, AxiosResponse<any, any>>(`${process.env.REACT_APP_BACKEND_URL}/users`, registrationValues, { withCredentials: true })
        .then((resp): boolean => {
            if (resp.status === 200) {
                setAvatarToUser(resp.data.user, resp.data.avatar)

                setUserInfos(resp.data.user, setUser);

                getFlash(setFlashMessage, [Ok, resp.data.message]);

                return true
            } else {
                console.error(resp);
                getFlash(setFlashMessage, [Error, resp.data.message]);
                return false;
            };
        })
        .catch((err): void => {
            getFlash(setFlashMessage, [Error, err.message]);
        });
}

async function updateUser(
    registrationValues: FormData | {},
    setUser: setContext<User>,
    setFlashMessage: setContext<FlashMessage>,
): Promise<any> {
    return await axios
        .patch<FormData | {}, AxiosResponse<any, any>>(`${process.env.REACT_APP_BACKEND_URL}/user`, registrationValues, { withCredentials: true })
        .then((resp): {} => {
            if (resp.status === 200) {
                setAvatarToUser(resp.data.user, resp.data.avatar);
                getFlash(setFlashMessage, [Ok, resp.data.message]);
                setUser(resp.data.user);
                return resp.data;
            } else {
                console.error(resp);
                return resp.data;
            };
        })
        .catch((err): void => {
            console.error(err);
        });
}

async function signOut(
    setUser: setContext<User>,
    setAddress: setContext<Address>
): Promise<[symbol, string]> {
    return await axios
        .delete(`${process.env.REACT_APP_BACKEND_URL}/users/sign_out`, { withCredentials: true })
        .then((resp): [symbol, string] => {
            if (resp.status === 200) {
                resetUserInfos(setUser, setAddress);
                return [Ok, resp.data.message];
            } else {
                console.error(resp);
                return [Error, resp.data.message];
            };
        })
        .catch((err): [symbol, string] => { return [Error, err.message] });
}

function setUserInfos(
    user: User,
    setUser: setContext<User>
) {
    setUser(user);
    localStorage.setItem(infos_user, "connected");
    console.info(`User is logged in with id ${user.id}.`);
}

function resetUserInfos(
    setUser: setContext<User>,
    setAddress: setContext<Address>
) {
    setUser(defaultUser);
    setAddress(defaultAddress);
    localStorage.removeItem(infos_user);

    console.info("We reset the user informations on client side.")
}

function getUserInfos(
    id: string,
    setUserProfile: React.Dispatch<React.SetStateAction<User>>,
    setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<boolean>>
) {
    axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/user/${id}`, { withCredentials: true })
        .then(resp => {
            setAvatarToUser(resp.data.user, resp.data.avatar);

            setUserProfile(resp.data.user);
            setIsLoaded(true);
        })
        .catch(err => {
            console.error("An error occured ::::: ", err);
            setIsLoaded(true);
            setError(true);
        })
}

export { signIn, signInWithToken, registerUser, updateUser, signOut, getUserInfos, setUserInfos }