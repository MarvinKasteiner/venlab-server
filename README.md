# Vue Datatable
> Autoren: Oliver Soukup, Fabian Raidl
> Datum:28.11.2025

Edit and rename the env.example then specify the correct schema in diesel.toml

1. Start the backend in /backend
`docker compose up -d` [2]
and now
`cargo build`

2. Vue Frontend
After that we can start the Vue in root with 
`docker compose up -d`

3. Access
Frontend available under http://localhost:8082/


# Implementation of Feedback
## Axios Classes
Mappings for each table has been created some examples are in services/BoxService.js etc.
The models are also now stored under models/Box.js for example.
These now house the constructors of each table view. [1]

## Vue App Table Access
All tables are and have been accessible at https://139.59.214.45/

## OpenAPI Documentation
Can be found in openapi.md

# Sources
[1] “Getting started,” Getting Started | Axios Docs, https://axios-http.com/docs/intro (accessed Jan. 13, 2026).
[2] “Getting started,” Getting Started | Docker Docs, https://docs.docker.com/compose/gettingstarted/ (accessed Jan. 13, 2026). 