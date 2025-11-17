---
title: "Contributing Guide"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Developers", "Contributors"]
prerequisites: ["Getting-Started.md"]
related_docs: ["Documentation-Standards.md", "Best-Practices/Code-Style.md"]
maintainer: "Development Team"
---

# Contributing Guide

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

## Overview

Thank you for your interest in contributing to MyTechPortfolio! This guide will help you understand our contribution process, code of conduct, and how to submit pull requests.

---

## Code of Conduct

### Our Standards

- **Be respectful**: Treat all contributors with respect and kindness
- **Be inclusive**: Welcome newcomers and help them learn
- **Be constructive**: Provide helpful feedback and suggestions
- **Be professional**: Maintain a professional and positive attitude

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Publishing others' private information
- Other conduct that could reasonably be considered inappropriate

---

## How to Contribute

### Reporting Bugs

1. **Check existing issues**: Search for similar issues before creating a new one
2. **Create an issue**: Use the bug report template
3. **Provide details**:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, browser, versions)
   - Screenshots if applicable

### Suggesting Features

1. **Check existing issues**: Search for similar feature requests
2. **Create an issue**: Use the feature request template
3. **Provide details**:
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach
   - Mockups or examples if applicable

### Contributing Code

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/MyTechPortfolio.git
cd MyTechPortfolio
```

#### 2. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name
# Or for bug fixes
git checkout -b fix/your-bug-fix
```

#### 3. Make Changes

- Follow the [Code Style Guide](../Best-Practices/Code-Style.md)
- Follow the [Naming Conventions](../Best-Practices/Naming-Conventions.md)
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass

#### 4. Commit Changes

```bash
# Stage your changes
git add .

# Commit with a clear message
git commit -m "feat: add new feature description"
# Or
git commit -m "fix: fix bug description"
```

**Commit Message Format**:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

#### 5. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference related issues
- List of changes
- Screenshots if UI changes

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Code is properly commented
- [ ] Commit messages are clear

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: Maintainers review the PR
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, PR will be merged

### PR Requirements

- **Title**: Clear and descriptive
- **Description**: Explain what and why
- **Tests**: Include tests for new features
- **Documentation**: Update relevant docs
- **Breaking Changes**: Clearly mark and document

---

## Development Setup

### Prerequisites

- Node.js 18+
- Java 21+
- MongoDB 7.0+
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/salieri009/MyTechPortfolio.git
   cd MyTechPortfolio
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp ../environment.template .env
   # Edit .env with your configuration
   ./gradlew bootRun
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Run Tests**
   ```bash
   # Backend
   cd backend
   ./gradlew test
   
   # Frontend
   cd frontend
   npm run test
   ```

See [Getting Started Guide](../Getting-Started.md) for detailed instructions.

---

## Coding Standards

### General Principles

- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **SOLID**: Follow SOLID principles
- **Clean Code**: Write readable, maintainable code

### Code Style

- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Write self-documenting code

### TypeScript/JavaScript

- Use TypeScript for type safety
- Prefer `const` over `let`
- Use arrow functions for callbacks
- Use async/await over promises
- Follow ESLint rules

### Java

- Follow Java naming conventions
- Use meaningful class and method names
- Add JavaDoc comments
- Follow Spring Boot best practices
- Use Lombok where appropriate

---

## Testing

### Test Requirements

- **Unit Tests**: Test individual components/functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user flows
- **Coverage**: Aim for 80%+ code coverage

### Writing Tests

```typescript
// Example: Frontend test
describe('ProjectCard', () => {
  it('should render project title', () => {
    // Test implementation
  })
})
```

```java
// Example: Backend test
@Test
void shouldCreateProject() {
    // Test implementation
}
```

---

## Documentation

### When to Update Documentation

- Adding new features
- Changing APIs
- Updating dependencies
- Fixing bugs that affect usage
- Changing architecture

### Documentation Standards

- Follow [Documentation Standards](./Documentation-Standards.md)
- Use clear, concise language
- Include code examples
- Update related documentation
- Add frontmatter metadata

---

## Getting Help

### Resources

- **Documentation**: [docs/README.md](../README.md)
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: Contact maintainers

### Questions

- Check existing documentation first
- Search closed issues for similar questions
- Ask in GitHub Discussions
- Create an issue if it's a bug

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Acknowledged in project documentation

---

## Related Documentation

- [Documentation Standards](./Documentation-Standards.md)
- [Code Style Guide](../Best-Practices/Code-Style.md)
- [Naming Conventions](../Best-Practices/Naming-Conventions.md)
- [Getting Started Guide](../Getting-Started.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team

