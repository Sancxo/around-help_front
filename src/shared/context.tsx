import { createContext, ReactNode, useState } from "react";
import { defaultAddress } from "./helpers/address.helper";
import { defaultUser } from "./helpers/user.helper";
import { Address, FlashMessage, Nil } from "./interfaces/misc.interfaces";
import User from "./interfaces/user.interfaces";

export default function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);
  const [address, setAddress] = useState<Address>(defaultAddress);
  const [token, setToken] = useState("");
  const [flashMessage, setFlashMessage] = useState<FlashMessage>([Nil, ""]);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      <UserContext.Provider value={{ user, setUser }}>
        <AddressContext.Provider value={{ address, setAddress }}>
          <FlashMessageContext.Provider value={{ flashMessage, setFlashMessage }}>
            {children}
          </FlashMessageContext.Provider>
        </AddressContext.Provider>
      </UserContext.Provider>
    </TokenContext.Provider>
  )
}

const UserContext = createContext({ user: defaultUser, setUser: (user: User): void => { } });

const AddressContext = createContext({ address: defaultAddress, setAddress: (address: Address): void => { } });

const TokenContext = createContext({ token: "", setToken: (token: string): void => { } });


const emptyFlash: FlashMessage = [Nil, ""];
const FlashMessageContext = createContext({ flashMessage: emptyFlash, setFlashMessage: (flashMessage: FlashMessage) => { } });

export { UserContext, AddressContext, TokenContext, FlashMessageContext };