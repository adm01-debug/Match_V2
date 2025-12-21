# Contributing to Match ATS

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/match.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`
5. Make your changes
6. Run tests: `npm test`
7. Commit: `git commit -m "feat: your feature"`
8. Push: `git push origin feature/your-feature`
9. Open a Pull Request

## 📋 PR Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guide
- [ ] All tests pass (`npm test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] TypeScript has no errors (`npm run type-check`)
- [ ] Lint passes (`npm run lint`)
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] Commit messages follow conventional commits

## 🎨 Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Component names in PascalCase
- Hook names start with `use`
- Use `memo()` for components with props
- Use `useCallback` for handlers
- Use `useMemo` for expensive computations

## 🧪 Testing

- Unit tests: `npm test`
- E2E tests: `npm run test:e2e`
- Coverage: `npm run test:coverage`

## 📚 Documentation

- Add JSDoc to functions
- Update README for new features
- Add Storybook stories for components

## 🐛 Bug Reports

Use the bug report template and include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable

## 💡 Feature Requests

Use the feature request template and include:
- Problem description
- Proposed solution
- Alternatives considered

## 📄 License

By contributing, you agree that your contributions will be licensed under MIT.
