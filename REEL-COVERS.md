# Reel covers

Decision (18 October 2026): the three Instagram reels on the Reviews page keep their own cover frames. The frames were taken from the clinic's reels and saved as `public/placeholders/reel-1.jpg`, `reel-2.jpg` and `reel-3.jpg`; nothing needs to be shot for them.

Captions shown under the tiles, from `content/videos.json`:

| Reel | Caption |
| --- | --- |
| Cmq82Syh1UH | Finishing touches at the chair |
| Ckal4a5AdlL | The veneer try-in |
| Csi3X2ugr05 | A whitening session |

To swap a reel later: change the `id`, `url` and `title` in `content/videos.json`, save the new cover frame under the same file name, and rebuild.
