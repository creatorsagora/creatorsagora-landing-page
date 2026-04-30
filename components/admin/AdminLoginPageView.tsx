"use client";

import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { adminLoginRequest, persistAdminSession } from "@/lib/auth-client";

export function AdminLoginPageView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await adminLoginRequest({ email, password });
      persistAdminSession(response.token, response.admin.email);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login as admin");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Admin Login" subtitle="Separate secure access for CREATORSAGORA administrators.">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="rounded-xl border border-pro-warning/30 bg-pro-warning/10 px-3 py-2 text-sm text-pro-main">
          <p className="inline-flex items-center gap-2 font-semibold">
            <ShieldCheck size={16} className="text-pro-warning" />
            Admin Portal
          </p>
          <p className="mt-1 text-xs text-pro-muted">This login is separate from creator/promoter accounts.</p>
        </div>

        <div>
          <label className="text-pro-muted mb-1 block text-sm">Admin Email</label>
          <input className="workspace-input" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
        </div>
        <div>
          <label className="text-pro-muted mb-1 block text-sm">Admin Password</label>
          <input className="workspace-input" onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
        </div>

        <button className="btn-pro-primary h-11 w-full px-4 py-0" type="submit">
          {submitting ? "Signing in..." : "Login as Admin"}
        </button>

        {error ? <p className="rounded-lg border border-[#ff4d6d66] bg-[#ff4d6d1a] px-3 py-2 text-sm text-[#ff8b9e]">{error}</p> : null}
      </form>
    </AuthShell>
  );
}
