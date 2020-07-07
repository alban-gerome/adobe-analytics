MeasureCamp London - Jul 11th 2020
====================================

Spicy Javascript - Your first Chrome Extension for Web Analytics QA
-------------------------------------------------------------------

<a id="Table-of-contents"></a>
### Table of contents:
----------------------
* [Which files do you need](#Dependencies)
* [How to Use](#HowToUse)


<a id="Dependencies"></a>
### Which files do you need

You will need these 6 files below:

* https://github.com/alban-gerome/adobe-analytics/blob/master/manifest.json
* https://github.com/alban-gerome/adobe-analytics/blob/master/content2.js
* https://github.com/alban-gerome/adobe-analytics/blob/master/background2.js
* https://github.com/alban-gerome/adobe-analytics/blob/master/duckface2.html
* https://github.com/alban-gerome/adobe-analytics/blob/master/duckface2.js
* https://github.com/alban-gerome/adobe-analytics/blob/master/duckface2.css

Copy them all into a single folder then open Chrome and go to chrome://extensions. You will need to pack the extension files by pointing Chrome to the folder where you saved the files. You should see a new icon appear to the right of your browser location bar, a black flying duck against a white background.

Then open a page that runs Adobe Launch, setting it up in debug mode can be a good idea as it will give you Launch rule names that fired or not. You can switch on the debug mode with:

    _satellite.setDebug(true);

<a id="HowToUse"></a>
### How to Use

Then pick a rule name you want to investigate further, copy the rule name and click on the flying duck icon. Paste the rule name into the box and submit. The text field also accepts the unfriendly rule name. They all start with "RL", you can find them in the Adobe Launch embed tag source code in the rules array or under:

    _satellite._container.rules.map(a => a.id);

Alban Gérôme
07 Jul 2020

Follow me on Twitter: <a href="https://twitter.com/albangerome?lang=en-gb" title="Follow Alban Gérôme on  Twitter">@albangerome</a>
