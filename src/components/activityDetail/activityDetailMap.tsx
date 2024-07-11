
import { Button } from "antd";
// import html2canvas from "html2canvas";
// import puppeteer from "puppeteer";

interface ActivityMapProps {

}

const ActivityMap = ({

}) => {

    // const snapAndDownload = async () => {
    //     const a = document.createElement('a');

    //     const browser = await puppeteer.launch({
    //         defaultViewport: {
    //           width: 1280,
    //           height: 2000,
    //         },
    //     });
        // const page = await browser.newPage();
        // await page.goto("https://nytimes.com");
        // await page.screenshot({ path: "nyt-puppeteer.png" });
        // // a.href = screencapture.to
        // // a.download = 'somefilename.jpg';
        // // a.click();

        // await browser.close();

        // const canvas = await html2canvas(document.body);

        // a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        // a.download = 'somefilename.jpg';
        // a.click();

    // }

    return (
        <>
        {/* <Button onClick={snapAndDownload}>Download </Button> */}
            <iframe id="ze-map" src="https://www.google.com/maps/d/u/0/embed?mid=15DOf-gL_MPnfIDNnJY6XNVldoCxLYRk&ehbc=2E312F&noprof=1" width="640" height="480"></iframe>
        </>
    )

}

export default ActivityMap;

/** need:
a way to get A and B
B = selected activity
A = derive from timeline, activity on preceding index when sorted by dateTime ascending

so it needs access to allTripActivities, or at least pass the preceding one in timeline

BUT the map url is individual to the ActionItem!
If we assume google maps everything, shouldn't it be at trip level?

then this map is accessed from activityviewer level


reliant currently on assumed google map

need to identify B on the map
need to identify A on the map

ideally provide some line/add line function

figure out or let user zoom a bit. but some destinations are v far apart.

take a screenshot that extends beyond screen
div must be way larger - not gonna fit in the page. overflow.

allow screenshot download.








//set a new default view for the google map
take screenshot programmatically

 */