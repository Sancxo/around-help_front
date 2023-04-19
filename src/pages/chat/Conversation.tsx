import { ChangeEvent, ReactElement, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FlashMessageContext, UserContext } from "../../shared/context";
import { getChatMessages, sendChatMessage } from "../../shared/helpers/chat.helper";
import { ChatMessage, Error, Ok } from "../../shared/interfaces/misc.interfaces";
import User from "../../shared/interfaces/user.interfaces";
import { getFlash, readDateTime } from "../../shared/helpers/misc.helper";

export default function Conversation(): ReactElement {
  // check if current user belongs to this conversation

  const user: User = useContext(UserContext).user;
  const setFlashMessage = useContext(FlashMessageContext).setFlashMessage;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageToSend, setMessageToSend] = useState("");
  const urlParams = useParams()

  const messagesContainer = document.getElementById("messages");

  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}`);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({
            room_id: urlParams.id,
            channel: "RoomChannel"
          })
        })
      );
      getFlash(setFlashMessage, [Ok, "You're connected to the chat room!"])
      console.info(`Websocket connected for chat_room with id ${urlParams.id}.`);
    }

    ws.onerror = () => {
      getFlash(setFlashMessage, [Error, "The connection with the chat room was lost; please wait or try reloading."]);
      console.error(`Websocket lost connection for chat_room with id ${urlParams.id}.`);
    }

    ws.onmessage = e => {
      const data = JSON.parse(e.data);
      if (data.type === "ping") return;
      if (data.type === "welcome") return;
      if (data.type === "confirm_subscription") return;
      setMessages(messages => [...messages, data.message]);
    }

    ws.onclose = _ => {
      getFlash(setFlashMessage, [Ok, "You were successfully disconnected from the chat room."]);
      console.info(`Websocket disconnected for chat_room with id ${urlParams.id}.`);
    }

    return () => ws.close(1000)
  }, [user.id, urlParams.id, setFlashMessage])

  const resetScroll = useCallback(() => {
    if (messagesContainer) messagesContainer!.scrollTop = messagesContainer!.scrollHeight;
  }, [messagesContainer]);

  useEffect(() => {
    getChatMessages(urlParams.id!, setMessages);
  }, [urlParams.id]);

  useEffect(() => {
    resetScroll();
  }, [messages, resetScroll])

  function handleInput(e: ChangeEvent<HTMLTextAreaElement>) {
    setMessageToSend(e.target.value);
  }

  async function handleSubmit() {
    sendChatMessage(messageToSend, user.id, urlParams.id!);
    setMessageToSend("");
  }

  return (
    <div id="chat-interface">
      <div id="messages">
        {messages.map((message, index) => (
          <div key={message.id} className={`chat-message ${message.user.id === user.id ? "your-message" : "not-your-message"}`}>
            {(index === 0 || message.user.id !== messages[index - 1].user.id) &&
              <p className="message-header"><small><span className="bold">{message.user.first_name} {message.user.last_name}</span> said:</small></p>
            }

            <p className="message-body">{message.body}</p>
            <p className="message-footer greyed"><small>{readDateTime(message.created_at)}</small></p>
          </div>
        ))}
      </div>
      <div id="message-form-container">
        <form id="message-form">
          <textarea name="message" id="chat-text-area" className="messageInput" cols={30} rows={10} value={messageToSend} onChange={handleInput} placeholder="Write your message here ..."></textarea>
          <input id="chat-send-btn" className="messageButton btn-prim" type="button" value="Send" onClick={handleSubmit} />
        </form>
      </div>
    </div>
  )
}