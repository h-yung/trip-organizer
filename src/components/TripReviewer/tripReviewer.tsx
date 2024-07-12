import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, Checkbox, ConfigProvider, Form, Rate } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useContext, useEffect, useMemo, useState } from "react";
import { ActionItem, TripReview, User } from "../../utils/interfaces";
import "./tripReviewer.scss";
import { convertFormToReview } from "../../utils/activityConverter";
import { addTripReview, updateTripReview } from "../../apis/main";
import jsesc from "jsesc";
import SuccessPage from "../Success/Success";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../utils/UserContext";

interface ReviewProps {
	allTripActivities: ActionItem[]; //via activityViewer, bc workflow
	tripReview: TripReview | null;
	setTripReview: (p: TripReview | null) => void;
}

const ENV = import.meta.env.VITE_MODE;

//need form reset

const TripReviewer = ({
	allTripActivities,
	setTripReview,
	tripReview,
}: ReviewProps) => {
	const { activeUsr, viewTrip } = useContext(UserContext);
	const navigate = useNavigate();
	const [isSuccess, setIsSuccess] = useState(false);

	const [form] = Form.useForm();

	const formVals = useMemo(() => {
		const values = {} as Record<string, number | string | boolean>; //assert for key acceptance

		console.log("review from reviewer:", tripReview);
		if (!tripReview) {
			//just iterate over the activities and assign blanks
			for (const activity of allTripActivities) {
				values[activity._id!] = 2.5; //default to "meh"
			}
			values.comment = "";
			values.recommend = false;
		} else {
			for (const itemRated of tripReview.itemRatings) {
				values[itemRated.id] = itemRated.rating;
			}
			values.comment = tripReview.comment;
			values.recommend = tripReview.recommend;
		}

		return values;
	}, [viewTrip, tripReview]);

	const formItemLayoutWithOutLabel = {
		wrapperCol: {
			xs: { span: 24, offset: 0 },
			sm: { span: 20, offset: 4 },
		},
	};

	//checkbox has a specific checked value that needs confirming rather than value. sync value.
	const setCheckboxValue = (e: any) => {
		form.setFieldValue(e.target.id, e.target.checked);
	};

	const submit = async (values: any) => {
		// console.log("form values for activity are by ID", values);
		if (!activeUsr) return;
		const review = convertFormToReview({
			initValSet: values,
			user: activeUsr,
			tripName: viewTrip,
			activities: allTripActivities,
		});

		if (tripReview) {
			//then it's an update
			review._id = tripReview._id;
			console.log("updating review");

			if (ENV === "dev") {
				console.log("is dev:", review);
				setTripReview(review);
				setIsSuccess(true);
				return;
			}
			const update = await updateTripReview(review);

			if (
				update.matchedCount &&
				update.modifiedCount &&
				update.matchedCount === update.modifiedCount
			) {
				console.log("Successfully sent in update!");

				//if update succeeded, apply the updates from submission; does not re-req however
				setTripReview(review); //doesn't seem to work properly..
				setIsSuccess(true);
				return;
			}
		} else {
			//it's a new review
			console.log("adding new review");
			if (ENV === "dev") {
				console.log("is dev:", review);
				setTripReview(review);
				setIsSuccess(true);
				return;
			}

			const response = await addTripReview(review);
			console.log("RESPONSE:", jsesc(response));
			if (response?.insertedId) {
				//if succeeded, apply the updates from submission; does not re-req however
				setTripReview(review); //doesn't seem to work properly..
				setIsSuccess(true);
			}
		}
		return;
	};

	const onFinishFailed = () => {
		console.log("Could not submit.");
	};

	const customIcons: Record<number, React.ReactNode> = {
		1: <FrownOutlined />,
		2: <FrownOutlined />,
		3: <MehOutlined />,
		4: <SmileOutlined />,
		5: <SmileOutlined />,
	};

	useEffect(() => {
		if (!viewTrip) navigate("/trip");
	}, [viewTrip]); //after authentication, activeUsr will never be null

	return !allTripActivities ? (
		<></>
	) : (
		<ConfigProvider
			theme={{
				components: {
					Checkbox: {
						fontSize: 18,
						controlInteractiveSize: 24,
					},
				},
			}}
		>
			{!isSuccess ? (
				<>
					<div className="entry-header">
						<h2>
							<span>Trip Review</span>
							<Link
								to={`/trip/${viewTrip}/activity`}
								className="cancel-update-btn"
							>
								Cancel
							</Link>
						</h2>
						<p className="prepopulated">
							by {activeUsr?.displayName} for {viewTrip}{" "}
						</p>
					</div>

					<Form
						form={form}
						className="review-form"
						labelCol={{ span: 4 }}
						size="large"
						layout="vertical"
						onFinish={submit}
						onFinishFailed={onFinishFailed}
						initialValues={formVals}
						// onValuesChange={e=>console.log(e)}

						{...formItemLayoutWithOutLabel}
					>
						<div className="form-subBlock">
							<label className="subheader">Activities</label>

							{allTripActivities.map((activity: ActionItem) => {
								return (
									<div key={activity._id}>
										<label className="item-label">
											{activity.title}
										</label>

										<Form.Item
											className="form-item"
											name={activity._id}
											// help="Required"
											rules={[{ required: true }]}
										>
											<Rate
												value={
													activity._id! in formVals
														? (formVals[
																activity._id as keyof object
														  ] as number)
														: 2.5
													//while every rating is required,
													//there might be new items added later
													//and then an edit to the review, where
													//existing review has no valid value
												}
												allowHalf
												character={({ index = 0 }) =>
													customIcons[index + 1]
												}
											/>
											{/* since I'm providing default value, might as well require */}
										</Form.Item>
									</div>
								);
							})}
						</div>
						<Form.Item
							className="form-item"
							name="recommend"
							//  rules={[{ required: true }]}
						>
							<Checkbox
								defaultChecked={formVals.recommend as boolean}
								onChange={setCheckboxValue}
							>
								Would you recommend?!
							</Checkbox>
						</Form.Item>

						<label className="item-label">Comments</label>

						<Form.Item
							className="form-item"
							name="comment"
							rules={[{ required: true }]}
							style={{ marginBottom: "3rem" }}
						>
							<TextArea
								rows={4}
								value={formVals.comment as string}
								placeholder="Overall, what went well/could improve?"
							/>
						</Form.Item>

						<Form.Item>
							<Button htmlType="submit" className="send-btn-item">
								Submit
							</Button>
						</Form.Item>
					</Form>
				</>
			) : (
				<SuccessPage
					customExitLine={"Back to activities page"}
					path={`/trip/${viewTrip}/activity`}
				/>
			)}
		</ConfigProvider>
	);
};

export default TripReviewer;
