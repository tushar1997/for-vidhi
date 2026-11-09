# sketchbook for Vidhi 🎨💻

A four-page animated static site: an artist and a developer, drawn in code.

| page | what happens |
|---|---|
| `index.html` | terminal "boot" (`npm run ask-vidhi`), then a sketchbook whose cover flips open |
| `meet.html` | character cards for Vidhi and Tushar, live-typed code, brush + laptop merge into a heart |
| `ask.html` | the question painted on an easel, with a **No** button that runs away from the cursor and from taps |
| `yes.html` | confetti, a `git commit` log, a date ticket with a countdown, and an .ics calendar download |

Built with HTML, CSS and JS, plus GSAP and canvas-confetti from a CDN. The characters are hand-written SVG in `js/characters.js`, and their eyes follow the cursor.

Run locally: `python -m http.server 5173` → http://localhost:5173
