# Contributing to Workforce Management App

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/workforce-management-app.git`
3. Add upstream: `git remote add upstream https://github.com/elliotthcs110/workforce-management-app.git`
4. Create a feature branch: `git checkout -b feature/my-feature`

## Development Setup

Follow the setup instructions in:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Main README](./README.md)

## Making Changes

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

Use clear, descriptive commit messages:

```
fix: resolve clock out not updating duration
feat: add timesheet approval workflow
docs: update API documentation
refactor: simplify auth middleware
test: add tests for clock in/out
```

### Pull Request Process

1. Update your branch: `git fetch upstream && git rebase upstream/main`
2. Push your changes: `git push origin feature/my-feature`
3. Create a Pull Request with:
   - Clear title and description
   - Reference any related issues
   - List of changes made
   - Screenshots for UI changes
4. Address code review feedback
5. Maintainers will merge when approved

## Feature Development

### Backend

1. Update Prisma schema if needed
2. Run migrations: `npm run db:push`
3. Create new routes in appropriate file
4. Add middleware/validation as needed
5. Test with Postman/Insomnia

### Frontend

1. Create new page or component
2. Add to routing in App.tsx
3. Implement with React best practices
4. Style with Tailwind CSS
5. Test in browser

## Testing

### Manual Testing

- Test in development with `npm run dev`
- Test with different user roles
- Test error scenarios
- Test responsive design (mobile, tablet, desktop)

### Database Testing

```bash
cd backend
npm run db:studio  # View database visually
```

## Reporting Issues

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, browser, Node version)
- Screenshots/logs if applicable

## Feature Requests

When suggesting features:
- Describe the use case
- Explain the benefit
- Provide examples
- Consider implementation complexity

## Documentation

- Update README.md for major changes
- Add code comments for complex logic
- Update API documentation for new endpoints
- Include examples for new features

## Areas for Contribution

### High Priority
- [ ] Schedule viewer implementation
- [ ] Advanced reporting
- [ ] Performance optimization
- [ ] Comprehensive error handling
- [ ] Unit and integration tests

### Medium Priority
- [ ] Enhanced UI/UX
- [ ] Mobile-friendly improvements
- [ ] Accessibility improvements
- [ ] Internationalization (i18n)
- [ ] Dark mode support

### Nice to Have
- [ ] Real-time notifications
- [ ] Data export (PDF, CSV)
- [ ] Advanced filtering
- [ ] Keyboard shortcuts
- [ ] Data visualization charts

## Questions?

Feel free to:
- Open an issue with your question
- Start a discussion
- Email the maintainers

Thank you for contributing! 🎉
