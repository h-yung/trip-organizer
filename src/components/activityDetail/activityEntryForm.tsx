import {
	CarOutlined,
	HomeOutlined,
	MinusCircleOutlined,
	PlusOutlined,
	PushpinOutlined,
} from "@ant-design/icons";
import {
	Button,
	ConfigProvider,
	DatePicker,
	Form,
	Input,
	Radio,
	Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import jsesc from "jsesc";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addActivity, getTz } from "../../apis/main";
import FoodOutlined from "../../assets/noun-food-6439612.svg";
import { convertFormToAct, retrieveTz } from "../../utils/activityConverter";
import {
	ActionItem,
	ActivityUpdateFormValues,
	TzResponse,
} from "../../utils/interfaces";
import { useUserContext } from "../../utils/UserContext";
import SuccessPage from "../Success/Success";
import { getCityOptions } from "../../modules/timezoneSelector";

import { TimezoneSelector } from "../../modules/timezoneSelector";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { sampleTzResponse } from "../../utils/sampleData";

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
	const { activeUsr, viewTrip, setSelectedActivity, customTz, setCustomTz } =
		useUserContext();
	const navigate = useNavigate();
	const [isSuccess, setIsSuccess] = useState(false);
	const [form] = Form.useForm();
	const [formVals, setFormVals] = useState<ActivityUpdateFormValues>({
		address: "",
		advisory: "",
		title: "",
		startTime: undefined, //display should use customTz if specified
		category: "",
		urls: [],
		country: "",
		countryCode: "",
		mapUrl: "",
		nearestCity: "",
		nearestState: "",
		zipcode: undefined,
		details: "",
		tz: "",
		//vendor
		email: "",
		name: "",
		phoneNumber: undefined,
		url: "",
	});

	const onValuesChange = async (
		changedValues: Record<string, any>,
		allValues: Record<string, any>
	) => {
		if ("nearestCity" in changedValues) {
			// return await retrieveTz(changedValues["nearestCity"]);
			// console.log(thing);
			const { iana_timezone, admin1, location, country } =
				await retrieveTz(changedValues["nearestCity"]);

			const amendedVals = structuredClone(allValues);
			// amendedVals.tz = iana_timezone; //will set this on submission using customTz
			amendedVals.country = location;
			amendedVals.countryCode = country;

			if (country === "US") amendedVals.nearestState = admin1;

			//fix startTime
			if (allValues.startTime) {
				//redundant?
				// console.log("there is start time");
				amendedVals.startTime = allValues.startTime.tz(
					iana_timezone,
					true
				);
			}

			console.log("Amended bc city,", amendedVals);
			setCustomTz(iana_timezone);
			setFormVals(amendedVals as ActivityUpdateFormValues);
			return;
		} else {
			//any other update:
			const updates = { ...formVals, ...changedValues };

			setFormVals(updates as ActivityUpdateFormValues);
			return;
		}

		// setFormVals(allValues as ActivityUpdateFormValues);
	};

	const cityOptions = useMemo(() => {
		return getCityOptions();
	}, [getCityOptions]);

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

	const submit = async () =>
		// values: any //all programmatic now
		{
			if (!activeUsr) return;

			// console.log(formVals);
			const entry = convertFormToAct(
				formVals,
				activeUsr,
				viewTrip,
				customTz
			);

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
					{/* <TimezoneSelector layout={"vertical"} /> */}

					<Form
						form={form}
						className="activity-form"
						labelCol={{ span: 4 }}
						size="large"
						layout="vertical"
						onFinish={submit}
						onFinishFailed={onFinishFailed}
						onValuesChange={onValuesChange}
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
							<Input value={formVals?.title} />
						</Form.Item>

						<div className="form-subBlock">
							{/* <label className="subheader">Location</label> */}

							<label className="item-label">Address</label>

							<Form.Item
								className="form-item"
								name="address"
								help="Required"
								rules={[{ required: true }]}
							>
								<Input value={formVals?.address} />
							</Form.Item>
							<label className="item-label">Nearest City</label>
							{formVals.country ? (
								<span className="prepopulated conditional">
									{formVals.nearestState
										? `${formVals.nearestState}, `
										: ""}
									{formVals.country}
								</span>
							) : (
								<></>
							)}
							<Form.Item
								className="form-item"
								name="nearestCity"
								rules={[{ required: true }]}
								help="Required"
							>
								{/* <Input /> */}
								<Select
									showSearch
									style={{ width: 250, fontSize: "1rem" }}
									placeholder="Select a city"
									options={cityOptions}
									// defaultValue={defaultVal}
									value={formVals?.nearestCity}
									size="large"
								/>
							</Form.Item>

							{/* <label className="item-label">Country</label> */}

							{/* <Form.Item
								className="form-item"
								name="country"
								help="Required"
								rules={[{ required: true }]}
							>
								<Input value={formVals?.country} />
							</Form.Item> */}

							{/* <label className="item-label">Nearest State</label> */}

							{/* <Form.Item
								className="form-item"
								name="nearestState"
							>
								<Input value={formVals?.nearestState} />
							</Form.Item> */}
							<label className="item-label">Zipcode</label>

							<Form.Item
								className="form-item"
								style={{ maxWidth: 200 }}
								name="zipcode"
							>
								<Input value={formVals?.zipcode} />
							</Form.Item>

							<label className="item-label first">Map URL</label>

							<Form.Item
								className="form-item"
								name="mapUrl"
								help="Required"
								rules={[{ required: true }]}
							>
								<Input value={formVals?.mapUrl} />
							</Form.Item>
						</div>

						<div className="form-subBlock">
							<label className="subheader">Timing</label>
							<label className="item-label first">
								Scheduled for
							</label>

							<Form.Item
								className="form-item date-picker"
								name="startTime"
								// help="Omit if adding to backlog"
								//  rules={[{ required: true }]}
							>
								<DatePicker
									showTime
									format="YYYY-MM-DD HH:mm"
									value={formVals?.startTime}
								/>
							</Form.Item>
							<Form.Item
								className="form-item date-picker"
								name="tz"
								help="Suggested timezone based on nearest city. Omit date if adding activity to backlog."
								//  rules={[{ required: true }]}
							>
								<TimezoneSelector layout={"vertical"} />
							</Form.Item>
						</div>

						<Form.List
							name="urls"
							initialValue={
								formVals?.urls?.length ? formVals.urls : [""]
							}
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
							<label className="subheader">Details</label>
							<label className="item-label first">
								Description
							</label>

							<Form.Item
								className="form-item"
								name="details"
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

							<Form.Item className="form-item" name="name">
								<Input />
							</Form.Item>
							<label className="item-label">Website</label>

							<Form.Item
								className="form-item"
								name="url"
								rules={[{ type: "url" }]}
							>
								<Input value={formVals?.url} />
							</Form.Item>
							<label className="item-label">Email</label>

							<Form.Item
								className="form-item"
								name="email"
								rules={[{ type: "email" }]}
							>
								<Input value={formVals?.email} />
							</Form.Item>
							<label className="item-label">Phone</label>

							<Form.Item className="form-item" name="phoneNumber">
								<Input value={formVals?.phoneNumber} />
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
