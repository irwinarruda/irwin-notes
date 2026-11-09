# Brand

The Irwin Arruda logo and icons. They are generated in [irwin-ui](https://github.com/irwinarruda/irwin-ui/blob/main/BRAND.md), which also documents the lettering and its spacing, and copied here: use these files, don't redraw or edit them. The letters are rounded strokes, and the dots are squares that carry the brick, `#B64D3F`. The default has one brick dot, on the first `i`; the `-duo` files have both dots in brick.

A suffix says which background a file is for. `-dark` has light letters, for dark backgrounds. `-light` has dark letters, for light backgrounds. No suffix means mid-gray letters that work on both.

## Wordmarks

| File | What it is | Used in |
| ---- | ---------- | ------- |
| `irwin.svg`, `irwin-dark.svg`, `irwin-light.svg`, and the same three with `-duo` | The short form, `irwin` | Nothing yet |
| `irwin-arruda.svg`, `irwin-arruda-dark.svg`, `irwin-arruda-light.svg` | The long form, `irwin arruda`, with one brick dot | The repository README (`-dark` and `-light`) |
| `irwin-arruda-duo.svg`, `irwin-arruda-duo-dark.svg`, `irwin-arruda-duo-light.svg` | The long form with two brick dots | The site's masthead (`-dark` and `-light`), on trial |

## Monograms

Transparent, for places where the wordmark is too wide. Nothing uses them yet.

| File | What it is |
| ---- | ---------- |
| `i.svg`, `i-dark.svg`, `i-light.svg` | `i`: the stem and the brick dot |
| `ia.svg`, `ia-dark.svg`, `ia-light.svg` | `ia` |

## Icons

The `ia` monogram in white on a slate rounded tile, keeping the brick dot.

| File | What it is | Used in |
| ---- | ---------- | ------- |
| `icon-ia.ico` | 16, 32 and 48 px favicon | Copied to `public/favicon.ico` |
| `icon-ia.svg` | Scalable favicon | `<link rel="icon" type="image/svg+xml">` |
| `icon-ia-180.png` | 180 px icon on a square tile, because iOS rounds the corners itself | Apple touch icon |
| `icon-ia-square.svg` | The square tile | The source of the touch icon |
| `icon-ia-512.png` | 512 px icon | OpenGraph image |

An alternative tile with just the `i` is kept in the set, and nothing uses it yet: `icon-i.ico`, `icon-i.svg`, `icon-i-180.png` and `icon-i-512.png`.
