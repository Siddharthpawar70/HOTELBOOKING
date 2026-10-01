# Authentication prototype

This frontend currently demonstrates account screens only. There is no authentication server, user database, password verification, or Google OAuth integration.

## Routes

- `/login` shows the sign-in screen.
- `/register` creates a demo traveller profile after validating the form.
- The existing user profile is saved in browser local storage. Passwords are never sent to a server or saved.
- The Google button creates a clearly labelled demo profile; it does not contact Google.

## Admin preview

Use `admin@stayaura.demo` on the sign-in page with any password to preview `/admin`. The client-side email check is for UI preview only and is not an access-control boundary.

## Production requirements

Before real accounts are used, connect a trusted authentication provider and backend, validate sessions and roles on the server, and verify Google ID tokens server-side. Configure provider credentials outside client source code. Never rely on the demo email check to protect hotel or guest data.
