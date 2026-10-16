# Happy Birthday Kanika 🎂

A little interactive book: cover → blow out the candle → video → envelope → letter.

## How it flows

| Step | What happens |
| --- | --- |
| 0. Site opens | Party popper confetti bursts from the bottom corners. |
| 1. Closed card | Click / → key opens it: cover on the left, cake on the right (page-turn sound). The background song fades in. |
| 2. Cake | She **blows into the mic**: candle goes out, smoke rises (blow-out sound). Clicking the flame also works as a backup. |
| 3. Video | Fades in as a box over the darkened card; the song fades out and comes back after. Then the page turns by itself. |
| 4. Envelope | Click → envelope sound, the closed envelope changes to the open one. |
| 5. Letter | Click the open envelope → the letter opens over the darkened card. Click outside it (or Esc) to close. |

On a laptop it opens like a card (two pages). On a phone it shows one page at a time.
← key goes back a page.

## Files

```
index.html          the page structure
css/style.css       how it looks (letter font/colour/size at the top)
js/config.js        ← EVERYTHING YOU EDIT: images, sounds, voice notes, video, letter
js/main.js          how it works (commented)
lib/                page-flip library (realistic page curl)
assets/pages/       your Canva PNGs
assets/sounds/      sound effects
assets/music/       put your background song here
assets/voice/       put your voice notes here
assets/video/       put your video here
```

## Things you'll add

- **Video:** export from CapCut as MP4 and save it as `assets/video/birthday.mp4`.
  It must be under **100 MB** for GitHub (1080p usually fits). Until it's there, the site skips straight to the envelope.
- **Background song:** put it in `assets/music/` and set `music.file` in `js/config.js`.
- **Voice notes:** put them in `assets/voice/` and set their paths in `js/config.js`:
  - `openOnLaptop` plays on her first tap, **only on a phone**.
  - `blowHint` plays if she hasn't blown after `blowHintAfterSeconds`.
- **Letter:** either type it into `letter:` in `js/config.js`, or design it in Canva and replace `assets/pages/5-letter.png`. That paper image is the letter that opens; the text is written on it in dark ink.
- **Sounds:** replace the files in `assets/sounds/` and keep the same names, or update the paths in `config.js`.
  Free sources: pixabay.com/sound-effects, freesound.org.
- **New page images:** export at the same size (1414 × 2000) and overwrite the files in `assets/pages/`.
  If the candle moves, adjust `#candle-zone` in `css/style.css`.

## Run it on your computer (VS Code)

1. Open the `kanika-birthday` folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**.
4. Allow the microphone when the cake page asks.

Don't just double-click `index.html`: the microphone needs it served from `localhost` or `https`.

**Testing the blow:** add `?debug` to the end of the address (e.g. `.../Kanika-birthday/?debug`) to see the live mic level and how loud it needs to be. If talking blows the candle out, raise `blow.sensitivity` in `config.js`. If blowing does nothing, lower it.

## Put it on GitHub and publish

1. Create an empty repo on github.com named `kanika-birthday`. Don't add a README.
2. In the VS Code terminal, inside this folder:

   ```bash
   git init
   git add .
   git commit -m "Kanika's birthday site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/kanika-birthday.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
4. After a minute it's live at `https://YOUR-USERNAME.github.io/kanika-birthday/`.

To update it later: `git add . && git commit -m "update" && git push`.
