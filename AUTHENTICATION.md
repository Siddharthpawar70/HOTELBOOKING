# Authentication prototype

This frontend currently demonstrates account screens only. There is no authentication server, user database, password verification, or Google OAuth integration.

## Routes

- Unauthenticated visitors are sent to `/login` before entering the guest website.
- `/login` shows the guest sign-in screen and links to `/register`.
- `/register` creates a demo traveller profile after validating the form.
- The existing user profile is saved in browser local storage. Passwords are never sent to a server or saved.
- The Google button creates a clearly labelled demo profile; it does not contact Google.

## Admin preview

Open `/admin` (for example, from the Hotelier Admin Portal link) to see the separate admin sign-in page. Use `admin@stayaura.demo` with any password to preview the console. Guest accounts cannot enter the admin console. The client-side email check is for UI preview only and is not an access-control boundary.

## Production requirements

Before real accounts are used, connect a trusted authentication provider and backend, validate sessions and roles on the server, and verify Google ID tokens server-side. Configure provider credentials outside client source code. Never rely on the demo email check to protect hotel or guest data.
