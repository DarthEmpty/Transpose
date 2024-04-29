import * as dotenv from "dotenv";
import axios from "axios";

const main = async () => {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  const data = {
    grant_type: "client_credentials",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  };

  let res;
  try {
    res = await axios.post(
      "https://accounts.spotify.com/api/token",
      data,
      config,
    );

    console.log(res.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response)
      console.error(
        `Error ${error.response.status}: ${error.response.data.error}`,
      );
    else console.error(error);
  }
};

dotenv.config();
main();
