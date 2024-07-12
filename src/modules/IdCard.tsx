import { useEffect, useMemo } from "react";
import { avatarDictionary } from "../utils/avatars";
import { AvatarItem } from "../utils/interfaces";

import { useNavigate } from "react-router-dom";
import { useUserContext } from "../utils/UserContext";

const ENV = import.meta.env.VITE_MODE;

const IdCard = () => {
	const { activeUsr } = useUserContext();
	const navigate = useNavigate();

	const yourAvatar = useMemo(() => {
		return avatarDictionary.find(
			({ ref }: AvatarItem) => ref === activeUsr?.avatarRef
		)?.svg;
	}, [activeUsr]);

	useEffect(() => {
		if (!activeUsr) navigate("/login");
	}, [activeUsr]);

	return (
		<div className="id-box">
			{/* <span className="titles">Who are you?</span> */}

			<div className="avatar-group" id={activeUsr?._id} role="button">
				<img
					src={yourAvatar}
					className="avatar-img"
					alt="animal icon avatar"
				/>
				<span
					style={{
						letterSpacing: "0.1rem",
						fontSize: "0.8rem",
						color: "black",
						textTransform: "uppercase",
					}} //scss not overriding link
				>
					{activeUsr?.displayName}
				</span>
			</div>
		</div>
	);
};

export default IdCard;
