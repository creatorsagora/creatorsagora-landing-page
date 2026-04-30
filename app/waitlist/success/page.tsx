import Link from "next/link";
import { BellRing, Clock3 } from "lucide-react";

export default function WaitlistSuccessPage() {
  return (
    <main className="workspace-shell flex min-h-screen items-center justify-center p-4 md:p-6">
      <section className="workspace-card w-full max-w-2xl p-6 md:p-8">
        <div className="workspace-card-soft inline-flex items-center gap-2 rounded-full border-pro-accent/30 bg-pro-accent/10 px-3 py-1.5 text-xs font-semibold text-pro-main">
          <BellRing size={14} className="text-pro-accent" />
          Waitlist Confirmed
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold">You are on the CreatorsAgora waitlist.</h1>
        <p className="text-pro-muted mt-2 max-w-xl text-sm leading-6">
          Thanks for registering. You will be notified by email once accounts are activated for launch.
          Until then, dashboard access is paused for waitlist members.
        </p>

        <div className="workspace-card-soft mt-5 flex items-start gap-3 rounded-xl p-4">
          <Clock3 className="mt-0.5 text-pro-accent" size={18} />
          <div>
            <p className="text-sm font-semibold">What happens next?</p>
            <p className="text-pro-muted mt-1 text-sm">
              When CreatorsAgora goes live, we will send a bulk launch notification and your account access will be enabled.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link className="btn-pro-secondary h-10 px-4 py-0 text-sm" href="/">
            Back to Landing
          </Link>
          <Link className="btn-pro-primary h-10 px-4 py-0 text-sm" href="/auth/login">
            Go to Login
          </Link>
        </div>
      </section>
    </main>
  );
}

