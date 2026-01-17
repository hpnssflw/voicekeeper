import { redirect } from "next/navigation";
import { DEMO_MODE } from "@/lib/features";

export default function RootPage() {
  // In demo mode, redirect to landing
  // In production, redirect to dashboard (auth will handle if not logged in)
  if (DEMO_MODE) {
    redirect("/landing");
  }
  
  redirect("/dashboard");
}
