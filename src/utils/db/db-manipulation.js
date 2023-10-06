import sql from "@/utils/db/db";

export async function insertToken(access_token, refresh_token, email) {
  console.log("THis was hit");
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

export async function selectToken(id) {
  console.log(id);
  try {
    const result = await sql`
            SELECT * FROM sessions WHERE session_id = ${id?.value};
        `;

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteToken(id) {
  try {
    const result = await sql`
            DELETE FROM sessions WHERE session_id = ${id};
        `;
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateToken(id, access_token, refresh_token) {
  try {
    const result = await sql`
            UPDATE sessions
            SET access_token = ${access_token}, refresh_token = ${refresh_token}
            WHERE session_id = ${id}
            RETURNING session_id;
        `;
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
