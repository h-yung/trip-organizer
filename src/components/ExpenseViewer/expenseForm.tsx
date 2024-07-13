import { CarOutlined, HomeOutlined, PushpinOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, DatePicker, Form, Input, Radio } from "antd";
import TextArea from "antd/es/input/TextArea";
import jsesc from "jsesc";
import { useEffect, useState } from "react";
import { addExpense } from "../../apis/main";
import FoodOutlined from "../../assets/noun-food-6439612.svg";
import { ExpenseItem } from "../../utils/interfaces";
import { useUserContext } from "../../utils/UserContext";
import SuccessPage from "../Success/Success";
import { useNavigate } from "react-router-dom";

//some detritus here from initially thinking to edit expense with the form

interface ExpenseEntryProps {}

const ENV = import.meta.env.VITE_MODE;

//need form reset

const ExpenseEntry = ({}: ExpenseEntryProps) => {
	const { activeUsr, viewTrip } = useUserContext();
	const navigate = useNavigate();
	const [isSuccess, setIsSuccess] = useState(false);

	const formItemLayoutWithOutLabel = {
		wrapperCol: {
			xs: { span: 24, offset: 0 },
			sm: { span: 20, offset: 4 },
		},
	};

	const submit = async (values: any) => {
		// Should format date value before submit.
		if (!activeUsr) return;
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
			url,
		} = values;

		const entry: ExpenseItem = {
			category,
			submittedBy: activeUsr.lookupName,
			trip: viewTrip,
			currency,
			date: date.toDate(), //to JavaScript Date object
			desc,
			value,
			details,
			vendor: {
				name,
				email,
				phoneNumber,
				url,
			},
		};

		//   'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
		//   'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),

		console.log("Received values of form: ", values, entry);

		if (ENV === "dev") {
			console.log("tis dev, submitted new expense");
			setIsSuccess(true);
			return;
		}
		const response = await addExpense(entry);
		console.log("RESPONSE:", jsesc(response));
		if (response?.insertedId) setIsSuccess(true);
		// }
		//if (editing === true && selectedExpense) {} //need to prepopulate information and display as defaults
	};

	const onFinishFailed = () => {
		console.log("Could not submit.");
	};

	useEffect(() => {
		if (!viewTrip) navigate("/trip");
	}, [viewTrip]); //after authentication, activeUsr will never be null

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
						<h2 style={{ marginRight: "1rem" }}>NEW Expense</h2>
						<p className="prepopulated">
							by {activeUsr?.displayName} for {viewTrip}{" "}
						</p>
					</div>
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
								<PushpinOutlined style={{ color: "black" }} />
							</Radio.Button>
							{/* {ENV === "dev" && <Radio.Button key={"radio_5"} className="radio-item" value="test"><SmileOutlined style={{color: "black"}} /></Radio.Button> } */}
						</Radio.Group>
					</Form.Item>

					<label className="item-label">Short description</label>
					<Form.Item
						className="form-item"
						name="desc"
						help="Required"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					{/* <div style={{display: "flex"}}> */}

					<Form.Item
						className="form-item"
						name="value"
						help="Required"
						rules={[{ required: true }]}
					>
						<Input prefix="Value:" />
					</Form.Item>

					<Form.Item
						className="form-item"
						name="currency"
						help="Required"
						rules={[{ required: true }]}
					>
						<Input prefix="Currency:" placeholder={"USD"} />
					</Form.Item>

					<div className="form-subBlock">
						<label className="item-label">Date of purchase </label>

						<Form.Item
							className="form-item date-picker"
							name="date"
							help="Required"
							rules={[{ required: true }]}
						>
							<DatePicker format="YYYY-MM-DD" />
						</Form.Item>
					</div>

					<div className="form-subBlock">
						<label className="subheader">Details</label>
						<label className="item-label">More info</label>

						<Form.Item
							className="form-item"
							name="details"
							// rules={[{ required: true }]}
						>
							<TextArea rows={4} />
						</Form.Item>

						<label className="item-label">Vendor name</label>

						<Form.Item className="form-item" name="name">
							<Input />
						</Form.Item>
						<label className="item-label">Website</label>

						<Form.Item
							className="form-item"
							name="url" //</div>rules={[{ type: 'url' }]}
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
						<Button
							htmlType="submit"
							className="send-btn-item"
							style={{ width: 200 }} //wouldn't take from scss..
						>
							Submit
						</Button>
					</Form.Item>
				</Form>
			) : (
				<SuccessPage
					path={`/trip/${viewTrip}/expenses`}
					customExitLine="Go back"
					// otherAction="Log another expense"
					// otherActionPath={`/trip/${viewTrip}/expenses/new`}
				/>
			)}
		</ConfigProvider>
	);
};

export default ExpenseEntry;
