// chrome.browserAction.onClicked.addListener(function(tab) {
//   // Send a message to the active tab
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     var activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
//   });
// });

// This block is new!
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     	alert('tung');
//     if( request.message === "open_new_tab" ) {
//       chrome.tabs.create({"url": request.url});
//     }
//   }
// );
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.message === "sub" ) {
			chrome.tabs.query({}, function(tabs) { 
				for(i = 0; i<tabs.length; i++){
					if(tabs[i].title.indexOf('Jisho.org') != -1) {
						chrome.tabs.update(tabs[i].id, {"url": request.url});
						break;
					}
				}
			 } );
		}
		if( request.message === "tran" ) {
			chrome.tabs.query({}, function(tabs) { 
				for(i = 0; i<tabs.length; i++){
					if(tabs[i].title.indexOf('Google Dịch') != -1) {
						chrome.tabs.update(tabs[i].id, {"url": request.url});
						break;
					}
				}
			 } );
		}
		if( request.message === "texttran" ) {
			chrome.tabs.query({}, function(tabs) { 
				for(i = 0; i<tabs.length; i++){
					if(tabs[i].title.indexOf('Jisho.org') != -1) {
						chrome.tabs.sendMessage(tabs[i].id, {"message": "texttran", "textvi" : request.textvi, "texten" : request.texten});
						break;
					}
				}
			 } );
		}
		if( request.message === "totungviolet" ) {
			chrome.tabs.query({}, function(tabs) { 
				for(i = 0; i<tabs.length; i++){
					if(tabs[i].title.indexOf('tungviolet.com') != -1) {
						chrome.tabs.sendMessage(tabs[i].id, {"message": "totungviolet",
							"textvi" : request.textvi, 
							"texten" : request.texten, 
							"hiragana" : request.hiragana, 
							"kanji" : request.kanji, 
							"ex" : request.ex
						});
						break;
					}
				}
			 } );
		}
	}

);

// var tabID = 551;
// chrome.tabs.query(  {}, function(tabs) {

// 				for(i = 0; i<tabs.length; i++){
// 					alert(tabs[i].title);
// 				}
// });
//chrome.tabs.get(2, function (){});
