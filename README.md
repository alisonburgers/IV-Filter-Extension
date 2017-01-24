# IV Filter Extension
A Chrome Extension package of IV filtering on londonpogomap.com


Disclaimer: 
alisonburgers is not responsible for any damage or lost caused by the inaccuracy of any information. 


Download instructions: 
1. Clone or download then extract the files from the repository. 

2. Visit your Google Chrome "Extensions" under the "Tools" menu (or chrome://extensions/). 

3. Make sure the "Developer mode" checkbox on the top right-hand corner is checked. 

4. Click "Load unpacked extension…"" to pop up a file-selection dialog. 

5. Select the extension files named "pack" to load the extension. 

6. To filter Pokemon, click the extension icon once you are on the page, and click the "Filter" button on the pop-up. 


Important notes: 
- This extension has not been fully tested and debugged, especially on displaying Pokemon with 100% IVs. 
- This extension DOES NOT asychronously filter Pokemon. To update the filter, either click the filter button again (but only do so when new spawns are added) or refresh the page and filter again. 
- If no Pokemon is showing/Pokemon displayed incorrectly/page not responding, refresh the page and filter again. 
- Avoid selecting too many Pokemon on the filter to enhance performance. 
- The default filter threshold is 82% or above. You can edit it by changing the variable "iv_filter" in content_script.js (value is inclusive). 
- This extension only works for Google Chrome on desktop. 
