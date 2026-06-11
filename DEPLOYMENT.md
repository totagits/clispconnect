# CLISPConnect Deployment & Setup Guide

This guide details instructions to run CLISPConnect locally, run it containerized via Docker Compose, deploy it to Google Cloud Run, and push the codebase to your Git repository.

---

## 1. Local Development Setup

To run the application directly on your local machine:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Generation & Seeding**:
   The project is configured by default to use a local self-contained SQLite database (`prisma/dev.db`), which does not require external servers to run. Run the push and seed commands:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

3. **Launch Developer Server**:
   ```bash
   npm run dev
   ```
   Open your browser to [http://localhost:3000](http://localhost:3000).

4. **Simulate Roles**:
   Toggle roles from the dropdown in the header to preview the Command Center under different administrative clearance levels (11 demo identities provided).

---

## 2. Running Locally with Docker Compose

To test the multi-container configuration (Next.js + PostgreSQL/PostGIS + Redis):

1. **Generate Local Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Launch Services**:
   ```bash
   docker-compose up --build
   ```
   This compiles the optimized Next.js standalone container, starts a PostgreSQL database with PostGIS extensions, starts Redis, and binds to [http://localhost:3000](http://localhost:3000).

---

## 3. Deploying to Google Cloud Run

To deploy the unified CLISPConnect container to Google Cloud Run:

### Step 3.1: Configure Google Cloud SDK
Ensure you are logged in to your Google Cloud account via the CLI:
```bash
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]
```

### Step 3.2: Enable Required APIs
Enable container registries, database connections, and Serverless runtimes:
```bash
gcloud services enable artifactregistry.googleapis.com \
                       run.googleapis.com \
                       sqladmin.googleapis.com
```

### Step 3.3: Set up Cloud SQL (PostgreSQL + PostGIS)
1. **Create Instance**:
   Create a PostgreSQL instance (v14 or newer) in Cloud SQL:
   ```bash
   gcloud sql instances create clisp-db-instance \
       --database-version=POSTGRES_15 \
       --tier=db-f1-micro \
       --region=us-central1
   ```
2. **Create Database**:
   ```bash
   gcloud sql databases create clisp_db --instance=clisp-db-instance
   ```
3. **Set Database User**:
   ```bash
   gcloud sql users create clisp_user --instance=clisp-db-instance --password=clisp_pass
   ```
4. **Enable PostGIS**:
   Log in to the database or use a Cloud SQL Proxy connection, and run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

### Step 3.4: Build and Deploy to Cloud Run
1. **Configure Artifact Registry Repository**:
   ```bash
   gcloud artifacts repositories create clisp-repo \
       --repository-format=docker \
       --location=us-central1 \
       --description="CLISPConnect Docker Registry"
   ```

2. **Build and Tag Image**:
   Use Docker to compile the image, tag it, and push it to the Google Artifact Registry:
   ```bash
   # Authenticate Docker to GCP
   gcloud auth configure-docker us-central1-docker.pkg.dev

   # Build image locally
   docker build -t us-central1-docker.pkg.dev/[YOUR_PROJECT_ID]/clisp-repo/clispconnect:latest .

   # Push to Artifact Registry
   docker push us-central1-docker.pkg.dev/[YOUR_PROJECT_ID]/clisp-repo/clispconnect:latest
   ```

3. **Deploy Container**:
   Deploy the container, linking it to the Cloud SQL database connection string:
   ```bash
   gcloud run deploy clispconnect \
       --image=us-central1-docker.pkg.dev/[YOUR_PROJECT_ID]/clisp-repo/clispconnect:latest \
       --platform=managed \
       --region=us-central1 \
       --allow-unauthenticated \
       --set-env-vars="DATABASE_URL=postgresql://clisp_user:clisp_pass@/clisp_db?host=/cloudsql/[YOUR_PROJECT_ID]:us-central1:clisp-db-instance" \
       --add-cloudsql-instances=[YOUR_PROJECT_ID]:us-central1:clisp-db-instance
   ```
   Cloud Run will output the public URL of your CLISPConnect platform.

---

## 4. Pushing Code to your Git Repository

To push the codebase to your Git repository (under the `totagtis` remote namespace):

1. **Initialize Git Repository** (if not already completed):
   ```bash
   git init
   ```

2. **Add Files to Staging**:
   ```bash
   git add .
   ```

3. **Commit Code**:
   ```bash
   git commit -m "Initial commit of CLISPConnect: Mapped communities, weekly reporting, GIS SVG engine, role-switcher simulator, and UN-HABITAT training certifications."
   ```

4. **Link Repository Remote**:
   Link to your remote Git account `totagtis` (replace with the exact repository path if using GitHub, GitLab, etc.):
   ```bash
   git remote add origin https://github.com/totagtis/clispconnect.git
   ```

5. **Push Code to Main Branch**:
   ```bash
   git branch -M main
   git push -u origin main
   ```
