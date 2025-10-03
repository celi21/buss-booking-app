# Bus Booking Application
The bus booking app project is a web-based platform built using NodeJS, Express, MongoDB, React, and Stripe payment gateway. It offers functionalities such as user authentication via login and signup, an admin portal for journey creation, and a user portal for booking, viewing bookings, generating invoices, processing payments, redeeming coupon codes, and managing cancellations. The app streamlines the bus booking process, making it easier and more convenient for both users and administrators.

## Environments & Deployment

This repo is configured for isolated Staging and Production deployments on Render (free plan). Production remains untouched by default; all changes flow to Staging first.

### Branching
- `staging`: auto-deploys Staging services
- `main`: auto-deploys Production services

### Render Blueprint
We include `render.yaml` to provision four services:
- `buss-booking-api` (prod, Node web service, branch: `main`)
- `buss-booking-web` (prod, static site, branch: `main`)
- `buss-booking-api-staging` (staging, Node web service, branch: `staging`)
- `buss-booking-web-staging` (staging, static site, branch: `staging`)

Deploy the blueprint from Render Dashboard → New + → Blueprint → Connect repository.

### Environment Variables
Set the following environment variables in Render or locally via `.env` files:

Server (`server/.env`):
```sh
PORT=8000
NODE_ENV=production
MONGO_URL=
JWT_SECRET=
SALT_ROUNDS=10
STRIPE_SECRET_KEY=
MERCHANT_ONE_SECRET_KEY=
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=
CORS_ORIGINS=
```

Client (`client/.env`):
```sh
REACT_APP_API_BASE_URL=
REACT_APP_STRIPE_PUBLISHABLE_KEY=
REACT_APP_GOOGLE_MAPS_API_KEY=
```

### CORS
Server CORS is allowlist-based via `CORS_ORIGINS` (comma-separated) or fallback `FRONTEND_URL`. Credentials are enabled.

### GitHub Actions
Two workflows trigger Render deploys via deploy hooks:
- `.github/workflows/deploy-staging.yml` (on `staging`) uses secrets: `RENDER_STAGING_API_DEPLOY_HOOK`, `RENDER_STAGING_WEB_DEPLOY_HOOK`.
- `.github/workflows/deploy-production.yml` (on `main`) uses: `RENDER_PROD_API_DEPLOY_HOOK`, `RENDER_PROD_WEB_DEPLOY_HOOK`.

Create deploy hooks from each Render service → Settings → Deploy Hook and add them as GitHub repo secrets.

## Functionalities
+ User authentication via login and signup
+ Admin portal for journey creation
+ User portal for booking
+ View bookings
+ Invoice generation
+ Payments
+ Coupon codes
+ Cancellations

## Technologies Used
+ Node.js
+ Express
+ MongoDB
+ React
+ Stripe payment gateway

## Screenshots

![image](https://user-images.githubusercontent.com/62594900/221008908-d43f7bc7-74e4-4bd4-82be-f41b1085b16d.png)

![image](https://user-images.githubusercontent.com/62594900/221008939-a8600e65-571a-45a3-aaac-4a253d9ea0d0.png)

![image](https://user-images.githubusercontent.com/62594900/221009869-6e793df5-04c8-4ed4-b94e-7301a0c1d798.png)

![image](https://user-images.githubusercontent.com/62594900/221010084-240838e0-fc42-449d-bfd2-bbc41b745387.png)

![image](https://user-images.githubusercontent.com/62594900/221010211-01af4fe9-fcda-4b57-a865-74444de1d600.png)

[Sample Invoice.pdf](https://github.com/sauravshekharsingh/bus-booking-app/files/10817452/Sample.Invoice.pdf)

## Getting Started

### Prerequisites
+ Node.js
+ MongoDB

### Installation
+ Clone the repository:
```bash
git clone https://github.com/username/bus-booking-app.git
```
+ Install dependencies:
 ```bash
cd bus-booking-app
npm install
```

+ Set up Firebase:

	+ Create a Firebase account and project
	+ Generate Firebase API keys for the project
	+ Add the API keys to a .env file in the root directory in backend

```sh
STRIPE_SECRET_KEY
JWT_SECRET
SALT_ROUNDS
MONGO_URL
PORT
```
+ Add the API keys to a .env file in the root directory in frontend

```sh
REACT_APP_API_BASE_URL
REACT_APP_STRIPE_KEY
```
+ Start the server:
```bash
npm start
```

+ Open the app in your browser at http://localhost:8000 or on the specified PORT in the .env file

## Contributors
Saurav Shekhar Singh | @sauravshekharsingh

#
