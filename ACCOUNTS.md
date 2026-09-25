# Accounts & progress sync

Learners can create an account with **email + password** or **phone number + SMS code** and
have their progress follow them across devices. Everything is optional: without an account the
Atlas works exactly as before, saving progress in the browser.

## How it works

```
 browser (localStorage)  ⇄  assets/account.js  ⇄  Firebase Auth  +  Firestore users/{uid}
```

- **Progress still lives in the browser first.** Every page keeps reading and writing
  `localStorage` as it always has. `assets/account.js` watches writes to the Atlas keys
  (`sd-*`, `ml-*`, `dsa-*`, `atlas-*`) and mirrors them to one Firestore document per user.
- **What is synced:** chapters completed, best quiz scores, flashcard schedules, mock-interview
  history and notes, readiness checklists, and the light/dark theme — every course and the Atlas.
- **First sign-in on a device merges** what that browser already has with the account:
  completed chapters are combined, the best quiz score per chapter is kept, flashcards keep the
  more-reviewed schedule, mock-interview history is combined; anything else keeps the newest copy.
  The page reloads once to show the merged progress.
- **After that, the newest change wins, key by key**, live across open tabs and devices
  (un-ticking a chapter on one device un-ticks it everywhere).
- **Email and phone can belong to the same account.** Signed in with email, a learner can add a
  phone number (and vice versa), then sign in with either.
- **Sign out** offers “keep progress here” or “clear this browser” (for shared computers).
  **Delete account** removes the user and their synced data; the browser keeps its own copy.
- **Dormant by default.** Nothing appears until a Firebase config is added (below). The offline
  single-file editions and pages opened from disk (`file://`) never load it.

What is stored per user: their email and/or phone number (in Firebase Auth), and one document
`users/{uid}` with `progress` (the key/value pairs above with timestamps), `profile` (email/phone)
and `updatedAt`. Nothing else — no names, no analytics.

## Setup (about 10 minutes)

1. **Create a Firebase project** at <https://console.firebase.google.com> (Analytics not needed).
2. **Add a web app**: Project settings → *Your apps* → `</>` → register. Copy the `firebaseConfig`
   object it shows.
3. **Paste it into `assets/account-config.js`**, replacing `null`:
   ```js
   export const firebaseConfig = {
     apiKey: "…", authDomain: "your-project.firebaseapp.com",
     projectId: "your-project", appId: "…",
   };
   ```
   These values are public by design; security comes from steps 5–6.
4. **Turn on sign-in methods**: Authentication → *Sign-in method* → enable **Email/Password** and
   **Phone**.
5. **Authorise your domains**: Authentication → *Settings* → *Authorized domains* → add
   `captainblue793.github.io` (and any custom domain). `localhost` is there by default.
6. **Create the database and lock it down**: Firestore Database → *Create database* (production
   mode, a region near your users). Then Rules → paste `firestore.rules` from this repo → Publish.
   (Or with the Firebase CLI: `firebase deploy --only firestore:rules`.)
7. Commit and deploy. A **👤 Sign in** button appears in the header of every page.

### Phone sign-in notes

- Firebase bills SMS beyond a small free allowance and needs the **Blaze (pay-as-you-go)** plan
  for production phone auth. Set a budget alert in Google Cloud, or switch phone off in
  `assets/account-config.js` (`signInMethods.phone = false`) to offer email only.
- Under Authentication → Settings → *SMS region policy*, allow only the countries you expect
  (reduces SMS-fraud risk).
- For development, add **test phone numbers** (Authentication → Sign-in method → Phone) with a fixed
  code; they don't send real SMS.
- Phone verification uses an invisible reCAPTCHA; nothing extra to configure on the page.

### Optional hardening

- **App Check** (reCAPTCHA Enterprise) stops other sites from using your Firebase project.
- **Email enumeration protection** (Authentication → Settings) is on by default for new projects;
  keep it on.

## Trying it locally

Sign-in needs `http(s)`, not `file://`. From the repo root:

```bash
python -m http.server 8000      # then open http://localhost:8000/
```

## Files

| File | Role |
|---|---|
| `assets/account-config.js` | Your Firebase config and which sign-in methods to offer |
| `assets/account.js` | The whole feature: storage watcher, merge + sync engine, sign-in UI |
| `*/assets/app.js` (last lines) | Loads `../assets/account.js` on course pages when served over http(s) |
| `index.html` | Loads `assets/account.js` on the Atlas home |
| `firestore.rules` | Each user can read/write only `users/{their uid}`; everything else is closed |
| `firebase.json` | Lets `firebase deploy --only firestore:rules` find the rules |

## Testing

The feature was exercised end to end against a local stand-in for Firebase (same function
signatures as the Firebase SDK, same ownership rule as `firestore.rules`) with three separate
Chrome profiles acting as three devices: sign-up, wrong password and weak password, first-sign-in
merge, live sync both ways, un-ticking without resurrection, linking a phone to an email account
and an email to a phone account, phone sign-in with a wrong and right code, sign-out with clear,
account deletion, and the offline/`file://` cases staying account-free — 33/33 checks passed.
Before launch, repeat a short manual pass against your real Firebase project.
