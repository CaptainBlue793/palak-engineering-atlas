/* =========================================================
   Accounts — Firebase project settings
   ---------------------------------------------------------
   Accounts are OFF until you paste your Firebase web-app
   config below (see ACCOUNTS.md for the 10-minute setup).
   These values are not secrets: every Firebase web app ships
   them to the browser. Security comes from Firestore rules
   (firestore.rules) and the authorised-domain list.
   ========================================================= */
export const firebaseConfig = null;

/* Example — replace `null` above with your own:
export const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  appId: "1:1234567890:web:abcdef",
};
*/

/* Which sign-in methods to offer. Phone sign-in sends real SMS,
   which Firebase bills beyond a small free allowance — switch it
   off here if you don't want that cost. */
export const signInMethods = { email: true, phone: true };

/* Country code pre-filled in the phone field. */
export const defaultCountryCode = '+91';
