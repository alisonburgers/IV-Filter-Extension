var iv_filter = 82;

var x = document.getElementsByClassName("leaflet-zoom-animated leaflet-interactive");
for (i in x) {
	try {
		x[i].click();
		var popups = document.getElementsByClassName("leaflet-popup-content");
		var content = popups[i].innerHTML;
		var end = content.indexOf("%");
		if (end > 0) {
			var iv_str;
			if (content.charAt(end - 3) == "1") {
				iv_str = content.substring(end - 3, end);
			} else if (content.charAt(end - 2) == "(") {
				iv_str = content.substring(end - 1, end);
			} else {
				iv_str = content.substring(end - 2, end);
			}
			var iv_int = parseInt(iv_str);
			if (iv_int < iv_filter) {
				x[i].style.display = "none";
			}	
		}
	} catch(e) {
		console.log("Error at " + i.toString());
	}
}