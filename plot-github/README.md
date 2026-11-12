# PLOT | Interactive website & lead management

A GitHub-ready monorepo with a **React / Next.js frontend** and **Django REST backend**. Bank Gothic fonts, concept imagery and the PLOT visual identity are included. This is the enhanced source-code edition; the earlier hosted preview is not automatically updated by this ZIP.

## What is included

- Responsive marketing pages: home, services, projects, process, about, contact and privacy.
- Interactive service finder with a preselected enquiry category.
- Filterable concept gallery and accessible image dialogs.
- Three-step project brief: service, stage, budget, timeline, location, scope and contact preferences.
- API validation, consent recording, honeypot, request throttling and retry protection.
- Success reference returned only after the backend confirms receipt.
- Honest preview mode: if no API URL is configured, the form downloads a brief instead of claiming to send it.
- Session campaign attribution: UTM source, medium, campaign and landing path.
- Sticky project CTA, optional official WhatsApp link, FAQs and a downloadable pre-build checklist.
- Staff-only Django admin with pipeline stages, notes, follow-up dates, search and filters.
- Docker Compose with PostgreSQL and shared Redis, plus GitHub Actions checks.

## Quick start: local development

Use Python 3.12 and Node.js 22. Run these from the extracted repository root.

### 1. Backend

```bash
python -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows PowerShell instead:
# .venv\Scripts\Activate.ps1
pip install -r backend/requirements.lock.txt
```

Copy `backend/.env.example` to `backend/.env`. Local development defaults to SQLite. Keep `DEBUG=true` locally.

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API: http://localhost:8000/api/enquiries/
Admin: http://localhost:8000/admin/
Health: http://localhost:8000/health/

### 2. Frontend (second terminal)

Copy `frontend/.env.example` to `frontend/.env.local`. Keep `NEXT_PUBLIC_API_URL=http://localhost:8000` to send test enquiries to the local backend.

```bash
cd frontend
npm ci
npm run dev
```

Visit http://localhost:3000. Submit a test brief and open the admin to verify it appears.

### 3. Static build

```bash
cd frontend
npm run build
npm start
```

This serves the generated `frontend/out` directory at port 3000. The build embeds `NEXT_PUBLIC_*` values: **rebuild after changing them**. The Django backend is deployed separately.

## Docker Compose

Copy root `.env.example` to `.env`. Replace both example secrets. Use hexadecimal secrets to avoid URL escaping in the database connection string; generate each with `python -c "import secrets; print(secrets.token_hex(32))"`.

```bash
docker compose up --build -d
docker compose exec backend python manage.py createsuperuser
```

Frontend: port 3000. API/admin: port 8000. Database and Redis are not exposed to host ports. PostgreSQL uses a persistent named volume. Local configuration enables DEBUG for HTTP testing; use DEBUG=false and HTTPS for a public deployment.

Docker files are provided for deployment portability. Containers were not executed in this workspace; verify them on your machine before production.

## Push to GitHub

Create an empty repository in GitHub, unzip this project, open a terminal in the `plot-github` folder and run:

```bash
git init
git add .
git commit -m "Build PLOT website and lead management"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Replace the URL with your repository URL. `.env`, databases, virtual environments and dependencies are excluded. No GitHub credentials or environment secrets are included. The ZIP does not contain a `.git` directory or private preview hosting identity.

## Public launch configuration

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) and [docs/LEAD_FLOW.md](docs/LEAD_FLOW.md).

Before accepting real enquiries, configure the API and public domain, confirm official contact details and your privacy/retention arrangements, and create named staff accounts. Review font web-use rights and all company copy before distributing or publishing this repository. User-supplied Bank Gothic assets are included; no third-party asset licence is granted by this source package. Concept images are explicitly labelled as AI-assisted visualisations.

This package does not send notification emails, book appointments, sync an external CRM or implement an unverified cost calculator. New enquiries are visible in Django admin. A WhatsApp link opens a draft conversation only when an official number is configured.

## Tests

```bash
# Backend, with local .env copied or DEBUG=true in the environment
python backend/manage.py test leads
python backend/manage.py makemigrations --check --dry-run
# Frontend includes TypeScript verification
npm --prefix frontend run build
```

GitHub Actions repeats the backend tests and frontend build on pushes and pull requests.
