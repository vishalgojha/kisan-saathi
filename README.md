# Kisan Saathi

**Multilingual WhatsApp AI for farmers: crop disease photo diagnosis, prices, weather, schemes**

Kisan Saathi is a farmer-first assistant that combines AI guidance with practical local insights.
It helps farmers with crop health decisions, market price visibility, weather awareness, and access to government schemes from a simple web + WhatsApp-friendly experience.

## Features

- Multilingual experience for farmer accessibility
- Crop disease support with photo upload and diagnosis workflow
- Mandi price lookup for key crops and regions
- Local weather snapshots and advisory context
- Government scheme discovery for relevant farming support
- Dashboard modules for alerts, notifications, and profile-based recommendations
- AI-powered nutrient and advisory guidance

## Tech Stack

- Vite
- React
- TypeScript
- React Router
- React Query
- Tailwind CSS + Radix UI components

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+

### Installation

```bash
git clone https://github.com/vishalgojha/kisan-saathi.git
cd kisan-saathi
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:3000
VITE_WHATSAPP_NUMBER=919876543210
VITE_UPLOAD_ENDPOINT=
```

### Run Locally

```bash
npm run dev
```

Open: `http://localhost:5173`

### Type Check and Build

```bash
npm run typecheck
npm run build
```

## Screenshots

Add screenshots to `docs/screenshots/` and update these links if filenames differ.

![Home](docs/screenshots/home.svg)
![Dashboard](docs/screenshots/dashboard.svg)
![Crop Diagnosis](docs/screenshots/crop-diagnosis.svg)
![Weather and Prices](docs/screenshots/weather-prices.svg)

## Farmer Guides

- [Farmer Guide (English)](docs/farmer-guide.en.md)
- [किसान गाइड (Hindi)](docs/farmer-guide.hi.md)

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-change`.
3. Commit your changes: `git commit -m "Describe your change"`.
4. Push your branch and open a Pull Request.

Detailed guide: [CONTRIBUTING.md](CONTRIBUTING.md)

Before opening a PR, run:

```bash
npm run typecheck
npm run build
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

