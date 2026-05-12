import Image from "next/image";

export default function Loading() {
	return (
		<Image
			src="/assets/icons/bubble-loading.svg"
			alt="loading..."
			width={30}
			height={30}
			className="block mx-auto mt-8"
		/>
	);
}
