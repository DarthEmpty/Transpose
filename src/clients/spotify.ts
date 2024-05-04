import { CreateAxiosDefaults, AxiosResponse } from "axios";
import Client from "./client.js";
import { Playlist, Track } from "../schema.js";

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

  private requestPlaylists = async (
    token: string,
    userID: string,
  ): Promise<AxiosResponse> =>
    this.instance.get(`/users/${userID}/playlists`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

  private requestPlaylistTracks = async (
    token: string,
    playlistID: string,
  ): Promise<AxiosResponse> =>
    this.instance.get(`/playlists/${playlistID}/tracks`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

  private async readPlaylistTracks(
    token: string,
    playlistID: string,
  ): Promise<Track[]> {
    const res = await this.requestPlaylistTracks(token, playlistID);
    const tracks = res.data.items.map((track: any) => track.track);

    return Promise.all<Track>(
      tracks.map((track: any) => ({
        name: track.name,
        artists: track.artists.map((artist: any) => artist.name),
      })),
    );
  }

  async getAccessToken(data: SpotifyTokenRequestData): Promise<string> {
    const res = await this.requestAccessToken(data);
    this.accessToken = String(res.data.access_token);
    return this.accessToken;
  }

  async readUserPlaylists(token?: string): Promise<Playlist[]> {
    // My UserID
    // TODO: Make users login to their own accounts to retrieve all playlists
    const userID = "313dxjn2yclpwv5kgitniu6ake2q";
    const access_token = token || this.accessToken;

    const res = await this.requestPlaylists(access_token, userID);
    const playlists = res.data.items;

    return await Promise.all<Playlist>(
      playlists.map(async (playlist: any) => ({
        name: playlist.name,
        tracks: await this.readPlaylistTracks(access_token, playlist.id),
      })),
    );
  }

  writeUserPlaylists(data: Playlist[], token?: string): Promise<AxiosResponse> {
    throw new Error("Method not implemented.");
  }
}
