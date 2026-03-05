# Notes

## Better-auth - use when updating config

npx --verbose @better-auth/cli@latest generate --config ./src/lib/server/auth.ts

## Generate the migration

npx drizzle-kit generate

npx drizzle-kit push

npx drizzle-kit migrate

## Create custom Drizzle migration

npx drizzle-kit generate --custom --name=rating-triggers

...then add SQL code directly to the SQL file provided, then migrate & push

## NGROK

ngrok http 5173

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
