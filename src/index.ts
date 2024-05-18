import { writeFile } from "fs";
import dotenv from "dotenv";
import { isAxiosError } from "axios";
import { AmazonMusicClient, SpotifyClient } from "./clients/index.js";

async function main() {
  const spotify = new SpotifyClient();
  const amazon = new AmazonMusicClient();

  try {
    // await spotify.getAccessToken({
    //   client_id: process.env.SPOTIFY_CLIENT_ID,
    //   client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    // });
    // const playlists = await spotify.readUserPlaylists();
    // writeFile("music_collection.json", JSON.stringify(playlists), (err) => {
    //   if (err) throw err;
    //   console.log("Playlists Downloaded");
    // });

    console.log(
      await amazon.getAccessToken({
        client_id: process.env.AMAZON_CLIENT_ID,
      }),
    );
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error(
        `Axios Error ${error.response.status}: ${error.response.statusText}`,
      );
      console.error(JSON.stringify(error.response.data as string, null, 2));
    } else console.error(error);
  }
}

dotenv.config();
main();
