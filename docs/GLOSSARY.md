# Skillar Mobile Glossary

This glossary defines the common terminology used throughout the Skillar Mobile project to ensure consistent communication across product, design, engineering, QA, and documentation.

## General Terms

### Architecture Decision Record (ADR)
A document that records a significant architectural decision, its context, alternatives considered, and consequences.

### RFC (Request for Comments)
A proposal document used to discuss significant features or architectural changes before implementation.

### Clean Architecture
A layered architecture where dependencies flow inward, keeping business logic independent of frameworks and infrastructure.

## Domain Terms

### Learner
An authenticated user consuming learning content.

### Journey
A curated learning path consisting of one or more courses arranged to achieve a learning objective.

### Course
A structured collection of learning modules.

### Module
A logical grouping of lessons within a course.

### Lesson
An individual unit of learning that contains one or more activities.

### Activity
A renderable piece of learning content such as a video, quiz, PDF, HTML page, audio, or assignment.

### Assessment
An activity used to evaluate learner knowledge or progress.

### Progress
The tracked completion state of a learner across activities, lessons, modules, courses, and journeys.

## Technical Terms

### Repository
The data access abstraction responsible for communicating with backend services and local storage.

### Service
Infrastructure code responsible for API communication or platform-specific capabilities.

### DTO (Data Transfer Object)
A typed object representing data exchanged with backend APIs.

### Entity
A core business object representing a concept within the domain model.

### Offline Sync
The process of synchronizing locally stored changes with the backend when connectivity is restored.

### Design System
The collection of design tokens, UI components, patterns, and guidelines used throughout the application.

### Definition of Done (DoD)
The agreed set of quality criteria that a feature must satisfy before being considered complete.

This glossary is a living document and should be updated as new concepts are introduced into the project.