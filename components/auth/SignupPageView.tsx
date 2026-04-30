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

const promoterGoalOptions = [
  "Brand Awareness",
  "Sales & Conversion",
  "Product Launch Hype",
  "Community Growth",
  "Event Promotion",
  "UGC Content Pipeline"
];

const promoterCreatorTypeOptions = ["Micro Creators", "Mid-Tier Creators", "Macro Creators", "Niche Experts", "UGC Creators", "Influencers"];

const creatorNicheOptions = [
  "Fashion",
  "Beauty",
  "Lifestyle",
  "Tech",
  "Fitness",
  "Food",
  "Travel",
  "Gaming",
  "Finance",
  "Education"
];

const creatorFormatOptions = ["Short-form Video", "Long-form Video", "Photo Content", "Live Sessions", "Story Posts", "Thread Posts"];

function toggleSelection(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function chipClass(selected: boolean) {
  return selected
    ? "border-pro-primary/55 bg-pro-primary/18 text-pro-main shadow-[0_0_0_1px_rgba(76,58,255,0.35)]"
    : "border-pro-surface bg-pro-primary/6 text-pro-muted hover:border-pro-primary/35 hover:text-pro-main";
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
  const [promoterGoals, setPromoterGoals] = useState<string[]>(["Brand Awareness"]);
  const [promoterCreatorTypes, setPromoterCreatorTypes] = useState<string[]>(["Micro Creators"]);
  const [creatorNiches, setCreatorNiches] = useState<string[]>(["Lifestyle"]);
  const [creatorFormats, setCreatorFormats] = useState<string[]>(["Short-form Video"]);
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
      if (role === "promoter" && promoterGoals.length === 0) {
        setError("Select at least one promoter goal so AI can optimize your creator matching.");
        return false;
      }
      if (role === "promoter" && promoterCreatorTypes.length === 0) {
        setError("Select at least one creator type preference for promoter onboarding.");
        return false;
      }
      if (role === "creator" && creatorNiches.length === 0) {
        setError("Select at least one creator niche so AI can match relevant campaigns to you.");
        return false;
      }
      if (role === "creator" && creatorFormats.length === 0) {
        setError("Select at least one content format for creator onboarding.");
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
            goals: promoterGoals,
            creatorTypes: promoterCreatorTypes
          },
          creator: {
            niches: creatorNiches,
            formats: creatorFormats
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
            <p className="text-sm font-semibold text-pro-main">Step {step} of {totalSteps}</p>
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
            <div className="workspace-card-soft space-y-3 rounded-xl p-3 sm:p-4">
              <div>
                <p className="text-sm font-semibold text-pro-main">
                  {role === "promoter" ? "Promoter Onboarding" : "Creator Onboarding"}
                </p>
                <p className="text-pro-muted mt-1 text-xs">
                  {role === "promoter"
                    ? "Tell us what outcomes you want so AI can recommend the right creator mix."
                    : "Select your niches and content strengths so AI matches you with the right campaigns."}
                </p>
              </div>

              {role === "promoter" ? (
                <>
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
                  </div>

                  <div>
                    <p className="text-pro-muted mb-2 text-xs uppercase tracking-[0.12em]">Preferred Creator Type</p>
                    <div className="flex flex-wrap gap-2">
                      {promoterCreatorTypeOptions.map((creatorType) => {
                        const selected = promoterCreatorTypes.includes(creatorType);
                        return (
                          <button
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${chipClass(selected)}`}
                            key={creatorType}
                            onClick={() => setPromoterCreatorTypes((current) => toggleSelection(current, creatorType))}
                            type="button"
                          >
                            {creatorType}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <>
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
                  </div>

                  <div>
                    <p className="text-pro-muted mb-2 text-xs uppercase tracking-[0.12em]">Content Formats</p>
                    <div className="flex flex-wrap gap-2">
                      {creatorFormatOptions.map((format) => {
                        const selected = creatorFormats.includes(format);
                        return (
                          <button
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${chipClass(selected)}`}
                            key={format}
                            onClick={() => setCreatorFormats((current) => toggleSelection(current, format))}
                            type="button"
                          >
                            {format}
                          </button>
                        );
                      })}
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
