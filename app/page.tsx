import { useUser } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Home() {
  const user = await currentUser();

  return (
    <div>
      <h1>Hello {user?.firstName}</h1>
    </div>
  );
}
