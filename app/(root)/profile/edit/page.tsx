import EditProfile from "@/components/forms/EditProfile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import React from "react";

async function Page() {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    return <p className="text-center">No user found!</p>;
  }

  const result = await getUserById(clerkId);

  const { bio, socialLinks } = result?.user;

  return (
    <div>
      <EditProfile bio={bio} socialLinks={socialLinks} />
    </div>
  );
}

export default Page;
