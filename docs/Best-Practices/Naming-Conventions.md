# Naming Convention Guide

> **Version**: 1.0.0  
> **Date**: 2025-11-15  
> **Status**: Active

## Frontend Naming Conventions

### React Components

#### File Names
- **PascalCase** for component files
- ✅ `ProjectCard.tsx`
- ✅ `ProjectShowcaseSection.tsx`
- ✅ `MainHeader.tsx`
- ❌ `ProjectCard_fixed.tsx` (no suffixes)
- ❌ `ProjectShowcaseSection_new.tsx` (no suffixes)
- ❌ `projects-page.tsx` (use PascalCase)

#### Component Names
- Match file name exactly
- ✅ `export function ProjectCard() {}`
- ✅ `export const ProjectCard = () => {}`

#### Folder Structure
- Component folders should match component name
- ✅ `ProjectCard/ProjectCard.tsx`
- ✅ `ThemeToggle/ThemeToggle.tsx`
- ✅ `LanguageSwiper/LanguageSwiper.tsx`

### TypeScript

#### Interfaces & Types
- **PascalCase** for interfaces and types
- ✅ `interface ProjectCardProps {}`
- ✅ `type ProjectStatus = 'active' | 'completed'`

#### Variables & Functions
- **camelCase** for variables and functions
- ✅ `const projectList = []`
- ✅ `function getProjects() {}`

#### Constants
- **UPPER_SNAKE_CASE** for constants
- ✅ `const API_BASE_URL = '/api'`
- ✅ `const MAX_RETRIES = 3`

### Styled Components

#### Component Names
- **PascalCase** with descriptive names
- ✅ `const ProjectCardWrapper = styled.div\``
- ✅ `const NavLink = styled(Link)\``

#### Props
- Use `$` prefix for transient props (not passed to DOM)
- ✅ `const Container = styled.div<{ $isActive: boolean }>\``
- ✅ `const Button = styled.button<{ variant: 'primary' | 'secondary' }>\``

### File Organization

#### Index Files
- Use `index.ts` for barrel exports
- ✅ `components/ui/index.ts`
- ✅ `components/project/index.ts`

#### Utility Files
- **camelCase** with descriptive suffix
- ✅ `errorHandler.ts`
- ✅ `apiClient.ts`
- ✅ `dateUtil.ts`

### i18n Files

#### Locale Files
- Use language codes only
- ✅ `ko.json`
- ✅ `en.json`
- ✅ `ja.json`
- ❌ `ko_new.json` (no suffixes)
- ❌ `en_fixed.json` (no suffixes)

### Backend Naming Conventions

#### Java Classes
- **PascalCase** for classes
- ✅ `ProjectController.java`
- ✅ `ProjectService.java`
- ✅ `ProjectRepository.java`

#### Methods & Variables
- **camelCase** for methods and variables
- ✅ `public List<Project> getProjects() {}`
- ✅ `private final ProjectRepository projectRepository;`

#### Constants
- **UPPER_SNAKE_CASE** for constants
- ✅ `public static final String API_BASE_PATH = "/api/v1";`

#### Packages
- **lowercase** with dots
- ✅ `com.mytechfolio.portfolio.controller`
- ✅ `com.mytechfolio.portfolio.service`

### General Rules

1. **No Suffixes**: Never use `_new`, `_fixed`, `_old`, `_backup` suffixes
2. **Consistency**: Use the same naming pattern throughout the project
3. **Descriptive**: Names should clearly indicate purpose
4. **No Abbreviations**: Use full words unless widely understood (e.g., `API`, `URL`)

---

**Last Updated**: 2025-11-15

