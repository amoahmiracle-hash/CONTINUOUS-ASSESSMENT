# School CA & Report Card Tracker — PWA package

An installable, works-offline version of the app. It is the same app as `school-ca-tracker.html`, plus the pieces that let a phone or computer install it and open it with no internet.

## What is in this folder

| File | What it does |
|---|---|
| `index.html` | The app itself |
| `manifest.webmanifest` | Tells the phone/computer the app's name, icons, colours and shortcuts |
| `sw.js` | The "service worker" — saves the app on the device so it opens offline |
| `pwa.js` | Install button, "new version" notice, and a warning if two windows are open |
| `icons/` | App icons (normal, maskable, Apple, favicon) |
| `screenshots/` | Pictures shown in the install window and by PWABuilder |

## Before you start — save your data

The app keeps its records inside the browser, **at the web address it is opened from**. The new web address starts empty, so move your records across like this:

1. In your **current** app: **Setup → Save Backup** (a `.json` file downloads).
2. Later, in the **new** installed app: **Setup → Import & Replace All**, and choose that file.

## Step 1 — Put it on GitHub Pages

1. On GitHub, create a new **public** repository, for example `school-ca-tracker`.
2. Upload everything that is **inside** this folder (not the folder itself) to the repository, and commit.
3. Open the repository's **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and Save.
4. After about a minute the app is live at `https://<your-username>.github.io/<repository-name>/`.

## Step 2 — Check that it works

1. Open that address in Chrome or Edge and let it finish loading once.
2. Turn off Wi-Fi / mobile data and reload. The app should still open.
3. Install it: use the **Install app** button in the app's green header (or the install icon in the browser's address bar). On Android you can also use the browser menu → *Install app*.
   - **iPhone / iPad:** open the address in Safari → Share → **Add to Home Screen**. A home-screen app on iOS has its own storage, separate from Safari — so install first, then import your backup inside the installed app.

## Step 3 — PWABuilder (only if you want a store-style package)

1. Go to **pwabuilder.com**, paste the live address, and press **Start**.
2. It should find the manifest and the service worker. Choose **Package for stores** and pick **Android** or **Windows**.
3. Download the package it builds.

Note for Android: a package for an address like `username.github.io/repository` cannot prove ownership of the web address, so the app opens with a thin address bar at the top. Using your own domain name removes that. Windows packages are not affected.

## Publishing an update later

1. Replace `index.html` (and any other changed file) in the repository.
2. Open `sw.js` and change `VERSION` (for example `"1.0.0"` → `"1.0.1"`). This step is what makes devices pick up the new files.
3. Commit. The next time someone opens the app online, a bar appears: *"A new version of the app is ready"* with an **Update now** button. Their saved records are not touched.

## Changing the app icon

The logo printed on report cards can be changed inside the app (**Setup → School Logo / Crest**). The icon on the home screen is a separate picture. To change it, replace the files in `icons/` with your own, keeping the same names and sizes (`icon-192`, `icon-512`, `maskable-192`, `maskable-512`, `apple-touch-icon` 180×180, `favicon-32`, `favicon-64`). Keep the artwork in the middle 80% of the maskable ones. Then raise `VERSION` in `sw.js`.

## Good to know

- Records live **on each device**. A teacher's phone and the head's computer do not share data automatically — use backup files and **Import & Merge Entries**.
- Opening the app in two windows at once can overwrite scores, so the app shows a "reload" notice if it sees the records change in another window.
- The app asks the browser to protect its saved data from being cleared when the device is short of space. Keep making backups anyway (the app reminds you after 7 days).
- Printing report cards: choose paper size **A5**, scale **100%**, and turn **Headers and footers** off.
