import { ChangeEvent, Dispatch, ReactElement, SetStateAction, useContext, useEffect, useState } from "react";
import { FlashMessageContext, UserContext } from "../shared/context";
import { createChatRoom, createChatRoomUser } from "../shared/helpers/chat.helper";
import { clearFlash, getFlash } from "../shared/helpers/misc.helper";
import { createNeed, defaultNeedFormValue } from "../shared/helpers/needs.helper";
import { Error, FlashMessage, Need, NeedFormValues, Ok, setContext } from "../shared/interfaces/misc.interfaces";
import User from "../shared/interfaces/user.interfaces";

export default function NeedRegistration({ setIsNeedCreated, setnewlyCreatedNeed }: {
  setIsNeedCreated: Dispatch<SetStateAction<boolean>>,
  setnewlyCreatedNeed: Dispatch<SetStateAction<Need>>
}): ReactElement {
  const user: User = useContext(UserContext).user;
  const [need, setNeed]: [NeedFormValues, Dispatch<SetStateAction<NeedFormValues>>] = useState(defaultNeedFormValue);

  const setFlashMessage: setContext<FlashMessage> = useContext(FlashMessageContext).setFlashMessage;

  useEffect(() => {
    setNeed(needFormValues => ({ ...needFormValues, creator_id: user.id }))
  }, [user.id])

  async function handleSubmit() {
    clearFlash(setFlashMessage);

    const resp = await createNeed(need);
    if (resp.status === 201) {
      setnewlyCreatedNeed(resp.data.need)
      setIsNeedCreated(true);

      const chatRoom = await createChatRoom(resp.data.need.id);
      createChatRoomUser(chatRoom.id, user.id);

      getFlash(setFlashMessage, [Ok, resp.data.message]);
    } else if (!resp) {
      console.error("Api response is undefined.")
      getFlash(setFlashMessage, [Error, "A technical error occured ..."]);
    } else {
      console.error(resp)
      getFlash(setFlashMessage, [Error, resp.data.message]);
    }
  }

  function handleInputs(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setNeed(needFormValues => ({ ...needFormValues, [name]: value }));
  }

  function handleRadioInputs(e: ChangeEvent<HTMLInputElement>) {
    e.target.value === "Yes" ?
      setNeed(needFormValues => ({ ...needFormValues, is_one_time: true })) :
      setNeed(needFormValues => ({ ...needFormValues, is_one_time: false }))
  }

  return (
    <form name="need-registration-form" id="need-registration" className="container">
      <h2 className="bold">Create your Need</h2>

      <label htmlFor="need-title-input">Title <small>(mandatory)</small>:</label>
      <input type="text" name="title" id="need-title-input" onChange={handleInputs} required />
      <br />

      <label htmlFor="description-input">Description <small>(mandatory)</small>:</label>
      <textarea name="description" id="description-input" cols={30} rows={10} onChange={handleInputs} required ></textarea>
      <br />

      <div>
        <p>Is it a single time need? <small>(mandatory)</small>:</p>
        <input type="radio" name="is_one_time" id="single-time" value="true" onChange={handleRadioInputs} defaultChecked />
        <label htmlFor="single-time" style={{ display: "inline" }} className='mr-1'>Yes</label>

        <input type="radio" name="is_one_time" id="not-single-time" value="false" onChange={handleRadioInputs} />
        <label htmlFor="not-single-time" style={{ display: "inline" }}>No</label>
      </div>

      <br />

      <input type="button" className="btn-prim" value="Submit" onClick={handleSubmit} />
    </form>
  )
}