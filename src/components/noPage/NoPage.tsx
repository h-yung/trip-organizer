import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { BigFruit } from "../../modules/Fruit";
import "./noPage.scss";

export default function NoPage() {
	const navigate = useNavigate();
	return (
		<div className="generic-container">
			<BigFruit />
			<p>Something went wrong.</p>

			<h2>Oof.</h2>
			<Button className="special-btn" onClick={() => navigate(-1)}>
				Go back
			</Button>
		</div>
	);
}
