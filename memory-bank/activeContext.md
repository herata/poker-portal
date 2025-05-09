# Active Context: PokerPortal

## Current Work Focus

As of May 6, 2025, development is focused on:

1. **Core Venue Discovery Features**
   - Implementing venue search functionality with various filters
   - Building the venue details page with comprehensive information
   - Developing the nearby venues map feature

2. **User Engagement Features**
   - Transitioning favorites functionality from client-side to server-side storage
   - Creating the user profile foundation
   - Implementing visited venues tracking

## Recent Changes

### Completed
- Initial project setup with Next.js 15.3.0 and React 19
- Basic application structure using the Next.js App Router
- Core page routes established (home, venues, venue details, nearby, favorites)
- UI component foundation using Radix UI and Tailwind CSS
- Implemented mock API for favorites functionality with server-side storage pattern
- Converted favorites page from client-side to server-side rendering

### In Progress
- API routes for venue data retrieval
- Venue search and filtering capabilities
- Continuing to transition client components to use the server-based favorites API
- Nearby venues map implementation

## Next Steps

### Immediate Priorities
1. Complete the favorites functionality migration to server-side storage
2. Create API routes for favorites management
3. Finalize the venue details page design and data structure
4. Implement the map component for the nearby venues feature
5. Complete user authentication flow

### Upcoming Features
1. Review system for venues
2. Event listings with filtering
3. User profile enhancements
4. Mobile responsive optimizations

## Active Decisions and Considerations

### Technical Decisions
- Using Cloudflare D1 as the database solution for its simplicity and integration with Cloudflare Pages
- Implementing a hybrid rendering approach with both server and client components
- Utilizing Tailwind CSS for styling with custom Radix UI-based components
- Moving from localStorage-based favorites to server-side API pattern for better persistence and future auth integration
- Using server actions for server-side data mutations in server components

### UX/UI Considerations
- Ensuring the venue search interface is intuitive and flexible
- Creating a visually engaging yet information-dense venue details page
- Making the nearby venues map feature both useful and performance-efficient
- Maintaining consistent favorite status indication across the application

### Data Architecture Considerations
- Designing an efficient venue data model that captures all necessary information
- Planning for review data that can be easily aggregated for venue ratings
- Creating relationship structure between users, favorites, and visited venues
- Implementing proper API interfaces following RESTful patterns

## Open Questions
- How to optimize map performance for the nearby venues feature?
- What is the best approach for implementing real-time notifications for venue events?
- How to scale the database efficiently as the number of venues and users grows?
- When to transition from mock API to actual Cloudflare Workers implementation?