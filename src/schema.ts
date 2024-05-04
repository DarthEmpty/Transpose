export type Track = {
  title: string;
  artist: string;
};

export type Playlist = {
  title: string;
  tracks: [Track];
};
