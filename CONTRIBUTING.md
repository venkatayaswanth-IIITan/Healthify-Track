# Contributing to HealthTrack

Thank you for your interest in contributing to HealthTrack! Follow these guidelines to get started.

## Code of Conduct
Please be respectful, constructive, and inclusive in all communications and reviews.

## Getting Started

1. **Fork the Repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/venkatayaswanth-IIITan/OLABS-HACKATHON-HEALTH-CARE-PROJECT.git
   cd OLABS-HACKATHON-HEALTH-CARE-PROJECT
   ```
3. **Install dependencies**:
   ```bash
   npm run install:all
   ```
4. **Create a branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Frontend
```bash
cd client
npm run dev
```

### Backend
```bash
cd server
npm run dev
```

### Verify Build Before Committing
Always verify the frontend builds cleanly without TypeScript or Vite errors:
```bash
cd client
npm run build
```

## Submitting a Pull Request
1. Commit your changes with a clear and descriptive commit message.
2. Push your branch to your GitHub fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Open a Pull Request against the `main` branch.
4. Fill out the PR template with relevant details and screenshots if applicable.
