import EditProfile from "@/components/forms/EditProfile";
import { getUserById } from "@/lib/actions/user.action";
import { Profile } from "@/types";
import { auth } from "@clerk/nextjs/server";

async function Page() {
	const { userId: clerkId } = await auth();

	if (!clerkId) {
		return <p className="text-center">No user found!</p>;
	}

	const result = await getUserById(clerkId);

	if (!result?.user) {
		return <p className="text-center">Profile not found</p>;
	}

	const { bio, socialLinks } = result?.user as Profile;

	return (
		<div>
			<EditProfile bio={bio} socialLinks={socialLinks} />
		</div>
	);
}

export default Page;
