import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const blockedCountries = new Set(["US", "PR", "GU", "VI", "AS", "MP"]);

export async function GET(request: Request) {
  const country = (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    (process.env.NODE_ENV === "development" ? "DEV" : "")
  ).toUpperCase();

  const isDevelopment = country === "DEV";
  const isBlocked = country === "US" || blockedCountries.has(country);
  const eligible = isDevelopment || (country.length === 2 && !isBlocked);
  const state = eligible ? "allowed" : isBlocked ? "blocked" : "pending";

  return NextResponse.json(
    {
      eligible,
      country: country === "DEV" ? null : country || null,
      state,
      manualApprovalRequired: eligible,
      reason: eligible
        ? "Your connection appears eligible. A separate Base registry approval may still be required."
        : isBlocked
          ? "Coinbase Tokenized Stocks are available only to eligible non-US users."
          : "We could not verify your location yet. Stock actions remain unavailable until eligibility is confirmed.",
    },
    {
      status: eligible ? 200 : 403,
      headers: { "Cache-Control": "private, no-store" },
    }
  );
}
