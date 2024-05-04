export type Track = {
  name: string;
  artists: string[];
};

export type Playlist = {
  name: string;
  tracks: Track[];
};
