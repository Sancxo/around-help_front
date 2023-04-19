import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NeedsMap from "../../components/NeedsMap";
import { defaultNeed, listNeeds } from "../../shared/helpers/needs.helper";
import { Need } from "../../shared/interfaces/misc.interfaces";

export default function Needs({ isLoaded }: { isLoaded: boolean }): ReactElement {
  const [needs, setNeeds]: [Need[], Dispatch<SetStateAction<Need[]>>] = useState([defaultNeed]);

  useEffect(() => { listNeeds(setNeeds) }, []);

  return (
    <div>
      <h2 className="bold">Needs</h2>
      <div className="flex justify-center">
        <NeedsMap isLoaded={isLoaded} needs={needs} />
      </div>

      <Link to={'/new-need'}><button type="button" className="btn-prim mt-2">Share your own Need</button></Link>
    </div>
  )
}