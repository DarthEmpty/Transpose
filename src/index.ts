import dotenv from "dotenv";
import { isAxiosError } from "axios";
import { SpotifyClient } from "./client.js";

async function main() {
  const spotify = new SpotifyClient();

  try {
    const res = await spotify.getAccessToken({
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    console.log(res.data);
  } catch (error) {
    if (isAxiosError(error) && error.response)
      console.error(
        `Error ${error.response.status}: ${error.response.data.error}`,
      );
    else console.error(error);
  }
}

dotenv.config();
main();
