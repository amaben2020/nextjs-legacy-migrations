# CI/CD Pipeline Documentation

This repository includes a comprehensive CI/CD pipeline that ensures all tests must pass before any deployment.

## 🚀 Pipeline Overview

### Workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`)

   - Runs on every push and pull request
   - Includes linting, type checking, building, and testing
   - Must pass before merging

2. **PR Checks** (`.github/workflows/pr-checks.yml`)

   - Runs on pull requests
   - Quick quality checks
   - Tests only affected apps
   - Comments on PR with results

3. **Deploy Pipeline** (`.github/workflows/deploy.yml`)

   - Runs on main branch pushes
   - Runs all tests before deployment
   - Deploys to staging and production

4. **Scheduled Tests** (`.github/workflows/scheduled-tests.yml`)
   - Runs daily at 2 AM UTC
   - Comprehensive test suite
   - Performance testing
   - Security scanning

## 🧪 Test Requirements

All tests must pass before:

- ✅ Merging pull requests
- ✅ Deploying to staging
- ✅ Deploying to production

### Test Types

1. **Linting** - Code style and quality checks
2. **Type Checking** - TypeScript type validation
3. **Build** - Compilation and bundling
4. **Unit Tests** - Component and function tests
5. **E2E Tests** - End-to-end user journey tests
6. **Security Audit** - Vulnerability scanning

## 🛠️ Local Development

### Running Tests Locally

```bash
# Run all tests
pnpm test

# Run tests in CI mode
pnpm test:ci

# Run specific app tests
pnpm test:local-sa

# Run all app tests
pnpm test:all

# Run security audit
pnpm audit
```

### Pre-commit Checklist

Before committing, ensure:

- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] `pnpm test` passes
- [ ] No security vulnerabilities

## 📊 Test Coverage

### E2E Tests (Cypress)

- **AuthButton Component**: 11 tests covering authentication flows
- **User Authentication**: Login/logout functionality
- **Session Management**: Persistence across page refreshes
- **Error Handling**: Network errors and invalid credentials

### Component Tests

- **AuthButton**: Rendering in different states
- **User Avatar**: Display logic and fallbacks
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔧 Configuration

### Environment Variables

Required for CI/CD:

- `NEXTAUTH_SECRET`: Authentication secret
- `NEXTAUTH_URL`: Application URL
- `CYPRESS_baseUrl`: Test server URL

### Secrets (GitHub)

For deployment:

- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

## 🚨 Failure Handling

### Test Failures

- All workflows will fail if tests don't pass
- Pull requests cannot be merged with failing tests
- Deployments are blocked until tests pass

### Security Issues

- High/critical vulnerabilities block deployment
- Moderate vulnerabilities show warnings
- Security audit runs on every build

## 📈 Monitoring

### Test Results

- View results in GitHub Actions tab
- Download test artifacts (screenshots, videos)
- Check PR comments for test status

### Performance

- Daily performance tests
- Load time monitoring
- Concurrent request testing

## 🔄 Workflow Triggers

| Workflow  | Trigger        | Purpose               |
| --------- | -------------- | --------------------- |
| CI        | Push/PR        | Quality checks        |
| PR Checks | Pull Request   | Quick validation      |
| Deploy    | Main branch    | Production deployment |
| Scheduled | Daily 2 AM UTC | Comprehensive testing |

## 🛡️ Security

### Automated Security Checks

- Dependency vulnerability scanning
- Known security issue detection
- Audit level: Moderate (configurable)

### Security Reports

- Generated on every build
- Available as artifacts
- 30-day retention

## 📝 Best Practices

1. **Always run tests locally** before pushing
2. **Fix linting issues** immediately
3. **Address security vulnerabilities** promptly
4. **Keep dependencies updated**
5. **Write comprehensive tests** for new features

## 🆘 Troubleshooting

### Common Issues

1. **Tests failing in CI but passing locally**

   - Check environment variables
   - Verify Node.js version
   - Clear caches and reinstall

2. **Build failures**

   - Check TypeScript errors
   - Verify all dependencies installed
   - Run `pnpm build` locally

3. **E2E test timeouts**
   - Ensure server starts properly
   - Check port availability
   - Verify test configuration

### Getting Help

- Check GitHub Actions logs
- Review test artifacts
- Consult team documentation
- Create issue for persistent problems

## 🎯 Success Criteria

A successful CI/CD run means:

- ✅ All linting passes
- ✅ Type checking succeeds
- ✅ Build completes without errors
- ✅ All tests pass
- ✅ Security audit clean
- ✅ Performance within limits

**Remember: No deployment without passing tests!** 🚫🚀
