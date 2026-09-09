export type EligibilityStatus = {
  eligible: boolean;
  country: string | null;
  reason: string | null;
  state?: "allowed" | "blocked" | "pending";
  manualApprovalRequired?: boolean;
};

const ATTESTATION_KEY = "talon-eligibility-attestation-v1";

export function hasEligibilityAttestation(): boolean {
  return typeof window !== "undefined" && window.localStorage.getItem(ATTESTATION_KEY) === "confirmed";
}

export function saveEligibilityAttestation(): void {
  if (typeof window !== "undefined") window.localStorage.setItem(ATTESTATION_KEY, "confirmed");
}

export async function getEligibilityStatus(): Promise<EligibilityStatus> {
  const response = await fetch(`/api/eligibility?ts=${Date.now()}`, {
    cache: "no-store",
    headers: { "cache-control": "no-cache" },
  });
  return (await response.json()) as EligibilityStatus;
}

export async function checkEligibility(): Promise<EligibilityStatus> {
  const body = await getEligibilityStatus();
  if (!body.eligible) {
    throw new Error(body.reason || "Eligibility could not be verified.");
  }
  return body;
}
