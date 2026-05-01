"use client";

import { Loader2, Sparkles, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import {
  createCampaignRequest,
  fetchCampaignRecommendationsRequest,
  readAuthSession,
  type CampaignRecommendationResponse
} from "@/lib/auth-client";

const goals = [
  { label: "Brand Awareness", value: "Awareness" },
  { label: "Viral Growth", value: "Viral" },
  { label: "Direct Sales", value: "Sales" }
] as const;
const categories = ["Fashion", "Music", "Brand", "Event", "Lifestyle", "Tech"];
const interestOptions = ["Fashion", "Beauty", "Lifestyle", "Technology", "Finance", "Gaming", "Fitness", "Travel"];

type GoalValue = (typeof goals)[number]["value"];
type CreatorRecommendation = CampaignRecommendationResponse["recommendedCreators"][number];

function chipClass(selected: boolean) {
  return selected
    ? "border-pro-primary/55 bg-pro-primary/18 text-pro-main shadow-[0_0_0_1px_rgba(76,58,255,0.35)]"
    : "border-pro-surface bg-pro-primary/6 text-pro-muted hover:border-pro-primary/35 hover:text-pro-main";
}

function toggleSelection(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function formatLargeNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

export function CreateCampaignPageView() {
  const { formatDualFromUsd, formatFromUsd } = useCurrency();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [goal, setGoal] = useState<GoalValue>("Awareness");
  const [budgetUsd, setBudgetUsd] = useState(1200);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(35);
  const [interests, setInterests] = useState<string[]>(["Fashion", "Lifestyle"]);
  const [customInterest, setCustomInterest] = useState("");

  const [recommendations, setRecommendations] = useState<CreatorRecommendation[]>([]);
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const [estimatedReach, setEstimatedReach] = useState<number | null>(null);
  const [planCreatorsCount, setPlanCreatorsCount] = useState<number | null>(null);
  const [planInfluencersCount, setPlanInfluencersCount] = useState<number | null>(null);

  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [launchingCampaign, setLaunchingCampaign] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const budgetPair = useMemo(() => formatDualFromUsd(budgetUsd), [budgetUsd, formatDualFromUsd]);
  const locationList = useMemo(
    () =>
      locationInput
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    [locationInput]
  );

  const handleAddCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (!trimmed) return;
    if (!interests.some((entry) => entry.toLowerCase() === trimmed.toLowerCase())) {
      setInterests((current) => [...current, trimmed]);
    }
    setCustomInterest("");
  };

  const handleGetRecommendations = async () => {
    setError("");
    setSuccessMessage("");

    if (!title.trim() || !description.trim()) {
      setError("Campaign name and promotion details are required.");
      return;
    }
    if (interests.length === 0) {
      setError("Select at least one campaign interest.");
      return;
    }

    const session = readAuthSession();
    if (!session?.token) {
      setError("Please sign in to generate AI recommendations.");
      return;
    }

    setLoadingRecommendations(true);
    try {
      const response = await fetchCampaignRecommendationsRequest(session.token, {
        category,
        goal,
        budgetUsd,
        interests
      });
      setRecommendations(response.recommendedCreators ?? []);
      setSelectedCreatorIds((response.recommendedCreators ?? []).slice(0, 4).map((entry) => entry.id));
      setEstimatedReach(response.aiPlan?.estimatedReach ?? null);
      setPlanCreatorsCount(response.aiPlan?.creatorsCount ?? null);
      setPlanInfluencersCount(response.aiPlan?.influencersCount ?? null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to generate recommendations");
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleLaunchCampaign = async () => {
    setError("");
    setSuccessMessage("");

    if (!title.trim() || !description.trim()) {
      setError("Campaign name and promotion details are required.");
      return;
    }

    const session = readAuthSession();
    if (!session?.token) {
      setError("Please sign in to create campaign.");
      return;
    }

    setLaunchingCampaign(true);
    try {
      const response = await createCampaignRequest(session.token, {
        title: title.trim(),
        description: description.trim(),
        category,
        goal,
        budgetUsd,
        startDate: startDate || null,
        endDate: endDate || null,
        targetAudience: {
          locations: locationList,
          ageMin,
          ageMax,
          interests
        },
        suggestedCreatorIds: selectedCreatorIds
      });

      setSuccessMessage(
        `Campaign created. ${response.campaign.title} is now pending with ${selectedCreatorIds.length} creator invite${
          selectedCreatorIds.length === 1 ? "" : "s"
        }.`
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to launch campaign");
    } finally {
      setLaunchingCampaign(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1020px] space-y-5">
      <section className="workspace-card p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-pro-muted mb-1.5 block text-sm">Campaign Name</label>
            <input className="workspace-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Summer Fashion Launch" />
          </div>

          <div>
            <label className="text-pro-muted mb-1.5 block text-sm">Category</label>
            <select className="workspace-input" value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-pro-muted mb-1.5 block text-sm">What are you promoting?</label>
          <textarea
            className="workspace-input h-28 resize-none py-3"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe your product, campaign angle, and expected outcomes."
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-pro-muted mb-2 block text-sm">Campaign Goal</label>
            <div className="grid gap-2 sm:grid-cols-3">
              {goals.map((option) => {
                const selected = option.value === goal;
                return (
                  <button
                    className={`rounded-lg border px-3 py-2 text-sm transition ${chipClass(selected)}`}
                    key={option.value}
                    type="button"
                    onClick={() => setGoal(option.value)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-pro-muted mb-1.5 block text-sm">Campaign Timeline</label>
            <div className="grid gap-2 sm:grid-cols-2">
              <input className="workspace-input" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
              <input className="workspace-input" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-pro-muted mb-1.5 block text-sm">Budget (AI uses this to match creator tier)</label>
          <div className="workspace-card-soft p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="mono-stat text-xl font-bold">{budgetPair.local}</p>
              <p className="text-xs text-pro-muted">{budgetPair.usd ?? formatFromUsd(budgetUsd)}</p>
            </div>
            <input
              className="w-full accent-[#4C3AFF]"
              type="range"
              min={150}
              max={25000}
              step={50}
              value={budgetUsd}
              onChange={(event) => setBudgetUsd(Number(event.target.value))}
            />
            <div className="mt-2 flex justify-between text-xs text-pro-muted">
              <span>{formatDualFromUsd(150).local}</span>
              <span>{formatDualFromUsd(25000).local}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-pro-muted mb-1.5 block text-sm">Target Locations</label>
            <input
              className="workspace-input"
              value={locationInput}
              onChange={(event) => setLocationInput(event.target.value)}
              placeholder="Lagos, Accra, Johannesburg"
            />
          </div>

          <div>
            <label className="text-pro-muted mb-1.5 block text-sm">Age Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="workspace-input"
                type="number"
                min={13}
                max={80}
                value={ageMin}
                onChange={(event) => setAgeMin(Number(event.target.value) || 18)}
              />
              <input
                className="workspace-input"
                type="number"
                min={13}
                max={80}
                value={ageMax}
                onChange={(event) => setAgeMax(Number(event.target.value) || 35)}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-pro-muted mb-2 block text-sm">Campaign Interests / Niches</label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => {
              const selected = interests.includes(interest);
              return (
                <button
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${chipClass(selected)}`}
                  key={interest}
                  type="button"
                  onClick={() => setInterests((current) => toggleSelection(current, interest))}
                >
                  {interest}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              className="workspace-input h-9"
              value={customInterest}
              onChange={(event) => setCustomInterest(event.target.value)}
              placeholder="Other interest..."
            />
            <button className="btn-pro-secondary h-9 px-3 py-0 text-xs" type="button" onClick={handleAddCustomInterest}>
              Add
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button className="btn-pro-primary h-11 px-5 py-0 text-sm" type="button" onClick={handleGetRecommendations} disabled={loadingRecommendations}>
            {loadingRecommendations ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Matching Creators...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Get AI Suggestions
              </>
            )}
          </button>
        </div>
      </section>

      <section className="workspace-card p-4 md:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-xl font-semibold">AI Creator Suggestions</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            {planCreatorsCount !== null ? <span className="workspace-badge">Recommended Creators: {planCreatorsCount}</span> : null}
            {planInfluencersCount !== null ? <span className="workspace-badge">Influencer Mix: {planInfluencersCount}</span> : null}
            {estimatedReach !== null ? <span className="workspace-badge">Est. Reach: {estimatedReach.toLocaleString()}</span> : null}
          </div>
        </div>

        {recommendations.length === 0 ? (
          <div className="workspace-card-soft p-4 text-sm text-pro-muted">
            Fill your campaign details, set budget, and click <span className="text-pro-main font-semibold">Get AI Suggestions</span> to see matched creator cards.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex snap-x gap-3 overflow-x-auto pb-2">
              {recommendations.map((creator) => {
                const selected = selectedCreatorIds.includes(creator.id);
                const payout = formatDualFromUsd(creator.suggestedPayoutUsd);
                return (
                  <article
                    className={`workspace-card-soft min-w-[290px] snap-start p-3 transition ${
                      selected ? "border-pro-primary/60 bg-pro-primary/12 shadow-[0_0_0_1px_rgba(76,58,255,0.3)]" : ""
                    }`}
                    key={creator.id}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{creator.fullName}</p>
                        <p className="mt-1 text-xs text-pro-muted">{creator.niches.slice(0, 3).join(" • ") || "General Creator"}</p>
                      </div>
                      <span className="workspace-badge border-pro-accent/35 bg-pro-accent/10 text-pro-accent">{creator.fitScore}% fit</span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="workspace-card-soft p-2">
                        <p className="text-pro-muted">Followers</p>
                        <p className="mono-stat mt-0.5 text-sm font-semibold">{formatLargeNumber(creator.followers)}</p>
                      </div>
                      <div className="workspace-card-soft p-2">
                        <p className="text-pro-muted">Engagement</p>
                        <p className="mono-stat mt-0.5 text-sm font-semibold">{creator.engagementRate.toFixed(2)}%</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {creator.socialLinks.slice(0, 3).map((link) => (
                        <a
                          className="workspace-badge border-pro-primary/30 hover:border-pro-accent/45 hover:text-pro-main"
                          href={link.url}
                          key={`${creator.id}-${link.platform}-${link.url}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[11px] text-pro-muted">Suggested payout</p>
                        <p className="mono-stat text-sm font-semibold">{payout.local}</p>
                      </div>
                      <button
                        className={`btn-pro-secondary h-9 px-3 py-0 text-xs ${selected ? "border-pro-primary/50 bg-pro-primary/14 text-pro-main" : ""}`}
                        type="button"
                        onClick={() =>
                          setSelectedCreatorIds((current) =>
                            current.includes(creator.id) ? current.filter((id) => id !== creator.id) : [...current, creator.id]
                          )
                        }
                      >
                        {selected ? "Selected" : "Select"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="workspace-card-soft flex flex-wrap items-center justify-between gap-2 p-3">
              <p className="text-sm text-pro-muted">
                <Users size={14} className="mr-1 inline-flex" />
                {selectedCreatorIds.length} creator{selectedCreatorIds.length === 1 ? "" : "s"} selected for launch.
              </p>
              <button
                className="btn-pro-primary h-11 px-5 py-0 text-sm"
                disabled={launchingCampaign}
                onClick={handleLaunchCampaign}
                type="button"
              >
                {launchingCampaign ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Launching...
                  </>
                ) : (
                  "Launch Campaign"
                )}
              </button>
            </div>
          </div>
        )}
      </section>

      {error ? <section className="rounded-xl border border-[#ff4d6d66] bg-[#ff4d6d1a] px-4 py-3 text-sm text-[#ff8b9e]">{error}</section> : null}
      {successMessage ? (
        <section className="rounded-xl border border-pro-success/35 bg-pro-success/10 px-4 py-3 text-sm text-pro-success">{successMessage}</section>
      ) : null}
    </div>
  );
}
