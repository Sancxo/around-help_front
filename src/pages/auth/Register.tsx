import { Dispatch, ReactElement, SetStateAction, useContext, useEffect, useState } from "react";
import UserRegistration from "../../components/UserRegistration";
import AddressRegistration from "../../components/AddressRegistration";
import User from "../../shared/interfaces/user.interfaces";
import { AddressContext, FlashMessageContext, UserContext } from "../../shared/context";
import { useNavigate } from "react-router-dom";
import { Address, FlashMessage, setContext } from "../../shared/interfaces/misc.interfaces";
import { updateUser } from "../../shared/helpers/user.helper";
import { defaultAddress } from "../../shared/helpers/address.helper";
import { getFlash } from "../../shared/helpers/misc.helper";

export default function Register(): ReactElement {
    const setFlashMessage: setContext<FlashMessage> = useContext(FlashMessageContext).setFlashMessage;
    const { user, setUser }: { user: User, setUser: setContext<User> } = useContext(UserContext);
    const { address, setAddress }: { address: Address, setAddress: setContext<Address> } = useContext(AddressContext);

    const navigate = useNavigate();

    const [isUserCreated, setIsUserCreated]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
    const [isAddressSet, setIsAddressSet]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
    const [newlyCreatedAddress, setnewlyCreatedAddress]: [Address, Dispatch<SetStateAction<Address>>] = useState(defaultAddress);

    useEffect(() => {
        if (isAddressSet) {
            setAddress(newlyCreatedAddress);
            updateUser({ address_id: newlyCreatedAddress.id }, setUser, setFlashMessage)
                .then(respUpdate => {
                    navigate(`/user/${respUpdate.user.id}`)
                })
                .catch(err => {
                    getFlash(setFlashMessage, err.message);
                    console.error(err);
                });
        }
    }, [isAddressSet, setAddress, newlyCreatedAddress, setFlashMessage, setUser, navigate])

    useEffect(() => {
        (user.id !== 0 && address.id !== 0) && navigate(`/user/${user.id}`)
    }, [user.id, address.id, navigate])

    return !isUserCreated ?
        <UserRegistration setIsUserCreated={setIsUserCreated} /> :
        <AddressRegistration setIsAddressSet={setIsAddressSet} setnewlyCreatedAddress={setnewlyCreatedAddress} />
}