"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  COUNTRY_CURRENCY_OPTIONS,
  DEFAULT_COUNTRY_CODE,
  FALLBACK_USD_RATES,
  getCountryOptionByCode,
  type CountryCurrencyOption
} from "@/lib/country-currency";

type CurrencyPair = {
  primary: string;
  secondary: string | null;
  local: string;
  usd: string | null;
};

type CurrencyContextValue = {
  countryCode: string;
  countryName: string;
  countryOptions: CountryCurrencyOption[];
  currencyCode: string;
  currencyName: string;
  currencyLocale: string;
  phoneCode: string;
  ratesSource: "fallback" | "live";
  isRatesLoading: boolean;
  setCountry: (countryCode: string) => void;
  convertFromUsd: (usdAmount: number) => number;
  formatFromUsd: (usdAmount: number, options?: Intl.NumberFormatOptions) => string;
  formatUsd: (usdAmount: number, options?: Intl.NumberFormatOptions) => string;
  formatDualFromUsd: (usdAmount: number, options?: Intl.NumberFormatOptions) => CurrencyPair;
  formatSignedDualFromUsd: (usdAmount: number, options?: Intl.NumberFormatOptions) => CurrencyPair;
};

const COUNTRY_STORAGE_KEY = "creatoragora-country-code";
const RATES_STORAGE_KEY = "creatoragora-usd-rates";

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function readStoredCountryCode(): string {
  if (typeof window === "undefined") return DEFAULT_COUNTRY_CODE;
  return getCountryOptionByCode(window.localStorage.getItem(COUNTRY_STORAGE_KEY)).code;
}

function sanitizeRates(input: Record<string, number>): Record<string, number> {
  return Object.keys(FALLBACK_USD_RATES).reduce<Record<string, number>>((accumulator, code) => {
    const rate = input[code];
    if (typeof rate === "number" && Number.isFinite(rate) && rate > 0) {
      accumulator[code] = rate;
    }
    return accumulator;
  }, {});
}

function readCachedRates(): Record<string, number> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(RATES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, number>;
    const sanitized = sanitizeRates(parsed);
    return Object.keys(sanitized).length > 0 ? sanitized : null;
  } catch {
    return null;
  }
}

function formatCurrency(
  amount: number,
  currency: string,
  locale: string,
  options: Intl.NumberFormatOptions = {}
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
      ...options
    }).format(amount);
  } catch {
    const fractionDigits = options.maximumFractionDigits ?? 2;
    return `${currency} ${amount.toFixed(fractionDigits)}`;
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY_CODE);
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_USD_RATES);
  const [ratesSource, setRatesSource] = useState<"fallback" | "live">("fallback");
  const [isRatesLoading, setIsRatesLoading] = useState(true);

  useEffect(() => {
    setCountryCode(readStoredCountryCode());
    const cachedRates = readCachedRates();
    if (cachedRates) {
      setRates({ ...FALLBACK_USD_RATES, ...cachedRates });
      setRatesSource("live");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(COUNTRY_STORAGE_KEY, countryCode);
  }, [countryCode]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRates = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD", {
          signal: controller.signal,
          cache: "no-store"
        });
        if (!response.ok) {
          throw new Error(`Unable to fetch rates. Status: ${response.status}`);
        }

        const payload = (await response.json()) as { rates?: Record<string, number> };
        if (!payload.rates) {
          throw new Error("Rate payload missing.");
        }

        const sanitized = sanitizeRates(payload.rates);
        if (Object.keys(sanitized).length === 0) {
          throw new Error("Rate payload invalid.");
        }

        const mergedRates = { ...FALLBACK_USD_RATES, ...sanitized };
        setRates(mergedRates);
        setRatesSource("live");
        if (typeof window !== "undefined") {
          window.localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(mergedRates));
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setRatesSource((current) => (current === "live" ? "live" : "fallback"));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsRatesLoading(false);
        }
      }
    };

    fetchRates();
    return () => controller.abort();
  }, []);

  const country = useMemo(() => getCountryOptionByCode(countryCode), [countryCode]);

  const getRate = useCallback(
    (currencyCode: string) => rates[currencyCode] ?? FALLBACK_USD_RATES[currencyCode] ?? 1,
    [rates]
  );

  const convertFromUsd = useCallback(
    (usdAmount: number) => usdAmount * getRate(country.currency),
    [country.currency, getRate]
  );

  const formatFromUsd = useCallback(
    (usdAmount: number, options?: Intl.NumberFormatOptions) =>
      formatCurrency(convertFromUsd(usdAmount), country.currency, country.locale, options),
    [convertFromUsd, country.currency, country.locale]
  );

  const formatUsd = useCallback(
    (usdAmount: number, options?: Intl.NumberFormatOptions) => formatCurrency(usdAmount, "USD", "en-US", options),
    []
  );

  const formatDualFromUsd = useCallback(
    (usdAmount: number, options?: Intl.NumberFormatOptions): CurrencyPair => {
      const primary = formatUsd(usdAmount, options);
      const secondary = country.currency === "USD" ? null : formatFromUsd(usdAmount, options);
      return {
        primary,
        secondary,
        local: primary,
        usd: secondary
      };
    },
    [country.currency, formatFromUsd, formatUsd]
  );

  const formatSignedDualFromUsd = useCallback(
    (usdAmount: number, options?: Intl.NumberFormatOptions): CurrencyPair => {
      const sign = usdAmount > 0 ? "+" : usdAmount < 0 ? "-" : "";
      const absolute = Math.abs(usdAmount);
      const primary = `${sign}${formatUsd(absolute, options)}`;
      const secondary = country.currency === "USD" ? null : `${sign}${formatFromUsd(absolute, options)}`;
      return {
        primary,
        secondary,
        local: primary,
        usd: secondary
      };
    },
    [country.currency, formatFromUsd, formatUsd]
  );

  const setCountry = useCallback((nextCountryCode: string) => {
    setCountryCode(getCountryOptionByCode(nextCountryCode).code);
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      countryCode: country.code,
      countryName: country.name,
      countryOptions: COUNTRY_CURRENCY_OPTIONS,
      currencyCode: country.currency,
      currencyName: country.currencyName,
      currencyLocale: country.locale,
      phoneCode: country.phoneCode,
      ratesSource,
      isRatesLoading,
      setCountry,
      convertFromUsd,
      formatFromUsd,
      formatUsd,
      formatDualFromUsd,
      formatSignedDualFromUsd
    }),
    [
      convertFromUsd,
      country.code,
      country.currency,
      country.currencyName,
      country.locale,
      country.name,
      country.phoneCode,
      formatDualFromUsd,
      formatFromUsd,
      formatSignedDualFromUsd,
      formatUsd,
      isRatesLoading,
      ratesSource,
      setCountry
    ]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
