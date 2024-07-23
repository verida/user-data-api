# User Data API

A simple PoC of a user data API that exposes endpoints to easily access decrypted user data stored on the Verida network.

This server is designed to be run locally or within a secure enclave to ensure privacy of user data and encryption keys.

## Setup

```
yarn
yarn run dev
```

## Endpoint Headers

All endpoints expect a `key` header to be passed that provides the Verida account `privateKey` (hex) or `seedPhrase`.

In the future, this will be modified to be `access` and `refresh` tokens.

Verida databases and datastores have different permissions that must be specifid in order to access the databases. These can be specified with the `permissions` header:

```
permissions = "write=owner,read=owner"
```

Supported options are:

- `read` / `write`
- `owner` / `public` / `users`

## Endpoint

There are two types of supported endpoints:

- `/db/` - Database access
- `/ds/` - Datastore access

It's expected to add additional endpoints in the future, such as `lucene` search endpoints.

### Database Endpoints

These examples fetch data from the `test_db` database.

**Get all records:**

```
curl -X GET \
     -H "key: <privateKey>" \
     http://localhost/db/get/test_db/38ae4e60-3a8a-11ef-b2fa-835c757cb6eb
```

**Get record by ID:**

```
curl -X GET \
     -H "key: <privateKey>" \
     http://localhost/db/get/test_db/38ae4e60-3a8a-11ef-b2fa-835c757cb6eb
```

```
curl -X POST \
     -H "key: <privateKey>" \
     -d '{
        "selector": {
            "name": "Test credential"
        },
        "options": {
            "sort": [{"insertedAt": "asc"}]
        }
    }'
     http://localhost/db/query/test_db/38ae4e60-3a8a-11ef-b2fa-835c757cb6eb
```

### Datastore Endpoints

Verida datastore's are data stored in databases that meet a specific JSON schema definition. A datastore is referenced by it's URL. This schema URL needs to be passed to the API, so it is base64 encoded.

The examples below make requests on the Verida Credential schema (`https://common.schemas.verida.io/credential/base/v0.2.0/schema.json`) which is base64 encoded (`aHR0cHM6Ly9jb21tb24uc2NoZW1hcy52ZXJpZGEuaW8vY3JlZGVudGlhbC9iYXNlL3YwLjIuMC9zY2hlbWEuanNvbg==`).

You can easily encode any schema URL here: https://www.base64encode.org/

**Get all records:**

```
curl -X GET \
     -H "key: <privateKey>" \
     http://localhost/ds/get/aHR0cHM6Ly9jb21tb24uc2NoZW1hcy52ZXJpZGEuaW8vY3JlZGVudGlhbC9iYXNlL3YwLjIuMC9zY2hlbWEuanNvbg==/38ae4e60-3a8a-11ef-b2fa-835c757cb6eb
```

**Get record by ID:**

```
curl -X GET \
     -H "key: <privateKey>" \
     http://localhost/ds/get/aHR0cHM6Ly9jb21tb24uc2NoZW1hcy52ZXJpZGEuaW8vY3JlZGVudGlhbC9iYXNlL3YwLjIuMC9zY2hlbWEuanNvbg==/38ae4e60-3a8a-11ef-b2fa-835c757cb6eb
```

```
curl -X POST \
     -H "key: <privateKey>" \
     -d '{
        "selector": {
            "name": "Test credential"
        },
        "options": {
            "sort": [{"insertedAt": "asc"}]
        }
    }'
     http://localhost/ds/query/aHR0cHM6Ly9jb21tb24uc2NoZW1hcy52ZXJpZGEuaW8vY3JlZGVudGlhbC9iYXNlL3YwLjIuMC9zY2hlbWEuanNvbg==/38ae4e60-3a8a-11ef-b2fa-835c757cb6eb
```