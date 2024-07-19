# trip-organizer

A lightweight mobile-first, desktop-unfriendly app with serverless API that keeps important travel information accessible on the go, with the option to log expenses. Simple password lock.
The app is intended for use during the trip, not for the heavy planning stage.

Site is live but behind password lock.
Server functions not included in public repo.

## Features

-   Choose from list of trips to review, update, add, or delete activity information.
-   Add, review, update, delete trip expenses.
-   Review the trip and update review if desired.

## Tech

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

## To dos (not in issues)
Mostly moved into Issues section.
-   [x] Fix visual problems. **Ish?** Mobile only.
-   [ ] Data entry.
-   [ ] Clean up SCSS /repetitiveness.
-   [x] Timeline view for activities. Could be a nicer at-a-glance thing although I like the AG Grid functionality. Why not both.
-   [ ] Update graphics.
-   [ ] Integrate better with ~~Google maps~~ some map API.

## Early user feedback
- "I'm not sure initially what the categories mean. Is there an indicator or can I also define them?"
- "No one reads the help section."
- "I worry that wifi will not be reliable." It probably won't do well in those situations - need to allow some offline convenient downloading.
- "Most event apps are used for navigation/wayfinding -even showing /highlighting the destination in a convention center (for example) would be an improvement on the typical experience (providing a floor map PDF). Also, it's hard to find activities that are actually interesting to me - requires reviewing long lists of activities to customize my schedule."
    - The second part is not super relevant to this app but noted...
    - The navigation + offline needs is a problem I've kind of sidestepped (assuming the trip group created their own map resource, e.g., via Google Maps) but wanted to explore. Orientation problem: Where am I right now + where is that place ("where is it relative to me").*

*A deeper dive:
While there's Wifi - 
  - Snapshot/guess of last location (last activity on schedule)
  - Location of next planned activity (if it's a sidetrip not in timeline, you're out of luck)
  - Option for user get a snap of the two locations and download for offline access
  - What's the minimum useful size and level of detail? Can the map indicate a visual path or at least highlight points A and B, and key landmarks/streets/crossings?

### API

-   [x] Get, Add, Update, Delete travel action items.
-   [x] Get, Add, Update, Delete expense items on the go.
    -   [x] CSV export.
-   [ ] Get, Add, Update, Delete trip review.
    -   [x] Add activity rating field (under Update endpt). **Created as trip review**
    -   One per user per trip
    -   Only allowed if user is a participant role.
    -   \*\*Endpoints all done, from UI you can only add or update.
-   [ ] Make trip reviews visible to all.
-   [ ] Add role-based restrictions for trip updates.

**Latest updates**

-   Made trip_activities collection to conform with rest of collections.
-   Simplified endpoint definitions.
-   Created trip_reviews and flows to add and update trip review.

## Requirements

Running locally (front-end only instruction):

-   npm install
-   create sample data sets in /utils based on the interfaces defined

    -   sampleActivities
    -   sampleReviews (really just one document, not an array)
    -   sampleExpenses

-   npm run dev

Add your own API key in environment variables for the Netlify functions.

## Credits/Resources/Thanks
- lutangar/ cities.json - https://github.com/lutangar/cities.json
- TimeAPI - https://www.timeapi.io
- TheRealBarenziah / imgbb-uploader - https://github.com/TheRealBarenziah/imgbb-uploader



## Learnings

Mostly sticking to a consistent workflow/order of operations. General directory structure working from outside-in,

1. Define data structures (only two here). Even if the database doesn't enforce a schema, be consistent and work with TypeScript.
2. Define basic endpoints needed for API.
3. Write functions and test API with Postman.
4. Inside server directory (update your .gitignore), create front-end directories.
5. Design main workflows/pages. ~~This was essentially a single page app, with few enough conditionals that I didn't bother using React Router. **Mild regrets about this now.**~~ Fixed routing to use router. Should have plotted that out.
6. Write components and very wasteful (S)CSS.
7. Change your mind a few times about how to handle certain user flows.
8. Rewrite the build and deploy scripts.
9. Fiddle with the design for some hours using browser dev tools.
10. Deploy and check functionality.

If I had to restart,

-   I would not have ended up with two package.json ...
    I didn't end up getting the Vite dev environment to play more nicely with the serverless functions. Is Hono worth looking at?

-   Try a relational database.
    Mongo is familiar but the more I worked on this, the less it made sense that these documents were all together. Very repetitive storage and requesting.

## Future documentation/etc

Create wrapper for Netlify serverless function + Mongo Data API.

## V1
![trip-organizer_2](https://github.com/h-yung/trip-organizer/assets/102257735/f59d7681-b8a9-419c-9121-3e215fcc2e70)


