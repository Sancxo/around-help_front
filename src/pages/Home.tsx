import { ReactElement, useContext, useEffect, useState } from "react";
import { countUnfulfilledNeeds } from "../shared/helpers/needs.helper";
import { UserContext } from "../shared/context";
import User from "../shared/interfaces/user.interfaces";
import { Link } from "react-router-dom";


export default function Home(): ReactElement {
    const [unfulfilledNeedsCount, setUnfulfilledNeedsCount] = useState(0);

    const user: User = useContext(UserContext).user;

    useEffect(() => {
        countUnfulfilledNeeds(setUnfulfilledNeedsCount);

        const counter = setInterval(() => countUnfulfilledNeeds(setUnfulfilledNeedsCount), 5000)
        return () => clearInterval(counter);
    }, [setUnfulfilledNeedsCount]);

    return (
        <div>
            <div id="hero-img">
            </div>
            <div id="hero-text">
                <h2>We Need You!</h2>
                <h3>Number of unfulfilled requests: {unfulfilledNeedsCount}</h3>
                {
                    user.id === 0 ?
                        <Link to={'/login'}><button type="button" className="btn-prim text-black">Log in</button></Link> :
                        <Link to={'/needs'}><button type="button" className="btn-prim text-black">Answer to a Need</button></Link>
                }
            </div>
        </div>
    );
}