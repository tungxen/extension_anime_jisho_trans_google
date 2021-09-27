function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;
	localStorage.setItem('copy', JSON.stringify(text));
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}
var itemjson = {"hiragana": "", "kanji": "", "en": "", "vn": "","ex": ""};
$(document).on('dblclick', '.concept_light-representation', function(){
	var string = $(this).find('.furigana').text().trim() + '\t' + $(this).find('.text').text().trim() + 
			'\t' +$(this).parents('.concept_light').find('.meaning-meaning').eq(0).text().trim();
	itemjson = {hiragana: $(this).find('.furigana').text().trim(),
				kanji : $(this).find('.text').text().trim(),
				en : $(this).parents('.concept_light').find('.meaning-meaning').eq(0).text().trim(),
				vn: "",
				ex : $('#keyword').val().trim(), 
			}
	$('#texttran').val('');
	var url = 'https://translate.google.com/#view=home&op=translate&sl=en&tl=vi&text='+ $(this).parents('.concept_light').find('.meaning-meaning').eq(0).text().trim();
	chrome.runtime.sendMessage({"message": "tran", "url": url});
	copyTextToClipboard(string);
 });
// chrome.tabs.getCurrent(function (tab) {
//   //Your code below...
//   var tabUrl = encodeURIComponent(tab.url);
//   var tabTitle = encodeURIComponent(tab.title);
//   var myNewUrl = "https://www.mipanga.com/Content/Submit?url=" + tabUrl + "&title=" + tabTitle;
//   console.log(myNewUrl);
//   //Update the url here.
//   chrome.tabs.update(tab.id, {url: myNewUrl});
// });
//window.location = 'https://developer.chrome.com/extensions/manifest';
$('#video').on('pause', function() {
  //Actions when video pause selected
  	var sub = $('#targettrack').text();
  	if (sub.trim() != '') {
  		var url = 'https://jisho.org/search/' + encodeURIComponent(sub.trim());
		chrome.runtime.sendMessage({"message": "sub", "url": url});
		//chrome.runtime.sendMessage({"message": "sub", "url": 'https://jisho.org/search/'});
  	}
});

if (window.location.hostname == "translate.google.com") {
	setTimeout(function () {

		var en = $('textarea').first().val();
		var vi = $('.VIiyi>span>span').text();
		chrome.runtime.sendMessage({"message": "texttran", "textvi": vi, "texten": en,});
	}, 1000);
}
var json = '';
if (window.location.hostname == "jisho.org") {
	chrome.storage.local.get(null, function(data) {
		json = data.json;
		console.log(json);
		if (typeof json != "object") {
			json = [];
		}
	});

	$('BODY').append('<div style="position: fixed; left: 0; bottom: 0; width: 100%; font-size: 20px;"><button id="confirm">saveItem</button><button id="saveLocal">save</button><button id="getjson">getjsonfile</button><button id="clearjson">clear</button><textarea style="font-size: 20px;" id="texttran"  rows="4" cols="50"></textarea></div>')
	$('#confirm').click(function(){
		chrome.runtime.sendMessage({"message": "totungviolet", "textvi": itemjson.vn, "texten": itemjson.en,
			'hiragana': itemjson.hiragana, 'kanji': itemjson.kanji, 'ex' : itemjson.ex
		});
	});
	$('#getjson').click(function(){
		download('jp.json', JSON.stringify(json));
	});
	$('#clearjson').click(function () {
		if (confirm('clear')) {
			chrome.storage.local.clear(); 
		}
	})
	$('#saveLocal').click(function(){
		chrome.storage.local.set({'json': json});
	});
	
	let indexcurrent = 1;
	var el_zen_bar = $('#zen_bar');
	var el = el_zen_bar.find('li:nth-child(' + indexcurrent + ')');
	$(document.body).keydown(function(e) {
		if (e.target.tagName == 'BODY' || e.target.tagName == 'A') {
		  var allel = el_zen_bar.find('li');
		  var arrow = { left: 37, up: 38, right: 39, down: 40 };
		  switch (e.which) {
		    case arrow.left:
		      if(indexcurrent > 1) {
		      	indexcurrent--;
		      }
		    	el = el_zen_bar.find('li:nth-child(' + indexcurrent + ')');
					allel.removeAttr("style");
		    	if(el.length) {
						el.css('font-size', '1.9em');
		    	}
		      break;
		    case arrow.up:
		      //..
		      break;
		    case arrow.right:
		      indexcurrent++;
		    	el = el_zen_bar.find('li:nth-child(' + indexcurrent + ')');
					allel.removeAttr("style");
					if(el.length) {
						el.css('font-size', '1.9em');
		    	}
		      
		      break;
		    case arrow.down:
		      //..
		      break;
		  }
		}
	  if (e.which == '13') {
	  	if(el.find('a').hasClass('current')) {
	  		$('.concept_light-representation').dblclick();
	  	} else {
				el.find('a')[0].click();
	  	}
	  }
});
} 


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "texttran" && itemjson.en == request.texten) {
    	$('#texttran').val(itemjson.kanji + '\n' + request.texten + '\n' + request.textvi);
    	itemjson.vn = request.textvi;
      //alert(request.text)
    }
    if( request.message === "totungviolet") {
    	$('textarea').eq(0).val(request.textvi);
    	$('textarea').eq(1).val(request.texten);
    	$('textarea').eq(2).val(request.hiragana);
    	$('textarea').eq(3).val(request.kanji);
    	$('textarea').eq(4).val(request.ex);
    }
  }
);
