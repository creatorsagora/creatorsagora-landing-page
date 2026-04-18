"use client";

import { Plus } from "lucide-react";
import { useCurrency } from "@/components/preferences/CurrencyProvider";

const goals = ["Brand Awareness", "Viral Growth", "Direct Sales", "Event Attendance"];
const interests = ["Fashion", "Lifestyle", "Technology"];

export function CreateCampaignPageView() {
  const { formatDualFromUsd } = useCurrency();
  const minBudget = formatDualFromUsd(50000 / 1550);
  const midBudget = formatDualFromUsd(500000 / 1550);
  const maxBudget = formatDualFromUsd(2000000 / 1550);

  return (
    <div className="workspace-card mx-auto max-w-[980px] p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">Campaign Details</h2>
          <p className="text-pro-muted text-sm">Step 1 of 3</p>
        </div>
        <button className="btn-pro-secondary h-10 px-4 py-0 text-sm">Save Draft</button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-pro-muted mb-1.5 block text-sm">Campaign Name</label>
          <input className="workspace-input" defaultValue="Summer Fashion Launch" />
        </div>

        <div>
          <label className="text-pro-muted mb-1.5 block text-sm">What are you promoting?</label>
          <textarea className="workspace-input h-28 resize-none py-3" defaultValue="Describe what you are promoting..." />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-pro-muted mb-1.5 block text-sm">Category</label>
            <select className="workspace-input">
              <option>Fashion</option>
              <option>Music</option>
              <option>Brand</option>
              <option>Event</option>
            </select>
          </div>
          <div>
            <label className="text-pro-muted mb-1.5 block text-sm">Budget</label>
            <div className="workspace-card-soft p-3">
              <div className="text-pro-muted mb-2 flex items-center justify-between text-xs">
                <span>{minBudget.local}</span>
                <span className="mono-stat text-pro-main">{midBudget.local}</span>
                <span>{maxBudget.local}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <span className="block h-1.5 w-[58%] rounded-full bg-gradient-to-r from-pro-primary to-pro-accent" />
              </div>
              {midBudget.usd ? <p className="text-pro-muted mt-2 text-xs">Local reference: {midBudget.usd}</p> : null}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-pro-muted mb-1.5 block text-sm">Start Date</label>
            <input className="workspace-input" defaultValue="2026-12-01" />
          </div>
          <div>
            <label className="text-pro-muted mb-1.5 block text-sm">End Date</label>
            <input className="workspace-input" defaultValue="2026-12-30" />
          </div>
        </div>

        <div>
          <label className="text-pro-muted mb-2 block text-sm">Campaign Goal</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {goals.map((goal, index) => (
              <label className="workspace-card-soft flex items-center gap-2 px-3 py-2 text-sm" key={goal}>
                <input type="radio" defaultChecked={index === 0} name="goal" />
                <span>{goal}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-pro-muted mb-1.5 block text-sm">Target Audience Location</label>
          <input className="workspace-input" defaultValue="Lagos, Abuja, Port Harcourt" />
        </div>

        <div>
          <label className="text-pro-muted mb-1.5 block text-sm">Age Range (18 - 65+)</label>
          <div className="h-1.5 rounded-full bg-white/10">
            <span className="block h-1.5 w-[42%] rounded-full bg-gradient-to-r from-pro-primary to-pro-accent" />
          </div>
        </div>

        <div>
          <label className="text-pro-muted mb-2 block text-sm">Interests</label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <span className={`workspace-badge ${index === 0 ? "border-pro-primary/45 bg-pro-primary/20 text-pro-main" : ""}`} key={interest}>
                {interest}
              </span>
            ))}
            <button className="workspace-badge inline-flex items-center gap-1.5">
              <Plus size={12} />
              Add Interest
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="btn-pro-primary h-11 px-6 py-0">Next: Get AI Suggestions</button>
      </div>
    </div>
  );
}
