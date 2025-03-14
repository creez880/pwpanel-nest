# v0.0.3-SNASHOT

## Implemented features

- Added summary and description for every endpoint
- Added functionality to resend the activation link
- Added dark mode to swagger
- Modify the endpoint /auth/verify-email from GET to POST; use request body instead of query param for the verification token
- Added scheduler to clear all overdue user verification token

# v0.0.2-alpha - 21st February 2025

## Implemented features:

- Added user rate limiting per IP in a fixed time window
- Added displayName for a user (can be shown instead of the username)
- Added endpoints for fetching and deleting users
- Added email verification feature
- Added mailing feature
- Added global validation of the request payloads
- Improved validation and transformation for all fields inside the request payloads
- Added swagger module with proper request body description
  <br><br><br>

# v0.0.1-alpha - 13th February 2025

## Implemented features:

- Authentication via JWT
- Database with initial migration of the users table
- Register & Login endpoint working with the database
