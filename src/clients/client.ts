import axios, {
  CreateAxiosDefaults,
  AxiosResponse,
  AxiosInstance,
} from "axios";

import { Playlist } from "../schema.js";

export default abstract class Client {
  protected instance: AxiosInstance;
  protected accessToken: string;

  constructor(config?: CreateAxiosDefaults) {
    this.instance = axios.create(config);
    this.accessToken = "";
  }

  abstract getAccessToken(data: Object): Promise<string>;
  abstract readUserPlaylists(token?: string): Promise<Playlist[]>;
  abstract writeUserPlaylists(
    data: Playlist[],
    token?: string,
  ): Promise<AxiosResponse>;
}
