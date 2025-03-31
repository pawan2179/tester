import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="m-10">
      <SignInButton>
        <Button>Login</Button>
      </SignInButton>
    </div>
  );
}
