import { CUISINES } from "@/constants";
import Link from "next/link";

function Sidebar() {
	return (
		<div className="my-6">
			<h2 className="h2">Cuisines</h2>
			<div className="flex gap-3 overflow-x-scroll my-3">
				{CUISINES.map((cuisine) => (
					<Link
						key={cuisine.value}
						href={`/cuisine/${cuisine.title}`}
						className="flex flex-col  items-center link border-[1px] border-gray-300 px-6 py-2 rounded-md"
					>
						<span>{cuisine.icon}</span>
						<span>{cuisine.title}</span>
					</Link>
				))}
			</div>
		</div>
	);
}

export default Sidebar;
