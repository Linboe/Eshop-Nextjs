## Ticket 01: setup

> /implement ticket 01

**The answer:** Went well. 

**Changes:** At first, /db-check returned 404 because we had suggested the page but hadn’t created it. We added it, and it now lists products; it’s just a connection check, so it doesn’t display images. The test, build and lint all pass, and we verified the test fails when given an incorrect expected status. 
