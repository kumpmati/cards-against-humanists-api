# Cards Against Humanists API

This is the NodeJS backend server logic for the [Cards Against Humanists](https://cards-against-humanist.xyz) web game, hosted on a free [Heroku](https://heroku.com) dyno.

# Setup

## Firebase

The backend uses the Firebase Realtime Database as its database, so a valid firebase config is required.

These environment variables must be set in order to connect to Firebase:

- API_KEY
- AUTH_DOMAIN
- DATABASE_URL
- PROJECT_ID
- STORAGE_BUCKET
- MESSAGING_SENDER_ID
- APP_ID
