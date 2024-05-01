import dotenv from "dotenv";
import { isAxiosError } from "axios";
import { SpotifyClient } from "./client.js";

async function main() {
  const spotify = new SpotifyClient();

  try {
    let res = await spotify.getAccessToken({
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const token = res.data.access_token;

    res = await spotify.readPlaylists(token);

    console.log(res.data.items.map((item: { name: string }) => item.name));
  } catch (error) {
    if (isAxiosError(error) && error.response)
      console.error(
        `Axios Error ${error.response.status}: ` +
          `${error.response.data.error.message}`,
      );
    else console.error(error);
  }
}

dotenv.config();
main();
