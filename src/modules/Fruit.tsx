import fruit from "../assets/icons8-fruit-100.png";
import "./fruit.scss";

export const BigFruit = () => {
	return (
		<div className="single-use">
			<div className="avatar-group">
				<img
					src={fruit}
					className="avatar-img"
					alt="animal icon avatar"
				/>
			</div>
		</div>
	);
};
