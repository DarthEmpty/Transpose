export interface Track {
  name: string;
  artists: string[];
}

export interface Playlist {
  name: string;
  tracks: Track[];
}
