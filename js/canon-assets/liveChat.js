var LiveChat = (function($){

  var displayGlobalFloatingChat = function(chatId) {
      window._bcvma = window._bcvma || [];
      _bcvma.push(["setAccountID", "193444363009547553"]);
      _bcvma.push(["setParameter", "WebsiteID", "3372322571352680781"]);
      if (chatId.indexOf("default") == -1)
      {
        _bcvma.push(["addFloat", {type: "chat", id: chatId}]);
      }
      _bcvma.push(["pageViewed"]);
      var bcLoad = function(){
        if(window.bcLoaded) return; window.bcLoaded = true;
        var vms = document.createElement("script"); vms.type = "text/javascript"; vms.async = true;
        vms.src = ('https:'==document.location.protocol?'https://':'http://') + "vmss.boldchat.com/aid/193444363009547553/bc.vms4/vms.js";
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(vms, s);
      };
      if(window.pageViewer && pageViewer.load) pageViewer.load();
      else if(document.readyState=="complete") bcLoad();
      else if(window.addEventListener) window.addEventListener('load', bcLoad, false);
      else window.attachEvent('onload', bcLoad);
  };

  var displayLiveStaticChat = function(chatId) {
      var bccbId = Math.random(); document.write(unescape('%3Cdiv id=' + bccbId + '%3E%3C/div%3E'));
      window._bcvma = window._bcvma || [];
      _bcvma.push(["setAccountID", "193444363009547553"]);
      _bcvma.push(["setParameter", "WebsiteID", "3372322571352680781"]);
      _bcvma.push(["addStatic", {type: "chat", bdid: chatId, id: bccbId}]);

      var bcLoad = function(){
        if(window.bcLoaded) return; window.bcLoaded = true;
        var vms = document.createElement("script"); vms.type = "text/javascript"; vms.async = true;
        vms.src = ('https:'==document.location.protocol?'https://':'http://') + "vmss.boldchat.com/aid/193444363009547553/bc.vms4/vms.js";
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(vms, s);
      };
      if(window.pageViewer && pageViewer.load) pageViewer.load();
      else if(document.readyState=="complete") bcLoad();
      else if(window.addEventListener) window.addEventListener('load', bcLoad, false);
      else window.attachEvent('onload', bcLoad);
  };
  
  var displayNanorepBot = function(chatId) {
	  chatId = '1067188651';
	  ! function(t, e, o, c, n, a) {
	    var s = this.nanorep = this.nanorep || {};
	    s = s[e] = s[e] || {}, s.apiHost = a, s.host = n, s.path = c, s.account = t, s.protocol = "https:" === location.protocol ? "https:" : "http:", s.on = s.on || function() {
	      s._calls = s._calls || [], s._calls.push([].slice.call(arguments))
	    };
	    var p = s.protocol + "//" + n + c + o + "?account=" + t, l = document.createElement("script");
	    l.async = l.defer = !0, l.setAttribute("src", p), document.getElementsByTagName("head")[0].appendChild(l)
	  }("canon", "floatingWidget", "floating-widget.js", "/web/", "canon.nanorep.co");
	  nanorep.floatingWidget.on({
	      init: function() {
	          this.setConfigId(chatId);
	      }
	  });
  };

  var displayChat = function(chatId, disableChat) {
    if((typeof disableChat === 'undefined') || (disableChat == 'False') || (disableChat == ''))
    {
      if ((window.location.href.indexOf("home/support/details") == -1) && (window.location.href.indexOf("home/support/service-repair/repair") == -1) && (window.location.href.indexOf("home/support") > -1))
      {
        chatId = '2694391809491518345';
      }
      else if (window.location.href.indexOf("home/support/service-repair/repair") > -1)
      {
    	chatId = '3593366961311834341';
      }
      else if ((window.location.href.indexOf("home/support/details") == -1) && (window.location.href.indexOf("home/products/details") == -1))
      {
        chatId = 'default';
      }
      else if ((typeof chatId === 'undefined') || (chatId == ''))
      {
        chatId = 'default';
      }

      displayGlobalFloatingChat(chatId);
    }
  };

  var displayBot = function(dataChatBot, currentContent) {
	  if (window.location.href.indexOf("home/support/details") > -1)
	  {
		  var productPathStart = "/Canon_NewWeb_Products/products/";
		  var productCatStart = "/Canon_NewWeb_Products/Products/product-categories/";
		  if(currentContent.indexOf(productPathStart) != -1)
		  {
			  var currentCatPath = currentContent.substring(productPathStart.length);
			  var selectionIndex = -1;
			  var selectionIndexDepth = -1;
			  for(i = 0; i < dataChat.length; i++)
			  {
				  var resultCategories = dataChatBot[i].categories.split(",");
				  for(k = 0; k < resultCategories.length; k++)
				  {
					  if(resultCategories[k].indexOf(productCatStart) != -1)
					  {
						  var tmpCat = resultCategories[k].substring(productCatStart.length);
						  var tmpCatDepth = tmpCat.split("/").length;
						  if((currentCatPath.indexOf(tmpCat) != -1) && (tmpCatDepth > selectionIndexDepth))
						  {
							  selectionIndex = i;
							  selectionIndexDepth = tmpCatDepth;
						  }
					  }
				  }
			  }

			  if(selectionIndex > -1)
			  {
				  if(dataChatBot[selectionIndex].enableChat == 'True')
				  {
					  displayNanorepBot('');
				  }
			  }
		  }
	  }
	  else if ((window.location.href.indexOf("home/support/details") == -1) && (window.location.href.indexOf("home/support") > -1))
	  {
		  displayNanorepBot('');
	  }
  };

  return {
    displayChat : displayChat,
    displayLiveStaticChat : displayLiveStaticChat,
    displayBot : displayBot
  };

})(jQuery);
