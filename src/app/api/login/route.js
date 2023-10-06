import { insertToken } from "@/utils/db/db-manipulation";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const payload = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();

    if (response.ok) {
      const [result] = await insertToken(
        data?.access_token,
        data?.refresh_token,
        data?.user?.email
      );
      return NextResponse.json(
        { success: true, message: data?.user?.role },
        {
          status: 200,
          headers: {
            "Set-Cookie": `session_id=${result.session_id}; HttpOnly; Path=/; Max-Age=3600`,
          },
        }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Something went wrong" },
        { status: 500 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 400 }
    );
  }
}
