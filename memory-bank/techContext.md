# Technical Context: PokerPortal

## Technology Stack

### Frontend Technologies
- **Framework**: Next.js 15.3.0
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Component Library**: Custom components built on Radix UI primitives
- **State Management**: React Hooks and Context API
- **Maps Integration**: For nearby venue functionality

### Backend Technologies
- **Infrastructure**: Cloudflare Pages and Workers
- **Database**: Cloudflare D1 (SQLite-compatible SQL database)
- **API Implementation**: RESTful API via Cloudflare Workers
- **Authentication**: Cloudflare Access or custom JWT-based authentication

## Development Environment

### Requirements
- Node.js 18.x or higher
- Package manager (npm, yarn, pnpm, or bun)
- Git for version control

### Setup Process
```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Tools
- **Linting**: Biome (see biome.json)
- **Type checking**: TypeScript
- **Testing**: To be implemented
- **Build system**: Next.js built-in tooling

## Technical Constraints

### Performance Requirements
- Fast initial load time (< 2 seconds)
- Responsive UI across all device types
- Efficient API calls with proper caching

### Security Requirements
- Secure authentication for user accounts
- Input validation and sanitization
- Protection against common web vulnerabilities

### Scalability Considerations
- Efficient database querying for growing venue database
- Pagination for lists with potentially large datasets
- Optimized image loading and storage

## External Dependencies

### Third-Party Services
- Mapping service for nearby venue functionality
- Possibly Cloudflare for authentication

### API Integrations
- Currently focusing on internal APIs
- Potential future integration with venue management systems

## Deployment Architecture

### Hosting
- Frontend and API deployed on Cloudflare Pages
- Database hosted on Cloudflare D1

### CI/CD Pipeline
- To be established

### Monitoring and Logging
- To be implemented

## Technical Debt and Challenges

### Current Limitations
- Initial implementation focuses on core functionality
- Mobile responsiveness needs ongoing refinement
- Full test coverage to be developed

### Future Technical Considerations
- Implementation of comprehensive testing strategy
- Potential for internationalization
- Analytics integration for user behavior tracking