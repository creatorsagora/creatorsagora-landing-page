import { WorkspaceShell } from "@/components/app-shell/WorkspaceShell";
import { WalletPageView } from "@/components/workspace/WalletPageView";
import { Download } from "lucide-react";

export default function WalletPage() {
  return (
    <WorkspaceShell
      title="Wallet"
      topActions={
        <>
          <button className="btn-pro-secondary inline-flex h-10 items-center gap-1.5 px-4 py-0 text-sm">
            <Download size={14} />
            Export Statement
          </button>
        </>
      }
    >
      <WalletPageView />
    </WorkspaceShell>
  );
}
