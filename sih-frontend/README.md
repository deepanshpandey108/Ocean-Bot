# FloatChat - AI-Powered Ocean Data Discovery

FloatChat is an innovative conversational interface that revolutionizes ocean data exploration through natural language queries, interactive visualizations, and intelligent insights from ARGO profiling floats worldwide.

## 🌊 Features

- **🤖 AI-Powered Chat Interface** - Natural language queries for ocean data exploration
- **📊 Interactive Data Visualization** - Charts, graphs, and visual representations of ocean parameters
- **🗺️ Interactive Maps** - Geographic visualization with city-based zoom and ARGO float locations
- **🌍 ARGO Integration** - Direct access to ARGO ocean profiling float data and real-time information
- **📈 Ocean Analytics** - Comprehensive oceanographic data analysis and trend identification
- **🌐 Global Coverage** - Worldwide ocean data access with regional and temporal filtering

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd world-spotter-tool
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Use

### Landing Page
- Visit the homepage to learn about FloatChat's capabilities
- Click "Start Chatting" to access the AI interface
- Explore the features and benefits of ocean data discovery

### Chat Interface
1. **Ask Questions** - Use natural language to ask about ocean data, temperatures, salinity, or specific locations
2. **Get Visualizations** - Receive interactive charts, graphs, and maps that visualize the data you requested
3. **Explore & Analyze** - Zoom into specific locations, analyze trends, and discover patterns in ocean data

### Example Queries
- "Show me temperature data for Miami"
- "What is the salinity profile near Tokyo?"
- "Show trends over time for ocean temperature"
- "Zoom to London and show ARGO floats"
- "What are the current ocean conditions?"

## 🛠️ Technology Stack

- **⚡️ Vite** - Next generation frontend tooling
- **⚛️ React 18** - UI library with TypeScript
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 shadcn/ui** - Re-usable components built using Radix UI
- **📊 Recharts** - Data visualization library
- **🗺️ Leaflet** - Interactive maps
- **🌊 ARGO Data Service** - Ocean data integration

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components
│   ├── ArgoDataService.ts  # ARGO data integration
│   └── SearchMap.tsx   # Map component
├── pages/              # Page components
│   ├── LandingPage.tsx # Landing page
│   ├── ChatPage.tsx    # Chat interface
│   └── Index.tsx       # Home page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── main.tsx           # Application entry point
```

## 🌊 ARGO Data Integration

FloatChat integrates with the ARGO float network, which consists of:
- **4,000+** autonomous instruments worldwide
- **3,800+** actively collecting data
- **2M+** data points collected
- Real-time temperature, salinity, and pressure measurements
- Global ocean coverage from surface to 2000m depth

## 🎨 Customization

### Adding New Components

You can add new shadcn/ui components using the CLI:

```bash
npx shadcn-ui@latest add <component-name>
```

### Styling

This project uses Tailwind CSS for styling. You can customize the design system by modifying the `tailwind.config.ts` file.

## 🚀 Deployment

The project can be deployed to any static hosting service. Build the project using:

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📊 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## 🌍 Ocean Data Sources

FloatChat leverages data from:
- **ARGO Float Network** - Global array of autonomous ocean profiling floats
- **OpenStreetMap** - Geographic data and city information
- **Real-time Ocean Parameters** - Temperature, salinity, pressure, and location data

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Learn More

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [ARGO Program](https://argo.ucsd.edu/)
- [Recharts Documentation](https://recharts.org/)
- [Leaflet Documentation](https://leafletjs.com/)