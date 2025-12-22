# Atomic Design Pattern

## Overview

Atomic Design is a methodology that organizes design system components into Atoms, Molecules, Organisms, Templates, and Pages. This project adopts this pattern to systematically organize components.

## Atomic Design Hierarchy

```
Pages
  └── Templates
      └── Organisms
          └── Molecules
              └── Atoms
```

## Atoms

**Location**: `src/components/ui/`

The smallest unit of reusable components. Basic UI elements that cannot be broken down further.

### Example Components

- **Button**: Button component
- **Card**: Card container
- **Tag**: Tag/badge component
- **Typography**: Text style component
- **LoadingSpinner**: Loading spinner
- **Container**: Layout container

### Characteristics

- **Independent**: Does not depend on other components
- **Reusable**: Can be used in multiple places
- **Simple**: Has only one clear purpose

### Example Code

```typescript
// Button.tsx (Atom)
export function Button({ variant, size, children, ...props }: ButtonProps) {
  return (
    <ButtonBase variant={variant} size={size} {...props}>
      {children}
    </ButtonBase>
  )
}
```

## Molecules

**Location**: `src/components/project/`, `src/components/testimonials/`, etc.

Composite components made by combining Atoms. Forms a functional unit.

### Example Components

- **ProjectCard**: Project card (Card + Tag + Button combination)
- **TestimonialCard**: Testimonial card (Card + Typography combination)
- **FeaturedProjectCard**: Featured project card

### Characteristics

- **Combination**: Composed of multiple Atoms
- **Functional Unit**: Performs one clear function
- **Reusable**: Can be used in other Organisms

### Example Code

```typescript
// ProjectCard.tsx (Molecule)
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      <Typography variant="h3">{project.title}</Typography>
      <Tag>{project.techStack[0]}</Tag>
      <Button>View Details</Button>
    </Card>
  )
}
```

## Organisms

**Location**: `src/components/sections/`, `src/components/layout/`

Complex components made by combining Molecules and Atoms. Forms major sections of a page.

### Example Components

- **Header**: Header (Logo + Navigation + ThemeToggle combination)
- **Footer**: Footer (FooterBranding + FooterNav + FooterContact combination)
- **ProjectShowcaseSection**: Project showcase section
- **JourneyMilestoneSection**: Journey milestone section
- **TechStackSection**: Tech stack section

### Characteristics

- **Complexity**: Combines multiple Molecules and Atoms
- **Section Unit**: Forms major sections of a page
- **Independent**: Can have its own state and logic

### Example Code

```typescript
// ProjectShowcaseSection.tsx (Organism)
export function ProjectShowcaseSection() {
  const [projects, setProjects] = useState([])
  
  return (
    <Section>
      <SectionTitle>Projects</SectionTitle>
      <Grid>
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Grid>
    </Section>
  )
}
```

## Pages

**Location**: `src/pages/`

Complete pages made by combining Organisms.

### Example Pages

- **HomePage**: Home page
- **ProjectsPage**: Projects list page
- **ProjectDetailPage**: Project detail page
- **AboutPage**: About page

### Characteristics

- **Top-level Component**: Top-level component connected to routes
- **Combination**: Composed of multiple Organisms
- **Data Fetching**: Performs data fetching at page level

### Example Code

```typescript
// HomePage.tsx (Page)
export function HomePage() {
  return (
    <>
      <Hero />
      <JourneyMilestoneSection />
      <ProjectShowcaseSection />
      <TechStackSection />
    </>
  )
}
```

## Directory Structure

```
src/components/
├── ui/                    # Atoms
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Tag.tsx
│   └── Typography.tsx
├── project/               # Molecules
│   ├── ProjectCard.tsx
│   └── FeaturedProjectCard.tsx
├── sections/              # Organisms
│   ├── ProjectShowcaseSection.tsx
│   └── JourneyMilestoneSection.tsx
└── layout/                # Organisms
    ├── Header.tsx
    └── Footer.tsx
```

## Benefits of Atomic Design

### 1. Reusability
- Systematic reuse from small to large units
- Consistent design system construction

### 2. Maintainability
- Clear role of each component makes modification easy
- Minimizes impact of changes on other components

### 3. Scalability
- Easy implementation of new features by combining existing components
- Easy to extend the design system

### 4. Collaboration Efficiency
- Clear communication tool between designers and developers
- Work can be divided by component units

## Best Practices

### 1. Keep Atoms Pure
- Atoms should not depend on other components
- Should not contain business logic

### 2. Organize Molecules by Functional Unit
- Perform one clear function
- Design to be reusable

### 3. Organisms Operate Independently
- Can have their own state and logic
- Can include complex logic like API calls

### 4. Pages Only Handle Composition
- Pages mainly combine Organisms
- Data fetching is possible but minimize UI logic

## Cautions

### 1. Avoid Over-Separation
- Too much separation increases complexity
- Consider actual reusability and maintainability when separating

### 2. Watch Inter-Layer Dependencies
- Upper layers depend only on lower layers
- Be careful that lower layers do not depend on upper layers

### 3. Naming Consistency
- Naming that clearly indicates the role of each layer
- Maintain consistent naming conventions
