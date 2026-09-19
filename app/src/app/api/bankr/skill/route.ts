import { NextResponse } from "next/server";
import skillManifest from "@/lib/bankr/talon-skill.json";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(skillManifest, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
