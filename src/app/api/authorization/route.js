import { selectToken } from "@/utils/db/db-manipulation";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const id = request.cookies.get("session_id");
    if (id) {
      const [{ access_token }] = await selectToken(id);
      return NextResponse.json(
        { success: true, message:access_token },
        {
          status: 200,
        }
      );
    }
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
