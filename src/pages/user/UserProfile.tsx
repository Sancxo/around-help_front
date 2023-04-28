import { ReactElement, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { UserContext } from "../../shared/context";
import { getUserInfos } from "../../shared/helpers/user.helper";


import User from "../../shared/interfaces/user.interfaces";

export default function UserProfile({ defaultUser }: { defaultUser: User }): ReactElement {
    const urlParams = useParams();

    const currentUser: User = useContext(UserContext).user;

    const [userProfile, setUserProfile] = useState<User>(defaultUser);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function getUser() {
            try {
                const userInfos: User = await getUserInfos(urlParams.id!);
                setUserProfile(userInfos);
                setIsLoaded(true);
            } catch (error) {
                console.error("An error occured ::::: ", error);
                setIsLoaded(true);
                setError(true);
            }

        }
        getUser()
    }, [urlParams.id])

    if (!isLoaded) return <div><p>Please, wait ...</p></div>

    if (error || userProfile === defaultUser) {
        return (
            <div>
                <p>Oops ... This user doesn't seem to exists !</p>
            </div>
        )
    }

    return (
        <div>
            {/* Public infos */}
            {/* Avatar */}
            <img src={`${userProfile.avatar ? userProfile.avatar : defaultUser.avatar}`} alt={`${userProfile.first_name}'s avatar`} width={200} height={200} />
            {/* <img src="" alt="" /> */}
            <p>Hello {userProfile.first_name} {userProfile.last_name}!</p>
            <p>Born: <>{userProfile.birthdate}</></p>
            {userProfile.about &&
                <div>
                    <p>About me: </p>
                    <p>{userProfile.about}</p>
                </div>
            }
            {/* => calculer l'âge */}
            {/* <p>Member since: <>{userProfile.created_at}</></p> */}

            {/* Private infos (if urlParams.id === user.id) */}
            <p>{userProfile.email}</p>
            {/* <p>{userProfile.address_id}</p> */}

            {/* {userProfile.id === currentUser.id && <Link to="/profile-edit" title="Edit your informations">Edit profile</Link>} */}
        </div >
    )
}   