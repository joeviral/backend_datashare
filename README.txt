Joetech Data Share — Simple project
===================================

What's included
- index.html — frontend form for creating confirmations
- admin.html — simple admin to list, edit, delete entries
- styles.css — styling
- app.js — frontend logic
- server.js — Node.js + Express backend
- data.json — storage file (created at runtime)

How it works
1. User fills phone, network, amount and message on index.html.
2. Frontend posts JSON to POST /api/gift.
3. server.js saves entry in data.json and returns the final text.
4. Admin can view/edit/delete entries at admin.html.

Setup (quick)
1. Save files in a folder.
2. Install Node dependencies:
   npm init -y
   npm install express body-parser cors
3. Run:
   node server.js
4. Open http://localhost:3000 in your browser (or deploy to a small VPS)

Notes
- This is a simple local/demo app. For production deploy use HTTPS, authentication, and a database.
- The front-end shows a JS alert "Welcome to Joetech Data Share Site" on load as requested.


Authentication
--------------
- Admin credentials are read from environment variables:
  ADMIN_USER (default: admin)
  ADMIN_PASS (default: password)
  SESSION_SECRET (set a secure value in production)

Airtime / Data API integration
-----------------------------
This project includes optional integration with Africa's Talking (Airtime & Data).
To enable:
1. Sign up at Africa's Talking and get your username and API key.
   Docs: https://developers.africastalking.com/docs/airtime/overview. citeturn0search5
2. Install the SDK:
   npm install africastalking
3. Add environment variables:
   AT_USERNAME=your_at_username
   AT_KEY=your_api_key
4. Restart the server. When configured, sending a gift will also attempt to top-up the recipient.

Other airtime/data providers
- VTpass (Nigeria-focused VTU & data) — docs: https://www.vtpass.com/documentation/airtime-vtu-api. citeturn0search1turn0search13
- Reloadly (global top-ups & data) — https://reloadly.com. citeturn0search23

Deploying to Firebase or Supabase
--------------------------------
- Firebase Functions: you can wrap this Express app inside Cloud Functions. Example file functions/index.js added as functions-index.js for guidance. Firebase docs: https://firebase.google.com/docs/functions/get-started. citeturn0search21
- Supabase: use Supabase for database + Auth and deploy static front-end to Supabase Hosting. Supabase deployment docs: https://supabase.com/docs/guides/deployment. citeturn0search24

Security notes
--------------
- This example uses simple session auth for convenience. For production, enable HTTPS, use stronger password storage (hashed), and consider using Supabase Auth or Firebase Auth for admin accounts.
