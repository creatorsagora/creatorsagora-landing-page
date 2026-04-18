import { WorkspaceShell } from "@/components/app-shell/WorkspaceShell";
import { AnalyticsPageView } from "@/components/workspace/AnalyticsPageView";
import { CalendarDays, Download } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <WorkspaceShell
      title="Analytics"
      topActions={
        <>
          <button className="btn-pro-secondary inline-flex h-10 items-center gap-1.5 px-4 py-0 text-sm">
            <CalendarDays size={14} />
            Last 30 days
          </button>
          <button className="btn-pro-primary inline-flex h-10 items-center gap-1.5 px-4 py-0 text-sm">
            <Download size={14} />
            Export Report
          </button>
        </>
      }
    >
      <AnalyticsPageView />
    </WorkspaceShell>
  );
}
