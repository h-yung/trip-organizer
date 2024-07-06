import { Form, Button, Radio, Input, DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import {MinusCircleOutlined, PlusOutlined   } from "@ant-design/icons";
import { ActionItem, User } from "../../utils/interfaces";
import TextArea from "antd/es/input/TextArea";
import { HomeOutlined, CarOutlined, SmileOutlined } from "@ant-design/icons";
import FoodOutlined from "../../assets/noun-food-6439612.svg";
import PrepOutlined from "../../assets/noun-notes-6829221.svg";
import { addActivity } from "../../apis/main";
import { useState } from "react";

interface ActivityEntryProps {
	setShowActEntry: (p: boolean) => void;
    user: User;
    viewTrip: string;
    // query: string; //global search
    editing?: boolean; //implies existing
    setEditing?:(p: boolean) => void;
    selectedActivity?: ActionItem | null; //for EDIT
    setSelectedActivity?: (p: null | ActionItem) => void;
}

const ENV = import.meta.env.VITE_MODE;

//need form reset

const ActivityEntry = (
    {
        setShowActEntry,

        setEditing,
        editing,
        // selectedActivity,

        user,
        viewTrip
        // , user
    }: ActivityEntryProps 
) => {

    const [isSuccess, setIsSuccess ] = useState(false);

    const exitForm = () => {
        setEditing && setEditing(false);
        setIsSuccess(false); //just cleanup
        setShowActEntry(false);
    }

    const formItemLayout = {
        // labelCol: {
        //   xs: { span: 24 },
        //   sm: { span: 4 },
        // },
        // wrapperCol: {
        //   xs: { span: 24 },
        //   sm: { span: 20 },
        // },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      };
      

    const submit = async (values: any) => {
            // Should format date value before submit.

            const {
                address,
                advisory,
                title,
                startTime,
                category,
                urls,
                country,
                mapUrl,
                nearestCity,
                nearestState,
                zipcode,
                details,
                //vendor
                email,
                name,
                phoneNumber,
                url
            } = values;

            const entry:ActionItem = {
                category,
                submittedBy: user.lookupName,
                trip: viewTrip,
                startTime: startTime.toDate(), //to JavaScript Date object
                title,
                details,
                location: {
                    mapUrl,
                    address,
                    country,
                    nearestCity,
                    nearestState,
                    zipcode
                },
                advisory,
                urls,
                vendor: {
                    name, email, phoneNumber, url
                }
            }

            //   'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
            //   'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
           
            console.log('Received values of form: ', startTime, entry.startTime);
        if (!editing){
            // = add
            const response = await addActivity(entry, viewTrip);
            console.log("RESPONSE:", response);
            if (response?.insertedId) setIsSuccess(true);
            
        }
        //if (editing === true && selectedActivity) {} //need to prepopulate information and display as defaults
    }

    const onFinishFailed = () => {
        if (!editing){
        }
        //if (editing === true && selectedActivity) {} //need to prepopulate information and display as defaults
        console.log("Could not submit.")
    }


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
        className="activity-form"
        labelCol={{ span: 4 }}
        size="large"
        layout="vertical"
        onFinish={submit}
        onFinishFailed={onFinishFailed}
        // onValuesChange={e=>console.log(e)}

        {...formItemLayoutWithOutLabel}
       
      >
       
         {/* <Form.Item className="form-item"> */}
         <div className="entry-header">
            <h2 style={{marginRight: "1rem"}}>{editing? "Updating Activity" : "NEW Activity" }</h2>
           <p className="prepopulated">By {user.displayName} for {viewTrip} </p>
           </div>
        {/* </Form.Item> */}
        <label className="item-label">Category</label>

        <Form.Item className="form-item" name="category" 
            help="Required"
            rules={[{ required: true }]}
        >
          <Radio.Group className="radio-group">
            <Radio.Button className="radio-item" key={"radio_1"} value="activity"><CarOutlined style={{color: "black"}} /></Radio.Button>
            <Radio.Button className="radio-item" key={"radio_2"} value="food"><img width={45} height={45} src={FoodOutlined} alt="food" /></Radio.Button>
            <Radio.Button className="radio-item" key={"radio_3"} value="lodging"><HomeOutlined style={{color: "black"}} /></Radio.Button>
            <Radio.Button className="radio-item" key={"radio_4"} value="prep"><img width={45} height={45} src={PrepOutlined} alt="preparations" /></Radio.Button>
           {ENV === "dev" && <Radio.Button key={"radio_5"} className="radio-item" value="test"><SmileOutlined style={{color: "black"}} /></Radio.Button> }
          </Radio.Group>
        </Form.Item>

        <label className="item-label">Title</label>
        <Form.Item className="form-item"  name="title" 
            help="Required"
            rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <div className="form-subBlock">

            <label className="item-label">Scheduled for </label>

            <Form.Item className="form-item date-picker" name="startTime"
                     help="Required"
                     rules={[{ required: true }]}
            >
                <DatePicker showTime format="YYYY-MM-DD HH:mm" />
            </Form.Item>
        </div>

        <Form.List
        name="urls"
        // rules={[
        //   {
        //     validator: async (_, names) => {
        //       if (!names || names.length < 2) {
        //         return Promise.reject(new Error('At least 2 passengers'));
        //       }
        //     },
        //   },
        // ]}
      >
        {(fields, { add, remove }//, { errors }
        ) => (
            <>
            <label className="item-label">Links</label>

            {fields.map((field, index) => (
                <div 
                key={`${field.key}_${index}_link`}
                
                >
                    {/* {index === 0 ?  : ''} */}

                    <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        
                        required={index === 0 ? true : false}
                        key={field.key}
                    >

                        <Form.Item className="form-item"
                        {...field}
                        key={`${field.key}_${index}`}
                        validateTrigger={['onChange', 'onBlur']}
                        //   rules={[
                        //     {
                        //       required: true,
                        //       whitespace: true,
                        //       message: "Please input passenger's name or delete this field.",
                        //     },
                        //   ]}
                        rules={[{ type: 'url' }]}
                        noStyle
                        >
                        <Input placeholder="https://..." style={{ width: '60%' }} />
                        </Form.Item>
                        {fields.length > 1 ? (
                        <MinusCircleOutlined
                            className="dynamic-delete-button"
                            style={{paddingLeft: 6 }}
                            onClick={() => remove(field.name)}
                        />
                        ) : null}
                    </Form.Item>
                </div>
              
            ))}
            <Form.Item className="form-item">
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
              </Form.Item>
              </>
        )}
        </Form.List>

        <div className="form-subBlock">
            <label className="subheader">Location</label>
            <label className="item-label">Map URL</label>

            <Form.Item className="form-item" name="mapUrl" 
                 help="Required"
                 rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>
            <label className="item-label">Address</label>

            <Form.Item className="form-item"  name="address" 
                 help="Required"
                 rules={[{ required: true }]}
            >
                <Input />

            </Form.Item>
            <label className="item-label">Nearest City</label>

            <Form.Item className="form-item"  name="nearestCity" 
            // rules={[{ required: true, message: "Required" }]}
            >
                <Input />
            </Form.Item>
            <label className="item-label">Country</label>

            <Form.Item className="form-item" name="country" 
                 help="Required"
                 rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>
            <label className="item-label">Nearest State</label>

            <Form.Item className="form-item" name="nearestState">
                <Input />
            </Form.Item>
            <label className="item-label">Zipcode</label>

            <Form.Item className="form-item" name="zipcode">
                <Input />
            </Form.Item>
        </div>

        <div className="form-subBlock">

        <label className="subheader">Details</label>
        <label className="item-label">Description</label>

        <Form.Item className="form-item" name="details" 
                 help="Required"
                 rules={[{ required: true }]}
        >
            <TextArea rows={4} />
        </Form.Item>
        <label className="item-label">Tips</label>

        <Form.Item className="form-item" name="advisory">
            <TextArea rows={4} />
        </Form.Item>
        </div>
        <div className="form-subBlock">

            <label className="subheader">Vendor</label>
                <label className="item-label">Name</label>

            <Form.Item className="form-item"  name="name">
                <Input />

            </Form.Item>
            <label className="item-label">Website</label>

            <Form.Item className="form-item" name="url" rules={[{ type: 'url' }]}>
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
            >
                Submit
            </Button>
        </Form.Item>
      </Form>

): (
    <div className="finish-panel">
        <SmileOutlined style={{fontSize: "6rem" }} />
        <h2 className="exclamation">SUCCESS!</h2>
        <p>...fully submitted.</p>
        <Button className="send-btn-item" size="large" onClick={()=> setIsSuccess(false) }>
            Add another entry
        </Button>
        <Button className="send-btn-item secondary" size="large" onClick={exitForm}>
            Go back
        </Button>
    </div>


)}
   </ConfigProvider>
    )
}

export default ActivityEntry;