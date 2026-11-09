# sketchbook for Vidhi 🌼

A one-page animated date invitation: Tue, 10 Nov 2026 · 4:00 PM · pickup from her place.

**Live:** https://tushar1997.github.io/for-vidhi/

## The flow (all in `index.html`, scenes switch with a book page-turn)

1. **Envelope.** Tapping it also starts the music with sound.
2. **Sketchbook.** A heart fills with paint, then the cover flips open.
3. **Meet the two of us.** Caricature cards with filling meters, plus a painted Venn diagram.
4. **The question.** Tushar on one knee with roses. The date, time and pickup are highlighted. The **No** button glides away and can't be clicked.
5. **She said yes.** Party poppers, then a picture that zooms out into a polaroid, a ticket with a countdown, a save-the-date (.ics) button, and the white car driving by.

## Files

| file | what it does |
|---|---|
| `index.html` | every scene's markup |
| `css/style.css` | theme, shared bits, cursor, meters, badges |
| `css/scenes.css` | per-scene layout, envelope, music card, page-turn, poppers |
| `js/app.js` | scene switching and each scene's animations |
| `js/common.js` | fairy lights, petals, page-turn, scroll cursor |
| `js/doodles.js` | sticker doodles, peeking heads, notes |
| `js/characters.js` | caricature image paths (SVG drawings as fallback) |
| `js/music.js` | official YouTube player: loops 0:34–0:44, jumps to 1:48 on Yes |

The caricatures are AI illustrations made from the photos. No audio file is stored here; the song streams from its official YouTube video.

Run locally: `python -m http.server 5173` → http://localhost:5173
