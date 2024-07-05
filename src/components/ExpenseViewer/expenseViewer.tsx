import { useEffect, useState } from "react";
import { ExpenseItem, User } from "../../utils/interfaces";


interface ExpenseViewerProps {
    user: User;
    viewTrip: string;
}

const ExpenseViewer = ({
    user,
    viewTrip
}: ExpenseViewerProps) => {
    const [rowData, setRowData] = useState<ExpenseItem[]>([]);


    return (
        <>
            <h2>Expense Viewer {user.displayName} {user.trips.find(trip => trip.tripName === viewTrip)!.role}</h2>
        </>
    )
}

export default ExpenseViewer;