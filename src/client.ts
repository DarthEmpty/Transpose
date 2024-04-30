import axios, {
  CreateAxiosDefaults,
  AxiosResponse,
  AxiosInstance,
} from "axios";

export abstract class Client {
  protected instance: AxiosInstance;

  constructor(config?: CreateAxiosDefaults) {
    this.instance = axios.create(config);
  }

  abstract getAccessToken(data: Object): Promise<AxiosResponse>;
  abstract readPlaylists(data: Object): void;
  abstract writePlaylists(data: Object): void;
}

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/";
const SPOTIFY_ACCESS_TOKEN_URL = "https://accounts.spotify.com/api/token";

interface SpotifyAccessTokenRequestData {
  client_id: string;
  client_secret: string;
}

export class SpotifyClient extends Client {
  constructor(config?: CreateAxiosDefaults) {
    super({ ...config, baseURL: SPOTIFY_API_BASE_URL });
  }

  getAccessToken = (
    data: SpotifyAccessTokenRequestData,
  ): Promise<AxiosResponse> =>
    this.instance.post(
      SPOTIFY_ACCESS_TOKEN_URL,
      { ...data, grant_type: "client_credentials" },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

  readPlaylists(data: Object): void {
    throw new Error("Method not implemented.");
  }
  writePlaylists(data: Object): void {
    throw new Error("Method not implemented.");
  }
}
