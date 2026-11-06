# Hearth Focus

A small focus timer with a soft sage palette, a CSS orb, and space for one intention.

Built with Next.js, React, TypeScript, and Tailwind CSS.

## Run

Use Node.js 24 and pnpm 12.18.0.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open http://127.0.0.1:3001. The server runs locally, and the page doesn't call external services.

## Checks

```bash
pnpm test
pnpm build
pnpm typecheck
```

To run the production build, use `pnpm start` after `pnpm build`.

## How it works

- Focus sessions last 25 minutes. You can start, pause, resume, and reset.
- Reset and New session keep your intention and restart the timer.
- The timer uses the device clock to catch up after a background tab or sleep.
- Everything lives in the current tab. Refreshing clears the timer and intention.

## Deploy

Import this repository into Vercel using the Next.js preset and the repository root. Keep the default build settings.

Set `ENABLE_EXPERIMENTAL_COREPACK=1` in Vercel's environment variables so the build uses the pinned pnpm version.
