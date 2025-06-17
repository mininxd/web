# Scalar API Documentation App

- This project serves `Scalar Swagger` using an `Express` backend.
- It provides a modular and easy-to-extend way to document your API endpoints.
- It also supports a `__dynamic server URL__`, so you don’t need to update your server url manually.

---

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/import?s=https://github.com/mininxd/web/tree/scalar)


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

`helloWorld.json`
```json
{
  "/hello": {
    "get": {
      "summary": "Hello World",
      "description": "Returns a simple hello world message.",
      "responses": {
        "200": {
          "description": "Successful response",
          "headers": {
            "Content-Type": {
              "description": "The content type of the response",
              "schema": {
                "type": "string",
                "example": "application/json"
              }
            }
          },
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": {
                    "type": "string",
                    "example": "hello world"
                  }
                }
              },
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
npm run start
npm run dev          # running with nodemon
```

## Build app 

```bash
npm run build
npm run build -- --dynamic     # dynamic url build
npm run start
```

Your Swagger UI will be available at: `http://localhost:3000/swagger`


__TL:DR__;
Dynamic build is auto detect URL by your browser

---