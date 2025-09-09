// export const useChangedSongs = (cb: (songs: Osdk.Instance<Song>[]) => void) => {
//   useEffect(() => {
//     return watchers.on("songs", (_, changedDocuments) => {
//       cb(changedDocuments as Osdk.Instance<Song>[]);
//     });
//   }, [cb]);
// };

// The following two functions are used but I'm leaving them in since
// we might want to use them soon
// export const getSongs= () => cache["songs"] as Song[] | undefined;

// export const onDidUpdateSongs = (
//   cb: (items: { songs: Song[] | null; changed: Song[] | null }) => void,
// ) =>
//   watchers.on("songs", (songs, changed) =>
//     cb({ songs: songs as Song[] | null, changed: changed as Song[] | null }),
//   );
