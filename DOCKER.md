# Docker image and OCIR deployment (single-container, multi-arch)

Files added

- `Dockerfile` — multi-stage build (Node build, Composer install, final image)
- `docker/nginx/default.conf` — nginx site configuration
- `docker/supervisor/supervisord.conf` — run php-fpm and nginx under supervisord
- `docker/docker-entrypoint.sh` — entrypoint to set permissions and optionally run migrations
- `.dockerignore` — files excluded from build context
- `.github/workflows/ocir-publish.yml` — GitHub Actions workflow to build and push to OCIR

Local build & test

1. Build the image for the architecture you want to test (loads it into your local Docker). Use `linux/amd64` on Intel hosts or when you need Instant Client x64, and `linux/arm64` on Apple Silicon or other ARM64 hosts. The build will fail if the Oracle Instant Client ZIPs for the selected platform are missing under `docker/instantclient/`.

```bash
docker buildx build --platform linux/amd64 -t textile-lab:local --load .
# or
docker buildx build --platform linux/arm64 -t textile-lab:local --load .
```

2. Run the container (provide `APP_KEY` and DB variables as needed). If you built the opposite architecture from your host CPU, pass `--platform` again so Docker Desktop emulates that architecture. Expose port `6001` for Reverb (WebSockets):

```bash
docker run --rm -p 8080:80 -p 6001:6001 \
  --platform linux/amd64 \
  -e APP_ENV=local \
  -e APP_KEY=base64:YOUR_APP_KEY \
  -e DB_CONNECTION=mysql -e DB_HOST=host.docker.internal -e DB_PORT=3306 -e DB_DATABASE=textile -e DB_USERNAME=user -e DB_PASSWORD=pass \
  -e REVERB_APP_ID=textile-local \
  -e REVERB_APP_KEY=local-app-key \
  -e REVERB_APP_SECRET=local-app-secret \
  -e REVERB_HOST=localhost -e REVERB_PORT=6001 -e REVERB_SCHEME=http \
  textile-lab:local
```

Note: The container will not include your `.env`; pass environment variables at runtime.

Optional: run migrations by adding `-e MIGRATE=true` (only if you want migrations to execute on container start).

### Using Docker Compose

To avoid the long `docker run` command you can now use `docker-compose.yml` at the repo root. It builds from the same `Dockerfile`, wires `docker.env`, publishes `8080`/`6001`, and attaches to the shared `textile-network` (created previously for Oracle). If that network does not exist yet run `docker network create textile-network` once.

```bash
# build and start
docker compose up --build -d

# follow logs
docker compose logs -f

# stop
docker compose down
```

Override or extend variables by editing `docker.env` or passing `--env-file`/`-e` flags directly to `docker compose`.

CI / OCIR notes

- Configure repository secrets: `OCIR_USERNAME`, `OCIR_PASSWORD`, `OCIR_TENANCY`, `OCIR_REGION`, `OCIR_REPOSITORY`.
- Workflow `ocir-publish.yml` builds both `linux/amd64` and `linux/arm64` images (so include both Oracle Instant Client ZIPs under `docker/instantclient/`) and pushes `latest` plus a commit-SHA tag.

Troubleshooting

- If `docker build` fails with credential helper errors (e.g., `docker-credential-desktop` not found), run `docker login` or configure your credential helper. On macOS with Docker Desktop this is usually preconfigured.
- If nginx or php-fpm fail to start, check container logs: `docker logs <container-id>`.
- Reverb runs under Supervisor (`php artisan reverb:start`) and listens on port `6001`. Update `REVERB_*` variables (or the `.env` file) to match the hostnames your frontend will use and ensure port `6001` remains exposed or proxied for WebSocket clients.

Questions or changes?
If you'd like a `docker-compose.qa.yml` that sets up the app + MySQL for local integration tests, I can add that next.
