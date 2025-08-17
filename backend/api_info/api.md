---
title: My Project
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# My Project

Comprehensive collection for interacting with the Indstrex backend. Variables: {{base_url}}, {{access_token}}, {{refresh_token}}, {{vendor_id}}, {{product_id}}.

Base URLs:

* <a href="http://localhost:3000">Develop Env: http://localhost:3000</a>

# Authentication

- HTTP Authentication, scheme: bearer

# ProMarket

## POST signup

POST /auth/signup

> Body Parameters

```json
{
  "email": "omar1@email.com",
  "password": "123456@Omar"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» email|body|string| yes |none|
|» password|body|string| yes |none|

> Response Examples

> 201 Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODllNjgxZTA5YTdiZWRkN2MwNmUwNjciLCJyb2xlIjoidXNlciIsImVtYWlsIjoib21hcjFAZW1haWwuY29tIiwiaWF0IjoxNzU1MjExODA2LCJleHAiOjE3NTUyMTI0MDZ9.-c4S--MFbC09_VpfubWbzKPykr8aCAM-GlxHpCEHSeM",
  "role": "user",
  "email": "omar1@email.com"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» accessToken|string|true|none||none|
|» role|string|true|none||none|
|» email|string|true|none||none|

## POST login

POST /auth/login

> Body Parameters

```json
{
  "email": "omar@email.com",
  "password": "123456@Omar"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» email|body|string| yes |none|
|» password|body|string| yes |none|

> Response Examples

> 201 Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODllNjgxZTA5YTdiZWRkN2MwNmUwNjciLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6Im9tYXIxQGVtYWlsLmNvbSIsImlhdCI6MTc1NTIxMTg1NSwiZXhwIjoxNzU1MjEyNDU1fQ.FjJaEsJppJMUJcUZbLrGT6poprY-aI1dats09EAnVZk",
  "role": "admin",
  "email": "omar1@email.com"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» accessToken|string|true|none||none|
|» role|string|true|none||none|
|» email|string|true|none||none|

## GET refreshToken

GET /auth/refresh

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|refreshToken|cookie|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODllNGQ1ZjBlOGZkYzc0Njk3NDQwMDMiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1NTIwOTM4MywiZXhwIjoxNzU1MjA5OTgzfQ.CC33DK2vAWrMv7AUsL03v51Bf595yXcdzDdX4t3NRXA"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» accessToken|string|true|none||none|

## POST CreateProduct

POST /products

> Body Parameters

```json
{
  "name": "headset",
  "description": "a new good headset with good voice quality",
  "price": 500,
  "category": "accessories",
  "image": "sdas",
  "stock": 25
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Get All Products

GET /products

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|category|query|string| no |group|
|limit|query|string| no |none|
|page|query|string| no |none|

> Response Examples

> 200 Response

```json
{
  "products": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "price": 0,
      "category": "string",
      "image": "string",
      "stock": 0,
      "__v": 0
    }
  ],
  "query": {
    "category": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» products|[object]|true|none||none|
|»» _id|string|false|none||none|
|»» name|string|false|none||none|
|»» description|string|false|none||none|
|»» price|integer|false|none||none|
|»» category|string|false|none||none|
|»» image|string|false|none||none|
|»» stock|integer|false|none||none|
|»» __v|integer|false|none||none|
|» query|object|true|none||none|
|»» category|string|true|none||none|

## GET Get Product By ID

GET /products/689f2854de8aea5195c4b765

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## PATCH Update Product By Id

PATCH /products/689f2854de8aea5195c4b765

> Body Parameters

```json
{
  "description": "a new good headphone with good voice quality "
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "price": 0,
  "category": "string",
  "image": "string",
  "stock": 0,
  "__v": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» _id|string|true|none||none|
|» name|string|true|none||none|
|» description|string|true|none||none|
|» price|integer|true|none||none|
|» category|string|true|none||none|
|» image|string|true|none||none|
|» stock|integer|true|none||none|
|» __v|integer|true|none||none|

## DELETE Delete Product By ID

DELETE /products/689f307e2742720e85c96781

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|none|None|

## POST Create Order

POST /orders

> Body Parameters

```json
{
  "items": [
    {
      "productId": "689f200f397067483708e5ae",
      "quantity": "5"
    }
  ]
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|

> Response Examples

> 201 Response

```json
{
  "userId": "string",
  "items": [
    {
      "productId": "string",
      "quantity": 0,
      "priceSnapshot": 0
    }
  ],
  "total": 0,
  "status": "string",
  "_id": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "__v": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» userId|string|true|none||none|
|» items|[object]|true|none||none|
|»» productId|string|false|none||none|
|»» quantity|integer|false|none||none|
|»» priceSnapshot|integer|false|none||none|
|» total|integer|true|none||none|
|» status|string|true|none||none|
|» _id|string|true|none||none|
|» createdAt|string|true|none||none|
|» updatedAt|string|true|none||none|
|» __v|integer|true|none||none|

## GET Get All Orders

GET /orders/

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Get My Order

GET /orders/me

> Response Examples

> 200 Response

```json
[
  {
    "_id": "string",
    "userId": "string",
    "items": [
      {
        "productId": {
          "_id": "string",
          "name": "string",
          "price": 0,
          "image": "string"
        },
        "quantity": 0,
        "priceSnapshot": 0
      }
    ],
    "total": 0,
    "status": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "__v": 0
  }
]
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» _id|string|false|none||none|
|» userId|string|false|none||none|
|» items|[object]|false|none||none|
|»» productId|object|false|none||none|
|»»» _id|string|true|none||none|
|»»» name|string|true|none||none|
|»»» price|integer|true|none||none|
|»»» image|string|true|none||none|
|»» quantity|integer|false|none||none|
|»» priceSnapshot|integer|false|none||none|
|» total|integer|false|none||none|
|» status|string|false|none||none|
|» createdAt|string|false|none||none|
|» updatedAt|string|false|none||none|
|» __v|integer|false|none||none|

## PATCH update Order Status

PATCH /orders/689f51ec96c0d16d17c57d50/status

> Body Parameters

```json
{
  "status": "preparing"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{
  "_id": "string",
  "userId": "string",
  "items": [
    {
      "productId": "string",
      "quantity": 0,
      "priceSnapshot": 0
    }
  ],
  "total": 0,
  "status": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "__v": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» _id|string|true|none||none|
|» userId|string|true|none||none|
|» items|[object]|true|none||none|
|»» productId|string|false|none||none|
|»» quantity|integer|false|none||none|
|»» priceSnapshot|integer|false|none||none|
|» total|integer|true|none||none|
|» status|string|true|none||none|
|» createdAt|string|true|none||none|
|» updatedAt|string|true|none||none|
|» __v|integer|true|none||none|

# Data Schema

