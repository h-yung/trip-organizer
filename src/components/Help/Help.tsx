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
					<SearchOutlined className="help-icon" /> *Global search
					(N/A)
				</li>
				<li>
					<CloseCircleOutlined className="help-icon" />
					Return to activity list
				</li>
			</ul>
			<p>Update/delete Activities: From detail page.</p>
			<p>
				Expenses: Export CSV / Add new expense. Edit/Delete from table
				(tap outside the grid to get it to stop editing lol). It'll ask
				you to confirm your edits but deletes straight away.
			</p>
			<p>Suggested categories: Activity, Food, Lodging, Prep/Sundry</p>
			<p>To choose a different trip, tap on the header.</p>
			<div style={{ fontSize: "0.8rem", textAlign: "center" }}>
				<Divider type="horizontal" />
				<span>
					Icons from{" "}
					<a href="https://www.flaticon.com/" target="_blank">
						Flaticon
					</a>
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
