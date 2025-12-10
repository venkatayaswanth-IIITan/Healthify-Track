# 🏥 Health Tracker App

A modern, AI-powered health tracking application built with React, TypeScript, and Vite. Track your health metrics, get personalized insights, and chat with MEDICO AI for health-related questions.

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- 📊 **Health Metrics Tracking** - Monitor your vital health statistics
- 🤖 **AI-Powered Chatbot** - Get instant health advice from MEDICO AI
- 💊 **Medication Management** - Track medications and schedules
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI** - Built with TailwindCSS and Bootstrap
- ⚡ **Fast Performance** - Powered by Vite for lightning-fast development

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd Health-Track--2--main/project/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to the URL shown in your terminal (typically `http://localhost:5173`)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Builds the app for production to the `dist` folder |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript 5.5** - Type-safe JavaScript
- **Vite 5.4** - Build tool and dev server
- **React Router DOM 6.30** - Client-side routing

### Styling
- **TailwindCSS 3.4** - Utility-first CSS framework
- **Bootstrap 5.3** - Component library
- **Lucide React** - Beautiful icon library

### Backend Integration
- **Axios** - HTTP client for API requests
- **Express** - Backend server framework
- **Mongoose** - MongoDB object modeling
- **MySQL2** - MySQL database driver

### AI Integration
- **OpenRouter API** - Powers MEDICO AI chatbot
- **Google Gemini 2.0** - Advanced language model

## 📁 Project Structure

```
project/
├── src/                    # Source files
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── assets/           # Images, fonts, etc.
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🤖 MEDICO AI Chatbot

The application includes an AI-powered chatbot that can answer health-related questions. The chatbot uses:
- **Model**: Google Gemini 2.0 Pro
- **Provider**: OpenRouter API
- **Features**: Markdown support, real-time responses

### Using the Chatbot

1. Navigate to the chatbot page
2. Type your health-related question
3. Click "Ask!" to get an AI-powered response
4. Responses are formatted in Markdown for better readability

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory if you need to customize API endpoints or keys:

```env
VITE_API_URL=your_api_url
VITE_OPENROUTER_KEY=your_openrouter_key
```

### Vite Configuration

The project uses Vite for fast development. Configuration can be found in `vite.config.ts`.

## 📦 Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist` folder, ready to be deployed to any static hosting service.

### Preview Production Build

```bash
npm run preview
```

## 🌐 Deployment

This app can be deployed to various platforms:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload `dist` folder to S3 bucket

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use:
```bash
# Kill the process using the port (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or specify a different port
npm run dev -- --port 3000
```

### Dependencies Issues

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- OpenRouter for AI API access
- Google Gemini for the language model
- The React and Vite communities

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Made with ❤️ using React + Vite + TypeScript**
