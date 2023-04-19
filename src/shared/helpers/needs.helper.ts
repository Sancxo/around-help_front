import axios, { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { Need, NeedFormValues } from "../interfaces/misc.interfaces";

export const defaultNeedFormValue: NeedFormValues = {
  creator_id: 0,
  title: "",
  description: "",
  is_one_time: true
}

export const defaultNeed: Need = {
  id: 0,
  creator_id: 0,
  title: "",
  description: "",
  is_one_time: true,
  is_fulfilled: false,
  creator: { id: 0, first_name: "", last_name: "", email: "" },
  fulfillers: [],
  address: { id: 0, address: "", lat_lng: { lat: 0, lng: 0 } },
  created_at: new Date("0000-00-00"),
  updated_at: new Date("0000-00-00")
}

async function listNeeds(setNeeds: Dispatch<SetStateAction<Need[]>>) {
  return await axios.get(`${process.env.REACT_APP_BACKEND_URL}/needs`)
    .then(resp => setNeeds(resp.data))
}

async function countUnfulfilledNeeds(setUnfulfilledNeedsCount: Dispatch<SetStateAction<number>>) {
  return await axios.get(`${process.env.REACT_APP_BACKEND_URL}/unfulfilled_needs`)
    .then(resp => setUnfulfilledNeedsCount(resp.data))
}

async function createNeed(need: NeedFormValues): Promise<any> {
  return await axios
    .post<NeedFormValues, AxiosResponse>(`${process.env.REACT_APP_BACKEND_URL}/needs/`, { need })
    .then(resp => { return resp; })
    .catch(err => console.error(err));
}

async function createNeedUser(needId: number, userId: number) {
  return await axios
    .post(`${process.env.REACT_APP_BACKEND_URL}/need_users`, { need_id: needId, user_id: userId }, { withCredentials: true })
    .then(_ => { return true })
    .catch(err => {
      console.error(err);
      return false;
    })
}

async function getNeed(
  needId: string,
  setNeed: Dispatch<SetStateAction<Need>>,
  setIsLoaded: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<boolean>>) {
  axios
    .get<Need, AxiosResponse>(`${process.env.REACT_APP_BACKEND_URL}/needs/${needId}`, { withCredentials: true })
    .then(resp => {
      setNeed(resp.data);
      setIsLoaded(true);
    })
    .catch(err => {
      console.error("An error occured ::::: ", err);
      setIsLoaded(true);
      setError(true);
    })
}

async function updateNeed(
  need_id: number,
  need: {},
) {
  return await axios
    .patch<NeedFormValues, AxiosResponse<any, any>>(`${process.env.REACT_APP_BACKEND_URL}/needs/${need_id}`, need, { withCredentials: true })
    .then((resp): any => { return resp; })
    .catch(err => console.error(err))
}

export { listNeeds, countUnfulfilledNeeds, createNeed, createNeedUser, getNeed, updateNeed };