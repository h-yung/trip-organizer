import { redirect, useNavigate } from "react-router-dom";
import "./loginPage.scss";
import { Button, ConfigProvider, Form, Input } from "antd";
import { useContext, useEffect, useState } from "react";
import { UserContext, useUserContext } from "../../utils/UserContext";
import { sampleUsers } from "../../utils/sampleData";
import dolphin from "../../assets/kiwi-bird.svg";
import { authenticate } from "../../apis/main";

const ENV = import.meta.env.VITE_MODE;

type FieldType = {
	username?: string;
	password?: string;
	remember?: string;
};

interface LoginPageProps {}

const LoginPage = ({}: LoginPageProps) => {
	const { setActiveUsr, activeUsr } = useUserContext();
	const navigate = useNavigate();

	const [msg, setMsg] = useState("Click to submit");
	const submit = async (values: any) => {
		const { username, password } = values;

		if (ENV === "dev") {
			console.log("tis dev");

			// setSelectedActivity(entry); //maybe need a way to force activityviewer to refresh
			const user = sampleUsers.find(
				(user) => user.lookupName === username
			);
			if (user) {
				navigate("/trip");
				setActiveUsr(user);
			} else {
				setMsg("Locked out? Contact admin.");
			}

			return;
		}

		//authenticate
		const user = await authenticate(username, password);
		if (user) {
			navigate("/trip");
			setActiveUsr(user);
		} else {
			setMsg("Locked out? Contact admin.");
		}

		return;
	};

	const onFinishFailed = () => {
		console.log("Could not submit.");
	};

	useEffect(() => {
		if (activeUsr) navigate("/trip"); //or fix later to last attptd
	}, [activeUsr]);

	return (
		<ConfigProvider
			theme={{
				components: {
					Button: {
						defaultBg: "#00c28e",
						defaultHoverBg: "transparent",
						defaultColor: "red",
					},
				},
			}}
		>
			<div className="login-container">
				<div style={{ margin: "1rem" }}>
					<h2 className="splash">Oy!</h2>
					<span className="titles">Sign in below.</span>
				</div>

				<Form
					className="login-form"
					size="large"
					layout="vertical"
					onFinish={submit}
					onFinishFailed={onFinishFailed}
					// onValuesChange={e=>console.log(e)}
				>
					<Form.Item<FieldType>
						label="Username"
						name="username"
						rules={[
							{
								required: true,
								message: "Provide your lookup name.",
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item<FieldType>
						label="Password"
						name="password"
						rules={[
							{
								required: true,
								message: "Enter password.",
							},
						]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item style={{ marginTop: "3rem" }}>
						<Button
							htmlType="submit"
							size="large"
							shape="circle"
							className="login-btn"
							onSubmit={(e) => e.preventDefault()}
							// style={{
							// 	height: 150,
							// 	width: 150,
							// 	overflow: "hidden",
							// 	border: "none",
							// }}
						>
							<div className="avatar-group">
								<img
									src={dolphin}
									className="avatar-img"
									alt="animal icon avatar"
								/>
							</div>
						</Button>
						<span
							style={{
								letterSpacing: "0.1rem",
								fontSize: "0.8rem",
								color: "black",
								textTransform: "uppercase",
								marginTop: "1rem",
							}} //scss not overriding link
						>
							{msg}
						</span>
					</Form.Item>
				</Form>
			</div>
		</ConfigProvider>
	);
};

export default LoginPage;
