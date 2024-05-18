import { CreateAxiosDefaults, AxiosResponse } from "axios";
import Client from "./client.js";
import type { Playlist } from "../schema.d.ts";

export default class AmazonMusicClient extends Client {
  constructor(config?: CreateAxiosDefaults) {
    super({ ...config, baseURL: "https://api.music.amazon.dev/v1" });
  }

  private requestDeviceAuthorization = async (data: {
    client_id: string;
  }): Promise<AxiosResponse> =>
    await this.instance.post("https://api.amazon.com/auth/o2/create/codepair", {
      ...data,
      scope: "profile",
      response_type: "device_code",
    });

  private requestAccessToken = async (data: {
    device_code: string;
    user_code: string;
  }): Promise<AxiosResponse> =>
    await this.instance.post("https://api.amazon.com/auth/o2/token", {
      ...data,
      grant_type: "device_code",
    });

  async getAccessToken(data: { client_id: string }): Promise<string> {
    const deviceAuthRes = await this.requestDeviceAuthorization(data);
    const accessTokenRes = await this.requestAccessToken(deviceAuthRes.data);
    console.log(accessTokenRes.data);
    return "";
  }

  readUserPlaylists(token?: string): Promise<Playlist[]> {
    throw new Error("Method not implemented.");
  }

  writeUserPlaylists(
    data: Playlist[],
    token?: string,
  ): Promise<AxiosResponse<any, any>> {
    throw new Error("Method not implemented.");
  }
}
