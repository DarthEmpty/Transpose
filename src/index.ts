import { writeFile } from "fs";
import dotenv from "dotenv";
import { isAxiosError } from "axios";
import { SpotifyClient } from "./clients/index.js";

async function main() {
  const spotify = new SpotifyClient();

  try {
    await spotify.getAccessToken({
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const playlists = await spotify.readUserPlaylists();

    writeFile("music_collection.json", JSON.stringify(playlists), (err) => {
      if (err) throw err;
      console.log("Playlists Downloaded");
    });
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
