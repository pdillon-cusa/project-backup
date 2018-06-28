// In here should go any custom js that is not delivered to us as part of the wireframes
// This way the file 'main.js' will always contain an exact copy of the wireframe js file and can be safely overwritten in case of updates
// without losing any custom js that is added by the portlet developers

// Here the defaults are configured for the jQuery validation plugin that we are using for form validation
// Any customization can be done in the specific js file for each portlet if needed
var formValidationDefaults = {
	errorClass: 'cf-error',
	validClass: 'cf-valid',
	onfocusout: false,
	onkeyup: false,
	onclick: false,
	focusInvalid: false
};

$(document).ready(function() {
	
//	var textBlock = $('.ribbon p');
//	var maxWords = 160;
//
//	textBlock.each(function(){
//
//			var textArr = $(this).html().trim().split(/\s+/);
//			var wordCount = textArr.length;
//
//			if (wordCount > maxWords) {
//					text_less = textArr.slice(0, maxWords).join(" ");
//					text_more = textArr.slice(maxWords, wordCount).join(" ");
//			}
//			else return;
//
//			$(this).html(
//					text_less + '<span> .... </span><a href="#" class="blockExpand"><i class="fa fa-angle-double-right"></i></a>'+
//					'<span style="display:none;">'+ text_more +' <a href="#" class="blockCollapse"><i class="fa fa-angle-double-left"></i></a></span>'
//			);
//	});
//	
//	$('a.blockExpand', textBlock).click(function(event){
//	event.preventDefault();
//	$(this).hide().prev().hide();
//	$(this).next().show();
//});
//
//$('a.blockCollapse', textBlock).click(function(event){
//		event.preventDefault();
//		$(this).parent().hide().prev().show().prev().show();
//});
	
	// All zipcode fields that have class 'extzipcode' should be using a mask for 5[+4]
	$('.extzipcode').mask('00000-0000', {placeholder: "_____-____"});
	// All phoneNumbers fields that have class 'maskedphone' should have an US phone mask
	 $('.maskedphone').mask('(000) 000-0000');
	 
		
		//reg ex for avoid specific special characters in the keypress event
		$(document).on("keypress", "input[type='text']:not(.skipSqlFiltering)" ,function(e){
			var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
			if(/[*%_\\=\[\]\{\}]/.test(str)){
				return false;
			}
			else{
				return true;
			}
			});
		
		// Based on phonetype show/hide the extension field
		 $(document).on("change", ".phonetype-select", function(){
		       var comId = this.id;
		       var phoneType = $("#"+comId).val();
		
		       if(phoneType!=null)
		       {
		    	var obj = $(this).parent().next().next().find('.ext');
	     	      if(phoneType=='Mobile Telephone')
		    	  {
	    	    	  obj.hide();
		    	      obj.next().hide();
		    	   }else
		    	       {
		    	    	     obj.show();
			    	    	  obj.next().show();
		    	        }
		          }
		 
		    });
		
		//making all dropdowns default lable as Select
		 $.map($('select option'), function(e) {
			  
			  if(e.value==-1){
			    
			    e.text = 'Select';
			  }
			   
		});
		//reg ex for avoid specific special characters in the onBlur event
		$(document).on("blur", "input[type='text']:not(.skipSqlFiltering)" ,function(e){
			var target = $(e.target);
			target.val(function() {
				  return target.val().trim().replace(/[*%_\\=\[\]\{\}]/g,'').replace(/\s\s+/g, ' ').trim();
			});
			});
	
	 
	
	//Numbers only check
	$(document).on('keypress','.numberonly', function (e){
	  if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
	    return false;
	  }
	});
		
	$('.alphanumeric').keypress(function (e) {
		if(e.which == '8'){
			return true;
		}
	    var regex = new RegExp("^[a-zA-Z0-9]+$");
	    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
	    if (regex.test(str)) {
	        return true;
	    }
	    e.preventDefault();
	    return false;
	});
	
	//Search typeahead	
	if ($('#search-button').length){
	    $('#search-button').typeahead({
	    	autoSelect: false,
			minLength: 3,
	 	 	source: function (query, process) {
	 	 		$("#search-dropdown").hide();
	 	 		var terms = [];
		 		if(query.length < 3){
	 	 			process(terms);
	 	 			return;
	 	 		}
		 		$.get( "/NewWebThemeDynamic/themes/html/searchTypeahead.jsp", { searchText: Utils.normalize(query)+"*" } )
		 		.done(function( data ) {	    	 		
	    	 		$(data).find("autnresponse").find("responsedata").find("autn\\:hit,hit").find("autn\\:content,content").find("DOCUMENT").each(function() {	    	 			
		        		terms.push($(this).find("DRETITLE").text());
		        	});	    	 		
	    	 		process(terms);
	    	 		$('.typeahead.dropdown-menu').width("140%");
		 		});
		 	},
		 	matcher: function(item) {
    	    	if (item) {    	    		
    	    		var title = Utils.normalize(item);
  	    	      
        	        var queryRegExp = new RegExp(Utils.normalize(this.query), 'gi');
        	        if (title.match(queryRegExp) != null) {    	        	
        	        	return true;
        	        }
    	    	}
    	    	
    	    	return false;
    	    },
    	    highlighter: function(item) {     	    			    	
  	    	  query = Utils.denormalize(this.query);
  	    	  
  	    	  return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {		    		  
  	    	    return '<strong>' + match + '</strong>';
  	    	  });
  	    	}
	 	});
	}
	
	$('#search-form').on('submit', function(e) {
		if ($('#search-button').val() == '') {
			return false;
		}
	});
	
	$.fn.extend( {
        limiter: function(limit, elem) {
            $(this).on("keyup focus", function() {
                setCount(this, elem);
            });
            function setCount(src, elem) {
                var chars = src.value.length;
                if (chars > limit) {
                    src.value = src.value.substr(0, limit);
                    chars = limit;
                }
                elem.html( chars );
            }
            setCount($(this)[0], elem);
        }
    });
	
	$('#logout-link').click(function(e) {	
		setCookie('continueUrl', window.location.href, 1);	    
	});

});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();    
    document.cookie = cname + "=" + cvalue + "; " + expires + ";domain=.canon.com;path=/";    
}

function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}


//This is for task 2537. Change place holder search button text and set current tab for search
function updatePlaceHolder(id, newPlaceHolder) {
	$("#searchTab").val(newPlaceHolder.toLowerCase());
	$("#"+id).attr("placeholder", "SEARCH " + newPlaceHolder).focus().blur();
	
	//Coremetrics call
	CoreMetricsWrapper.createElementTag(newPlaceHolder, 'Theme Search bar placeholder change');
}


function reportProductFinderCoreMetrics(selectedTabName, model) {
	
	if (model.path != null && model.path != '') {
		var pathElements = model.path.split('/products/');
		
		if (pathElements.length > 1) {
		   var path = pathElements[1].split('/');
		   pageView.attributes.attr15 = selectedTabName;
			pageView.attributes.attr16 = '1';
			pageView.attributes.attr17 = path[0];
			pageView.attributes.attr18 = path[1];
			pageView.attributes.attr19 = model.title;	
			CoreMetricsWrapper.reportPageCategory(); 
		}
	}
	
}

function filterPhoneNumberInputs(classToFilter){
	$('.'+classToFilter).each(function(){
		$(this).val(function() {
			  return $(this).cleanVal();
		});
		});
}

function resetPhoneNumberMasks(classSelector){
 $('.'+classSelector).each(function(){
		$(this).unmask();
		$(this).mask('(000) 000-0000');
		});
}



//Needed calls for Bazaar Voice
if(typeof $BV === 'undefined'){
    //Bazaar voice script library was not loaded (WAI theme)
}else{
	$BV.configure("global", { 
        submissionContainerUrl: baseURL + "/online/portal/us/home/products/reviewsubmission"
	}); 
};

var Utils = (function() {

	var charMapE = ['\310\311\312\313\350\351\352\353'];
	var charMapA = ['\300\301\302\303\304\305\306\340\341\342\343\344\345\346'];
	var charMapC = ['\307\347'];
	var charMapI = ['\314\315\316\317\354\355\356\357'];
	var charMapO = ['\322\323\324\325\326\362\363\364\365\366'];
	var charMapU = ['\331\332\333\334\371\372\373\374'];
	var charMapN = ['\321\361'];
	
	var uniqueList = function(list, field) {
 		var result = [];
 		var keys = [];
 		$.each(list, function(i, e) {
 			if ($.inArray(e[field], keys) == -1) {
 				result.push(e);
 				keys.push(e[field]);
 	 	        }
 	 	});
 	 	return result;
 	};
 	
 	var cleanupWcmPath = function(incomingPath) {
 		return incomingPath.replace(wcmPathStripStart, '');
 	};
 	
 	var normalize = function(str) {
 		var expressionE = '';
    	$.each(charMapE, function(idx, el) {
    		expressionE = expressionE + el;
    	});    	
        var regexE = new RegExp('[' + expressionE + ']', 'gi');
        var expressionA = '';
    	$.each(charMapA, function(idx, el) {
    		expressionA = expressionA + el;
    	});    	
        var regexA = new RegExp('[' + expressionA + ']', 'gi');
        var expressionC = '';
    	$.each(charMapC, function(idx, el) {
    		expressionC = expressionC + el;
    	});    	
        var regexC = new RegExp('[' + expressionC + ']', 'gi');
        var expressionI = '';
    	$.each(charMapI, function(idx, el) {
    		expressionI = expressionI + el;
    	});    	
        var regexI = new RegExp('[' + expressionI + ']', 'gi');
        var expressionO = '';
    	$.each(charMapO, function(idx, el) {
    		expressionO = expressionO + el;
    	});    	
        var regexO = new RegExp('[' + expressionO + ']', 'gi');
        var expressionU = '';
    	$.each(charMapU, function(idx, el) {
    		expressionU = expressionU + el;
    	});    	
        var regexU = new RegExp('[' + expressionU + ']', 'gi');
        var expressionN = '';
    	$.each(charMapN, function(idx, el) {
    		expressionN = expressionN + el;
    	});    	
        var regexN = new RegExp('[' + expressionN + ']', 'gi');
        
        str = str.replace(/[-+*?%$#@& ]/gi, ''); 
        str = str.replace(regexE, 'e'); 
        str = str.replace(regexA, 'a'); 
        str = str.replace(regexC, 'c'); 
        str = str.replace(regexI, 'i'); 
        str = str.replace(regexO, 'o'); 
        str = str.replace(regexU, 'u'); 
        str = str.replace(regexN, 'n'); 
        
        return str;
 	};
 	
 	var denormalize = function(str) {
 		str = str.replace(/[-+*?%$#@&]/gi, ' ');
 		
 		var expressionE = '';
 		$.each(charMapE, function(idx, el) {
 			expressionE = expressionE + el;
    	});
 		expressionE = 'e' + expressionE;
 		var expressionA = '';
 		$.each(charMapA, function(idx, el) {
 			expressionA = expressionA + el;
    	});
 		expressionA = 'a' + expressionA;
 		var expressionC = '';
 		$.each(charMapC, function(idx, el) {
 			expressionC = expressionC + el;
    	});
 		expressionC = 'c' + expressionC;
 		var expressionI = '';
 		$.each(charMapI, function(idx, el) {
 			expressionI = expressionI + el;
    	});
 		expressionI = 'i' + expressionI;
 		var expressionO = '';
 		$.each(charMapO, function(idx, el) {
 			expressionO = expressionO + el;
    	});
 		expressionO = 'o' + expressionO;
 		var expressionU = '';
 		$.each(charMapU, function(idx, el) {
 			expressionU = expressionU + el;
    	});
 		expressionU = 'u' + expressionU;
 		var expressionN = '';
 		$.each(charMapN, function(idx, el) {
 			expressionN = expressionN + el;
    	});
 		expressionN = 'n' + expressionN;
 		
 		
 		str = str.replace(/ /gi, '[-+*?%$#@& ]*');
 		str = str.replace(/e/gi, '[' + expressionE + ']');
 		str = str.replace(/a/gi, '[' + expressionA + ']');
 		str = str.replace(/c/gi, '[' + expressionC + ']');
 		str = str.replace(/i/gi, '[' + expressionI + ']');
 		str = str.replace(/o/gi, '[' + expressionO + ']');
 		str = str.replace(/u/gi, '[' + expressionU + ']');
 		str = str.replace(/n/gi, '[' + expressionN + ']');
 	
 		return str;
 	};
 	
 	var getPortalContextRoot = function() {
 		return window.location.protocol + '//' + window.location.host + portalContextRoot;
 	};
 	
 	var getVirtualPortalRoot = function() {
 		return getPortalContextRoot() + virtualPortalName;
 	};
 	
 	// This method looks through the json results that are coming from the WCM model lookup service call
 	// and tries to find the information for the specified model. Returns the json object related to the model if found, or null otherwise
 	var getWcmDetail = function(modelId, wcmResults) {
		
		for (var i=0, max=wcmResults.length; i<max; ++i) {
			if (wcmResults[i].hasOwnProperty('productOverviewItem') && wcmResults[i].productOverviewItem.model_id == modelId) {
				return wcmResults[i].productOverviewItem;
			}
		}
		
		return null;		
	};
	
	/**
	 * Utility method to show or hide extra error information on forms when there are missing required fields or address validation errors
	 * 
	 * @param	{string}	redErrorText			The text to display when there are only missing required fields
	 * @param	{string}	blueErrorText			The text to display when there are only address validation errors
	 * @param	{string}	redAndBlueErrorText		The text to display when there are only missing required fields AND address validation errors
	 * @param	{boolean}	hasRedError				Flag to indicate if there are missing required fields
	 * @param	{boolean}	hasBlueError			Flag to indicate if there are address validation errors
	 * @param	{object}	container				jQuery object representing the container to display the message in
	 * @param	{object}	relatedButton			jQuery object representing the button to which the message is related. Used to determine button text if present
	 */
	var showSubmitErrorDescriptions = function(redErrorText, blueErrorText, redAndBlueErrorText, hasRedError, hasBlueError, container, relatedButton) {
		
		// The error messages are coming from WCM. Business can use a template #buttontext# to insert the actual button text in the message
		var buttonTextTemplate = '#buttontext#';
		var reToReplace = new RegExp(buttonTextTemplate, 'g');
		var showContainer = true;
		var actualButtonText = 'SUBMIT';
		
		if (relatedButton !== undefined) {
			actualButtonText = relatedButton.text().toUpperCase();
		}
		
		container.hide();
							
		if (hasRedError && !hasBlueError) {
			container.html(redErrorText.replace(reToReplace, actualButtonText));				
		} else if (!hasRedError && hasBlueError) {
			container.html(blueErrorText.replace(reToReplace, actualButtonText));				
		} else if (hasRedError && hasBlueError) {
			container.html(redAndBlueErrorText.replace(reToReplace, actualButtonText));				
		} else {
			showContainer = false;
		}
		
		if (showContainer) {
			container.show();
		}
					
	};

 
 	return {
 		uniqueList : uniqueList,
 		cleanupWcmPath : cleanupWcmPath,
 		normalize : normalize,
 		denormalize : denormalize,
 		getPortalContextRoot : getPortalContextRoot,
 		getVirtualPortalRoot : getVirtualPortalRoot,
 		getWcmDetail : getWcmDetail,
 		showSubmitErrorDescriptions : showSubmitErrorDescriptions
	};
 	
})();



var SummaryReview = (function($){
	var addLinkHandlers = function(id) {
		$('a[name=BV_TrackingTag_Rating_Summary_1_ReadReviews_' + id + ']').click(function(e) {
			e.preventDefault();
			$(this).off('click');
			$(this).prop("onclick", null);
			document.getElementById('BVRRContainer').style.visibility = 'visible';
		});
	};

	return {
		addLinkHandlers : addLinkHandlers
	};
	
})(jQuery);


