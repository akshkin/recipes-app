import { Button } from "./button";
import { useRouter } from "next/navigation";

function CancelButton() {
	const router = useRouter();
	return (
		<Button
			className="border-2 hover:border-gray-500"
			type="button"
			onClick={() => router.back()}
		>
			Cancel
		</Button>
	);
}

export default CancelButton;
