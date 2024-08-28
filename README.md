# [The Tech Catalyst](https://www.thetechcatalyst.org/)
Tech Catalyst is an all-in-one resource platform designed to help undergrads and recent graduates break 
into the tech industry. We provide essential resources like resume templates, skill-building roadmaps, 
courses, and job listings, empowering you to navigate the tech landscape and land your dream role.

## [Wireframes](https://motiff.com/file/y4k6ssqksKGS0KbrOJI1w4L?nodeId=0%3A1&type=design "The Tech Catalyst - Wire Frames")
All wireframes for the below task breakdown can be referenced [here](https://motiff.com/file/y4k6ssqksKGS0KbrOJI1w4L?nodeId=0%3A1&type=design "The Tech Catalyst - Wire Frames").

## Tech Stack
- **Database**: Cloud Firestore
- **Frontend**: React with Next.js, Tailwind CSS, and DaisyUI
- **Messaging**: Socket.io
- **Authentication**: Firebase Authentication
- **Hosting**: Firebase Storage, Vercel
- **APIs**: Google Safe Browsing API, Google LinkedIn Jobs API, Indeed API, GitHub API, SightEngine API, EventBrite API, Google Calendar API, Microsoft Graph API, 

## Task Breakdown

### Homepage
- [ ] **Feature Section**: add onHover or onClick modal popup to list all potential badges, awards, and highlights.

### User Engagement Features
- [x] **Founder's Emblem Badge:** Awarded to the first 100 users to join The Tech Catalyst, among the original architects of our hall of knowledge.
- [ ] **Scribe's Mark Badge**: Awarded for contributing the first approved resource to the community, the ink that builds the foundation of our archives.
- [ ] **Sage's Seal Badge**: Awarded for consistenly contributing top-quality resources to the resource library, earning the highest recognition among contributors.
- [ ] **Illuminator Badge**: Awarded for providing feedback on new features during the testing phase.
- [ ] **Alchemist's Bond Badge**: Granted for making first 5 connections through Swipe-to-Connect, the beginnings of blending your network, turning connections into valuable insights.
- [ ] **Grand Alchemist Badge:** Granted after making 100 connections through Swipe-to-Connect, reflecting your ability to forge and sustain connections to transform your network into gold.
- [ ] **Oracle's Insight Badge:** Achieved by attending five tech events and sharing key insights with the community, sharing foresight to help guide others through the halls of knowledge.
- [ ] **Concordia Conqueror Badge:** Unlocked by successfully completing a project with a peer found through Swipe-to-Connect.
- [ ] **Archivist's Quill Badge**: Awarded when you upload your first project, etching your contributions and documenting your work.
- [ ] **Catalyst MVP Badge** (Most Valuable Peer): Earned through consistent activity and support in the community (making discussion forums, commenting, collaborating/messaging, engaging in features, etc.,)
- [ ] **Technomancer's Glyph Badge**: Granted for mastering at least three tech stacks (similar to GitHubs Rainbow Lang Trophy), wielding arcane arts of technology with precision of expertise.
- [ ] **Scholar's Crest Badge**: Achieved by completing your first skill-building roadmap, scholarly dedication of the renaissance thinkers.
- [ ] **Seeker's Sigil Badge**: Unlocked after applying to 10 jobs through the job search tool, navigating the labyrinth of opportunities with relentless pursuit.
- [ ] **Mnemosyne’s Grimoire Badge**: Create 20 sets of flashcards, or ace over 200 flashcards, mastering memory and sharpening scholarly prowess.
- [ ] **Vanguard's Helm Badge**: Earned after participating in your first hackathon - _may require proof of participation._
- [ ] **Sage of Solutions Badge**: Unlocked for asking an answering over 50 questions with the AI Tech Chatbot.
- [ ] **Navigator's Compass Badge**: Earned through particing in your first tech event listed on our platform.
- [ ] **Resume Artificer Badge**: Earned by creating a standout resume with one of our featured templates.
- [ ] **Trailblazer's Torch Badge**: Awarded for completing the first of one of our featured roadmaps or certifications.

### Flashcard Feature
- [ ] **Resource Library**: add button that links to flashcard feature page (see [wireframe](https://motiff.com/file/y4k6ssqksKGS0KbrOJI1w4L?nodeId=0%3A1&type=design "The Tech Catalyst - Wire Frames"))
- [ ] **Flashcard Page**: Create page for flashcard feature, add routing to it from header component using project structure-based navigation.
- [ ] Add option for user to specify how many flashcards the AI should generate (limit = ~50 flashcards _total_ on free tier, whether saved as collection/deleted or not).
- [ ] onClick, if user isn't logged in, open popup prompting user to log in to access flashcard feature.
- [ ] onClick, If user is logged in, on flashcard generation:
     - [ ] If #flashcard requests === 0 or is less than #requests user is making, open popup blocking user from using flashcard feature.
     - [ ] If enough flashcard requests remaining (or on paid plan), increment flashcard request counter and approve generation.
- [ ] Add "remaining requests {remaining requests}" on top of page, set to infinity symbol if user is on paid plan.
- [ ] Add button to save flashcards to collection.
- [ ] **Collection Page**: Create collection page , add routing to it from header component (only shows if user is logged in)
- [ ] Add edit button inside each collection, onClick - displays delete icon next to each flashcard.
- [ ] Handle deletion of flashcards (do not update flashcard limit).
- [ ] Add edit button to collections list, onClick - displays delete icons next to each collection.
- [ ] Handle deletion of collections (do not update flashcard limit).

### Roadmap Generation Feature

### Tech Chatbot Feature

### Project Guidelines Generation Feature

### Resource Library
- [x] Create resource library page with link to it from header component.
- [x] Add [Plus](https://heroicons.com/) icon with a form to upload resource link.
- [ ] Set limit of 1 resource contribution a day on free plan (auto resets after 24hrs)
- [ ] Set limit of 10 resource contributions a day on paid plan (auto resets after 24hrs)
- [x] On submission of form:
    - [x] Show popup if user is not logged in, cannot make contribution if not logged in.
    - [ ] Show popup if user reached quota of allowed resource submissions.
    - [ ] Add Loader while API checks are occurring.
    - [x] Check if resource is a valid URL
    - [x] Check if the resource is already in Cloud Firestore database
    - [x] Check if URL is safe using Web Risk API (implement immediate ban, or 3 strikes with message to dispute strikes at support@thetechcatalyst.org)
    - [ ] Check if URL is appropriate using [SightEngine](https://sightengine.com/docs/url-link-moderation) URL and Link Moderation API
    - [ ] Check if URL is tech related (TBD how to implement)
    - [x] Fetch and style resource title & company logo using metadata scraping, domain parsing, and Clearbit.
    - [x] Add resource to Firestore in community_resources table, listing it in the resource library with Name, Company, Contributor (the current user), and Link as attributes.
    - [ ] Increment # of contributions made by user:
        - [ ] If 1 after incrementing: assign user FirstContribution badge if submission is successful.
        - [ ] If milestone number after incrementing: assign TopContributor badge if submission is successful.
        - [ ]  Display congratulations popup (with confetti animation) displaying corresponding badge.
- [x] Implement pagination.
- [ ] Implement API to scope internet and auto-add resources to cloud firestore in catalyst_resources table.
- [ ] Add Categories sidebar with filtering method to filter resources (community uploaded or otherwise) into categories (templates, videos, websites, SWE, Web Dev, App Dev, Cyber, etc.,)
- [ ] Add Job Board section with LinkedIn API, Indeed API, and parse GitHub repositories of job listings.

### User Authentication
- [ ] modify verification feature to delete old verification codes and links instead of setting them to false.
- [ ] Check if email on registration is of a valid domain.

### User Dashboard
- [ ] Add section for favorited resources (separate tab)
- [ ] Add cooldown for user read & write requests (prevent abuse - minimize future costs)
- [ ] Modify profile deletion feature to remove image from database.
- [ ] Add section to delete account.
- [ ] Allow deleting, rearranging, & categorizing favorited resources.
- [ ] Add search bar to "Other Users" section.
- [ ] Add settings preference to display profile as public or private.
- [ ] Add achievements/badge section.
- [ ] Improve click & drag feature for projects in edit state (make responsive on mobile)
- [ ] Create "GitHub Achievements" section, displayed only if GitHub state is set to true (user links their GitHub):
     - [ ] List any badges/highlights/trophies and achievements earned through GitHub.
     - [ ] Show list of the users' pinned repositories.
- [ ] **Potential Additional Feature:** Create "LeetCode Achievements" section
- [ ] Add + button next to each project for users to add skills (auto populates skills section)

### Payments
- [ ] Add payment policy page to prevent liability, add link to it in header component.
- [ ] Set up checkout page with Stripe API for each payment plan (monthly, yearly, and lifetime).
- [ ] Create _counter_ & _limit_ attributes for chatbot feature (limit set to ~25 message requests).
- [ ] Create _counter_ & _limit_ attributes for flashcard feature (limit set to ~50 total generated flashcards).
- [ ] When user payment is confirmed:
     - [ ] Send confirmation email with receipt.
     - [ ] Set limit to undefined (unlimited).
     - [ ] Define start of payment plan to track auto-renewal.
- [ ] Update preferences section in settings:
     - [ ] Add “Cancel Plan” button if user is subscribed to a premium (non lifetime) plan.
     - [ ] Add “Upgrade Plan” button if user is not subscribed to a plan.
     - [ ] Add section to show, update, delete billing information (cannot delete billing information if on payment plan without having another billing record set up).
     - [ ] Add section to show, modify, delete card information (same rule as above applies)
     - [ ] Leave blank, or just display “Current Plan” if subscribed to lifetime plan

### Calendar of Tech Events
- [ ] Add [CalendarDays](https://heroicons.com/) icon in Header component (should open separate page0
- [ ] Design calendar and integrate Eventbrite API to pull events from reputable sites (Google Calendar API, Microsoft Graph API, etc.,)
- [ ] Create [PlusCircle](https://heroicons.com/) button with modal form onClick for users to add events to public calendar (auto check for duplicates in DB using above APIs)

### Built-In Messaging System
- [ ] Add [Envelope](https://heroicons.com/) and [EnvelopeOpen](https://heroicons.com/) (in notification state) to Header component
- [ ] Create Inbox section in Dashboard (navigates to it on click of icon)
- [ ] Create message thread components and containers for chats
- [ ] Implement Websockets (Socket.io)

### Swipe-to-Connect Feature
- [ ] Cooldown of 5 connections a day on free tier.
- [ ] Create list of languages, frameworks, UIs, DBMSs, etc., (for dashboard skills section)
- [ ] Pass users skills into AI with above list, with prompt to list complimentary/supplimentary skills, use as criteria for finding matches.
- [ ] List all users with a higher ratio of matching skills to other/complimentary skills as "Similar"
- [ ] List all users with a higher ratio of compliemntary skills to matching/other skills as "Complientary"

### Discussions
- [ ] Add tab in header component that links to discussion forum page.
- [ ] List all discussions, with search bar to search existing forums.
- [ ] Add [Plus](https://heroicons.com/) icon to start discussion:
     - [ ] Type of discussion:
          - [ ] Tech Events: selecting this option prompts user to choose the event from a dropdown menu and write key insights of the event (with min character limit). Possibly require proof of attendance for regulation of content.
          - [ ] 
