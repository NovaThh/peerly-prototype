# Peerly Server

Spring Boot backend for the Peerly peer learning platform prototype.

## Prerequisites

Before running the backend, make sure you have the following installed:

- **Java 17**
- **Maven 3.9+**
- **Docker Desktop** or another Docker runtime
- **PostgreSQL** via Docker Compose

This backend uses:

- **Spring Boot 4**
- **PostgreSQL**
- **Port `8081`** for the server
- **Port `55432`** for the local PostgreSQL container

The default database configuration is loaded from `application.properties`:

- Database URL: `jdbc:postgresql://localhost:55432/peerly`
- Database username: `postgres`
- Database password: `password`
- Server port: `8081`

## Project Setup

### 1. Go to the server folder

```bash
cd apps/server
```

### 2. Start the database

From the project root, start PostgreSQL with Docker Compose:

```bash
docker compose up -d db
```

If you want to start all services with Docker instead, run:

```bash
docker compose up --build
```

### 3. Install dependencies and compile the project

From `apps/server`:

```bash
mvn clean install
```

## Run the Project

### Run the backend normally

From `apps/server`:

```bash
mvn spring-boot:run
```

The backend will start on:

```text
http://localhost:8081
```

### Seed sample data

To insert the sample users, first **stop the running server** if it is running.

Then run the seeder from `apps/server`:

```
mvn "-Dexec.mainClass=com.peerly.server.seeder.DataSeeder" exec:java
```

After the seeder finishes, **start the server again**:

```bash
mvn spring-boot:run
```

### Clear all seeded data

To remove all users from the database, first **stop the running server**.

Then run the clearer from `apps/server`:

```
mvn "-Dexec.mainClass=com.peerly.server.seeder.DataClearer" exec:jav
```

After the clearer finishes, **start the server again**:

```bash
mvn spring-boot:run
```

## Credentials

The following sample users are created by `DataSeeder`.

| Name          | Email                 | Password      |
| ------------- | --------------------- | ------------- |
| Alice Johnson | `alice@example.com`   | `password123` |
| Bob Smith     | `bob@example.com`     | `password123` |
| Charlie Brown | `charlie@example.com` | `password123` |
| Diana Prince  | `diana@example.com`   | `password123` |
| Eve Wilson    | `eve@example.com`     | `password123` |

## Run Tests
from `apps/server` run:

```bash
# Unit tests
mvn test

# Integration tests
mvn verify

```

## Notes

- The database must be running before starting the backend, seeding data, or clearing data.
- `DataSeeder` only creates users that do not already exist.
- `DataClearer` removes all users from the database.
- If you run the backend with Docker instead of Maven, the backend uses the database service name `db` internally, while local Maven runs use `localhost:55432` by default.
