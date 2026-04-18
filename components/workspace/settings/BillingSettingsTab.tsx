"use client";

import { CreditCard, Landmark, Wallet } from "lucide-react";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { useSettingsContext } from "@/components/workspace/settings/SettingsContext";

function togglePill(checked: boolean) {
  return checked ? "border-pro-primary/45 bg-pro-primary/20" : "border-pro-surface bg-white/[0.04]";
}

function stateClass(state: "Paid" | "Processing" | "Overdue") {
  if (state === "Paid") return "bg-pro-success/12 text-pro-success";
  if (state === "Processing") return "bg-pro-warning/12 text-pro-warning";
  return "bg-red-500/12 text-red-300";
}

export function BillingSettingsTab() {
  const { state, setState } = useSettingsContext();
  const invoicesPagination = usePagination(state.billing.invoices, 5);

  const updateBilling = (patch: Partial<typeof state.billing>) =>
    setState((previous) => ({ ...previous, billing: { ...previous.billing, ...patch } }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="workspace-card-soft p-4">
          <h3 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
            <Wallet size={18} className="text-pro-accent" />
            Billing Controls
          </h3>
          <div className="mt-3 space-y-3">
            <label className="inline-flex items-center justify-between rounded-lg border border-pro-surface bg-white/[0.03] px-3 py-2 text-sm">
              <span>Auto Top-up</span>
              <input checked={state.billing.autoTopup} onChange={(event) => updateBilling({ autoTopup: event.target.checked })} type="checkbox" />
            </label>
            <input className="workspace-input" onChange={(event) => updateBilling({ topupThreshold: event.target.value })} placeholder="Auto top-up threshold" value={state.billing.topupThreshold} />
            <input className="workspace-input" onChange={(event) => updateBilling({ monthlyCap: event.target.value })} placeholder="Monthly budget cap" value={state.billing.monthlyCap} />
            <input className="workspace-input" onChange={(event) => updateBilling({ invoiceEmail: event.target.value })} placeholder="Invoice email" value={state.billing.invoiceEmail} />
            <input className="workspace-input" onChange={(event) => updateBilling({ taxId: event.target.value })} placeholder="Tax ID" value={state.billing.taxId} />
          </div>
        </article>

        <article className="workspace-card-soft p-4">
          <h3 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
            <CreditCard size={18} className="text-pro-accent" />
            Payment Method
          </h3>
          <div className="mt-3 grid gap-2">
            <button className={`rounded-lg border p-3 text-left text-sm transition ${togglePill(state.billing.defaultMethod === "card")}`} onClick={() => updateBilling({ defaultMethod: "card" })} type="button">
              Visa / Mastercard
            </button>
            <button className={`rounded-lg border p-3 text-left text-sm transition ${togglePill(state.billing.defaultMethod === "bank")}`} onClick={() => updateBilling({ defaultMethod: "bank" })} type="button">
              Bank Transfer
            </button>
            <button className={`rounded-lg border p-3 text-left text-sm transition ${togglePill(state.billing.defaultMethod === "usdt")}`} onClick={() => updateBilling({ defaultMethod: "usdt" })} type="button">
              USDT Wallet
            </button>
            <p className="text-pro-muted mt-1 text-xs">
              Default method: <span className="text-pro-main uppercase">{state.billing.defaultMethod}</span>
            </p>
          </div>
        </article>
      </div>

      <article className="workspace-card-soft p-4">
        <h3 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
          <Landmark size={18} className="text-pro-accent" />
          Invoice History
        </h3>
        <div className="mt-3 space-y-2">
          {invoicesPagination.pageItems.map((invoice) => (
            <div className="workspace-card-soft flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between" key={invoice.id}>
              <div>
                <p className="text-sm font-semibold">{invoice.id}</p>
                <p className="text-pro-muted text-xs">
                  {invoice.period} | {invoice.method}
                </p>
              </div>
              <div className="text-right">
                <p className="mono-stat text-sm">{invoice.amount}</p>
                <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs ${stateClass(invoice.state)}`}>{invoice.state}</span>
              </div>
            </div>
          ))}
        </div>
        <PaginationControls
          fromItem={invoicesPagination.fromItem}
          onPageChange={invoicesPagination.setPage}
          onPageSizeChange={invoicesPagination.setPageSize}
          page={invoicesPagination.page}
          pageSize={invoicesPagination.pageSize}
          toItem={invoicesPagination.toItem}
          totalItems={invoicesPagination.totalItems}
          totalPages={invoicesPagination.totalPages}
        />
      </article>
    </div>
  );
}
