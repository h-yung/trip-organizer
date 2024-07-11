import { CarOutlined, HomeOutlined, MinusCircleOutlined, PlusOutlined, PushpinOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, DatePicker, Form, Input, Radio } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { updateAction } from "../../apis/main";
import FoodOutlined from "../../assets/noun-food-6439612.svg";
import { convertActForForm, convertFormToAct } from "../../utils/activityConverter";
import { ActionItem, User } from "../../utils/interfaces";
import SuccessPage from "../Success/Success";

interface UpdateActivityEntryProps {
    user: User;
    viewTrip: string;
    selectedActivity: ActionItem;
    setSelectedActivity: (p: null | ActionItem) => void;
}

const ENV = import.meta.env.VITE_MODE;

//need form reset

const UpdateActivityEntry = (
    {
        selectedActivity,
        setSelectedActivity, //need to update this
        user,
        viewTrip
    }: UpdateActivityEntryProps 
) => {
    const [isSuccess, setIsSuccess ] = useState(false);

    const [ form ] = Form.useForm();

    const formVals = useMemo(()=> {
        return convertActForForm(selectedActivity);

    }, [selectedActivity])

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
        const entry = convertFormToAct(values, user, viewTrip, selectedActivity._id);

        if (ENV === "dev") {
            
            setSelectedActivity(entry);
            
            console.log("tis dev, submitted update activity");
            setIsSuccess(true);
            return;
        }

        const update = await updateAction(entry);

        if (update.matchedCount && update.modifiedCount && update.matchedCount === update.modifiedCount) {
            console.log('Successfully sent in update!');

            //if update succeeded, apply the updates from submission; does not re-req however. The re-req comes on ActivityViewer level.
            setSelectedActivity(entry);

            setIsSuccess(true);
        }
    }

    const onFinishFailed = () => {
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

    <>
    <div className="entry-header">
            <h2>
                <span>Updating Activity</span> 
                <Link to={`/trip/${viewTrip}/activity`} 
                className="cancel-update-btn"
                 // style={{width: 200}} //wouldn't take from scss..
                >
                    Cancel
                </Link>
            </h2>
           <p className="prepopulated">by {user.displayName} for {viewTrip} </p>
           </div>
           
      <Form
        form={form}
        className="activity-form"
        labelCol={{ span: 4 }}
        size="large"
        layout="vertical"
        onFinish={submit}
        onFinishFailed={onFinishFailed}
        initialValues={formVals}
        // onValuesChange={e=>console.log(e)}

        {...formItemLayoutWithOutLabel}
       
      >
       
        <label className="item-label">Category</label>

        <Form.Item className="form-item" name="category" 
            help="Required"
            rules={[{ required: true }]}
        >
            <Radio.Group className="radio-group">
            <Radio.Button className="radio-item" key={"radio_1"} value="activity"><CarOutlined style={{color: "black"}} /></Radio.Button>
            <Radio.Button className="radio-item" key={"radio_2"} value="food"><img width={54} height={54} src={FoodOutlined} alt="food" /></Radio.Button>
            <Radio.Button className="radio-item" key={"radio_3"} value="lodging"><HomeOutlined style={{color: "black"}} /></Radio.Button>
            <Radio.Button className="radio-item" key={"radio_4"} value="prep"><PushpinOutlined style={{color: "black"}}/></Radio.Button>
           {/* {ENV === "dev" && <Radio.Button key={"radio_5"} className="radio-item" value="test"><SmileOutlined style={{color: "black"}} /></Radio.Button> } */}
          </Radio.Group>
        </Form.Item>

        <label className="item-label">Title</label>
        <Form.Item className="form-item"  name="title" 
            help="Required"
            rules={[{ required: true }]}
        >
          <Input value={formVals?.title} />
        </Form.Item>

        <div className="form-subBlock">

            <label className="item-label">Scheduled for </label>

            <Form.Item className="form-item date-picker" name="startTime"
                     help="Required for updates"
                     rules={[{ required: true }]}
            >
                <DatePicker showTime format="YYYY-MM-DD HH:mm" value={formVals?.startTime} />
            </Form.Item>
        </div>

        <Form.List
        name="urls"
        
        //???
        initialValue={formVals?.urls?.length ? formVals.urls : [""]}
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
            <div style={{ width: 335}}>
            <label className="item-label">Links</label>

            {fields.map((field, index) => (
                <div 
                key={`${field.key}_${index}_link`}
                
                
                >

                    <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        
                        required={index === 0 ? true : false}
                        key={field.key}
                        // style={{ display: "flex", justifyContent: "center", alignItems: "center"}}
                    >

                        <Form.Item 
                        className="form-item"
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
                        <Input placeholder="https://..." 
                        style={{ width: "80%" }} 
                        />
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
              </div>
        )}
        </Form.List>

        <div className="form-subBlock">
            <label className="subheader">Location</label>
            <label className="item-label">Map URL</label>

            <Form.Item className="form-item" name="mapUrl" 
                 help="Required"
                 rules={[{ required: true }]}
            >
                <Input value={formVals?.mapUrl} />
            </Form.Item>
            <label className="item-label">Address</label>

            <Form.Item className="form-item"  name="address" 
                 help="Required"
                 rules={[{ required: true }]}
            >
                <Input value={formVals?.address} />

            </Form.Item>
            <label className="item-label">Nearest City</label>

            <Form.Item className="form-item"  name="nearestCity" 
            // rules={[{ required: true, message: "Required" }]}
            >
                <Input value={formVals?.nearestCity} />
            </Form.Item>
            <label className="item-label">Country</label>

            <Form.Item className="form-item" name="country" 
                 help="Required"
                 rules={[{ required: true }]}
            >
                <Input value={formVals?.country} />
            </Form.Item>
            <label className="item-label">Nearest State</label>

            <Form.Item className="form-item" name="nearestState">
                <Input value={formVals?.nearestState}/>
            </Form.Item>
            <label className="item-label">Zipcode</label>

            <Form.Item className="form-item" name="zipcode">
                <Input value={formVals?.zipcode} />
            </Form.Item>
        </div>

        <div className="form-subBlock">

        <label className="subheader">Details</label>
        <label className="item-label">Description</label>

        <Form.Item className="form-item" name="details" 
                 help="Required"
                 rules={[{ required: true }]}
        >
            <TextArea rows={4} value={formVals?.details} />
        </Form.Item>
        <label className="item-label">Tips</label>

        <Form.Item className="form-item" name="advisory">
            <TextArea rows={4} value={formVals?.advisory} />
        </Form.Item>
        </div>
        <div className="form-subBlock">

            <label className="subheader">Vendor</label>
                <label className="item-label">Name</label>

            <Form.Item className="form-item"  name="name">
                <Input value={formVals?.name} />

            </Form.Item>
            <label className="item-label">Website</label>

            <Form.Item className="form-item" name="url" rules={[{ type: 'url' }]}>
                <Input value={formVals?.url} />
            </Form.Item>
            <label className="item-label">Email</label>

            <Form.Item className="form-item" name="email" rules={[{ type: 'email' }]}>
                <Input value={formVals?.email} />
            </Form.Item>
            <label className="item-label">Phone</label>

            <Form.Item className="form-item" name="phoneNumber">
                <Input value={formVals?.phoneNumber} />
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
      </>
): (
    <SuccessPage 
    path={`/trip/${viewTrip}/activity/detail/${selectedActivity._id}`} //may have to lift this to customize more freely
    customExitLine="Go back"
/>

)}




   </ConfigProvider>
    )
}

export default UpdateActivityEntry;