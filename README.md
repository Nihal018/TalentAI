# TalentAI - AI-Powered Job Portal

A modern job portal that uses AI to help match job seekers with relevant opportunities through resume analysis and intelligent matching.

**Live Demo:** [https://talent-ai-seven.vercel.app/](https://talent-ai-seven.vercel.app/)

## Overview

TalentAI is a web-based job portal that simplifies the job search process by using AI to analyze resumes and match candidates with suitable job opportunities. Users can upload their resumes and get instant job recommendations based on their skills and experience.

## Features Implemented

- **Resume Upload**: Simple interface to upload resume files (PDF, DOC, DOCX support)
- **AI-Powered Analysis**: Extracts key information from resumes including skills, experience, and qualifications
- **Job Matching**: Matches uploaded resumes with available job listings based on compatibility
- **Scoring System**: Provides match scores to show how well a candidate fits each job
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, user-friendly interface built with modern design principles

## Tech Stack

- **Frontend Framework**: Next.js/React.js
- **Styling**: Tailwind CSS for responsive design
- **Deployment**: Vercel for hosting
- **AI Integration**: Resume parsing and matching algorithms

## How It Works

1. **Upload Resume**: Users upload their resume through the drag-and-drop interface
2. **AI Processing**: The system analyzes the resume to extract relevant information
3. **Job Matching**: Algorithm compares resume data with available job listings
4. **View Results**: Users see matched jobs with compatibility scores
5. **Apply**: Users can proceed to apply for matched positions

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nihal018/TalentAI.git
   cd TalentAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file and add necessary configuration:
   ```
   NEXT_PUBLIC_API_URL=your_api_url
   # Add other required environment variables
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
TalentAI/
├── components/       # React components
├── pages/           # Next.js pages
├── styles/          # CSS files
├── public/          # Static assets
├── lib/             # Utility functions
└── package.json     # Dependencies
```

## Current Implementation

### What's Working
- Landing page with project information
- Resume upload functionality
- Basic AI matching algorithm
- Job listing display with match scores
- Responsive design for all screen sizes
- Deployment on Vercel

### Technologies Used
- Next.js for the web framework
- Tailwind CSS for styling
- Vercel for deployment and hosting
- AI/ML libraries for resume parsing

## Building the Project

```bash
# Development build
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

## Deployment

The project is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Create a Vercel account
3. Import the repository in Vercel
4. Configure environment variables
5. Deploy

## Future Improvements

Some ideas for enhancing the project:
- User authentication and profiles
- Save job applications
- More sophisticated matching algorithms
- Admin panel for job postings
- Email notifications
- Advanced filtering options

## Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to open issues or submit pull requests.

## Developer

**Nihal** - [GitHub](https://github.com/Nihal018)

## License

MIT License - feel free to use this project for learning or as a starting point for your own job portal.

## Acknowledgments

- Built as a personal project to explore AI integration in web applications
- Thanks to the open-source community for the amazing tools and libraries

---

For any questions or feedback, please open an issue on GitHub.
