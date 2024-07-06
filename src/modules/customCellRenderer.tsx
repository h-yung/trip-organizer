import { Select } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { CustomCellRendererProps } from '@ag-grid-community/react';
import { Category, ExpenseItem } from "../utils/interfaces";
import { useCallback, useMemo } from "react";
import { deleteExpense, getAllExpenses } from "../apis/main";

const ENV = import.meta.env.VITE_MODE;

export interface CategoryCellProps extends CustomCellRendererProps {
    setSelectedExpense: (p: null | ExpenseItem) => void,
    selectedExpense: ExpenseItem | null,
	editingEx: boolean,


}
export const CategoryCellRenderer = ({
    setSelectedExpense,
    selectedExpense,
    editingEx,
    data,
    value
}: CategoryCellProps) => {

    const genuinelyEditable = editingEx && (selectedExpense?._id === data._id);

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);

        if (selectedExpense){
            const updated = structuredClone(selectedExpense);
            updated!.category = value as Category;

            setSelectedExpense(updated);
        } else {
            console.log('No valid selected expense');
        }
        
      };
    return (

        genuinelyEditable ? 
        <Select
      defaultValue="lucy"
      style={{ width: 120 }}
      onChange={handleChange}
      options={[
        { value: 'food', label: 'food' },
        { value: 'lodging', label: 'lodging' },
        { value: 'activity', label: 'activity' },
        { value: 'prep', label: 'prep' },
    ]
    // .concat( ENV === "dev" ? [{ value: 'test', label: 'test' }] : [])
        // { value: 'disabled', label: 'Disabled', disabled: true },
     }
    />
    :
    `${value}`
    )
}

export interface BinCellRendererProps extends CustomCellRendererProps {
	editingEx: boolean,
    setRowData: (p:ExpenseItem[]) => void;
    viewTrip: string;
}


export const BinCellRenderer = ({
    data,
    api,
    editingEx,
    setRowData,
    viewTrip
}: BinCellRendererProps) => {

    const sendToTrash = useCallback(async () => {
        const { _id } = data;

        if (ENV === "dev"){ 
            console.log("tis dev")
            api.applyTransaction({remove: [data]});
            return;
        }

        const response = await deleteExpense(_id);
        console.log(response);
        if (response.deletedCount){
            //deletedCount succeeds
            api.applyTransaction({ remove: [data]});
            const exps = await getAllExpenses(viewTrip);

                const { documents } = exps;
                setRowData(documents);
                console.log(documents);
        }
       
    }, []);


    return useMemo(() => {
        //else could render as disabled btn
        return (
        editingEx ? 
            <DeleteOutlined style={{color: "red"}} onClick={sendToTrash} /> : <DeleteOutlined />
    )
},[
    editingEx
])

}

//shows the expense form 
export const EditorCellRenderer = () => {
    return useMemo(() => {
        //else could render as disabled btn for some roles
        return (
            <div className="editor-btn-style">
                <EditOutlined />
            </div>
        )
    },[])
}