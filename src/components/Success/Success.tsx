import { SmileOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";

interface SuccessPageProps {
    customExitLine: string;
    path: string; //the wrong approach ...
}
export default function SuccessPage({
    customExitLine,
    path
    
}:SuccessPageProps) {
    return (
        <div className="finish-panel">
        <SmileOutlined style={{fontSize: "6rem" }} />
        <h2 className="exclamation">SUCCESS!</h2>

        {/* use location to see if add entry? */}

        <p>...fully submitted.</p>
        <Link to={path} className="send-btn-item">
        {customExitLine}
        </Link>
    </div>

    )
}