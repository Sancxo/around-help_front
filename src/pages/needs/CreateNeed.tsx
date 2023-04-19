import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressRegistration from "../../components/AddressRegistration";
import NeedRegistration from "../../components/NeedRegistration";
import { defaultAddress } from "../../shared/helpers/address.helper";
import { defaultNeed, updateNeed } from "../../shared/helpers/needs.helper";
import { Address, Need } from "../../shared/interfaces/misc.interfaces";

export default function CreateNeed(): ReactElement {
  const [isNeedCreated, setIsNeedCreated]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
  const [isAddressSet, setIsAddressSet]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
  const [newlyCreatedAddress, setnewlyCreatedAddress]: [Address, Dispatch<SetStateAction<Address>>] = useState(defaultAddress);
  const [newlyCreatedNeed, setnewlyCreatedNeed]: [Need, Dispatch<SetStateAction<Need>>] = useState(defaultNeed);

  const navigate = useNavigate();

  useEffect(() => {
    isAddressSet && updateNeed(newlyCreatedNeed.id, { address_id: newlyCreatedAddress.id })
      .then(resp => {
        if (resp.status === 200) {
          navigate(`/needs/${resp.data.need.id}`)
        } else {
          console.error(resp);
        }
      }).catch((err) => console.error(err));
  }, [isAddressSet, newlyCreatedAddress.id, newlyCreatedNeed.id, navigate])

  return !isNeedCreated ?
    <NeedRegistration setIsNeedCreated={setIsNeedCreated} setnewlyCreatedNeed={setnewlyCreatedNeed} /> :
    <AddressRegistration setIsAddressSet={setIsAddressSet} setnewlyCreatedAddress={setnewlyCreatedAddress} />

}