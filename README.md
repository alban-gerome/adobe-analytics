MeasureCamp London X - Mar 25th 2017
====================================

3 scripts for Adobe Reports & Analytics and DTM
-----------------------------------------------

### Show the URLs in the pages report with a bookmarklet

The Reports & Analytics interface has gone through a radical facelift in the past few years. The underlying architecture also seems to have changed and now uses:

* React.js - a Facebook framework to speed up rendering
* AngularJS - a Google framework to replace full page loads with partial page updates
* jQuery - now you're talking!

The pages report shows a ranking of the top pages identified by a friendly page name and their page views. If your page name matches a single page you can click on a page name in the report. Instead of showing the page it will show a contextual menu. One of the options is for previewing the page in a pop-up. If you need to check only a few pages this is fit for purpose but not for dozens.

Interestingly these page name links are ordinary links with a URL, the default URL associated to that page name, is the one displayed in the pop-up. You could right-click on the page name and open the page in a new tab but that's only marginally better than the preview pop-up option. The report is just a HTML table so we can:

* grab the cells with a page name link
* split each cell into 2 cells, one with the original page name link and one with the URL
* turn the script into a bookmarklet

The code for the bookmarklet is here:

https://github.com/alban-gerome/adobe-analytics/blob/master/show-page-name

To create the bookmark do this:

* Bookmark any page in your browser
* Place the bookmark in your bookmarks toolbar, make sure that the toolbar is visible
* Edit the URL and replace it with the one above starting with "javascript:void..."

Please note that exporting the report will not add the URLs to the exported report. Use a browser extension that lets you export HTML tables into CSV for example. Here's one for Chrome: https://chrome.google.com/webstore/detail/table-capture/iebpjdmgckacbodjpijphcplhebcmeop?hl=en


### Developers-friendly debugger for Reports & Analytics

The Adobe DigitalPulse Debugger is an amazing tool but if you are using multiple Adobe tools such as Target on top of Reports & Analytics, many interactions etc it can quickly become a little too verbose. There's also a max limit on how many requests it can display, just under 100 I think.

At the heart of the Adobe DigitalPulse Debugger is a collection of Javascript objects based on the _s.visitorNamespace_ property. If your website is tagged with Adobe Analytics, try this:

* open the Javascript console in your browser devtools
* type "s.visitorNamespace"
* now type "s_i_" and your console might suggest variable names starting with "s_i_" followed by the value of s.visitorNamespace

If you try this on a page with interactions and triggered some of them you will get a collection of them. Example:

barclaysuk // value of my s.visitorNamespace property

* s_i_barclaysuk
* s_i_barclaysuk_1
* s_i_barclaysuk_2
* s_i_barclaysuk_3

Each of these variables contain an img tag and the value of the src attribute is your image request. The Adobe DigitalPulse Debugger simply decodes them and displays them nicely.

When I give a tagging guide to the developers I give them a spreadsheet where each row can be a bunch of tracking requirements for a single page view or a single page element interaction. I ask the developers to provide evidence that the code was displayed, i.e. the raw image request. Unfortunately they often provide me with the requests for another tracking requirement so I have to reorder them, get rid of the duplicate raw requests and see what's missing. Eventually I wrote code that returns a JSON object showing clearly whether this is a page view or a page element interaction and which sort of interaction it was. The code is here:

https://github.com/alban-gerome/adobe-analytics/blob/master/SC-debugger

Now this debugger can run in 2 modes:

* You have the raw image request - the script will decode it for you and return a JSON object
* You are on the page you need to test - the script will return an array of all the image requests that the page has fired. The array contains the decoded image requests, one JSON object per request

Now the developers can see immediately whether the code is firing and what sort of request they are looking at. It's also great to educate people on how the data gets packaged up and sent to Adobe.


### DTM debugger (Google Chrome only)

The DTM debugger is useful but very limited I think. I was wasting a huge amount of time beautifying the satelliteLib file to find which scripts were associated to which rules and then checking back in my network tab whether these had loaded and what was the URL of the marketing pixel in these DTM files.

At about the same time I was reading something on _console.table()_ as an alternative to _console.log()_ and presto I was typing things like _console.table(\_satellite.pageLoadRules)_ and thought it was quite nifty. You can even sort the table by a column of your choice!

Now the script I used for my demo at MeasureCamp would only work on the websites in my work remit. It seems that the code does not work for some of you so please start with this simplified version below. It will display for every row the details of each _satellite-*.js_ script.

https://github.com/alban-gerome/adobe-analytics/blob/master/DTM-debugger-mini

* (index) : _satellite-*.js_ file name for all non-sequential content or a numeric index for sequential content
* Rule Name : This is the same of the rule the _satellite-*.js_ file belongs to
* Type : _Page Load Rule_, _Direct Call Rule_ or _Event Based Rule_
* Conditions Met? : This indicates whether the condition in your rule were met and your content was served. Content served and the tag working are two distinct things. You might be serving a marketing pixel but the URL is incorrect
* Event : _pagebottom_, _pagetop_, _domready_, _load_
* Command : _loadBlockingScript_, _loadScript_, _loadIframe_, _writeHTML_, this will depend on what you selected in DTM, i.e. _sequential Javascript_, _non-sequential Javascript_, _sequential HTML_ and _non-sequential HTML_
* Loading Type : _sequential_ or _non-sequential_
* Script URL : absolute URL of the _satellite-*.js_ file, if the URL is longer than 100 characters the file name will be truncated and an ellipsis character will be displayed in the middle. _console.table_ can only show 100 characters per table cell 

You can customise the output at the end of the code:

* showPageLoadRules : set to _true_ if you need to see page load rules, _false_ to hide them, _undefined_ if you don't care
* showEventBasedRules : same as above but for event-based rules
* showDirectCallRules : same as above but for direct call rules

Set all 3 properties to _true_ to see the information for all  _satellite-*.js_ files.

The script I presented at MeasureCamp supported more features and provided more information such as:

* show whether the satellite file had loaded, the HTTP status code
* show parts of the marketing pixel URL in the satellite file
* show only certain types or rules, or the ones that did not fire or where the satellite file could not be found
* show only the columns you need, or the top 10 rows or the last 20

The code is here:

https://github.com/alban-gerome/adobe-analytics/blob/master/DTM-debugger

Here are the options you can play with:

* columns - put in an array the names of the columns you need or set to _undefined_ if you want them all but go buy a wider screen first
* fromRow - from row number
* untilRow - until row number
* showPageLoadRules - set to _true_ if you need the the page load rules, _false_ if not
* showEventBasedRules - set to _true_ if you need the the event-based load rules, _false_ if not
* showDirectCallRules - set to _true_ if you need the the direct call rules, _false_ if not
* showNotFiredOnly - set to _true_ to show only the rules that did not fire or _false_ to remove them or _undefined_ if you don't care
* show404NotFoundOnly - set to _true_ to show only the satellite files that returned a 404 -not found HTTP error or _false_ to remove them or _undefined_ if you don't care

Here are the columns available, some might not work for you as the contents of your satellite files will be different

* Index - row number, always there, can't be removed
* Rule type - which type of rule the satellite file belongs to, i.e. a page load, event-based or direct call rule
* Name - the name of the rule the satellite file belongs to
* Has fired? - the rule condition was met. The satellite file may contain additional conditions that were not met. This column only concerns the rule conditions
* Event - the type of event, only for event-based rules
* Loading Type - sequential or non-sequential
* Command - can't remember, never used that column
* Scope - the conditions applied to the rule, not the ones in the satellite files
* Script URL - satellite file absolute URL
* Script Content - satellite file content peek, 100 characters only
* Script HTTP Status - satellite file status code
* Script Img URL - peek at the URL of the marketing pixel in the satellite file, 100 characters only
* Script Img Domain - domain of the URL of the marketing pixel in the satellite file
* Script Img Path - path of the URL of the marketing pixel in the satellite file
* Script Img Query - query string of the URL of the marketing pixel in the satellite file
* Script Img Hash - hash of the URL of the marketing pixel in the satellite file

One thing to note is that this script needs jQuery. Also you may run into cross-domain errors and get no information about the contents of the satellite file such as the HTTP status code. These are not show-stoppers, use these:

* add jQuery on any page on your local machine: http://www.learningjquery.com/2009/04/better-stronger-safer-jquerify-bookmarklet
* temporarily disable cross-domain errors on your local machine: https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en (Chrome only)

I am making this DTM debugger into a Chrome extension so watch this space. _console.table_ is amazing but you cannot display more than 100 characters per cell. This is one of the reasons why I have so many columns.
