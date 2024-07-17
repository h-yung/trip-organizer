import {
	CarOutlined,
	HomeOutlined,
	MinusCircleOutlined,
	PlusOutlined,
	PushpinOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, DatePicker, Form, Input, Radio } from "antd";
import TextArea from "antd/es/input/TextArea";
import jsesc from "jsesc";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addActivity } from "../../apis/main";
import FoodOutlined from "../../assets/noun-food-6439612.svg";
import { convertFormToAct } from "../../utils/activityConverter";
import { ActionItem } from "../../utils/interfaces";
import { useUserContext } from "../../utils/UserContext";
import SuccessPage from "../Success/Success";

import { TimezoneSelector } from "../../modules/timezoneSelector";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

interface ActivityEntryProps {
	// query: string; //global search
	selectedActivity?: ActionItem | null; //for EDIT
	setSelectedActivity?: (p: null | ActionItem) => void;
}

const ENV = import.meta.env.VITE_MODE;

//need form reset
//some detritus here from initially thinking to edit with same form
//may replace everything with the update activity form /controlled values

const ActivityEntry = ({}: ActivityEntryProps) => {
	const { activeUsr, viewTrip, setSelectedActivity, customTz } =
		useUserContext();
	const navigate = useNavigate();
	const [isSuccess, setIsSuccess] = useState(false);

	dayjs.extend(utc);
	dayjs.extend(timezone);

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
		if (!activeUsr) return;
		const entry = convertFormToAct(values, activeUsr, viewTrip, customTz);

		if (ENV === "dev") {
			console.log("tis dev, submitted new activity");
			console.log(entry);
			setIsSuccess(true);
			return;
		}
		const response = await addActivity(entry);
		console.log("RESPONSE:", jsesc(response));
		if (response?.insertedId) setIsSuccess(true);
	};

	const onFinishFailed = () => {
		console.log("Could not submit.");
	};

	useEffect(() => {
		if (!viewTrip) navigate("/trip");
	}, [viewTrip]);

	useEffect(() => {
		//single-use cleanup
		setSelectedActivity(null);
	}, []);

	return (
		<ConfigProvider
			theme={{
				components: {
					Radio: {
						buttonBg: "transparent",
						buttonCheckedBg: "red",
						buttonCheckedBgDisabled: "transparent",
					},
				},
			}}
		>
			{!isSuccess ? (
				<>
					<div className="entry-header">
						<h2>NEW Activity</h2>
						<p className="prepopulated new">
							BY {activeUsr?.displayName} FOR {viewTrip}{" "}
						</p>
					</div>
					<TimezoneSelector layout={"vertical"} />

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
						<label className="item-label">Category</label>

						<Form.Item
							className="form-item"
							name="category"
							help="Required"
							rules={[{ required: true }]}
						>
							<Radio.Group className="radio-group">
								<Radio.Button
									className="radio-item"
									key={"radio_1"}
									value="activity"
								>
									<CarOutlined style={{ color: "black" }} />
								</Radio.Button>
								<Radio.Button
									className="radio-item"
									key={"radio_2"}
									value="food"
								>
									<img
										width={54}
										height={54}
										src={FoodOutlined}
										alt="food"
									/>
								</Radio.Button>
								<Radio.Button
									className="radio-item"
									key={"radio_3"}
									value="lodging"
								>
									<HomeOutlined style={{ color: "black" }} />
								</Radio.Button>
								<Radio.Button
									className="radio-item"
									key={"radio_4"}
									value="prep"
								>
									<PushpinOutlined
										style={{ color: "black" }}
									/>
								</Radio.Button>
								{/* {ENV === "dev" && <Radio.Button key={"radio_5"} className="radio-item" value="test"><SmileOutlined style={{color: "black"}} /></Radio.Button> } */}
							</Radio.Group>
						</Form.Item>

						<label className="item-label">Title</label>
						<Form.Item
							className="form-item"
							name="title"
							help="Required"
							rules={[{ required: true }]}
						>
							<Input />
						</Form.Item>

						<div className="form-subBlock">
							<label className="item-label">Scheduled for </label>

							<Form.Item
								className="form-item date-picker"
								name="startTime"
								help="Omit if adding to backlog."
								//  rules={[{ required: true }]}
							>
								<DatePicker
									showTime
									format="YYYY-MM-DD HH:mm"
								/>
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
							{(
								fields,
								{ add, remove } //, { errors }
							) => (
								<div style={{ width: 335 }}>
									<label className="item-label">Links</label>

									{fields.map((field, index) => (
										<div key={`${field.key}_${index}_link`}>
											<Form.Item
												{...(index === 0
													? formItemLayout
													: formItemLayoutWithOutLabel)}
												required={
													index === 0 ? true : false
												}
												key={field.key}
												// style={{ display: "flex", justifyContent: "center", alignItems: "center"}}
											>
												<Form.Item
													className="form-item"
													{...field}
													key={`${field.key}_${index}`}
													validateTrigger={[
														"onChange",
														"onBlur",
													]}
													//   rules={[
													//     {
													//       required: true,
													//       whitespace: true,
													//       message: "Please input passenger's name or delete this field.",
													//     },
													//   ]}
													rules={[{ type: "url" }]}
													noStyle
												>
													<Input
														placeholder="https://..."
														style={{ width: "80%" }}
													/>
												</Form.Item>
												{fields.length > 1 ? (
													<MinusCircleOutlined
														className="dynamic-delete-button"
														style={{
															paddingLeft: 6,
														}}
														onClick={() =>
															remove(field.name)
														}
													/>
												) : null}
											</Form.Item>
										</div>
									))}
									<Form.Item className="form-item">
										<Button
											type="dashed"
											onClick={() => add()}
											style={{ width: "60%" }}
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

							<Form.Item
								className="form-item"
								name="mapUrl"
								help="Required"
								rules={[{ required: true }]}
							>
								<Input />
							</Form.Item>
							<label className="item-label">Address</label>

							<Form.Item
								className="form-item"
								name="address"
								help="Required"
								rules={[{ required: true }]}
							>
								<Input />
							</Form.Item>
							<label className="item-label">Nearest City</label>

							<Form.Item
								className="form-item"
								name="nearestCity"
								// rules={[{ required: true, message: "Required" }]}
							>
								<Input />
							</Form.Item>
							<label className="item-label">Country</label>

							<Form.Item
								className="form-item"
								name="country"
								help="Required"
								rules={[{ required: true }]}
							>
								<Input />
							</Form.Item>
							<label className="item-label">Nearest State</label>

							<Form.Item
								className="form-item"
								name="nearestState"
							>
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

							<Form.Item
								className="form-item"
								name="details"
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

							<Form.Item className="form-item" name="name">
								<Input />
							</Form.Item>
							<label className="item-label">Website</label>

							<Form.Item
								className="form-item"
								name="url"
								rules={[{ type: "url" }]}
							>
								<Input />
							</Form.Item>
							<label className="item-label">Email</label>

							<Form.Item
								className="form-item"
								name="email"
								rules={[{ type: "email" }]}
							>
								<Input />
							</Form.Item>
							<label className="item-label">Phone</label>

							<Form.Item className="form-item" name="phoneNumber">
								<Input />
							</Form.Item>
						</div>

						<Form.Item>
							<Button htmlType="submit" className="send-btn-item">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</>
			) : (
				<SuccessPage
					path={`/trip/${viewTrip}/activity`}
					customExitLine="Go back"
					// otherAction="Add another entry"
					// otherActionPath={`/trip/${viewTrip}/activity/new`}
				/>

				// <div className="finish-panel">
				//     <SmileOutlined style={{fontSize: "6rem" }} />
				//     <h2 className="exclamation">SUCCESS!</h2>
				//     <p>...fully submitted.</p>
				//     <Button className="send-btn-item" size="large" onClick={()=> setIsSuccess(false) }>
				//         Add another entry
				//     </Button>
				//     <Link to={`/trip/${viewTrip}/activity`} className="send-btn-item secondary" //onClick={exitForm}>
				//     >
				//         Go back
				//     </Link>
				// </div>
			)}
		</ConfigProvider>
	);
};

export default ActivityEntry;
