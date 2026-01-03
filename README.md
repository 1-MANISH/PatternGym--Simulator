# PatternGym – Simulator 🧠⚡

PatternGym–Simulator is a **full-stack interactive web application** built as part of the **Babua Premier League (BPL) – Product Design Challenge**.  
The core idea is to move beyond traditional video-based LMS platforms and enable **learning by doing** through **interactive simulations**, real-time feedback, and a clean, distraction-free UI.

---

## 🚀 Core Idea

Most learning platforms focus on content consumption.  
**PatternGym–Simulator** focuses on:

- 🧩 Solving patterns & logic interactively  
- 🛠 Learning through simulators instead of lectures  
- ⚡ Immediate feedback and iteration  
- 🎯 Interview-oriented problem practice  
- 🎨 Minimal, comfort-first UI (no visual overload)

---

## ✨ Key Features

- Interactive pattern / logic simulator
- Modular full-stack architecture
- Modern frontend tooling with fast builds
- Backend services for business logic
- Shared TypeScript models and utilities
- Tailwind-based minimal design
- Easily extensible for future learning modules

---

## Figma Design -

- Phase 1

[Initial Design](https://www.figma.com/make/w8b5R9tWfrlqk5SnmiDCqc/Website-for-Babua-Learning-Platform?t=lLov5NJdHNpYORxC-1)


## Live Site - 
 - Phase 1

 [PatternGym](https://3f8ac736-e616-4a95-abab-69c449ff7b9b-00-2xo0ose2vty22.picard.replit.dev)

## 📁 Project Structure

```
PatternGym--Simulator/
├── attached_assets/        # Images, diagrams, UI assets
├── client/                 # Frontend application
├── server/                 # Backend APIs and services
├── script/                 # Utility & setup scripts
├── shared/                 # Shared types & helpers
├── package.json            # Project dependencies
├── drizzle.config.ts       # Database / ORM configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── .gitignore
```

---

## 🧠 Tech Stack

### Frontend
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- TypeScript

### Shared
- Common TypeScript models & utilities

### Tooling
- Drizzle ORM
- Vite
- Tailwind CSS

---

## 🧑‍💻 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/1-MANISH/PatternGym--Simulator.git
cd PatternGym--Simulator
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Variables
Create a `.env` file in the project root:

```env
PORT=4000
DATABASE_URL=your_database_url_here
```

---

## ▶️ Running the Project

### Start Backend
```bash
npm run dev:server
```

### Start Frontend
```bash
npm run dev:client
```

Open in browser:
```
http://localhost:3000
```

---

## 📜 Available Scripts

| Command | Description |
|------|-------------|
| `npm run dev` | Run client and server together |
| `npm run dev:client` | Start frontend only |
| `npm run dev:server` | Start backend only |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

---

## 🎯 Use Cases

- Pattern-based learning for DSA & logic building
- Interview preparation (pattern recognition & flow)
- Simulator-driven education platforms
- Hackathon-ready LMS alternatives
- Experimentation with non-course monetization models

---

## 🛣 Future Enhancements

- User authentication & profiles
- Progress tracking & analytics
- Interview-style pattern challenges
- Real-time multiplayer simulations
- Gamification & ranking system
- Sustainable monetization without selling courses

---

## 🤝 Contributing

Contributions are welcome and encouraged!

1. Fork the repository  
2. Create a feature branch  
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes  
   ```bash
   git commit -m "feat: add new feature"
   ```
4. Push and open a Pull Request  

Please follow clean code practices and add documentation where needed.

---

## 🙌 Author

**Manish Patidar**  
Full-Stack Developer | MERN | System Design | WebSockets | Scalable Applications  
If you find this project useful, don’t forget to ⭐ the repository!
