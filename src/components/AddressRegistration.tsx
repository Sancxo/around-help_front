import React, { ChangeEvent, Dispatch, ReactElement, SetStateAction, useContext, useState } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { FlashMessageContext } from "../shared/context";
import { registerAddress } from "../shared/helpers/address.helper";
import { clearFlash, getFlash } from "../shared/helpers/misc.helper";
import { Address, AddressValues, Error, FlashMessage, Ok, setContext } from "../shared/interfaces/misc.interfaces";

export default function AddressRegistration({ setIsAddressSet, setnewlyCreatedAddress }: {
  setIsAddressSet: Dispatch<SetStateAction<boolean>>,
  setnewlyCreatedAddress: Dispatch<SetStateAction<Address>>
}): ReactElement {
  const [addressValues, setAddressValues] = useState<AddressValues>({
    address: "",
    lat_lng: { lat: 0, lng: 0 }
  });

  const setFlashMessage: setContext<FlashMessage> = useContext(FlashMessageContext).setFlashMessage

  const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete({ callbackName: "initMap" });

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  const handleSelect = ({ description }: any) => () => {
    setValue(description, false);
    clearSuggestions();

    getGeocode({ address: description }).then(results => {
      const latLng = getLatLng(results[0]);

      setAddressValues({ address: results[0].formatted_address, lat_lng: latLng });
    })
  }

  const renderSuggestions = () => data.map(suggestion => {
    const { place_id, structured_formatting: { main_text, secondary_text } } = suggestion;
    return (
      <li key={place_id} onClick={handleSelect(suggestion)}>
        <strong>{main_text}</strong> <small>{secondary_text}</small>
      </li>
    )
  })

  async function handleSubmit() {
    clearFlash(setFlashMessage);

    const resp = await registerAddress(addressValues);
    if (resp.status === 201) {
      setnewlyCreatedAddress(resp.data.address);
      setIsAddressSet(true);
      getFlash(setFlashMessage, [Ok, resp.data.message]);
    } else {
      console.error(resp);
      getFlash(setFlashMessage, [Error, resp.data.message])
    }
  }

  return (
    <form name="address-registration-form" id="address-registration" className="container">
      <fieldset>
        <legend>Your address:</legend>

        <label htmlFor="address-search-input">Address search engine <small>(mandatory)</small>:</label>
        <input type="text" id="address-search-input" autoComplete="off" value={value} onChange={handleInput} disabled={!ready} placeholder="Where are you living?" required />
        {status === "OK" && <ul id="address-search-input-results" data-testid="address-search-input-results" className="unstyled">{renderSuggestions()}</ul>}
      </fieldset>

      <input type="button" className="btn-prim" value="Submit" onClick={handleSubmit} />
    </form>
  )
}