# trip-organizer

A lightweight mobile-friendly app with serverless API that keeps important travel information accessible on the go, with the option to log expenses. Simple password lock.

The desktop UX is trash because time crunch lol! Someday we'll do breakpoints again...

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

## API

-   [ ] Get, (Add, Update, Delete) travel action items.
    -   **No update/delete from UI yet**
-   [x] Get, Add, Update, Delete expense items on the go.
    -   [x] CSV export.

## To dos

-   [x] Fix visual problems. **Ish?** Mobile only.
-   [ ] Data entry.

Bonus round:

-   [ ] User avatar/username selection (user item). Get req only for now.
-   [ ] Additional art.
-   [ ] Integrate better with Google maps.
-   [ ] Checklist/todos (checklist item).
-   [ ] Add activity rating field (under Update endpt)

## Requirements

Add your own db key in environment variables for the Netlify function.

## Future documentation/etc

Create wrapper for Netlify serverless function + Mongo Data API.

## WIP

[![wip-screens](https://i.postimg.cc/SKd99wnZ/wip-screens.png)](https://i.postimg.cc/SKd99wnZ/wip-screens.png)
