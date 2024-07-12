import {
	FileAddOutlined,
	DollarOutlined,
	SearchOutlined,
	CloseCircleOutlined,
} from "@ant-design/icons";
import { Divider } from "antd";

export default function HelpPage() {
	return (
		<div className="help-box">
			<h2>Halp.</h2>
			<span>Lower right buttons:</span>
			<ul>
				<li>
					<FileAddOutlined className="help-icon" /> Add new activity
				</li>
				<li>
					<DollarOutlined className="help-icon" /> Expense report
					viewer
				</li>
				<li>
					<SearchOutlined className="help-icon" /> *Global search (not
					yet functional HAHA)
				</li>
				<li>
					<CloseCircleOutlined className="help-icon" />
					Close everything/return to activity list
				</li>
			</ul>
			<p>
				In Activities List: Double click to see activity detail. From
				detail page, you can edit or delete activity.
			</p>
			<p>
				In Expenses: Export CSV with the button at the bottom, or add a
				new expense. You can tap to enable deletion (tap on red bin 1x)
				or update existing expense (tap around elsewhere on the grid to
				get it to stop editing lol). It'll ask you to confirm your edits
				but deletes straight away. If you enter a new expense, notice
				you can add a few more fields than are currently shown.
			</p>
			<p>
				Click on the trip name in the header to choose a different trip.
			</p>
			<div style={{ fontSize: "0.8rem", textAlign: "center" }}>
				<Divider type="horizontal" />
				<span>
					Icons from{" "}
					<a href="https://www.flaticon.com/" target="_blank">
						{" "}
						Flaticon
					</a>{" "}
					&{" "}
					<a
						href="https://thenounproject.com/browse/icons/term/kiwi/"
						target="_blank"
						title="Kiwi Icons"
					>
						Noun Project
					</a>{" "}
					(CC BY 3.0), and{" "}
					<a target="_blank" href="https://icons8.com">
						Icons8
					</a>
					. More art from Art Institute of Chicago. | LCM
				</span>
			</div>
		</div>
	);
}
