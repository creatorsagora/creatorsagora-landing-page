"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { loginRequest, persistAuthSession, updateModeRequest } from "@/lib/auth-client";
import { persistUserRole, readUserRole, type UserRole } from "@/lib/user-role";

export function LoginPageView() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("promoter");
  const [email, setEmail] = useState("alex@creatoragora.com");
  const [password, setPassword] = useState("password123");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setRole(readUserRole());
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await loginRequest({ email, password });
      const payload =
        response.user.currentMode === role
          ? response
          : await updateModeRequest(response.token, role);
      persistAuthSession(payload);
      persistUserRole(role);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleContinue = () => {
    persistUserRole(role);
    router.push("/dashboard");
  };

  return (
    <AuthShell title="Sign In" subtitle="Access your campaigns, wallet, and analytics dashboard.">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="text-pro-muted mb-1 block text-sm">Email</label>
          <input className="workspace-input" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-pro-muted text-sm">Password</label>
            <Link className="text-xs text-pro-accent" href="#">
              Forgot password?
            </Link>
          </div>
          <input className="workspace-input" onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
        </div>

        <div>
          <label className="text-pro-muted mb-1 block text-sm">Start In Mode</label>
          <select className="workspace-input" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
            <option value="promoter">Promoter</option>
            <option value="creator">Creator</option>
          </select>
          <p className="text-pro-muted mt-1 text-xs">You can switch mode at any time after login.</p>
        </div>

        <label className="text-pro-muted mt-2 inline-flex items-center gap-2 text-sm">
          <input defaultChecked type="checkbox" />
          Keep me signed in
        </label>

        <button className="btn-pro-primary mt-2 h-11 w-full px-4 py-0" type="submit">
          {submitting ? "Signing in..." : "Sign In"}
        </button>

        <button className="btn-pro-secondary h-11 w-full px-4 py-0" type="button" onClick={handleGoogleContinue}>
          Continue with Google
        </button>
        {error ? <p className="rounded-lg border border-[#ff4d6d66] bg-[#ff4d6d1a] px-3 py-2 text-sm text-[#ff8b9e]">{error}</p> : null}
      </form>

      <p className="text-pro-muted mt-4 text-sm">
        New here?{" "}
        <Link className="text-pro-accent" href="/auth/signup">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
