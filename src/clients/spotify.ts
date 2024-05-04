import { CreateAxiosDefaults, AxiosResponse } from "axios";
import Client from "./client.js";
import { Playlist } from "../schema.js";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

interface SpotifyTokenRequestData {
  client_id: string;
  client_secret: string;
}

export default class SpotifyClient extends Client {
  constructor(config?: CreateAxiosDefaults) {
    super({ ...config, baseURL: SPOTIFY_API_BASE_URL });
  }

  private requestAccessToken = async (
    data: SpotifyTokenRequestData,
  ): Promise<AxiosResponse> =>
    await this.instance.post(
      "https://accounts.spotify.com/api/token",
      { ...data, grant_type: "client_credentials" },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

  private requestPlaylists = async (token: string): Promise<AxiosResponse> =>
    this.instance.get("/users/313dxjn2yclpwv5kgitniu6ake2q/playlists", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

  async getAccessToken(data: SpotifyTokenRequestData): Promise<string> {
    const res = await this.requestAccessToken(data);
    this.accessToken = String(res.data.access_token);
    return this.accessToken;
  }

  async readPlaylists(token?: string): Promise<[Playlist]> {
    const res = await this.requestPlaylists(token || this.accessToken);
    return res.data.items as [Playlist];
  }

  writePlaylists(data: [Playlist], token?: string): Promise<AxiosResponse> {
    throw new Error("Method not implemented.");
  }
}
