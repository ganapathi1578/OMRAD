# 🏥 OMRAD Diagnostics — Full (Production) Build

This repository contains a **complete, production-ready build** of the OMRAD Diagnostics system — frontend, backend, and integrated AI models — packaged as containers.
Everything (UI, API, model inference, storage) is prebuilt and wired together. To run the whole system you only need **Docker** and **Docker Compose** on your machine (or Raspberry Pi).

> This README focuses on *what the project is* and *how to run it* (single command deployment).

---

## What this project is

* **Single-user, offline-capable medical imaging app** (designed for local deployment on a Raspberry Pi or any server).
* User uploads an X-ray image in the web UI → backend runs the integrated AI inference pipeline → result is returned and saved as a report.
* All model artifacts are already integrated into the backend container. No external APIs or internet required for inference.
* Persistent storage for uploaded images and generated reports is provided via Docker volumes.

---

## Main components (already included)

* **Frontend** — modern responsive UI (HTML/CSS/JS) served by the frontend container.
* **Backend** — Flask API that handles uploads, executes `diagnosis(image)` pipeline (AI models included), and returns/stores reports.
* **Model service** — inference libraries and pre-trained models packaged inside backend image (no separate container required unless desired).
* **Storage** — Docker volumes for:

  * uploaded images
  * generated reports / logs
* **Optional reverse proxy** (nginx) — configured to proxy and serve static assets, TLS-ready if desired.

---

## Requirements

* Docker (latest stable).
* Docker Compose (v2 recommended).
* For Raspberry Pi (ARM64): install Docker & Compose on Pi. Prebuilt multi-arch images are provided; if you choose to build locally, see the Raspberry Pi notes below.

---

## Quick start (run the whole system)

1. Clone the repo (or copy project folder):

```bash
git clone https://github.com/yourusername/omrad-fullbuild.git
cd omrad-fullbuild
```

2. Start everything with Docker Compose:

```bash
docker compose up --build
```

* The command will build (if needed) and start all containers.
* To run detached:

```bash
docker compose up -d --build
```

3. Open the UI in your browser:

* On the machine running the stacks: `http://localhost:5000`
* On another device in the same network: `http://<HOST_IP>:5000`

---

## Stop / Restart / Remove

* Stop (graceful):

```bash
docker compose down
```

* Stop & remove volumes (data will be deleted):

```bash
docker compose down -v
```

* Restart:

```bash
docker compose restart
```

---

## Logs & debugging

* View live logs:

```bash
docker compose logs -f
```

* View logs for a specific service (example `backend`):

```bash
docker compose logs -f backend
```

* Enter a running container shell:

```bash
docker compose exec backend sh
# or bash if present
```

---

## Data persistence & volumes

By default the compose file mounts persistent volumes:

* `images_volume` — uploaded images
* `reports_volume` — generated reports (JSON / PDF / text)
* `db_volume` — optional local DB if used

These map to local Docker-managed volumes so data survives restarts. The compose file can be edited to map to host paths if desired.

---

## Configuration

* Environment variables are handled via `.env` (already included). Typical configurable values:

  * `APP_PORT` — HTTP port (default 5000)
  * `MODEL_THREADS` — number of CPU threads for model inference
  * `STORAGE_PATH` — location inside container for saved files
* To change configs: edit `.env` then `docker compose up -d --build`.

---

## Raspberry Pi (ARM) notes

* The repository includes multi-arch images where possible. If you pull releases from the registry, they are ARM-compatible.
* If you build images locally on a non-ARM machine, use `docker buildx` to produce multi-arch images, or build directly on the Pi:

  * Build for Pi using buildx (example):

    ```bash
    docker buildx build --platform linux/arm64,linux/amd64 -t yourname/omrad-backend:latest --push backend/
    ```
  * Or build on the Pi (slower):

    ```bash
    docker compose build
    ```
* Ensure the Pi has enough memory; for heavier model inference, an ARM64 Pi with 4GB+ RAM is recommended.

---

## Security & network

* The default setup binds the UI to port `5000` on all interfaces (`0.0.0.0`). If deploying in a networked environment, restrict access via firewall or use a reverse proxy with TLS (nginx + certs).
* For single-device/local mode (Pi in a clinical kiosk), keep network isolated or use local network ACLs.

---

## Upgrading models or code

* Replace or update model files inside the backend `models/` folder, then rebuild backend image:

```bash
docker compose build backend
docker compose up -d
```

* If you prefer to deploy a prebuilt image from a registry, update `docker-compose.yml` to point to the new image tag and run:

```bash
docker compose pull
docker compose up -d
```

---

## Common troubleshooting

* **Port already in use**: change `APP_PORT` in `.env` or stop the conflicting service.
* **Permissions error writing volumes**: ensure Docker user has permission to host-mounted directories, or use Docker-managed volumes.
* **Model inference failing**: check `backend` logs (`docker compose logs backend`) for Python/torch/onnx errors. For missing dependencies, rebuild backend with updated `requirements.txt`.

---

## Typical file layout (already included)

```
.
├── backend/
│   ├── Dockerfile
│   ├── app.py              # Flask app + /upload and /report endpoints
│   ├── diagnosis.py        # diagnosis(image) pipeline & model wrappers
│   └── models/             # pre-trained model files (already integrated)
├── frontend/
│   ├── index.html
│   ├── assets/
│   └── app.js
├── docker-compose.yml
├── .env
└── README.md
```

---

## How the (integrated) pipeline behaves

1. Web UI → user uploads image.
2. Image is routed to backend `/upload`.
3. Backend saves image to `images_volume` and calls `diagnosis(image)` which:

   * performs pre-processing,
   * runs one or more inference models (already included),
   * compiles a structured report (JSON + human-readable summary),
   * stores the report in `reports_volume`.
4. UI fetches and displays the generated report immediately.

---

## Ports (defaults)

* `5000` — Application UI & API (HTTP)
* Other internal ports used by services are defined in `docker-compose.yml`.

---

## License

MIT License.

---

## Change log & support

* This README assumes the **complete integrated build** (models included). If you are using a slim/dev distro that omits models, follow the `Upgrading models` section to add them.
* For reproducible deployments, use the tagged release images from the project registry (if provided).

---

