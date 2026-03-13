# Peerly Server

This is the Spring Boot backend for the Peerly prototype.

## Dockerized setup
A `Dockerfile` and root-level `docker-compose.yml` have been added so that the entire backend (including a PostgreSQL database) can be started without any manual configuration.

### Steps for teachers or evaluators
1. **Ensure Docker is installed** on your machine.
2. Open a terminal in the repository root (`peerly-prototype`).
3. Run:
   ```sh
   docker-compose up --build
   ```
   This does the following:
   - Pulls a `postgres:15` image and starts it with `peerly` database pre‑configured.
   - Builds the server jar using Maven and starts the Spring Boot application.
4. The API will be reachable at `http://localhost:8080`. No database setup is required; the service connects to the `db` container automatically.

### Environment variables
The application reads database configuration from environment variables which are set in `docker-compose.yml`:
- `SPRING_DATASOURCE_URL` (default `jdbc:postgresql://db:5432/peerly`)
- `SPRING_DATASOURCE_USERNAME` (`postgres`)
- `SPRING_DATASOURCE_PASSWORD` (`password`)

They fall back to sensible defaults in `application.properties` when not provided.

### Notes
- The Maven build in the Dockerfile uses a multi-stage image to keep the final image small.
- A `.dockerignore` file excludes `target/` and `.git`.

Feel free to stop the services with `docker-compose down` when you are finished.
