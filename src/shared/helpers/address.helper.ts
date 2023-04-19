import axios, { AxiosResponse } from "axios";
import { Address, AddressValues, setContext } from "../interfaces/misc.interfaces";

export const defaultAddress: Address = {
  id: 0,
  address: "",
  lat_lng: { lat: 0, lng: 0 }
}

async function registerAddress(data: AddressValues): Promise<any> {
  return await axios
    .post<AddressValues, AxiosResponse<any, any>>(`${process.env.REACT_APP_BACKEND_URL}/addresses`, data, { withCredentials: true })
    .then((resp): {} => {
      return resp;
    })
    .catch((err): void => {
      console.error(err);
    })
}

async function getAddress(address_id: number, setAddress: setContext<Address>): Promise<any> {
  return await axios
    .get<AddressValues, AxiosResponse<any, any>>(`${process.env.REACT_APP_BACKEND_URL}/addresses/${address_id}`, { withCredentials: true })
    .then((resp): void => {
      if (resp.status === 200) {
        setAddress(resp.data);
      } else {
        console.error(resp);
      }
    })
    .catch((err): void => {
      console.error(err);
    })
}

export { registerAddress, getAddress }