# trip-organizer
A lightweight mobile-friendly app with serverless API that keeps important travel information accessible on the go, with the option to log expenses. Simple password lock.

## Details
Web app built with:
- React + TypeScript
- Vite
- MongoDb
- Netlify-cli
UI libraries:
- Ant Design
- AG Grid (probably overkill)

Free icons from FlatIcon and some personal graphics

Additional art, etc. credits to the AIC (Art Institute of Chicago) API
Potential img hosting: PixaBay

## API
- [ ] Get, (Add, Update, Delete) travel action items.
  - Endpoints exist but not all are in place from front end.
- [ ] Get, Add, Update, Delete expense items on the go. **Get/add/delete** done.
    - [x] CSV export.
     
## To dos
- [ ] Fix visual problems.
- [ ] Data entry.

Bonus round:
- [ ] User avatar/username selection (user item). Get req only for now.
- [ ] Additional art.
- [ ] Integrate better with Google maps.
- [ ] Checklist/todos (checklist item).
- [ ] Add activity rating field (under Update endpt)

## Requirements
Add your own db key in environment variables for the Netlify function.

## Future documentation/etc
Create wrapper for Netlify serverless function + Mongo Data API.

## WIP
[![wip-screens](https://i.postimg.cc/SKd99wnZ/wip-screens.png)](https://i.postimg.cc/SKd99wnZ/wip-screens.png)
