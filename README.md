# Week 8 - Authenticated Tasks API

A RESTful backend API built with NestJS, TypeScript, PostgreSQL, TypeORM, JWT authentication, bcrypt, and Jest.

This project extends the Task Manager application developed in Week 6 and Week 7 by adding user authentication, authorization, request validation, exception handling, and automated testing.

## Technologies Used

- NestJS
- TypeScript
- Node.js
- PostgreSQL
- TypeORM
- JWT
- Passport
- bcrypt
- class-validator
- class-transformer
- Jest
- Supertest
- Thunder Client

## Features

- User registration
- User login
- Password hashing with bcrypt
- JWT authentication
- Protected API routes
- Request validation using DTOs
- Global exception handling
- PostgreSQL database integration
- TypeORM repositories
- Unit testing
- End-to-end testing
- API testing with Thunder Client

## Project Structure

```text
src/
├── auth/
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
│
├── users/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
│
├── projects/
│   ├── entities/
│   ├── projects.controller.ts
│   ├── projects.module.ts
│   └── projects.service.ts
│
├── tasks/
│   ├── entities/
│   ├── tasks.controller.ts
│   ├── tasks.module.ts
│   └── tasks.service.ts
│
├── tags/
│   └── entities/
│
├── common/
│   └── filters/
│       └── http-exception.filter.ts
│
├── app.controller.ts
├── app.module.ts
└── main.ts

test/
├── app.e2e-spec.ts
├── auth.e2e-spec.ts
└── jest-e2e.json
````

## Database

This project uses PostgreSQL.

Database name:

```text
week6_taskmanager
```

The database contains the following tables:

```text
users
projects
tasks
tags
task_tags
```

The `users` table contains authentication-related fields:

```text
id
name
email
password_hash
created_at
updated_at
```

Passwords are hashed using bcrypt before being stored in the database.

## Environment Variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_DATABASE=week6_taskmanager

JWT_SECRET=your-super-secret-jwt-key
```

Replace `YOUR_POSTGRES_PASSWORD` with your PostgreSQL password.

Do not commit the `.env` file to GitHub.

The `.gitignore` file should contain:

```text
.env
node_modules/
dist/
coverage/
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project:

```bash
cd week8-authenticated-tasks-api
```

Install dependencies:

```bash
npm install
```

## Running the Application

Start the development server:

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

The application can be tested using Thunder Client or Postman.

## Authentication API

### Register User

Endpoint:

```http
POST /auth/register
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Successful response:

```json
{
  "email": "user@example.com",
  "name": null,
  "id": 1,
  "createdAt": "2026-08-19T06:23:58.874Z",
  "updatedAt": "2026-08-19T06:23:58.874Z"
}
```

The password is never returned in the response.

### Login User

Endpoint:

```http
POST /auth/login
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Successful response:

```json
{
  "access_token": "JWT_TOKEN"
}
```

The returned JWT token is used to access protected endpoints.

## JWT Authentication

Protected endpoints require a Bearer token.

Add the following HTTP header:

```http
Authorization: Bearer JWT_TOKEN
```

Example:

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Request Validation

The API uses NestJS `ValidationPipe` with `class-validator`.

Registration and login requests validate:

* Email format
* Required fields
* Password type
* Minimum password length

Example invalid request:

```json
{
  "email": "invalid-email",
  "password": "123"
}
```

The request will be rejected with a validation error.

## Error Handling

The project uses a global exception filter:

```text
src/common/filters/http-exception.filter.ts
```

Errors are returned in a consistent format.

Example:

```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized",
  "timestamp": "2026-08-19T06:23:59.051Z",
  "path": "/auth/login"
}
```

## Testing

The project includes unit tests and end-to-end tests.

Run all tests:

```bash
npm test
```

Run E2E tests:

```bash
npm run test:e2e
```

Run authentication E2E tests only:

```bash
npm run test:e2e -- --runInBand test/auth.e2e-spec.ts
```

## Authentication E2E Tests

The authentication E2E tests verify:

### Successful Login

```text
POST /auth/login
```

Expected status:

```text
200 OK
```

Expected response:

```json
{
  "access_token": "..."
}
```

### Wrong Password

```text
POST /auth/login
```

Expected status:

```text
401 Unauthorized
```

Expected response contains:

```json
{
  "statusCode": 401,
  "message": "Invalid email or password"
}
```

## Thunder Client

Thunder Client can be used inside VS Code to test the API.

### Register

```text
POST http://localhost:3000/auth/register
```

Body:

```json
{
  "email": "test@example.com",
  "password": "Password123!"
}
```

### Login

```text
POST http://localhost:3000/auth/login
```

Body:

```json
{
  "email": "test@example.com",
  "password": "Password123!"
}
```

Copy the `access_token` from the response.

For protected endpoints, use:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## Useful Commands

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run start:dev
```

Build the application:

```bash
npm run build
```

Run unit tests:

```bash
npm test
```

Run E2E tests:

```bash
npm run test:e2e
```

Run authentication E2E tests:

```bash
npm run test:e2e -- --runInBand test/auth.e2e-spec.ts
```

## Week 6 → Week 7 → Week 8

### Week 6

Task Manager built using:

* PostgreSQL
* Raw SQL
* Database relationships
* Joins
* Aggregations

### Week 7

Task Manager rebuilt using:

* Node.js
* TypeScript
* TypeORM
* PostgreSQL
* Entities
* Relationships
* Migrations

### Week 8

Task Manager API extended using:

* NestJS
* Authentication
* JWT
* bcrypt
* DTO validation
* Exception filters
* Unit testing
* E2E testing

## Test Results

All tests are passing.

```text
Test Suites: 2 passed, 2 total
Tests:       3 passed, 3 total
```

Authentication tests:

```text
POST /auth/login - Success          PASS
POST /auth/login - Wrong Password   PASS
```

## Security

* Passwords are hashed using bcrypt.
* Plain-text passwords are never stored.
* Password hashes are not returned in API responses.
* JWT is used for authentication.
* Protected endpoints require a valid Bearer token.
* Environment variables are stored in `.env`.
* `.env` is excluded from Git.

## Author

**Motashim Nawaz Khan**

Internship - Week 8

Authenticated Tasks API

```