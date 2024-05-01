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
  abstract readPlaylists(token: string): Promise<AxiosResponse>;
  abstract writePlaylists(data: Object): Promise<AxiosResponse>;
}

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";
const SPOTIFY_ACCESS_TOKEN_URL = "https://accounts.spotify.com/api/token";

interface SpotifyTokenRequestData {
  client_id: string;
  client_secret: string;
}

export class SpotifyClient extends Client {
  constructor(config?: CreateAxiosDefaults) {
    super({ ...config, baseURL: SPOTIFY_API_BASE_URL });
  }

  getAccessToken = (data: SpotifyTokenRequestData): Promise<AxiosResponse> =>
    this.instance.post(
      SPOTIFY_ACCESS_TOKEN_URL,
      { ...data, grant_type: "client_credentials" },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

  readPlaylists = (token: string): Promise<AxiosResponse> =>
    // My public playlists
    // TODO: Make users login to their own accounts to retrieve all playlists
    this.instance.get("/users/313dxjn2yclpwv5kgitniu6ake2q/playlists", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

  writePlaylists(data: Object): Promise<AxiosResponse> {
    throw new Error("Method not implemented.");
  }
}
