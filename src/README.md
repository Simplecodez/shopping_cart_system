# Shopping cart system

This project is a backend application built with Express, MongoDB, Redis and Mongoose. The sections below provides step-by-step guides for setting it up.

## Prerequisites

Ensure the following are installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) (preferably LTS version)

## Project Setup

### 1. Clone the Repository

Clone the project repository:

```bash
git clone https://github.com/simplecodez/shopping_cart_system.git
cd shopping_cart_system

```

### 2. Install npm packages

```bash
npm install
```

### 3. Add the Environment variables

Create a file named `.env` at the root of your project and populate this envs

```
MONGODB_URI=
JWT_SECRET=
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=default

```

### 4. Run Redis on docker

The command below sets up the Redis image container as defined in the compose.yaml file.

```bash
docker-compose up -d
```

### 5. Start Application

Run the command below to start the app.

```bash
npm run dev
```

### 6. View Documentation

To view the API documentation, open your browser and go to:

[`documentation link`](documentation)
