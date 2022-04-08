/*
loas posts, format, create anchors, create share links
on page load, if there is a # then cache it until after loading posts, then nav to it

assumes posts var is created and formatted corectly 

FORMAT: each post is an array
	first element is the post title/anchor id - unique
	following n elements are string segments that can be
		simple string
		html - must start with <
		array for link - format url then display text 

questions
how to support multiple links in a post?
can/should I limit to one link per post but aggregate all posts from a single day?
what is the format of a post entry?
could just be date followed by X segments, if a segment is an array then it is a link specification
then asse,ble just the text for a tweet and the text with links for display 
*/

function loadPosts (postList, postContainer) {
	var linkedPost = getLinkedPostFromUrl();

	for (let i = 0; i < postList.length; i++) {

	    var postPartsLength = postList[i].length;

		if ( postPartsLength > 1 ) {
			var titleID = postList[i][0];
			
			var postText = "";
			var tweetText = "";
			
		    for (let j = 1; j < postPartsLength; j++) {
		    	var postPart = postList[i][j];
		    	
	        	if (Array.isArray(postPart)) {
	        		postText += addLink(postPart);
	        		tweetText += postPart[1];
	        	}
	        	else {
	        		postText += postPart;
	        		
	        		if (!postPart.startsWith("<")) {
	        			tweetText += postPart;
	        		}
	        	}
	        	postText += " ";
	        	tweetText += " ";
			} 
			
			if ( tweetText.length > 280 ) {
				tweetText = tweetText.substring(0, 270) + "...";
			}
			
			if (linkedPost == titleID)
			{
				var fullPost = formatLinkedPost(titleID, postText, tweetText);
			
				postContainer.innerHTML = fullPost + postContainer.innerHTML;
			} 
			else {
				var fullPost = formatPost(titleID, postText, tweetText);
			
				postContainer.innerHTML += fullPost;
			}
	    }
	    else {
	    	console.log("BAD POST FORMAT: " + postList[i]);
	    }
	}	
}




function addLink(postPart) {
	return " <a href=\"" + postPart[0] + "\" target=\"_blank\">" + postPart[1] + "</a> ";
}


function formatLinkedPost (titleID, postText, tweetText) {
	var fullPost = "<header class=\"major\"><h3>" + titleID + "</h3><p>" + postText + "</p><p>";
	fullPost += formatShareLinks(titleID, tweetText);
	fullPost += "</p></header>";
	return fullPost;
}

function formatPost (titleID, postText, tweetText) {
	var fullPost = "<hr id=" + titleID + "><header><h3>" + titleID + "</h3><p>" + postText + "</p><p>";
	fullPost += formatShareLinks(titleID, tweetText);
	fullPost += "</p></header>";
	return fullPost;
}


function formatShareLinks(titleID, tweetText) {
	var postURL = encodeURIComponent(location.protocol + "//" + location.host + location.pathname + "#" + titleID);

	var shareLinks = "Share: " +
	"&nbsp" +
	"<a href=\"#\" onclick=\"shareOnFacebook('" + postURL + 
	"'); return false;\" class=\"icon brands alt fa-facebook-f\"><span class=\"label\">Share on Facebook</span></a>" + 
	"&nbsp" +
	"<a href=\"#\" onclick=\"shareOnTwitter('" + postURL + "', '" + tweetText + 
	"'); return false;\" class=\"icon brands alt fa-twitter\"><span class=\"label\">Share on Twitter</span></a>";
	
	return shareLinks;
}



function socialWindow(url) { 
    var left = (screen.width - 570) / 2; 
    var top = (screen.height - 570) / 2;
    var params = "menubar=no,toolbar=no,status=no,width=570,height=570,top=" + top + ",left=" + left;
    window.open(url,"NewWindow",params);
}

function shareOnFacebook(postURL) {
    url = "https://www.facebook.com/sharer.php?u=" + postURL;
    socialWindow(url);
    return false;
}

function shareOnTwitter(postURL, tweet) {
    url = "https://twitter.com/intent/tweet?url=" + postURL + "&text=" + tweet + "&hashtags=72rats";
    socialWindow(url);
    return false;
}


function  getLinkedPostFromUrl() {
	var navToID = "";

	if (location.href.indexOf("#") > -1) {
		navToID = location.href.split("#")[1];
	}
	
	return navToID;
}

function navToPost() {
	if (location.href.indexOf("#") < 0) {
		return false;
	}
	
	var navToID = "#" + location.href.split("#")[1];
		
    // target element
    var $id = $(navToID);
    if ($id.length === 0) {
        return false;
    }

    // top position relative to the document
    var pos = $id.offset().top;

    // animated top scrolling
    $('body, html').animate({scrollTop: pos});
}
