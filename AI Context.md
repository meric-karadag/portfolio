# **Project Context: Yusuf Meric Karadag Portfolio**

## **Project Goal**

A professional Single Page Application (SPA) portfolio for a high-achieving Computer Engineering student (GPA 4.0/4.0, 1st Rank). The site aims to bridge the gap between **academic rigor** and **industry engineering**, targeting both Masters' recruiters and industry R\&D roles.

## **Design Philosophy**

* **Vibe:** "Claude.ai" / Anthropic style. Minimalist, academic, high-signal.  
* **Palette:** Warm Paper (\#F9F9F7), Deep Charcoal (\#2C2C2C), Burnt Orange Accent (\#D4693F).  
* **Typography:** Sans-serif (Inter), clean, high readability.

## **Tech Stack**

* **Framework:** React \+ Vite \+ TypeScript  
* **Styling:** Tailwind CSS (configured in tailwind.config.js)  
* **Icons:** Lucide React  
* **Backend:** Firebase (Firestore \+ Auth)  
  * **Auth:** Anonymous login to secure DB writes.  
  * **DB:** Firestore for storing messages and analytics.

## **Site Structure (App.tsx)**

The app uses a state-based router (currentView) to switch between two main views:

1. **HomeView:**  
   * **Hero:** Intro \+ Affiliations (MIT, TUM, Microsoft).  
   * **Updates:** Short news ticker.  
   * **About:** Narrative \+ "Technical Toolkit" (replaces generic skills list).  
   * **Research Experience:** Detailed cards for internships.  
   * **Achievements:** 1st Rank, High Honor, etc.  
   * **Publications:** Paper citations.  
   * **References:** Academic vouchers.  
   * **Contact:** Form linked to Firebase.  
2. **ProjectsView:**  
   * **Featured Projects:** High-quality open source (e.g., Chrono-Kit).  
   * **Engineering Logs:** Dev-blog style timeline for technical thoughts.

## **Current Status**

* **Migrated:** Codebase has been moved from a browser preview to a local Vite setup.  
* **Backend:** Firebase config is abstracted in src/firebase.ts. Env vars are in .env.  
* **Pending:**  
  * Real Firebase keys need to be added to .env.  
  * "Download CV" button needs a real PDF link (currently just tracks the click).  
  * Profile images are placeholders.

## **Instructions for AI Agent**

* When adding new features, maintain the "Warm Paper" aesthetic.  
* Use src/firebase.ts for any DB interactions.  
* Keep the single-file component structure in App.tsx unless the file exceeds 800 lines, then refactor HomeView and ProjectsView into separate components.