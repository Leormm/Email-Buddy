# Email Buddy

Your sending sidekick for cold outreach and follow-ups.

## Features

- **Cold Outreach**: Generate personalized cold emails based on your draft and prospect data
- **Call Follow-Up**: Turn call transcripts into follow-up emails instantly
- **Voice Profile**: Train the system on your writing style so emails sound like you, not a robot

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## How to Use

### 1. Cold Outreach
- Paste your email draft in the left panel
- The app will personalize it using mock company context
- Review and copy the generated email

### 2. Call Follow-Up
- Paste your call transcript or notes
- The app generates a follow-up email tied to what was discussed
- Copy and send

### 3. Voice Profile
- Upload past emails or writing samples
- Click "Analyze Voice" to extract your writing style
- Your profile will be used to personalize all future emails

## Tech Stack

- Next.js 14
- React 18
- Lucide Icons
- Tailwind CSS (via inline styles)

## Architecture

- **`app/page.js`** - Main SDR app with all modes
- **`app/layout.js`** - Root layout
- **`app/globals.css`** - Global styles
- **`package.json`** - Dependencies

## Mock Functions

Currently uses mock functions for:
- Email generation (`mockColdOutreach`)
- Follow-up generation (`mockFollowUp`)
- Voice analysis (`mockVoiceAnalysis`)

In production, these would call Claude API endpoints.

## License

MIT
