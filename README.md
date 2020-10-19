# Cards Against Humanists API

This is the NodeJS backend server logic for [Cards Against Humanists](https://cards-against-humanist.xyz), hosted on a [Heroku](https://heroku.com) Hobby dyno.

# Setup

## Firebase

The backend uses [Firebase Firestore](https://firebase.google.com/docs/firestore) as its card database, so a valid firebase config is required.

These environment variables must be set in order to connect to Firebase:

- API_KEY
- AUTH_DOMAIN
- DATABASE_URL
- PROJECT_ID
- STORAGE_BUCKET
- MESSAGING_SENDER_ID
- APP_ID

These environment variables are needed for database read and write access:

- DB_EMAIL
- DB_PASSWORD
