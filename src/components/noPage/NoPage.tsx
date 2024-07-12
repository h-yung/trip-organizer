import { Link } from "react-router-dom";

export default function NoPage() {
	return (
		<>
			<h2>404. Oh noooooo something went wrong.</h2>
			<Link to={`/login`}>Go log in again.</Link>
		</>
	);
}
