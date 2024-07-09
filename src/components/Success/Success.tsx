import { SmileOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";

interface SuccessPageProps {
    customExitLine: string;
    path: string; //the wrong approach ...
    // unsetSuccess: (p:boolean) => void; //until routing cleaned up
    // otherAction?: string;
    // otherActionPath?: string; //for any do anothers
}
export default function SuccessPage({
    customExitLine,
    path,
    // unsetSuccess,
    // otherAction,
    // otherActionPath,
    
}:SuccessPageProps) {
    return (
        <div className="finish-panel">
        <SmileOutlined style={{fontSize: "6rem" }} />
        <h2 className="exclamation">SUCCESS!</h2>
        <p>...fully submitted.</p>

        {/* { otherActionPath && otherAction &&
        <>
        <Link to={otherActionPath}  className="titles" style={{fontSize: "1rem", color:"#00c28e",  padding: 8}} >
        <Button className="send-btn-itm" onClick={()=> unsetSuccess}>{otherAction}</Button>
        </Link>

        <span>or</span>
        </>
        } */}

        <Link to={path} className="titles" style={{fontSize: "1rem", color:"#00c28e", padding: 8}}>
        {customExitLine}
        </Link>
    </div>

    )
}