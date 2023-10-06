import sql from "@/utils/db/db";

export async function insertToken(access_token, refresh_token, email) {
  console.log("THis was hit")
  try {
    const result = await sql`
            INSERT INTO sessions
            (access_token, refresh_token, email)
            VALUES
            (${access_token}, ${refresh_token}, ${email})
            RETURNING session_id;
        `;
    return result;
  } catch (err) {
    console.log(err);
  }
}
