import { redirect } from "next/navigation";

export default function WaitlistEntryPage() {
  redirect("/auth/signup?source=waitlist");
}

