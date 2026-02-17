# Personal Portfolio Website - Knowledge File

## Project Vision
A modern, professionally-designed single-page portfolio website for Yusuf, an undergraduate Computer Engineering student at METU applying to master's programs in Europe. The site should showcase academic achievements, research publications, and experience while maintaining a clean, sophisticated design inspired by Claude/Anthropic's design language.

## Design System
### Visual Identity
- **Inspiration**: Claude.ai and Anthropic's design language
- **Color Palette**: 
  - Primary: Warm beige/cream tones (#F4F1EA, #E8E3D6)
  - Accent: Burnt orange/terra cotta (#C85C38, #D4693F)
  - Text: Deep charcoal (#1F1F1F, #2C2C2C)
  - Subtle accents: Soft blue-grays for secondary elements
- **Typography**:
  - Headings: Clean sans-serif (similar to Inter or SF Pro)
  - Body: Highly readable sans-serif with generous line-height
  - Code/Technical: Monospace font for technical details
- **Spacing**: Generous whitespace, breathing room between sections
- **Style**: Minimalist, elegant, professional yet approachable

### UI Principles
- Clean, uncluttered layouts
- Smooth scroll behavior between sections
- Subtle animations (fade-ins, gentle transitions)
- Responsive design (mobile-first approach)
- Accessibility: WCAG 2.1 AA compliant

## Site Structure (Single Page Application)

### Section Order:
1. **Hero/Landing** - Name, title, brief tagline, CTA
2. **About** - Background, current status, interests
3. **Experience** - Research positions, internships, work
4. **Publications** - Academic papers, research outputs
5. **Blog** - Featured blog posts with preview cards
6. **Contact** - Email, social links, contact form

### Navigation
- Fixed header with smooth scroll anchors
- Responsive hamburger menu on mobile
- Active section highlighting

## Key Features

### CV Download
- Prominent button in header and contact section
- Downloads latest PDF version
- Track download events in analytics

### Blog System
- Dedicated blog section with card-based layout
- Each card shows: title, date, excerpt, read time
- Click to expand or navigate to full post
- Support for markdown content
- Easy addition of new posts via JSON/markdown files

### Location Tracker (Analytics)
- Capture and log: IP address, country, city, timestamp, page views
- Store in Supabase for later analysis
- Privacy-compliant (anonymize IP, add privacy notice)
- Dashboard view for admin to see visitor analytics
- Track CV downloads specifically

### Modularity
- Component-based architecture
- Easy to add new sections (Projects, Teaching, etc.)
- Reusable card components for Publications, Experience, Blog
- Centralized content management (JSON files or Supabase)

## Technical Requirements
- React + TypeScript
- Tailwind CSS for styling
- Supabase for:
  - Analytics storage
  - Blog post content (optional)
  - Contact form submissions
- Responsive breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
- SEO optimized (meta tags, Open Graph, schema markup)

## User Personas
### Primary: Academic Recruiters/Professors
- Quickly assess qualifications
- Download CV immediately
- View publications and research
- Understand research interests

### Secondary: Peers/Colleagues
- Learn about research work
- Read blog posts
- Connect professionally

## Content Guidelines
- Professional but approachable tone
- Emphasize research achievements
- Keep technical details accessible
- Highlight unique aspects (perfect GPA, research at TU Munich, etc.)

## Future Enhancements (Not in v1)
- Projects showcase section
- Interactive research timeline
- Dark mode toggle
- Language switcher (EN/TR)