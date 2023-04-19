import axios, { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { ChatMessage, Conversation } from "../interfaces/misc.interfaces";

async function createChatRoom(needId: number): Promise<any> {
  return await axios
    .post<number, AxiosResponse>(`${process.env.REACT_APP_BACKEND_URL}/chat_rooms`, { need_id: needId }, { withCredentials: true })
    .then(resp => { return resp.data; })
    .catch(err => console.error(err))
}

async function createChatRoomUser(chatRoomId: number, userId: number) {
  return await axios
    .post(`${process.env.REACT_APP_BACKEND_URL}/chat_room_users`, { chat_room_id: chatRoomId, user_id: userId }, { withCredentials: true })
    .then(resp => { return resp.data })
    .catch(err => {
      console.error(err);
      return false
    })
}

async function getChatRoomFromNeedId(needId: number): Promise<number> {
  return await axios
    .get<{ need_id: number }, AxiosResponse>(`${process.env.REACT_APP_BACKEND_URL}/chat_room/${needId}`, { withCredentials: true })
    .then(resp => { return resp.data.id })
    .catch(err => console.error(err))
}

async function getConversations(userId: number | undefined, setConversations: Dispatch<SetStateAction<Conversation[]>>) {
  return await axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/chat_rooms_list/${userId}`, { withCredentials: true })
    .then(resp => {
      setConversations(resp.data)
      return resp.data
    })
    .catch(err => console.error(err))
}

async function getChatMessages(chat_room_id: string, setMessages: Dispatch<SetStateAction<ChatMessage[]>>) {
  return await axios
    .get<ChatMessage[]>(`${process.env.REACT_APP_BACKEND_URL}/chat_messages_list/${chat_room_id}`, { withCredentials: true })
    .then(resp => setMessages(resp.data))
    .catch(err => console.error(err))
}

async function sendChatMessage(messageBody: string, userId: number, chatRoomId: string) {
  return await axios
    .post(`${process.env.REACT_APP_BACKEND_URL}/chat_messages`, { body: messageBody, user_id: userId, chat_room_id: chatRoomId }, { withCredentials: true })
    .catch(err => console.error(err));
}

export { createChatRoom, createChatRoomUser, getConversations, getChatRoomFromNeedId, getChatMessages, sendChatMessage }