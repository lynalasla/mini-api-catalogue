# CI/CD Configuration

This project uses GitHub Actions for continuous integration and deployment.

## Workflows

### 1. CI Pipeline (`ci.yml`)
Triggered on push and pull requests to `main`, `frontend`, and `develop` branches.

**Jobs:**
- **Backend Tests**: Runs backend tests with MySQL service
- **Frontend Tests**: Builds and tests the React frontend
- **Docker Build**: Builds Docker images for backend and frontend
- **Security Scan**: Scans for vulnerabilities using Trivy
- **Code Quality**: Runs SonarCloud analysis (optional)

### 2. Deployment (`deploy.yml`)
Triggered on push to `main` branch or version tags.

**Steps:**
- Builds and pushes Docker images to Docker Hub
- Deploys to production server via SSH

### 3. PR Checks (`pr-checks.yml`)
Automated checks for pull requests:
- Validates package.json changes
- Auto-labels PRs based on changed files
- Checks PR size

## Setup Instructions

### Required GitHub Secrets

Add these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

#### For Deployment:
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password or access token
- `DEPLOY_HOST`: Production server hostname or IP
- `DEPLOY_USER`: SSH username for deployment
- `DEPLOY_KEY`: SSH private key for deployment

#### For Code Quality (Optional):
- `SONAR_TOKEN`: SonarCloud authentication token
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Local Testing

To test the Docker build locally:

```bash
# Build backend
docker build -t mini-api-catalogue .

# Build frontend
docker build -t mini-api-catalogue-frontend ./client

# Run full stack
docker-compose up -d
```

### Prisma Migrations

The CI automatically runs Prisma migrations. Make sure migrations are committed:

```bash
npx prisma migrate dev --name your_migration_name
git add prisma/migrations/
git commit -m "Add migration: your_migration_name"
```

## Workflow Status

Check the status of workflows in the **Actions** tab of your GitHub repository.

### Branch Protection

Recommended branch protection rules for `main`:
- ✅ Require pull request reviews
- ✅ Require status checks to pass (CI must pass)
- ✅ Require branches to be up to date
- ✅ Include administrators

## Deployment Process

1. **Development**: Push to `frontend` or `develop` branch
   - CI runs tests and builds
   
2. **Pull Request**: Create PR to `main`
   - All PR checks run
   - Auto-labeling applied
   - Review and approval required

3. **Production**: Merge to `main`
   - CI runs full test suite
   - Docker images built and pushed
   - Automatic deployment to production

## Monitoring

- **Build Status**: Check Actions tab
- **Security Alerts**: Check Security → Dependabot alerts
- **Code Quality**: Check SonarCloud dashboard (if configured)

## Troubleshooting

### CI Failing?
1. Check the Actions tab for detailed logs
2. Ensure all secrets are properly configured
3. Verify Docker Compose configuration
4. Check database migration status

### Deployment Issues?
1. Verify SSH credentials
2. Check production server Docker installation
3. Ensure firewall rules allow GitHub Actions IPs
4. Check server disk space

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub](https://hub.docker.com/)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
