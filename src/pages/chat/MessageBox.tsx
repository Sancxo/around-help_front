import { ReactElement, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../shared/context";
import { getConversations } from "../../shared/helpers/chat.helper";
import { Conversation } from "../../shared/interfaces/misc.interfaces";
import { readDate } from "../../shared/helpers/misc.helper";

export default function MessageBox(): ReactElement {
  const user = useContext(UserContext).user;

  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    user.id !== 0 && getConversations(user.id, setConversations);
  }, [user, setConversations])

  return (
    <div className="p-1">
      <h2 className="bold">Your conversations</h2>
      <ul className="unstyled">
        {conversations.map((conversation: Conversation) => (
          <li key={conversation.id} className="row">
            <div className="column flex align-center">
              <h3 className="mb-0 mr-1 fs-2"><Link to={`../conversation/${conversation.id}`} className={conversation.need.is_fulfilled ? "greyed italic line-through" : ""}>{conversation.need.title}</Link></h3>
              {conversation.need.is_fulfilled && <small>(fulfilled)</small>}
            </div>
            <p className="column">Created by: <>{conversation.need_creator.id === user.id ? "You" : <Link to={`../user/${user.id}`}>{conversation.need_creator.first_name} {conversation.need_creator.last_name}`</Link>}</></p>
            <p className="column greyed">Joined on {readDate(conversation.created_at)}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}