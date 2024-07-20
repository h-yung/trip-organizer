import { QuestionCircleOutlined } from "@ant-design/icons";
import { ConfigProvider, Popconfirm } from "antd";
import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../../utils/UserContext";
import "./Header.scss";

interface AppHeaderProps {}
const AppHeader = ({}: // activeUsr,

AppHeaderProps) => {
	const { activeUsr, viewTrip, setViewTrip, setSelectedActivity } =
		useUserContext();

	const location = useLocation();
	const navigate = useNavigate();

	const showName = useMemo(
		() => activeUsr?.displayName.split(" ")[0],
		[activeUsr]
	);

	const confirm = () => {
		setViewTrip("");
		setSelectedActivity(null);
		// console.log("active user is", activeUsr);
		// console.log("viewtrip set to ull, redirecting");
		navigate("/trip");
	};

	// const startReview = () => {
	//   setReviewForm(true);
	// }

	return (
		<ConfigProvider
			theme={{
				components: {
					Button: {
						defaultBg: "transparent",
						defaultHoverBg: "transparent",
						//   defaultColor: "#00c28e",
					},
				},
			}}
		>
			<div className={`header-container ${!activeUsr && "not-auth"}`}>
				{!activeUsr && <span className="titles">Log in</span>}

				{
					activeUsr && (
						// <Popconfirm title="Switch user?"
						//   onConfirm={switchUser}
						//   placement="bottom"
						//   >
						<div className="avatar-group">
							{activeUsr.avatar && (
								<img
									src={activeUsr.avatar}
									className="avatar-img"
									alt="animal icon avatar"
								/>
							)}
							<span className="titles">{showName}</span>
						</div>
					)
					// </Popconfirm>
				}

				<Popconfirm
					title="See a different trip?"
					onConfirm={confirm}
					placement="bottom"
				>
					<div role="button" className="trip-name-container">
						{viewTrip}
					</div>
				</Popconfirm>
				{
					location.pathname !== "/help" ? (
						<Link to="/help" className="help-btn">
							<QuestionCircleOutlined />
						</Link>
					) : (
						// <Button className="help-btn">
						<QuestionCircleOutlined
							className="help-btn"
							role="button"
							onClick={() => navigate(-1)}
						/>
					)
					// </Button>
				}
			</div>
		</ConfigProvider>
	);
};

export default AppHeader;
