# RAG-LLM Chat Interface

A modern, Grok-style chat interface built with Next.js, React, and Tailwind CSS. Features a clean, minimalist design with smooth scrolling and elegant message capsules.

## Features

- 🎨 Grok-inspired UI design with subtle dark theme
- 💬 User message capsules with distinctive flat top-right corner
- 🔄 Smooth scrolling with proper overflow handling
- 📱 Responsive layout optimized for all screen sizes
- ⚡ Built with Next.js 16 and React 19 for optimal performance
- 🎯 AI-powered chat interface using Vercel AI SDK

## Tech Stack

- **Framework**: Next.js 16.0.0
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS v4
- **AI Integration**: Vercel AI SDK
- **Icons**: Lucide React
- **Components**: Radix UI primitives
- **Animations**: Motion (Framer Motion)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or later
- npm, yarn, or pnpm package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jdcastano06/RAG-LLM.git
   cd RAG-LLM
   ```

2. **Navigate to the app directory**
   ```bash
   cd my-app
   ```

3. **Install dependencies**
   
   Using npm:
   ```bash
   npm install
   ```
   
   Using yarn:
   ```bash
   yarn install
   ```
   
   Using pnpm (recommended):
   ```bash
   pnpm install
   ```

## Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

1. **Build the application**
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

2. **Start the production server**
   ```bash
   npm run start
   # or
   yarn start
   # or
   pnpm start
   ```

### Linting

Run the linter to check for code quality issues:

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

## Project Structure

```
my-app/
├── app/
│   ├── page.tsx          # Main chat interface component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ai-elements/      # AI chat components
│   │   ├── message.tsx   # Message component with Grok styling
│   │   ├── prompt-input.tsx
│   │   └── ...
│   └── ui/              # Reusable UI components
├── lib/
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## Key Features Explained

### Message Design
- **User Messages**: Right-aligned with subtle dark gray background (`neutral-800`) and distinctive flat top-right corner
- **Assistant Messages**: Left-aligned with plain text styling
- **Spacing**: Optimized vertical spacing for comfortable reading

### Scrolling
- Smooth scroll behavior with proper overflow handling
- Sticky input area that stays at the bottom
- Content padding to prevent messages from being hidden behind the input

### Theme
- Dark background with subtle gradient (`#0f0f0f`)
- Carefully chosen color palette for excellent contrast
- Modern, minimalist aesthetic inspired by Grok

## Customization

### Changing Colors
Edit `components/ai-elements/message.tsx` to customize message colors:
```tsx
// User message background
"group-[.is-user]:bg-neutral-800"

// User message text
"group-[.is-user]:text-white"
```

### Adjusting Layout
Modify `app/page.tsx` to change the overall layout:
```tsx
// Background color
className="bg-[#0f0f0f]"

// Container max width
className="mx-auto max-w-4xl"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please open an issue on GitHub or contact the maintainer.

---

Built with ❤️ using Next.js and React

