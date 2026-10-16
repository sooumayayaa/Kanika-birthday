/* =====================================================================
   CONFIG — everything you'd want to change lives in this one file.
   Paths are relative to index.html. Leave a path as "" to turn it off.
   ===================================================================== */

const CONFIG = {
  // ---- The pages (your Canva exports, same size for all) -------------
  pages: {
    cover: "assets/pages/1-cover.png",
    cakeLit: "assets/pages/2-cake-lit.png", // candle burning
    cakeUnlit: "assets/pages/3-cake-unlit.png", // shown after she blows
    envelopeClosed: "assets/pages/4-envelope-closed.png", // until she clicks
    envelopeOpen: "assets/pages/4-envelope-open.png", // fades in when she clicks
    // The letter is a notebook. Both images were made from 5-letter.png.
    letterPaper: "assets/pages/5-letter-paper.png", // a plain notebook page
    letterHand: "assets/pages/5-letter-hand.png", // sticker on the first page only
  },

  // ---- Background song -------------------------------------------------
  // Starts on her first click (browsers don't allow sound before that),
  // fades out while the video plays and fades back in afterwards.
  music: {
    file: "", // e.g. "assets/music/song.mp3"
    volume: 0.35, // keep it soft so it sits under the sound effects
    fadeSeconds: 2,
  },

  // ---- Sound effects (file names are case-sensitive on GitHub Pages) --
  sounds: {
    pageTurn: "assets/sounds/page-turn.mp3",
    blowOut: "assets/sounds/blow-out.mp3",
    envelopeOpen: "assets/sounds/envelope-open.mp3",
    volume: 0.9, // 0 = silent, 1 = full
  },

  // ---- Your voice notes ------------------------------------------------
  voice: {
    // Plays on her first tap, only on a phone. The page doesn't turn until
    // she taps again. Example: "open this on your laptop!"
    openOnLaptop: "", // e.g. "assets/voice/open-on-laptop.mp3"

    // Plays if she hasn't blown the candle after this many seconds.
    blowHint: "", // e.g. "assets/voice/blow-hint.mp3"
    blowHintAfterSeconds: 8,
  },

  // ---- Blowing out the candle -----------------------------------------
  blow: {
    // How loud the blow has to be (0..1). Lower = easier to trigger.
    // If it goes out from talking, raise it. If blowing does nothing, lower it.
    // Add ?debug to the end of the address to see the live mic level.
    sensitivity: 0.05,
    // It also has to be this many times louder than the room's background
    // noise (measured when the cake page opens), so music or a fan won't count.
    aboveBackground: 3,
    // How long (milliseconds) she has to keep blowing.
    holdMs: 250,
    // Backup: clicking the flame also blows it out (e.g. if the mic is blocked).
    tapCandleBackup: true,
  },

  // ---- Your CapCut video (plays after the candle goes out) ------------
  video: "assets/video/birthday.mp4",
  secondsBeforeVideo: 2.5, // time to watch the smoke rise before the video fades in

  // ---- The letter ------------------------------------------------------
  // Written in the notebook. Leave a blank line between paragraphs.
  // It flows onto as many pages as it needs: an open notebook (two pages)
  // on a laptop, one page at a time on a phone. Clicking turns the page.
  letter: `Bhai, bahut jaldi buddhe ho rahe ho aap toh. 23 years old. Baal toh abhi se jhadne shuru ho gaye hain, shaadi karle jaldi. Ashish ready baitha hai. Shit yaar, fourth year aa gaya. Hum first year mein mile the aur ab graduate hone wale hain, majdoori karni padegi jeevan bhar. Tu interviews de rahi hai aur main doosri continent mein baithi hoon. What the fuck?

Aur tu hamesha kehti thi ki tu mujhse milne aayegi, par behen ki lodi, jab main India aayi tab bhi tu nahi mili. December mein mil liyo bas, ab aur drama nahi chahiye.

Coincidences dekh apni ghisi-pitti story ke. Pehle Faridabad, phir Greater Noida mein ek doosre ke ghar ke itne paas, aur phir ek hi hostel mein. Universe ne bhi socha hoga ki in dono ko milwa ke hi rahenge. Pehli baar stairs pe baat karte hue mujhe tere se darr lag raha tha. Phir pata chala tu bhi Greater Noida se hai toh main comfortable ho gayi. Aur phir main seedha tere room mein ghus gayi, movies mein dekha tha na ki hostel mein knock thodi karte hain.

Phir opposite rooms le liye because humein laga nahi tha ki apni itni banegi. BUT BHAI, jo apni balcony mein bani na, humein saath mein hi room le lena chahiye tha. Smoking, ek doosre ke beds aur wardrobes use karna, ek doosre ke upar let ke reels scroll karna. Bas baithe rehte the aur haste rehte the, pata bhi nahi hota tha kis baat pe. Tere saath kuch karna zaroori nahi tha, bas saath hona enough tha.

Aur bhai, jab hum pehli baar high hue the. Humein lag raha tha police aa gayi, main imaginary insaan ke saath dance kar rahi thi, Rachit ko galat number pe call kar diya aur mujhe lag raha tha tu Maggi bana ke mujhe jala degi. CRAZY DAY.

Aur woh din jab tu flowers leke mujhe milne aayi thi. Main maid aunty samajh ke gate khol rahi thi, mujhe laga safai nahi karwani, aur main bas T-shirt pehen ke khadi thi. Tu flowers leke aayi, maine hug kiya aur madam meri half-naked video record kar rahi hain. Bhenchod 😭 But genuinely, it was so sweet ki tu jaldi aayi taaki hum zyada time saath bita sakein before I left. I don't think I tell you enough how much these little things mean to me.

Bhai, gaali dena maine tere se hi seekha hai. Main kitni achhi insaan thi pehle, kya kar diya tune mere saath?

Jokes apart, tune mujhe itni saari cheezein di hain. Woh Bath & Body Works set jo tune diya tha na, main literally roz use karti hoon. Ab woh meri scent ban gayi hai. Log compliment karte hain toh main bolti hoon Kanika ne diya hai. It's such a small thing, but it made me realise how thoughtful you've been.

I miss your storytelling so much. Tu ek hi kahani sau baar suna sakti hai aur main sau baar sun lungi. you are genuinely one of the funniest people I know, and you're so fucking smart too. Tera dimaag, teri memory, teri ability to figure shit out with minimum effort — irritating hai, but I admire you. I hope you never lose that resilience, but I also hope you know ki har cheez ko joke bana ke akele handle karna zaroori nahi hai. Therapy main seekha maine.

Ab tere se baat hi kahan hoti hai yaar. Apna bond hi alag tha. Apni bakchodi, balcony pe sutta, random stories, ghanton hasna, dance break btw studies. Ab baat hoti bhi hai toh main hi apna rona roti rehti hoon. Tu batati hi nahi hai teri life mein kya chal raha hai. Kis se baat karti hai aajkal? Kis ke saath cheat kar rahi hai? I want to know all the stupid little details, yaar. I miss being around you.

I know life changes and we can't always be as present as we used to be. But even if we don't talk as much, I hope you know you're still one of my people. Tu mere liye utni hi important hai, even from another continent. I don't want the distance to ever make you think otherwise.

At 23, I hope you build a life YOU want, not just the one everyone expects you to have. Tu itni smart aur capable hai, I hope you get to do everything you genuinely want to do and never feel like you have to fit into someone else's idea of your life. I still remember the letter you wrote and read out to me when I was leaving college. It was such a sweet thing to do, and maybe that's why I wanted to write you one too. even if its a bad and disorganised one. Chatgpt se likhwaya hai

Happy 23rd birthday, aunty. I love you, you absolute menace. No matter how much life changes or how far apart we end up, you'll always be one of my people. ❤️`,

  // The very last page of the notebook. Leave either as "" to hide it.
  letterEnd: {
    bye: "Bye!",
    ps: "P.S. woh white roses maine bhejwaye the",
  },
};
