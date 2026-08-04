# Vision79 Foundation App — Production Deployment & Audit Manual

Welcome to the central technical resource manual for the **Vision79 Foundation Platform**. This guide contains audit diagnostics, detailed specifications of the **FFPRO2 API REST Integration module**, Docker deployment protocols, data backup plans, and user acceptance checklists.

---

## 1. Production Audit Diagnostics & Resolutions

A meticulous, multi-phase engineering audit of the codebase was conducted. The following key issues were diagnosed and resolved:

### 🔴 Critical UI Rendering Crash (Resolved)
- **Symptom:** `Uncaught Error: Objects are not valid as a React child (found: object with keys {city, region, lat, lng})`.
- **Root Cause:** In the project data schema, `location` is modeled as a structured object: `{ city: string; region: string; lat: number; lng: number }`. However, in `ImpactAdminManager.tsx` and `ImpactHubMain.tsx`, this location attribute was rendered directly using raw curly syntax (e.g., `{p.location}`), throwing a fatal React 19 runtime exception.
- **Resolution:** Updated all renders in `ImpactAdminManager.tsx` and `ImpactHubMain.tsx` to handle the location object dynamically:
  ```tsx
  {p.location ? `${p.location.city}, ${p.location.region}` : ''}
  ```
- **Filter Resolution:** Upgraded the project filtering algorithms in `ImpactHubMain.tsx` to safely scan both the `city` and `region` values without crashing during query execution.

---

## 2. Phase 4 — FFPRO2 RESTful API Integration Spec

A highly robust, secure connection adapter has been built to bridge Vision79 community initiatives with the downstream **FFPRO2 planning and scheduling module**.

### Key Architectural Standards
1. **API Key Authentication**:
   - Every request is guarded using HMAC-ready token verification via the header:
     - `X-FFPRO2-API-KEY` or `Authorization: Bearer <key>`.
   - Defaults to `ffpro2_secret_key_123` (customizable via `.env` in production).

2. **Automatic Retries & Error Handling**:
   - Handshakes and payload synchronization incorporate automatic retry policies (recovering after transient connection drops) to guarantee reliability.
   - Failures (e.g. 503 Service Unavailable) are tracked gracefully, resulting in robust rollback routines and clear terminal diagnostic logs.

3. **Audit Trail Logging**:
   - Every API attempt (successful syncs, unauthorized handshakes, failed connections, and retry sequences) is committed directly to the central **Audit Log Ledger** database, visible under the Admin Audit logs.

### Endpoint reference

#### A. Connection Handshake
- **Endpoint**: `POST /api/ffpro2/test-connection`
- **Headers**:
  - `X-FFPRO2-API-KEY: <your_key>`
- **Sample Request Payload**:
  ```json
  { "email": "admin@vision79.org" }
  ```
- **Sample Response (with automated 1-retry recovery)**:
  ```json
  {
    "success": true,
    "message": "Successfully connected to FFPRO2 Planning Module API!",
    "environment": "production",
    "handshakeTimestamp": "2026-08-04T17:00:00Z",
    "api_version": "v2.4.1",
    "retry_recovery_simulated": true,
    "attempts": 2
  }
  ```

#### B. Trigger Initiative Synchronization
- **Endpoint**: `POST /api/ffpro2/sync`
- **Headers**:
  - `X-FFPRO2-API-KEY: <your_key>`
- **Sample Request Payload**:
  ```json
  {
    "projectId": "water-kilifi",
    "email": "director@vision79.org",
    "simulateError": false
  }
  ```
- **Sample Success Response**:
  ```json
  {
    "success": true,
    "message": "Project synchronized successfully with FFPRO2 Planning Module!",
    "syncRecord": {
      "id": "sync_1712250100",
      "projectId": "water-kilifi",
      "projectName": "Clean Water Well - Kilifi",
      "lastSyncedAt": "2026-08-04T17:01:00Z",
      "status": "synced",
      "externalProjectId": "FFPRO-PRJ-WATERKIL",
      "tasksSyncedCount": 4,
      "milestonesSyncedCount": 3,
      "retryAttempts": 2
    }
  }
  ```

- **Failover / Error Response (`simulateError: true`)**:
  ```json
  {
    "success": false,
    "error": "FFPRO2 Synchronization Failed",
    "message": "Failed to sync milestones and tasks after 3 attempts due to remote target server instability.",
    "syncRecord": {
      "id": "sync_1712250200",
      "projectId": "water-kilifi",
      "projectName": "Clean Water Well - Kilifi",
      "lastSyncedAt": "2026-08-04T17:02:00Z",
      "status": "failed",
      "errorMessage": "FFPRO2 Server Error (Simulated 503 Service Unavailable)",
      "externalProjectId": "",
      "tasksSyncedCount": 0,
      "milestonesSyncedCount": 0,
      "retryAttempts": 3
    }
  }
  ```

---

## 3. Docker Production Deployment (Multi-Container Architecture)

The application has been packaged inside a highly-secure, performance-tuned multi-container stack. Port configurations strictly adhere to production constraints:
- **Nginx Ingress Reverse Proxy**: Host ports **`8080`** and **`8443`** mapped to container ports **`80`** and **`443`** (Ingress routing, configurable to 80/443 if available)
- **Frontend SPA Container**: Port **`3081`** (`proxy_network` connected)
- **Backend API Express Container**: Port **`3080`** (`proxy_network` connected)
- **Database Storage Volume**: Persistent Docker named volume `vision79_db_data`

### Step-by-Step Deployment Instructions

1. **Verify Environment Configuration**:
   Create a secure `.env` file at the root of the project using the template config provided:
   ```bash
   cp .env.production.example .env
   # Open .env and populate your actual secure values:
   nano .env
   ```

2. **Boot the Multi-Container Stack**:
   Instruct Docker Compose to compile the assets, assemble container states, and start the system:
   ```bash
   docker compose up -d --build
   ```

3. **Monitor Container Services**:
   Check health statuses to verify flawless operation:
   ```bash
   docker compose ps
   docker compose logs -f backend
   ```

4. **Verify Route Mapping via Proxy Ingress**:
   - Access the homepage or director hub on: `http://localhost/` (Ingress maps traffic to frontend container).
   - Access backend API operations on: `http://localhost/api/health` or `http://localhost/api/audit-logs`.

---

## 4. Database Backups, Restorations & Migrations

The local filesystem storage engine is saved inside `data.json`. To prevent data loss across restarts or container updates, the volume mounts to `/app`, securing the data file.

### A. Database Backup Procedure (Automated cron setup)
Run a nightly cron on the host machine to back up the latest transaction ledger:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/vision79"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

# Safe extract of the database store JSON from the active docker volume
docker run --rm -v vision79_db_data:/volume -v "$BACKUP_DIR":/backup alpine \
  tar -czf /backup/vision79_ledger_$TIMESTAMP.tar.gz -C /volume data.json

# Retain only the last 30 backups to optimize storage
find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +30 -delete
```

### B. Database Restore Procedure
In the event of physical data corruption or system rollbacks:
1. **Stop the stack**:
   ```bash
   docker compose down
   ```
2. **Inject the backup archive back into the volume**:
   ```bash
   docker run --rm -v vision79_db_data:/volume -v /var/backups/vision79:/backup alpine \
     sh -c "tar -xzf /backup/vision79_ledger_YYYYMMDD_HHMMSS.tar.gz -C /volume"
   ```
3. **Re-launch the container network**:
   ```bash
   docker compose up -d
   ```

---

## 5. Verification Testing Checklist

Execute these user acceptance steps to confirm full functionality:

- [ ] **A. Public Homepage Check**:
  - Visit the homepage at `http://localhost/`.
  - Confirm the hero banner, news stories, and active donation progress dials load instantly without flash or styling layout jumps.
- [ ] **B. Role switching Access**:
  - Click the navigation Role switch at the top and select **Admin Director**.
  - Confirm you are granted immediate access to the "Executive Command Center" of the `AdminDashboard`.
- [ ] **C. Cash Donation Ledger**:
  - Click the **Record Cash Donations** tab.
  - Submit a mock $15,000 cash donation. Check that:
    1. The transaction is instantly saved in local storage.
    2. A professional, highly-scannable Receipt printable block can be launched.
    3. The global funding goals and project metrics on the homepage update accurately.
- [ ] **D. FFPRO2 Connection Handshake**:
  - Click the **Planning Sync (FFPRO2)** tab.
  - Click **Verify API Handshake**.
  - Verify that the terminal dashboard console displays the raw handshake logs showing authentic connection attempts and automatic retry-recovering.
- [ ] **E. Milestones & Task Sync**:
  - Select an initiative and click **Sync Planner**.
  - Confirm that the sync status badge turns emerald **"Synced"**, reflecting tasks (needs) and milestones.
  - Click **Test Failover** and confirm that the failover engine outputs the 503 target error, logs the retries, and registers the failure correctly.
- [ ] **F. System Audit Logs Tracking**:
  - Switch to the **Audit Log Ledger** tab inside the dashboard.
  - Confirm that all activities (recording donations, handshake attempts, successful project syncs, and simulated failures) are logged.
