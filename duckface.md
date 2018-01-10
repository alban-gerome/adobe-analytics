Duckface
========

How to extract the entire Adobe Analytics footprint for a given page
--------------------------------------------------------------------

"Please tell me whether that link is tracked?" No problem, you open the Adobe Marketing Cloud debugger or your browser's DevTools network tab. "Now tell me everything that is tracked on that page". For the page view, I would use the Adobe debugger and for the interactions, I would grab the Custom Link report and breakdown by all props and eVars we use and hope it's not too many. I would not be able to tell which element on the page are tracked though.

Now you can, just load the page you want to test, copy my script at https://github.com/alban-gerome/adobe-analytics/blob/master/duckface and paste it in your browser's Javascript console. It works only on Chrome, it might work on IE soon, it breaks the new Firefox, I have not tried Safari or other browsers. Please note that the script can take a few minutes per test to run so please be patient but let me know if you run into bugs.

<a id="Table-of-contents"></a>
### Table of contents:
----------------------
* [Page view requests](#Pageviews)
* [Interaction requests](#Interactions)
* [HTML5 data- attributes](#HTML5)
* [Quick Quack](#Quack)
* [Decode raw requests](#Raw)
* [What is it useful for?](#Useful)


<a id="Pageviews"></a>
### Page view requests

By the time you run the script, the page view request has fired long ago already. There is a Javascript object in the global scope with a name starting with s_i_, sometimes followed by a number and a slash, then always followed by your visitor name space. Examples:

* s_i_barclaysuk
* s_i_0_barclaysuk

Every subsequent request on that page, such as a virtual page view will create another one of these variables with a _1, _2 suffix and so on:

* s_i_barclaysuk_1
* s_i_barclaysuk_2

These objects will return an img HTML tag with a src attribute which is the raw tracking request URL for yor page view. You will recognise the page name in your raw request and few others, the rest uses more compact names such as v0 instead of your campaign tracking code or c1 instead of prop1.

It is possible to take the entire raw request and decode it. In fact, that's exactly what the Adobe Marketing Cloud Debugger does. Duckface decodes your request and generates a JSON representation of your raw page view request.

[Back to the table of contents](#Table-of-contents)

<a id="Interactions"></a>
### Interaction requests

If you track a submit button click, you are tracking an interaction with a page element. This will also generate a Javascript object in the global scope. If you jumped right to here and this is unclear, I suggest you read the paragraph above about the page view requests.

The main difference here is that you might track many page element interactions. If we want to return the entire analytics footprint for a given page as a single JSON object, we need an array to group all the decoded interactions together.

The challenge here is how can we find elements that result in an image request? What Javascript events will trigger a tracking request? Here, Duckface uses a brute-force method: it will scan all HTML elements in the body of the page and fire 3 Javascript events on each one of them:

* blur - fires when a text field loses focus, this is a proxy for measuring when a text field was interacted with
* change - fires when a drop-down menu or a set of radio buttons was clicked
* click - does what it says on the tin, I would use it for links, buttons and checkboxes mostly

These 3 events should cover 99% of your tracking needs. If we simulate a click on a link and that link is tracked, we will have a JSON representing the decoded tracking request for that link when it is clicked in script output. If that link would result in a new page to load, you will stay on the same page. We only simulate the click, this also does not result in Adobe server calls either.

[Back to the table of contents](#Table-of-contents)

<a id="HTML5"></a>
### HTML5 data- attributes

HTML5 supports custom attributes with any name of your choice, provided that it starts with "data-". After running Duckface, the body tag of the page will gain a new "data-duckface" and many "data-duckface-*" attributes where "*" represents a data point of interest such as the page name for example and all your props and eVars etc. Duckface will also add similar attributes to all the page elements that are tracked. This way, you can simply inspect the element and see if it is tracked and with which values.

After running Duckface, the line of code below will return an array of all elements that would fire an interaction request:

<pre><code>
  document.querySelectorAll("[data-duckface]");
</code></pre>

This code snippet below will draw a 1px black border around the page elements that Duckface has found:

<pre><code>
  [].map.call(document.querySelectorAll("[data-duckface]"), function(a){
    a.style = "border:1px solid black"
  });
</code></pre>

Here are the jQuery equivalents of the code snippets above:

<pre><code>
  $("[data-duckface]");
</code></pre>

<pre><code>
  $("[data-duckface]").css({border:"1px solid black"});
</code></pre>

[Back to the table of contents](#Table-of-contents)

<a id="Quack"></a>
### Quick Quack

Imagine you want to inspect an element and see if it's tracked. If the page element is tracked indeed you will see plenty of HTML5 data- attributes starting with "data-duckface". It's hard too read so point at the element with your mouse and try Shift + Right-Click instead. It will show these attributes and their values as a nice table in the Javascript console. Again, this only works on Chrome.

[Back to the table of contents](#Table-of-contents)

<a id="Raw"></a>
### Decode raw requests

You can pass a string or an array of strings as a parameter for Duckface, right at the end of the code between the last pair of brackets. Duckface will decode the request or requests for you:

Single raw request example:

<pre><code>
      return ll.length==1 ? ll[0] : ll;
    };
  })("https://smetrics.barclays.co.uk/b/ss/barukalbandev/1/H.25.1/s14473374245718?AQB=1&ndh=1&t=15%2F3%2F2017%2012%3A33%3A0%206%20-60&ns=barclaysuk&cdp=3&pageName=onl%3Alogon%3ALogonLogin%3AStep1WhoAreYouLoginMyBarclays&g=https%3A%2F%2Fbank.barclays.co.uk%2Folb%2Fauth%2FLoginLink.action&r=http%3A%2F%2Fwww.barclays.co.uk%2FPersonalBanking%2FP1242557947640&cc=GBP&ch=UKRBB&server=bank.barclays.co.uk&events=event20&c1=onl&c2=onl%3Alogon&v2=Repeat&c3=onl%3Alogon%3ALogonLogin&c5=38&c6=12%3A30PM&v6=12%3A30PM&c7=Saturday&v7=Saturday&c8=Weekend&v8=Weekend&c16=%2Folb%2Fauth%2FLoginLink.action&v36=MembershipID&v39=D%3Ds_vi&v41=onl%3Alogon%3ALogonLogin%3AStep1WhoAreYouLoginMyBarclays&h1=onl%3Alogon%3ALogonLogin&s=1920x1080&c=24&j=1.6&v=N&k=Y&bw=1225&bh=961&p=Widevine%20Content%20Decryption%20Module%3BChrome%20PDF%20Viewer%3BNative%20Client%3B&AQE=1");
</code></pre>

Two raw requests example:

<pre><code>
      return ll.length==1 ? ll[0] : ll;
    };
  })(["https://smetrics.barclays.co.uk/b/ss/barukalban/1/H.25.1/s14473374245718?AQB=1&ndh=1&t=15%2F3%2F2017%2012%3A33%3A0%206%20-60&ns=barclaysuk&cdp=3&pageName=onl%3Alogon%3ALogonLogin%3AStep1WhoAreYouLoginMyBarclays&g=https%3A%2F%2Fbank.barclays.co.uk%2Folb%2Fauth%2FLoginLink.action&r=http%3A%2F%2Fwww.barclays.co.uk%2FPersonalBanking%2FP1242557947640&cc=GBP&ch=UKRBB&server=bank.barclays.co.uk&events=event20&c1=onl&c2=onl%3Alogon&v2=Repeat&c3=onl%3Alogon%3ALogonLogin&c5=38&c6=12%3A30PM&v6=12%3A30PM&c7=Saturday&v7=Saturday&c8=Weekend&v8=Weekend&c16=%2Folb%2Fauth%2FLoginLink.action&v36=MembershipID&v39=D%3Ds_vi&v41=onl%3Alogon%3ALogonLogin%3AStep1WhoAreYouLoginMyBarclays&h1=onl%3Alogon%3ALogonLogin&s=1920x1080&c=24&j=1.6&v=N&k=Y&bw=1225&bh=961&p=Widevine%20Content%20Decryption%20Module%3BChrome%20PDF%20Viewer%3BNative%20Client%3B&AQE=1"],["https://smetrics.barclays.co.uk/b/ss/barukalban/1/H.26.2/s6314638176922?AQB=1&ndh=1&t=9%2F0%2F2018%2019%3A13%3A22%202%200&fid=1B6B0CA9FF5E8C37-3D357280C4A224EA&ns=barclaysuk&cdp=3&pageName=Personal&g=https%3A%2F%2Fwww.barclays.co.uk%2F&cc=GBP&ch=UKRBB&server=www.barclays.co.uk&events=event20&c1=Personal&v2=Repeat&c5=100&c6=7%3A00PM&v6=7%3A00PM&c7=Tuesday&v7=Tuesday&c8=Weekday&v8=Weekday&c16=%2F&c18=Personal&c34=203038735379&c39=Public&v39=D%3Ds_vi&v41=Personal&c50=9-Jan-2018%2019%3A13&c70=https%3A%2F%2Fwww.barclays.co.uk&v73=%2F&s=1920x1080&c=24&j=1.6&v=N&k=Y&bw=821&bh=949&p=Chrome%20PDF%20Plugin%3BChrome%20PDF%20Viewer%3BNative%20Client%3BWidevine%20Content%20Decryption%20Module%3B&AQE=1"]);
</code></pre>

[Back to the table of contents](#Table-of-contents)

<a id="Useful"></a>
### What is it useful for?

Now you can easily audit a page or a collection of pages by either going to the page itself or by asking your developers to provide with the evidence that they have implemented all your tracking requirements.

The developers can now run Duckface before pushing changes live and see everything that would be tracked on the page and compare the output with the tagging guide. Ideally, your tagging could exist in JSON format and you could find additional scripts that would compare the JSON of your tagging guide with the JSON produced by Duckface. Unless the comparison shows a perfect match, the developers should get back to you for advice on how to fix the discrepancies.

[Back to the table of contents](#Table-of-contents)

Alban Gérôme
9 Jan 2018

Follow me on Twitter: <a href="https://twitter.com/albangerome?lang=en-gb" title="Follow Alban Gérôme on  Twitter">@albangerome</a>
