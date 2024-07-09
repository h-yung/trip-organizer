import { Link } from "react-router-dom";


export default function NoPage() {
    return (
        <>
            <h2>404</h2>
            <Link to={`/`}>Return to user selection</Link>
        </>
    )
}