# trip-organizer

A lightweight mobile-first, desktop-unfriendly app with serverless API that keeps important travel information accessible on the go, with the option to log expenses. Simple password lock.
Site is live but behind password lock. Server functions not included in public repo.

## Details

Web app built with:

-   React + TypeScript
-   Vite
-   MongoDb
-   Netlify-cli
-   pagecrypt for convenient pw (this is not particularly robust). Can update with Identity via Netlify.

UI libraries:

-   Ant Design
-   AG Grid (probably overkill)

Free icons from FlatIcon and some personal graphics

Additional art, etc. credits to the AIC (Art Institute of Chicago) API
Potential img hosting: PixaBay

The desktop UX is trash because time crunch lol! Someday we'll do breakpoints again...

## API

-   [x] Get, Add, Update, Delete travel action items.
-   [x] Get, Add, Update, Delete expense items on the go.
    -   [x] CSV export.

## To dos

-   [x] Fix visual problems. **Ish?** Mobile only.
-   [ ] Data entry.

Bonus round:

-   [ ] User avatar/username selection (user item). Get req only for now.
-   [ ] Update graphics.
-   [ ] Integrate better with Google maps.
-   [ ] Checklist/todos (checklist item).
-   [ ] Add activity rating field (under Update endpt)

## Requirements

Add your own API key in environment variables for the Netlify functions.

## Learnings

Mostly sticking to a consistent workflow/order of operations. General directory structure working from outside-in,

1. Define data structures (only two here). Even if the database doesn't enforce a schema, be consistent and work with TypeScript.
2. Define basic endpoints needed for API.
3. Write functions and test API with Postman.
4. Inside server directory (update your .gitignore), create front-end directories.
5. Design main workflows/pages. This was essentially a single page app, with few enough conditionals that I didn't bother using React Router. Although I could probably have used Context.
6. Write components and very wasteful (S)CSS.
7. Change your mind a few times about how to handle certain user flows.
8. Rewrite the build and deploy scripts.
9. Fiddle with the design for some hours using browser dev tools.
10. Deploy and check functionality.

If I had to restart, I would not have two package.json ...
I didn't end up getting the Vite dev environment to play more nicely with the serverless functions. Is Hono worth looking at?

## Future documentation/etc

Create wrapper for Netlify serverless function + Mongo Data API.

## V1

Left to right, top to bottom: trip list for user > activities list > activity detail > expenses viewer (exportable + can add) > editing expense > add new activity

[![v1-screens](https://i.postimg.cc/bwGLX9nb/v1-screens.png)](https://i.postimg.cc/bwGLX9nb/v1-screens.png)
