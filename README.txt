MATE & HomeChef showcase website
================================
Open index.html (double-click works). Everything is inside this folder.

PUT YOUR FILES HERE
  apk/MATE.apk, apk/HomeChef.apk     -> the download buttons
  video/mate.mp4, video/homechef.mp4 -> the two video frames (blank until added; H.264 .mp4)
  assets/amalia.jpg, assets/aiman.jpg -> About us photos (portrait, any size)
  audio/music.mp3                     -> background song (already included)

APP SCREENS ON THE 3D PHONES
  HomeChef uses your 3 screenshots. MATE currently uses 3 drawn mock screens.
  When you have real MATE screenshots, name them mate-1.png, mate-2.png, mate-3.png (assets/).
  Note: opened by double-click, the site reads the embedded copy in assets/screens.js.
  When the site is hosted (GitHub Pages / Netlify / any server) it reads assets/*.png directly.
  Send the new screenshots to Claude and the embedded copy will be regenerated for you.

QR CODES (Try Them Today)
  They appear automatically once the site is hosted online.
  You can also set SITE_URL at the top of js/main.js.

3D model: assets/iphone.glb.js (your iphone_14_pro.glb, compressed and embedded).

SCROLL BEHAVIOUR (3D phone)
  Page 1 is the headline. Page 2 ("Meet Your Two New Companions") introduces the phone.
  The phone is a pure function of scroll (Flowty-style): scroll down and it spins to the next stop, scroll up and it spins back.
  It LOCKS on Stop Overspending, the MATE video, Never Wonder and the HomeChef video, and only moves on when you keep scrolling.
  Lock length: --hold on .pin and --vhold on .vpin in css/style.css (default 90vh).
  Phone position is read from cached layout (no measuring while scrolling); only its spin and fade are eased.
