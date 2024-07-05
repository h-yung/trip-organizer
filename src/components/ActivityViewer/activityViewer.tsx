import { useEffect, useState } from "react";
import { Button } from "antd";
import { ActionItem, User } from "../../utils/interfaces";
import ExpenseEntryForm from "../ExpenseViewer/expenseForm";
import { getAllActivity } from "../../apis/main";

interface ActivityViewerProps {
    user: User;
    viewTrip: string;
}

const ActivityViewer = ({
    user,
    viewTrip
}: ActivityViewerProps) => {
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [rowData, setRowData] = useState<ActionItem[]>([]);

    const toggleFormVisibility = () => { setShowExpenseForm(!showExpenseForm)};


    useEffect(()=> {

        async function getActivities(){
            if (viewTrip){
                const activities = await getAllActivity(viewTrip);

                const { documents } = activities;
                setRowData(documents);
                console.log(documents);
            }
        }
       getActivities();

    }, [viewTrip])

    return (
        <>
            <h1>Activity Viewer {user.displayName} {user.trips.find(trip => trip.tripName === viewTrip)!.role}</h1>

            <div>
                Grid container
            </div>
            <Button type="primary" onClick={toggleFormVisibility}>{showExpenseForm ? "Hide form" : "Add trip expense"}</Button>
            {showExpenseForm && <ExpenseEntryForm />}
        </>
    )
}

export default ActivityViewer;