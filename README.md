# Entity Developer Dashboard

A VueJs based dashboard for developers to manage their tenants and API keys				

## Manual

### Install

Node Version:  `v20.10.0`

```bash
git clone https://github.com/hypersign-protocol/entity-developer-dashboard #Pull the repo
cd studio/client
yarn
```

### Build & Run

#### Prod

```bash
yarn build
yarn serve
```

#### Dev

```bash
npm run dev
```


Make sure you have `.env` file.


# Design

Element,Specification
Color Palette,"Primary: #3b82f6 (Blue); Backgrounds: #f9fafb (Gray), #f0f7ff (Light Blue tint); Borders: #e5e7eb / #e2e8f0."
Typography,"Clean sans-serif; specialized input-label (0.72rem, bold, uppercase, letter-spacing); x-small (0.75rem); lh-lg (1.6 line height)."
Shape & Depth,Border-radius: 0.75rem (12px) for cards; Subtle borders (1px solid); Soft shadows for active elements.
Components,"Step-based roadmaps with vertical connectors; overview-container sidebars; Hover transitions (e.g., translateX(4px))."
Iconography,"Use of v-icon (Material Design Icons) for visual cues like mdi-arrow-right, mdi-book-open-variant, and mdi-lifebuoy."
🛠️ Key Implementation Details
To ensure consistency in future redesigns, I will focus on these structural patterns:

Layout: Using lg="8" for main content and lg="4" for sidebar resource panels.

Interactive Elements: Modern link styling with mdi-arrow-right and weight-based emphasis rather than heavy buttons.

Spacing: Heavy use of utility classes (mb-6, py-6, p-4) to maintain whitespace.