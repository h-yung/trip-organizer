import { Button, ConfigProvider } from "antd";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAicArt } from "../apis/main";
import { Image, TripRecord } from "../utils/interfaces";
import { UserContext } from "../utils/UserContext";
import "./tripSelection.scss";
import IdCard from "../modules/IdCard";

const ENV = import.meta.env.VITE_MODE;

interface TripSelectionProps {}

export default function TripSelection({}: TripSelectionProps) {
	const { activeUsr, setViewTrip, setActiveUsr } = useContext(UserContext);
	const navigate = useNavigate();
	const [artImg, setArtImg] = useState<Image | null>(null);

	const activeHasTrips: TripRecord[] = useMemo(() => {
		return activeUsr ? activeUsr.trips : [];
	}, [activeUsr]);

	const chooseTrip = (e: any) => {
		const trip = e.currentTarget.id;
		setViewTrip(trip);
	};

	const logout = useCallback(async () => {
		//remove local token?
		setActiveUsr(null);
		setViewTrip("");
		navigate("/login");

		//prod: does session have to end explicitly, or just wipe storage?
	}, []);
	useEffect(() => {
		async function getArt(query?: string) {
			//currently "bear" default
			const artObj = await getAicArt(query);
			setArtImg(artObj);
		}

		if (ENV === "dev") {
			setArtImg({
				title: "Chicago",
				artist_title: "Ricky Esquivel, Pexels",
				date_display: "Mar 22, 2016",
				image_id: "1001010101",
				alt_text: "test art image",
				url: "https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg",
			});
		} else {
			getArt(); //no query for now
		}
	}, []);

	return (
		<div className="trip-container">
			<span className="titles">Choose a trip</span>
			<ConfigProvider
				theme={{
					components: {
						Button: {
							defaultBg: "transparent",
							defaultHoverBg: "transparent",
							defaultColor: "#00c28e",
						},
					},
				}}
			>
				{/* fix the order of ops user -> trip list -> choose -> unset user=unset viewtrip */}
				<div className="trip-list-container">
					{activeHasTrips.map((trip: TripRecord) => {
						return (
							<div
								key={trip.tripName}
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<Link to={`/trip/${trip.tripName}/activity`}>
									<Button
										className="trip-item"
										size="large"
										id={trip.tripName}
										onClick={chooseTrip}
									>
										{trip.tripName}
									</Button>
								</Link>
							</div>
						);
					})}
				</div>
				<div
					style={{
						width: "100%",
						marginBottom: "2rem",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Button className="titles tertiary-btn" onClick={logout}>
						{/* <IdCard /> */}
						Log out
					</Button>
				</div>
			</ConfigProvider>

			{/* <UserUpdateCreate activeUsr={activeUsr} /> */}

			{artImg && (
				<div className="art-aic-container">
					<div style={{ width: "100vw", height: 300 }}>
						<img src={artImg.url} alt={artImg?.alt_text} />
					</div>
					<div style={{ width: "100vw", padding: "0 2rem" }}>
						<label>{artImg.title}</label>
						<p>
							{artImg.date_display} | {artImg.artist_title}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
