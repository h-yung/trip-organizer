import crow from "../../assets/crow.svg";
import bugs from "../../assets/bugs.svg";
import dolphin from "../../assets/dolphin.svg";
import horse from "../../assets/equestrian-statue.svg";
import bear from "../../assets/fullbear.svg";
import hippo from "../../assets/hippo.svg";
import monkey from "../../assets/monkey.svg";
import raccoon from "../../assets/raccoon.svg";
import lion from "../../assets/lion.svg";
import kiwiBird from "../../assets/kiwi-bird.svg";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AvatarItem, User } from "../../utils/interfaces";
import { getAllUsers } from "../../apis/main";
import "./userSelection.scss";


interface UserSelectionProps {
    setUser: (p:User) => void;
}

const UserSelection = ({
    setUser
}: UserSelectionProps) => {
    const [userOptions, setUserOptions] = useState<User[]>([]);
    const avatarDictionary = useMemo<AvatarItem[]>(()=> [
        {
            ref: "crow",
            svg: crow
        },
        {
            ref: "bugs",
            svg: bugs
        },
        {
            ref: "dolphin",
            svg: dolphin
        },
        {
            ref: "horse",
            svg: horse
        },
        {
            ref: "bear",
            svg: bear
        },
        {
            ref: "hippo",
            svg: hippo
        },
        {
            ref: "monkey",
            svg: monkey
        },
        {
            ref: "raccoon",
            svg: raccoon
        },
        {
            ref: "lion",
            svg: lion
        },
        {
            ref: "kiwiBird",
            svg: kiwiBird
        },
    ] ,[]);

    const assignUser = useCallback((event:any)=> {

        event.preventDefault();
        const activeUser = userOptions.find((opt:User)=> opt._id === event.currentTarget.id);

        // console.log(userOptions.map(usr => usr._id))
        

        if (activeUser){
            console.log("New active user")

            activeUser.avatar = avatarDictionary.find(({ref}:AvatarItem)=> ref === activeUser?.avatarRef)?.svg;

            setUser(activeUser);
        }

    }, [userOptions]);

    useEffect(()=> {
        async function getUsers(){
           const users = await getAllUsers();

           console.log("all the users")
           console.log()
           setUserOptions(users.documents);
        }

        getUsers();
    },[])


    return (
        <div className="user-selection-container">
            <span className='titles'>Who are you?</span>

           {userOptions.length && (
            <div className="user-selection-ctr">
                {userOptions.map(
                    ({_id, displayName, avatarRef}:User)=> {

                        const svg = avatarDictionary.find(({ref}:AvatarItem)=> ref === avatarRef)?.svg;
                        return (
                            <div className="avatar-group"
                                key={_id} 
                                id={_id}
                                onClick={assignUser}
                                role="button"
                                >
                                {svg && <img src={svg} 
                                key={_id} 
                                className="avatar-img" alt="animal icon avatar"/> }
                                <span>{displayName}</span>
                            </div>
                        )
                    }
                )}
            </div>
           )}
        </div>
    )
}

export default UserSelection;






