import { getUserById } from "@/lib/actions/user.action";
import React from "react";

interface ParamsProps {
  params: {
    id: string;
  };
}

async function Page({ params }: ParamsProps) {
  const { id: clerkId } = params;

  const { user } = await getUserById(clerkId);

  return <div>Page</div>;
}

export default Page;
