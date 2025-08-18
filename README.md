# AI-AIM: AI-Powered Technical Document Simplification Platform

[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/react-19.1.1-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue.svg)](https://typescriptlang.org)

## 🚀 Overview

AI-AIM (AI-powered Technical Simplification) is a comprehensive platform that transforms complex technical manuals, diagrams, and documents into clear, understandable content using advanced AI technologies. The platform combines multimodal document processing, intelligent retrieval, and conversational AI to help users save hours of reading time and boost productivity.

## ✨ Key Features

### 🔍 **Multimodal Document Processing**
- **PDF Support**: Process technical PDFs with text and visual content using Poppler Utils
- **Image Analysis**: Extract and understand diagrams, charts, and technical drawings
- **Text Extraction**: Intelligent parsing of complex technical documentation
- **PDF Conversion**: High-quality PDF to image conversion for AI processing

### 🤖 **AI-Powered Intelligence**
- **ColPali Engine**: Advanced multimodal AI for document understanding
- **Gemini 2.5 Flash**: Google's latest language model for intelligent responses
- **CrewAI Agents**: Autonomous agents for document retrieval and web search
- **RAG Pipeline**: Retrieval-Augmented Generation for context-aware responses

### 💬 **Smart Conversational Interface**
- **Chat Sessions**: Persistent conversation history with document context
- **Context-Aware Responses**: AI understands document context and user queries
- **Multi-Session Management**: Organize conversations by topic or project

### 🔐 **Secure User Management**
- **JWT Authentication**: Secure token-based authentication
- **User Profiles**: Personalized experience with user-specific data
- **Protected Routes**: Secure access to user-specific content

### 🎨 **Modern User Interface**
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Customizable appearance with theme toggle
- **Intuitive Navigation**: User-friendly interface for document management

## 🏗️ Architecture

### Backend (Flask + Python)
```
backend/
├── app.py                 # Main Flask application
├── agents/               # AI agents and tools
│   ├── agents.py        # CrewAI agent configuration
│   ├── tasks.py         # Agent task definitions
│   └── tools.py         # Custom tools for agents
├── config/               # Configuration management
│   ├── database.py      # Database initialization
│   └── settings.py      # Application settings
├── core/                 # Core functionality
│   ├── colpali_client.py # ColPali engine integration
│   ├── qdrant_client.py # Vector database client
│   ├── rag_singleton.py # RAG pipeline singleton
│   └── rag_utils.py     # RAG utility functions
├── middleware/           # Request/response middleware
├── model/                # Data models
│   ├── chat.py          # Chat session models
│   ├── document.py      # Document models
│   └── user.py          # User models
├── routes/               # API endpoints
│   ├── agent.py         # AI agent endpoints
│   ├── auth.py          # Authentication endpoints
│   ├── chat.py          # Chat endpoints
│   ├── documents.py     # Document management
│   └── users.py         # User management
├── services/             # Business logic
│   ├── auth_service.py  # Authentication service
│   ├── file_service.py  # File processing service
│   └── query_service.py # Query processing service
└── utils/                # Utility functions
```

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base UI components (shadcn/ui)
│   │   └── userboard/   # User dashboard components
│   ├── contexts/        # React contexts for state management
│   ├── features/        # Feature-specific components
│   │   ├── auth/        # Authentication components
│   │   ├── landing/     # Landing page components
│   │   └── userboard/   # Main user interface
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries and services
│   └── routes/          # Application routing
```

## 🛠️ Technology Stack

### Backend Technologies
- **Framework**: Flask (Python web framework)
- **Database**: MySQL with SQLAlchemy ORM
- **AI/ML**: 
  - ColPali Engine for multimodal processing
  - Google Gemini 2.5 Flash for language understanding
  - CrewAI for autonomous agents
- **Vector Database**: Qdrant for semantic search
- **Authentication**: JWT with Flask-JWT-Extended
- **File Processing**: PyMuPDF, PDF2Image, Pillow, Poppler Utils

### Frontend Technologies
- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation

### AI & ML Libraries
- **colpali-engine**: Multimodal document understanding
- **torch**: PyTorch for deep learning
- **qdrant-client**: Vector database operations
- **crewai**: Autonomous AI agent framework
- **google-generativeai**: Google's AI model integration

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- MySQL database
- Qdrant vector database
- Google Gemini API key
- Tavily API key
- Poppler Utils (for PDF processing) - **Required for PDF conversion**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-AIM/backend
   ```

2. **Install Poppler Utils**
   
   **On Ubuntu/Debian:**
   ```bash
   sudo apt-get update
   sudo apt-get install -y poppler-utils
   ```
   
   **On macOS:**
   ```bash
   brew install poppler
   ```
   
   **On Windows:**
   ```bash
   # Download from: https://github.com/oschwartz10612/poppler-windows/releases
   # Extract to C:\poppler and add C:\poppler\Library\bin to PATH
   # Or use Chocolatey:
   choco install poppler
   ```
   
   **On CentOS/RHEL:**
   ```bash
   sudo yum install poppler-utils
   # Or for newer versions:
   sudo dnf install poppler-utils
   ```

3. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   SECRET_KEY=your-secret-key
   JWT_SECRET_KEY=your-jwt-secret
   QDRANT_URL=your-qdrant-url
   QDRANT_API_KEY=your-qdrant-api-key
   TAVILY_API_KEY=your-tavily-api-key
   GEMINI_API_KEY=your-gemini-api-key
   DATABASE_URL=mysql://user:password@localhost/database_name
   ```

6. **Verify Poppler installation**
   ```bash
   # Test if poppler-utils is properly installed
   pdftoppm -h
   # Should display help information
   ```

7. **Initialize database**
   ```bash
   python reset_db.py
   ```

8. **Run the backend**
   ```bash
   python app.py
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📖 Usage

### 1. **User Registration & Authentication**
- Sign up for a new account
- Log in with your credentials
- Access protected user dashboard

### 2. **Document Upload & Processing**
- Upload technical PDF documents
- AI processes and extracts content
- Documents are indexed for semantic search

### 3. **Intelligent Querying**
- Ask questions about uploaded documents
- AI provides context-aware answers
- Fallback to web search when needed

### 4. **Chat Sessions**
- Create new chat sessions for different topics
- Maintain conversation history
- Switch between sessions seamlessly

### 5. **Document Management**
- View uploaded documents
- Access processing status
- Manage document library

## 🔧 Configuration

### Environment Variables
The application uses several environment variables for configuration:

- **Database**: MySQL connection string
- **AI Services**: API keys for Gemini, Tavily, and Qdrant
- **Security**: JWT and application secrets
- **File Upload**: Maximum file size and allowed extensions

### Poppler Utils Configuration
Poppler Utils must be properly installed and accessible from the system PATH. The application uses these Poppler tools:
- **pdftoppm**: Converts PDF pages to images
- **pdftotext**: Extracts text from PDFs
- **pdfinfo**: Retrieves PDF metadata

**Note**: If you encounter "command not found" errors, ensure Poppler Utils is properly installed and added to your system PATH.

### AI Model Configuration
- **ColPali Engine**: Configured for multimodal document processing
- **Gemini 2.5 Flash**: Set as the primary language model
- **CrewAI Agents**: Configured for document retrieval and web search
- **Poppler Utils**: PDF processing utilities for high-quality document conversion

## 🚀 Deployment

### Backend Deployment
1. **Install Poppler Utils on production server**
   ```bash
   # Ubuntu/Debian
   sudo apt-get update && sudo apt-get install -y poppler-utils
   
   # CentOS/RHEL
   sudo yum install poppler-utils
   
   # Verify installation
   pdftoppm -h
   ```

2. Set up production environment variables
3. Use production WSGI server (Gunicorn)
4. Configure reverse proxy (Nginx)
5. Set up SSL certificates

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**AI-AIM** - Transforming complex technical documentation into clear, actionable insights through the power of artificial intelligence.