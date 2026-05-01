"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { useCurrency } from "@/components/preferences/CurrencyProvider";
import { useLanguage } from "@/components/preferences/LanguageProvider";
import { persistAuthSession, signupRequest } from "@/lib/auth-client";
import { resolveLanguageFromLocale } from "@/lib/languages";
import { persistUserRole, type UserRole } from "@/lib/user-role";

const promoterProfileOptions = ["Artist / Musician", "Brand / Startup", "Agency / Manager", "Event Organizer"];
const promoterGoalOptions = ["Find Niche Creators", "Boost Brand Awareness", "Drive Sales", "Launch New Product", "Grow Community"];

const creatorNicheOptions = ["Fashion", "Beauty", "Lifestyle", "Tech", "Fitness", "Food", "Travel", "Gaming", "Finance", "Education"];
const creatorLookingForOptions = ["Brand Partnerships", "Long-Term Retainers", "UGC Projects", "Event Collaborations", "Affiliate Deals"];
const socialPlatforms = ["Instagram", "TikTok", "YouTube", "X", "LinkedIn", "Website", "Other"];

type CreatorSocialLink = {
  platform: string;
  url: string;
};

function toggleSelection(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function chipClass(selected: boolean) {
  return selected
    ? "border-pro-primary/55 bg-pro-primary/18 text-pro-main shadow-[0_0_0_1px_rgba(76,58,255,0.35)]"
    : "border-pro-surface bg-pro-primary/6 text-pro-muted hover:border-pro-primary/35 hover:text-pro-main";
}

function addCustomValue(values: string[], value: string) {
  const trimmed = value.trim();
  if (!trimmed) return values;
  if (values.some((entry) => entry.toLowerCase() === trimmed.toLowerCase())) return values;
  return [...values, trimmed];
}

function normalizeCreatorSocialLinks(links: CreatorSocialLink[]) {
  return links
    .map((link) => ({ platform: link.platform.trim(), url: link.url.trim() }))
    .filter((link) => link.platform && link.url);
}

export function SignupPageView() {
  const router = useRouter();
  const totalSteps = 3;
  const [isWaitlistFlow, setIsWaitlistFlow] = useState(false);
  const [role, setRole] = useState<UserRole>("promoter");
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Johnson");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("password123");

  const [promoterProfileTags, setPromoterProfileTags] = useState<string[]>(["Brand / Startup"]);
  const [promoterGoals, setPromoterGoals] = useState<string[]>(["Find Niche Creators"]);
  const [promoterGoalCustomInput, setPromoterGoalCustomInput] = useState("");

  const [creatorNiches, setCreatorNiches] = useState<string[]>(["Lifestyle"]);
  const [creatorNicheCustomInput, setCreatorNicheCustomInput] = useState("");
  const [creatorLookingFor, setCreatorLookingFor] = useState<string[]>(["Brand Partnerships"]);
  const [creatorLookingForCustomInput, setCreatorLookingForCustomInput] = useState("");
  const [creatorSocialLinks, setCreatorSocialLinks] = useState<CreatorSocialLink[]>([{ platform: "Instagram", url: "" }]);

  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { countryCode, countryOptions, currencyCode, currencyName, phoneCode, setCountry } = useCurrency();
  const { languageCode, languageOptions, setLanguageCode } = useLanguage();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsWaitlistFlow(params.get("source") === "waitlist");
  }, []);

  const stepProgressPercent = (step / totalSteps) * 100;

  const validateStep = (targetStep: number) => {
    if (targetStep === 1) {
      if (!firstName.trim() || !lastName.trim()) {
        setError("First name and last name are required.");
        return false;
      }
      if (!email.trim() || !email.includes("@")) {
        setError("Enter a valid email address.");
        return false;
      }
      if (!password || password.length < 6) {
        setError("Password must be at least 6 characters.");
        return false;
      }
    }

    if (targetStep === 2) {
      if (!phoneNumber.trim()) {
        setError("Phone number is required.");
        return false;
      }
    }

    if (targetStep === 3) {
      if (!acceptedTerms) {
        setError("You must agree to the Terms of Service and Privacy Policy.");
        return false;
      }

      if (role === "promoter" && promoterProfileTags.length === 0) {
        setError("Select at least one promoter profile tag.");
        return false;
      }
      if (role === "promoter" && promoterGoals.length === 0) {
        setError("Select at least one promoter objective so AI can match creator niches.");
        return false;
      }
      if (role === "creator" && creatorLookingFor.length === 0) {
        setError("Select at least one creator objective.");
        return false;
      }
      if (role === "creator" && creatorNiches.length === 0) {
        setError("Select at least one creator niche so AI can match relevant campaigns.");
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    setError("");
    if (!validateStep(step)) return;
    setStep((current) => Math.min(current + 1, totalSteps));
  };

  const handlePreviousStep = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
  };

  const handleSubmit = async () => {
    setError("");
    if (!validateStep(3)) return;
    setSubmitting(true);
    try {
      const response = await signupRequest({
        firstName,
        lastName,
        email,
        password,
        phone: `${phoneCode} ${phoneNumber}`.trim(),
        country: countryCode,
        currency: currencyCode,
        language: languageCode,
        role,
        source: isWaitlistFlow ? "waitlist" : "direct",
        onboarding: {
          promoter: {
            profileTags: promoterProfileTags,
            goals: promoterGoals,
            creatorTypes: []
          },
          creator: {
            niches: creatorNiches,
            lookingFor: creatorLookingFor,
            socialLinks: normalizeCreatorSocialLinks(creatorSocialLinks)
          }
        }
      });

      if (isWaitlistFlow) {
        router.replace("/waitlist/success");
        return;
      }

      persistAuthSession(response);
      persistUserRole(role);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title={isWaitlistFlow ? "Join Waitlist" : "Create Account"}
      subtitle={
        isWaitlistFlow
          ? "Reserve your spot. We will notify you as soon as CreatorsAgora goes live."
          : "Start launching AI-powered creator campaigns in minutes."
      }
    >
      <form className="space-y-3" onSubmit={(event) => event.preventDefault()}>
        <div className="workspace-card-soft rounded-xl p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-pro-main">
              Step {step} of {totalSteps}
            </p>
            <p className="text-pro-muted text-xs">{step === 1 ? "Account" : step === 2 ? "Location & Mode" : "Onboarding"}</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full border border-pro-surface bg-pro-primary/10">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-pro-primary via-[#7C3AED] to-pro-accent transition-all duration-500"
              style={{ width: `${stepProgressPercent}%` }}
            />
          </div>
        </div>

        {step === 1 ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-pro-muted mb-1 block text-sm">First Name</label>
                <input className="workspace-input" onChange={(event) => setFirstName(event.target.value)} value={firstName} />
              </div>
              <div>
                <label className="text-pro-muted mb-1 block text-sm">Last Name</label>
                <input className="workspace-input" onChange={(event) => setLastName(event.target.value)} value={lastName} />
              </div>
            </div>

            <div>
              <label className="text-pro-muted mb-1 block text-sm">Work Email</label>
              <input className="workspace-input" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
            </div>

            <div>
              <label className="text-pro-muted mb-1 block text-sm">Password</label>
              <input className="workspace-input" onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-pro-muted mb-1 block text-sm">Country</label>
                <select
                  className="workspace-input"
                  value={countryCode}
                  onChange={(event) => {
                    const nextCode = event.target.value;
                    setCountry(nextCode);
                    const country = countryOptions.find((option) => option.code === nextCode);
                    if (country?.locale) {
                      setLanguageCode(resolveLanguageFromLocale(country.locale));
                    }
                  }}
                >
                  {countryOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <p className="text-pro-muted mt-1 text-xs">
                  Currency auto-selected: <span className="text-pro-main font-semibold">{currencyCode}</span> ({currencyName})
                </p>
              </div>
              <div>
                <label className="text-pro-muted mb-1 block text-sm">Phone Number</label>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-11 items-center rounded-lg border border-pro-surface bg-white/[0.04] px-3 text-sm font-semibold text-pro-main">
                    {phoneCode}
                  </span>
                  <input
                    className="workspace-input"
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    placeholder="801 234 5678"
                    type="tel"
                    value={phoneNumber}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-pro-muted mb-1 block text-sm">Global Language</label>
              <select className="workspace-input" onChange={(event) => setLanguageCode(event.target.value)} value={languageCode}>
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label} ({option.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-pro-muted mb-1 block text-sm">Start In Mode</label>
              <select className="workspace-input" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
                <option value="promoter">Promoter</option>
                <option value="creator">Creator</option>
              </select>
              <p className="text-pro-muted mt-1 text-xs">
                One account supports both modes. You can switch between promoter and creator anytime from the header or settings.
              </p>
              <p className="text-pro-muted mt-1 text-xs">
                Creator accounts can earn a <span className="text-pro-main font-semibold">Verified Influencer</span> badge after manual review.
              </p>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div className="workspace-card-soft space-y-4 rounded-xl p-3 sm:p-4">
              <div>
                <p className="text-sm font-semibold text-pro-main">{role === "promoter" ? "Promoter Onboarding" : "Creator Onboarding"}</p>
                <p className="text-pro-muted mt-1 text-xs">
                  {role === "promoter"
                    ? "Tell us your profile and priorities so AI can recommend the right creators for every budget."
                    : "Tell us your niches and goals so AI can route matching campaigns to you."}
                </p>
              </div>

              {role === "promoter" ? (
                <>
                  <div>
                    <p className="text-pro-muted mb-2 text-xs uppercase tracking-[0.12em]">Who Are You?</p>
                    <div className="flex flex-wrap gap-2">
                      {promoterProfileOptions.map((profile) => {
                        const selected = promoterProfileTags.includes(profile);
                        return (
                          <button
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${chipClass(selected)}`}
                            key={profile}
                            onClick={() => setPromoterProfileTags((current) => toggleSelection(current, profile))}
                            type="button"
                          >
                            {profile}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-pro-muted mb-2 text-xs uppercase tracking-[0.12em]">What Are You Looking For?</p>
                    <div className="flex flex-wrap gap-2">
                      {promoterGoalOptions.map((goal) => {
                        const selected = promoterGoals.includes(goal);
                        return (
                          <button
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${chipClass(selected)}`}
                            key={goal}
                            onClick={() => setPromoterGoals((current) => toggleSelection(current, goal))}
                            type="button"
                          >
                            {goal}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input
                        className="workspace-input h-9"
                        placeholder="Other objective..."
                        value={promoterGoalCustomInput}
                        onChange={(event) => setPromoterGoalCustomInput(event.target.value)}
                      />
                      <button
                        className="btn-pro-secondary h-9 px-3 py-0 text-xs"
                        type="button"
                        onClick={() => {
                          setPromoterGoals((current) => addCustomValue(current, promoterGoalCustomInput));
                          setPromoterGoalCustomInput("");
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                </>
              ) : (
                <>
                  <div>
                    <p className="text-pro-muted mb-2 text-xs uppercase tracking-[0.12em]">What Are You Looking For?</p>
                    <div className="flex flex-wrap gap-2">
                      {creatorLookingForOptions.map((goal) => {
                        const selected = creatorLookingFor.includes(goal);
                        return (
                          <button
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${chipClass(selected)}`}
                            key={goal}
                            onClick={() => setCreatorLookingFor((current) => toggleSelection(current, goal))}
                            type="button"
                          >
                            {goal}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input
                        className="workspace-input h-9"
                        placeholder="Other objective..."
                        value={creatorLookingForCustomInput}
                        onChange={(event) => setCreatorLookingForCustomInput(event.target.value)}
                      />
                      <button
                        className="btn-pro-secondary h-9 px-3 py-0 text-xs"
                        type="button"
                        onClick={() => {
                          setCreatorLookingFor((current) => addCustomValue(current, creatorLookingForCustomInput));
                          setCreatorLookingForCustomInput("");
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-pro-muted mb-2 text-xs uppercase tracking-[0.12em]">Creator Niche Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {creatorNicheOptions.map((niche) => {
                        const selected = creatorNiches.includes(niche);
                        return (
                          <button
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${chipClass(selected)}`}
                            key={niche}
                            onClick={() => setCreatorNiches((current) => toggleSelection(current, niche))}
                            type="button"
                          >
                            {niche}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <input
                        className="workspace-input h-9"
                        placeholder="Other niche..."
                        value={creatorNicheCustomInput}
                        onChange={(event) => setCreatorNicheCustomInput(event.target.value)}
                      />
                      <button
                        className="btn-pro-secondary h-9 px-3 py-0 text-xs"
                        type="button"
                        onClick={() => {
                          setCreatorNiches((current) => addCustomValue(current, creatorNicheCustomInput));
                          setCreatorNicheCustomInput("");
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-pro-muted text-xs uppercase tracking-[0.12em]">Social Media Links</p>
                      <button
                        className="btn-pro-secondary h-8 px-3 py-0 text-xs"
                        type="button"
                        onClick={() =>
                          setCreatorSocialLinks((current) => [...current, { platform: "Instagram", url: "" }])
                        }
                      >
                        Add Social Link
                      </button>
                    </div>
                    <div className="space-y-2">
                      {creatorSocialLinks.map((link, index) => (
                        <div className="grid gap-2 sm:grid-cols-[150px_1fr_auto]" key={`${link.platform}-${index}`}>
                          <select
                            className="workspace-input h-9"
                            value={link.platform}
                            onChange={(event) => {
                              const next = [...creatorSocialLinks];
                              next[index] = { ...next[index], platform: event.target.value };
                              setCreatorSocialLinks(next);
                            }}
                          >
                            {socialPlatforms.map((platform) => (
                              <option key={platform} value={platform}>
                                {platform}
                              </option>
                            ))}
                          </select>
                          <input
                            className="workspace-input h-9"
                            placeholder="https://..."
                            value={link.url}
                            onChange={(event) => {
                              const next = [...creatorSocialLinks];
                              next[index] = { ...next[index], url: event.target.value };
                              setCreatorSocialLinks(next);
                            }}
                          />
                          <button
                            className="btn-pro-secondary h-9 px-3 py-0 text-xs"
                            onClick={() => setCreatorSocialLinks((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <label className="text-pro-muted inline-flex items-start gap-2 text-sm">
              <input
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                type="checkbox"
                className="mt-0.5"
              />
              I agree to the Terms of Service and Privacy Policy.
            </label>
          </>
        ) : null}

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            className="btn-pro-secondary h-11 min-w-[110px] px-4 py-0 text-sm"
            disabled={step === 1 || submitting}
            onClick={handlePreviousStep}
            type="button"
          >
            Back
          </button>

          {step < totalSteps ? (
            <button className="btn-pro-primary h-11 min-w-[130px] px-4 py-0 text-sm" disabled={submitting} onClick={handleNextStep} type="button">
              Next Step
            </button>
          ) : (
            <button className="btn-pro-primary h-11 min-w-[170px] px-4 py-0 text-sm" type="button" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          )}
        </div>

        {error ? <p className="rounded-lg border border-[#ff4d6d66] bg-[#ff4d6d1a] px-3 py-2 text-sm text-[#ff8b9e]">{error}</p> : null}
      </form>

      <p className="text-pro-muted mt-4 text-sm">
        Already have an account?{" "}
        <Link className="text-pro-accent" href="/auth/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
