# Scalar API Documentation App

This project serves Scalar UI with an Express backend.
It allows you to document your API endpoints in a modular and easy-to-extend way.

---

## How to Add More API Data to `swagger`
By default, Swagger loads your API specification from `openapi.yaml`.  
But in this app, you can freely add short JSON code with different files and just put them in the swagger folder.

### 1. Locate the `swagger` folder
This folder contains `index.json` and `test.json`.
Typically, it looks like this (simplified example):

`index.json`
```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "scalar express api",
    "version": "1.0.0",
    "description": "This is an example scalar API Docs."
  },
  "servers": [
    {
      "url": "http://localhost:3000"
    }
  ],
  "paths": {}
}
```

`test.json`
```json
{
  "/test": {
    "get": {
      "summary": "Get test data",
      "description": "Returns a simple hello world message.",
      "responses": {
        "200": {
          "description": "Successful response",
          "content": {
            "application/json": {
              "example": {
                "message": "hello world"
              }
            }
          }
        }
      }
    }
  }
}
```

### 2. Add a New Endpoint

To add a new route, you can create a new JSON file or extend any existing JSON file.

Example: Adding a POST `/user` endpoint,
create a new `user.json` file:
```json
{
  "/user": {
    "post": {
      "summary": "Create a new user",
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "username": { "type": "string" },
                "email": { "type": "string", "format": "email" }
              },
              "required": ["username", "email"]
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "User created successfully"
        }
      }
    }
  }
}
```

### 3. Save and Reload

Once you update and save, restart your server or refresh your Scalar UI page to see the new documentation.

---

## Notes

- When deploying to Vercel, don't forget to build first, or set the build command to "node build.js"
- The OpenAPI spec must remain a valid JSON file.

---

## Running the App

```bash
npm install
node index.js
```

Your Swagger UI will be available at: `http://localhost:3000/swagger`

---

If you're familiar with nodemon, you can use that for development with auto refresh when files are updated.