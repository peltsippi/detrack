# detrack

_The U.S. government "kill[s] people based on metadata," ... , according to former head of the National Security Agency Gen. Michael Hayden.
https://abcnews.com/blogs/headlines/2014/05/ex-nsa-chief-we-kill-people-based-on-metadata_

Remove tracking parameters from URLs

Simply copy the files to a web server of your choosing. All you need to have is ability to host static files (or just copy them to your device locally).

Get also the file data.min.json from https://github.com/ClearURLs/Addon/ and copy it to document root
+ modify index.html url to match your own url to prevent security issues with fetch method...

Deployed to http://detrack.perunat.eu if someone wants to test it out.

Now local mode is available. Just download local.html and scripts.js and store to same folder and open with your web browser

21.6.2026: significant improvements - uses data.min.json patterns directly to ensure updates can be made smoothly. 

BYOCSS for now.
