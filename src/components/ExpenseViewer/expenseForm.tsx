import { Form, Button, Radio, Input, DatePicker, ConfigProvider } from "antd";
import { ExpenseItem, User } from "../../utils/interfaces";
import TextArea from "antd/es/input/TextArea";
import { HomeOutlined, CarOutlined, SmileOutlined } from "@ant-design/icons";
import FoodOutlined from "../../assets/noun-food-6439612.svg";
import PrepOutlined from "../../assets/noun-notes-6829221.svg";
import { addExpense } from "../../apis/main";
import { useState } from "react";

//some detritus here from initially thinking to edit expense with the form

interface ExpenseEntryProps {
	setShowExpenseForm: (p: boolean) => void;
    user: User;
    viewTrip: string;
    // query: string; //global search
    // editing: boolean; //implies existing 
    // setEditing:(p: boolean) => void;
    // selectedExpense: ExpenseItem | null; //for EDIT
    // setSelectedExpense: (p: null | ExpenseItem) => void;
}

const ENV = import.meta.env.VITE_MODE;

//need form reset

const ExpenseEntry = (
    {
        setShowExpenseForm,
        // setEditing,
        // editing,
        // selectedExpense,
        // setSelectedExpense,
        user,
        viewTrip
        // , user
    }: ExpenseEntryProps 
) => {

    const [isSuccess, setIsSuccess ] = useState(false);

    const exitForm = () => {
        // setEditing && setEditing(false);
        setIsSuccess(false); //just cleanup
        setShowExpenseForm(false);
    }

      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      };
      

    const submit = async (values: any) => {
            // Should format date value before submit.

            const {
                currency,
                category,
                details,
                date,
                desc,
                value,
                //vendor
                email,
                name,
                phoneNumber,
                url
            } = values;

            const entry:ExpenseItem = {
                category,
                submittedBy: user.lookupName,
                trip: viewTrip,
                currency,
                date: date.toDate(), //to JavaScript Date object
                desc,
                value,
                details,
                vendor: {
                    name, email, phoneNumber, url
                }
            }

            //   'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
            //   'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
           
            console.log('Received values of form: ', values, entry);
            // console.log("editing?", editing);
        // if (!editing){
            // = add
            const response = await addExpense(entry);
            console.log("RESPONSE:", response);
            if (response?.insertedId) setIsSuccess(true);
        // }
        //if (editing === true && selectedExpense) {} //need to prepopulate information and display as defaults
    }

    // const cancelExpenseEditing = ()=> {
    //     // setEditing(false);
    //     setShowExpenseForm(false);
    //     // setSelectedExpense(null);
    // }

    const onFinishFailed = () => {
        // if (!editing){
        // }
        //if (editing === true && selectedExpense) {} //need to prepopulate information and display as defaults
        console.log("Could not submit.")
    }

    // const expInitialValues = useMemo(()=> {

    //     if (selectedExpense && editing){
    //         return {
    //             currency:selectedExpense.currency,
    //             category:selectedExpense.category,
    //             details:selectedExpense.details,
    //             date:selectedExpense.date,
    //             desc:selectedExpense.desc,
    //             value:selectedExpense.value,
    //             //vendor
    //             email:selectedExpense.vendor?.email ?? "",
    //             name:selectedExpense.vendor?.name ?? "",
    //             phoneNumber:selectedExpense.vendor?.phoneNumber ?? "",
    //             url:selectedExpense.vendor?.url ?? ""
    //         }
    //     }

    //     return {};
    // }, [editing, selectedExpense]);


    return (
    
    <ConfigProvider
        theme={{
            components: {
            Radio: {
                buttonBg: "transparent",
                buttonCheckedBg: "red",
                buttonCheckedBgDisabled: "transparent"
            },
            },
        }}
        >
        { !isSuccess ? (
      <Form
        className="expense-form"
        labelCol={{ span: 4 }}
        size="large"
        layout="vertical"
        onFinish={submit}
        onFinishFailed={onFinishFailed}
        // onValuesChange={e=>console.log(e)}

        {...formItemLayoutWithOutLabel}
       
      >
       
         <div className="entry-header">
            <h2 style={{marginRight: "1rem"}}>NEW Expense</h2>
           <p className="prepopulated">By {user.displayName} for {viewTrip} </p>
           </div>
        <label className="item-label">Category</label>

        <Form.Item className="form-item" name="category" 
        help="Required"
        rules={[{ required: true }]}
        >
          <Radio.Group className="radio-group"
            // defaultValue={editing && selectedExpense && selectedExpense.category}
          >
            <Radio.Button className="radio-item" key={"radio_1"} value="activity"><CarOutlined style={{color: "black"}} /></Radio.Button>
            <Radio.Button className="radio-item" key={"radio_2"} value="food"><img width={45} height={45} src={FoodOutlined} alt="food" /></Radio.Button>
            <Radio.Button className="radio-item" key={"radio_3"} value="lodging"><HomeOutlined style={{color: "black"}} /></Radio.Button>
            <Radio.Button className="radio-item" key={"radio_4"} value="prep"><img width={45} height={45} src={PrepOutlined} alt="preparations" /></Radio.Button>
           {/* {ENV === "dev" && <Radio.Button key={"radio_5"} className="radio-item" value="test"><SmileOutlined style={{color: "black"}} /></Radio.Button> } */}
          </Radio.Group>
        </Form.Item>

        <label className="item-label">Short description</label>
        <Form.Item className="form-item"  name="desc" 
        help="Required"
        rules={[{ required: true }]}
             >
          <Input />
        </Form.Item>
        {/* <div style={{display: "flex"}}> */}

        <Form.Item className="form-item"  name="value" 
        help="Required"
        rules={[{ required: true }]}
             >
          <Input prefix="Value:"  />
        </Form.Item>

        <Form.Item className="form-item"  name="currency" 
        help="Required"
        rules={[{ required: true }]}
             >
          <Input prefix="Currency:" placeholder={"USD"} />
        </Form.Item>

        <div className="form-subBlock">

            <label className="item-label">Date of purchase </label>

            <Form.Item className="form-item date-picker" name="date"
            help="Required"
            rules={[{ required: true }]}
            >
                <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
        </div>

        <div className="form-subBlock">

            <label className="subheader">Details</label>
            <label className="item-label">More info</label>

            <Form.Item className="form-item" name="details" 
            // rules={[{ required: true }]}
            >
                <TextArea rows={4} />
            </Form.Item>
            

            <label className="item-label">Vendor name</label>

            <Form.Item className="form-item"  name="name">
                <Input />

            </Form.Item>
            <label className="item-label">Website</label>

            <Form.Item className="form-item" name="url" //</div>rules={[{ type: 'url' }]}
            >
                <Input />
            </Form.Item>
            <label className="item-label">Email</label>

            <Form.Item className="form-item" name="email" rules={[{ type: 'email' }]}>
                <Input />
            </Form.Item>
            <label className="item-label">Phone</label>

            <Form.Item className="form-item" name="phoneNumber">
                <Input />
            </Form.Item>
        </div>
   
        <Form.Item >
            <Button htmlType="submit"
            className="send-btn-item"
            style={{width: 200}} //wouldn't take from scss..
            >
                Submit
            </Button>
        </Form.Item>

       {/* {editing && <Form.Item >
            <Button htmlType="button"
            className="send-btn-item"
            onClick={cancelExpenseEditing}
            >
                Cancel Edits & Exit
            </Button>
        </Form.Item>} */}
      </Form>

): (
    <div className="finish-panel">
        <SmileOutlined style={{fontSize: "6rem" }} />
        <h2 className="exclamation">SUCCESS!</h2>
        <p>...fully submitted.</p>
        <Button className="send-btn-item" size="large" onClick={()=> setIsSuccess(false) }>
            Add another expense
        </Button>
        <Button className="send-btn-item secondary" size="large" onClick={exitForm}>
            Go back
        </Button>
    </div>


)}
    </ConfigProvider>

    )
}

export default ExpenseEntry;