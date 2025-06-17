# LeadBot AI

A React-based AI-powered lead generation tool that helps find properties in any location using the Gemini API. The application provides real-time lead tracking and conversation metadata export capabilities.

## Features

- **Property Search**: Find properties in any location using AI-powered search
- **Real-time Lead Tracking**: Automatically categorizes leads as hot, cold, or invalid
- **Conversation Export**: Download conversation metadata in JSON or CSV format
- **Configurable Business Types**: Customize the application according to your business needs
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Gemini API

## Installation

1. Clone the repository:
```bash
git clone https://github.com/tamatar-23/leadbot.git
cd leadbot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Configure your business type in the application settings
2. Start searching for properties by entering location details
3. Monitor lead status in real-time as conversations progress
4. Export conversation data as needed in JSON or CSV format

## Lead Classification

The application automatically tracks and classifies leads based on conversation analysis:

- **Hot Lead**: High potential prospects showing strong interest
- **Cold Lead**: Lower engagement prospects requiring nurturing
- **Invalid Lead**: Non-viable prospects or incomplete interactions

## Export Features

Download conversation metadata including:
- Lead classification data
- Conversation timestamps
- Property search queries
- Response analysis
- Available in JSON and CSV formats

## Repository

GitHub: https://github.com/tamatar-23/leadbot

## License

This project is licensed under the MIT License.