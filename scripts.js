function clean() {
	//var srcURL = document.getElementById("url").value;
	
	var url = document.getElementById("url").value;
	
	var originalLength = url.length;
	
	//window.alert("Cleaning string: " + url);
	
	var reduction = 10; // to ensure that first cycle runs normally...
	
	
	var cleaned = ""
	while (reduction > 0) {
			
		cleaned = cutTracking(url);
		//window.alert("cleaning " + url + " to " + cleaned);
		//window.alert("cleaning more. url: " + url + " and cleaned: " + cleaned);
		reduction = url.length - cleaned.length;
		url = cleaned;
		//window.alert("reduction was : " +reduction);
	}
			
		
	if (originalLength == url.length) {
		
			window.alert("No tracking id pattern found from URL!")
			updateStatus("No tracking id pattern found from URL!");
		}
		else {
			writeURL(url);
			updateStatus("URL was cleaned");
		}
	
}

function cutTracking(url) {
	
	var tracking = hasTracking(url);
	//window.alert("Tracking id found: " + tracking);
	if (tracking.length > 0) {
		var trackingStart = url.indexOf(tracking);
		
		if (url[trackingStart - 1] == "&") {
			trackingStart--;
			//window.alert("Deleting extra & away");
		}
		
		var offset = trackingStart + tracking.length;
		var trackingEnd = url.indexOf("&", offset);
		
		var remaining = url.substring(0, trackingStart);
		
		if (trackingEnd > 0) {
			remaining += url.substring(trackingEnd, url.length);
		}
		
		return remaining;
	}
	
	return url;
	
}

function hasTracking(url) {
	var filterRAW = document.getElementById("filters").value;
	var filters = filterRAW.split("\n");
	
	for (let i = 0; i < filters.length; i++) {
		//window.alert("What is this");
		let position = url.indexOf(filters[i]);
		
		if (position > 0 ) {
			return filters[i];
			
		}
		
	}
	
	return "";
	
	
}

function copy() {
	
	textString = document.getElementById("cleaned");
	
	textString.select();
	
	textString.setSelectionRange(0,99999);
	
	navigator.clipboard.writeText(textString.value);
	
	updateStatus("Copied to clipboard!");
	
}

function writeURL(url) {
	document.getElementById("cleaned").value=url;
	
}

function updateStatus(string) {
	document.getElementById("status").value = string;
}