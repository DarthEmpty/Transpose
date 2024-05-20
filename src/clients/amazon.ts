import { CreateAxiosDefaults, AxiosResponse, isAxiosError } from "axios";
import open from "open";
import Client from "./client.js";
import { sleep } from "../utils.js";
import type { Playlist } from "../schema.d.ts";

export default class AmazonMusicClient extends Client {
  constructor(config?: CreateAxiosDefaults) {
    super({ ...config, baseURL: "https://api.music.amazon.dev/v1" });
  }

  private requestDeviceAuthorization = async (data: {
    client_id: string;
  }): Promise<AxiosResponse> =>
    this.instance.post("https://api.amazon.com/auth/o2/create/codepair", {
      ...data,
      scope: "profile",
      response_type: "device_code",
    });

  private requestAccessToken = async (data: {
    device_code: string;
    user_code: string;
  }): Promise<AxiosResponse> =>
    this.instance.post("https://api.amazon.com/auth/o2/token", {
      ...data,
      grant_type: "device_code",
    });

  private async pollForAccessToken(data: {
    device_code: string;
    user_code: string;
    interval: number;
    expires_in: number;
  }): Promise<string> {
    for (let elapsed = 0; elapsed < data.expires_in; elapsed += data.interval) {
      try {
        const res = await this.requestAccessToken(data);
        return res.data.access_token;
      } catch (error) {
        if (
          !isAxiosError(error) ||
          !error.response ||
          error.response.data.error !== "authorization_pending"
        )
          throw error;

        await sleep(data.interval * 1000);
      }
    }

    return "";
  }

  async getAccessToken(data: { client_id: string }): Promise<string> {
    const deviceAuthRes = await this.requestDeviceAuthorization(data);
    const codeInfo = deviceAuthRes.data;

    console.log(codeInfo.user_code);
    open(codeInfo.verification_uri);

    return this.pollForAccessToken(codeInfo);
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
