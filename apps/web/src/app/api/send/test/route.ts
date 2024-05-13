/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import is from "@sindresorhus/is";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return Promise.resolve(NextResponse.json({}));
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { to, subject, html } = await req.json();

    const ip = req.headers.get("x-vercel-forwarded-for");
    const latitude = req.headers.get("x-vercel-ip-latitude");
    const longitude = req.headers.get("x-vercel-ip-longitude");
    const city = req.headers.get("x-vercel-ip-city");
    const country = req.headers.get("x-vercel-ip-country");
    const countryRegion = req.headers.get("x-vercel-ip-country-region");

    const savePromise = supabase
      .from(process.env.SUPABASE_TABLE_NAME || "")
      .insert([
        {
          to: [to],
          subject,
          html,
          ip,
          latitude,
          longitude,
          city,
          country,
          country_region: countryRegion,
        },
      ]);

    const sendPromise = resend.emails.send({
      from: "React Email <preview@react.email>",
      to: [to],
      subject,
      html,
    });

    await Promise.all([savePromise, sendPromise]);

    return NextResponse.json({ message: "Test email sent" });
  } catch (error) {
    if (is.error(error)) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
        },
      );
    }
  }
}
