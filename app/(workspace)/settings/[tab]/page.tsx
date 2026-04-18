import { redirect } from "next/navigation";
import { WorkspaceShell } from "@/components/app-shell/WorkspaceShell";
import { SettingsProvider } from "@/components/workspace/settings/SettingsContext";
import { SettingsScaffold } from "@/components/workspace/settings/SettingsScaffold";
import { SettingsTabContent } from "@/components/workspace/settings/SettingsTabContent";
import { normalizeSettingsTab, type SettingsTabId } from "@/lib/settings-tabs";

type SettingsTabPageProps = {
  params: Promise<{ tab: string }>;
};

export default async function SettingsTabPage({ params }: SettingsTabPageProps) {
  const { tab } = await params;
  const normalizedTab = normalizeSettingsTab(tab);

  if (tab !== normalizedTab) {
    redirect(`/settings/${normalizedTab}`);
  }

  return (
    <WorkspaceShell title="Profile and Settings">
      <SettingsProvider>
        <SettingsScaffold activeTab={normalizedTab as SettingsTabId}>
          <SettingsTabContent activeTab={normalizedTab as SettingsTabId} />
        </SettingsScaffold>
      </SettingsProvider>
    </WorkspaceShell>
  );
}
