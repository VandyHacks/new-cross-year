# History artwork

Original Devpost event images are preferred over archived-site mascots. Editions without a confirmed theme keep the existing VandyHacks logo (`artwork: null`). No artwork is generated.

## Sources

Retrieved November 20, 2026. These are unmodified copies of each event’s `og:image` / `twitter:image` thumbnail from its Devpost page.

| Edition | Event page                                           | Local asset        | Original image                                                                                                                 |
| ------- | ---------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| VI      | [Devpost](https://vandyhacksvi.devpost.com/)         | `vi-devpost.png`   | [Original thumbnail](https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/000/875/307/datas/large.png) |
| VII     | [Devpost](https://vandyhacks-retro-edn.devpost.com/) | `vii-devpost.png`  | [Original thumbnail](https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/001/224/950/datas/large.png) |
| VIII    | [Devpost](https://vandyhacksviii.devpost.com/)       | `viii-devpost.png` | [Original thumbnail](https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/001/675/048/datas/large.png) |
| IX      | [Devpost](https://vandyhacks-ix.devpost.com/)        | `ix-devpost.png`   | [Original thumbnail](https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/002/222/481/datas/large.png) |
| X       | [Devpost](https://vandyhacks-x.devpost.com/)         | `x-devpost.png`    | [Original thumbnail](https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/002/596/549/datas/large.png) |
| XI      | [Devpost](https://vandyhacks-xi.devpost.com/)        | `xi-devpost.png`   | [Original thumbnail](https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/016/888/datas/large.png) |

I–V and XII use the standard VandyHacks logo. VIII’s original logo is black on transparent, so `artworkLightBackground: true` places it on a white notehead; the image file itself is unchanged. Original images belong to their respective creators; this record does not assert a new license.

## Replace or add artwork

1. Add a PNG, WebP, or SVG to this directory. Square or transparent artwork works best.
2. Update the edition’s `artwork` path in `lib/hackathons.ts`, for example `/history/2026-xii.png`.
3. Set `artwork: null` to use the standard VandyHacks logo. Missing images also fall back to it.
4. Use `artworkLightBackground: true` only for original dark artwork that needs a light backing.

Artwork uses `object-fit: contain` within a circular notehead; leave padding around important corners. Each edition’s Devpost link stays independent of its artwork. The two 2015 editions remain separate entries.
