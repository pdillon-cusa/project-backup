(function($) {
		
	var WCM_BASE_URL = window.location.protocol + '//' + window.location.host; 
	var WCM_PRODUCT_BASE_PATH = 'canon_newweb_products/products';
	var context = '';	
	
	var defaultLabels = {
		introText: 'Begin typing your model name, then select your model from the displayed list and click the Go button',
		placeholder: 'Ex: EOS 5D Mark III, MX922 or MG8220',
		buttonText: 'Go',
		rightHandSideIntroText: 'Use our Product Finder',
		genericErrorMessage: 'This is a generic error message' 
	};
	
	$.widget("canon.productfinder", {
				   
		options: {
		  labelIdentifier : 'default',		  		 
		  productFinderButtonLabel : 'Product Finder',				 
		  context : '',
		  productFinderHierarchyUrl : '',
		  productFinderHierarchyRHSUrl : '',
		  levelLabels : ['Product Category', 'Product Family','Product Series', 'Models'],		 
		  showImages: false,
		  initialLevel: 0
		},
		_create: function() {
			
			var el = this.element;
			
			this._labels = this._getLabelsFromWCM(this.options.labelIdentifier);
			this._labels = $.extend({}, defaultLabels, this._labels);
			
	        el.addClass('row');
	        
	        this._devComment = $('<div></div>', { id: 'pf-dev-comment'});
	        el.append(this._devComment.hide());
	        
	        this._errorMessage = $('<div></div>', { class: 'col-xs-12 text-center', id: 'pf-error-message'});
	        this._errorMessage.css('color', 'red').css('margin-bottom', '15px').hide();
	        this._errorMessage.insertBefore(el);
	        
	        
	        this._createTypeahead(el);
	        el.append($('<div></div>', { class: 'col-xs-12 col-sm-1 text-center', style: 'display: none;'}).append($('<span></span>', {class: 'conjunction'}).text('OR')));
	        this._createDropdown(el);
	        
	        var selectors = $('<div></div>', { class : 'row pf-all-selectors'});
	        el.after(selectors);
	        
	        this.$loadingImage = $('<div></div>', { id : 'loading-spinner'});
	        this.$loadingImage.append($('<img></img>', { src : 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHdpZHRoPScyNHB4JyBoZWlnaHQ9JzI0cHgnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiBjbGFzcz0idWlsLWVsbGlwc2lzIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjUwIiByPSIxNSIgZmlsbD0iI2ZlMDgwOCIgdHJhbnNmb3JtPSJyb3RhdGUoMCA1MCA1MCkiPjxhbmltYXRlIGlkPSJhbmlyMTEiIGF0dHJpYnV0ZU5hbWU9InIiIGZyb209IjAiIHRvPSIxNSIgYmVnaW49IjBzO2FuaXIxNC5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5pcjEyIiBhdHRyaWJ1dGVOYW1lPSJyIiBmcm9tPSIxNSIgdG89IjE1IiBiZWdpbj0iYW5pcjExLmVuZCIgZHVyPSIwLjYyNXMiIGZpbGw9ImZyZWV6ZSI+PC9hbmltYXRlPjxhbmltYXRlIGlkPSJhbmlyMTMiIGF0dHJpYnV0ZU5hbWU9InIiIGZyb209IjE1IiB0bz0iMCIgYmVnaW49ImFuaXIxMi5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5pcjE0IiBhdHRyaWJ1dGVOYW1lPSJyIiBmcm9tPSIwIiB0bz0iMCIgYmVnaW49ImFuaXIxMy5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDExIiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iMTYiIHRvPSIxNiIgYmVnaW49IjBzO2FuaXgxOC5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDEyIiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iMTYiIHRvPSIxNiIgYmVnaW49ImFuaXgxMS5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDEzIiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iMTYiIHRvPSI1MCIgYmVnaW49ImFuaXgxMi5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDE0IiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iNTAiIHRvPSI1MCIgYmVnaW49ImFuaXgxMy5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDE1IiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iNTAiIHRvPSI4NCIgYmVnaW49ImFuaXgxNC5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDE2IiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iODQiIHRvPSI4NCIgYmVnaW49ImFuaXgxNS5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDE3IiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iODQiIHRvPSI4NCIgYmVnaW49ImFuaXgxNi5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDE4IiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iODQiIHRvPSIxNiIgYmVnaW49ImFuaXgxNy5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48L2NpcmNsZT48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxNSIgZmlsbD0icmdiYSgyNTMsOCw4LDAuNDg5KSIgdHJhbnNmb3JtPSJyb3RhdGUoMCA1MCA1MCkiPjxhbmltYXRlIGlkPSJhbmlyMjEiIGF0dHJpYnV0ZU5hbWU9InIiIGZyb209IjE1IiB0bz0iMTUiIGJlZ2luPSIwczthbmlyMjUuZW5kIiBkdXI9IjAuNXMiIGZpbGw9ImZyZWV6ZSI+PC9hbmltYXRlPjxhbmltYXRlIGlkPSJhbmlyMjIiIGF0dHJpYnV0ZU5hbWU9InIiIGZyb209IjE1IiB0bz0iMCIgYmVnaW49ImFuaXIyMS5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5pcjIzIiBhdHRyaWJ1dGVOYW1lPSJyIiBmcm9tPSIwIiB0bz0iMCIgYmVnaW49ImFuaXIyMi5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5pcjI0IiBhdHRyaWJ1dGVOYW1lPSJyIiBmcm9tPSIwIiB0bz0iMTUiIGJlZ2luPSJhbmlyMjMuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXIyNSIgYXR0cmlidXRlTmFtZT0iciIgZnJvbT0iMTUiIHRvPSIxNSIgYmVnaW49ImFuaXIyNC5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDIxIiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iMTYiIHRvPSI1MCIgYmVnaW49IjBzO2FuaXgyOC5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDIyIiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iNTAiIHRvPSI1MCIgYmVnaW49ImFuaXgyMS5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDIzIiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iNTAiIHRvPSI4NCIgYmVnaW49ImFuaXgyMi5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDI0IiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iODQiIHRvPSI4NCIgYmVnaW49ImFuaXgyMy5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDI1IiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iODQiIHRvPSI4NCIgYmVnaW49ImFuaXgyNC5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDI2IiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iODQiIHRvPSIxNiIgYmVnaW49ImFuaXgyNS5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDI3IiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iMTYiIHRvPSIxNiIgYmVnaW49ImFuaXgyNi5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5peDI4IiBhdHRyaWJ1dGVOYW1lPSJjeCIgZnJvbT0iMTYiIHRvPSIxNiIgYmVnaW49ImFuaXgyNy5lbmQiIGR1cj0iMC4xMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48L2NpcmNsZT48Y2lyY2xlIGN4PSI4NCIgY3k9IjUwIiByPSIxNSIgZmlsbD0iI2ZlMDgwOCIgdHJhbnNmb3JtPSJyb3RhdGUoMCA1MCA1MCkiPjxhbmltYXRlIGlkPSJhbmlyMzEiIGF0dHJpYnV0ZU5hbWU9InIiIGZyb209IjE1IiB0bz0iMTUiIGJlZ2luPSIwczthbmlyMzUuZW5kIiBkdXI9IjAuMjVzIiBmaWxsPSJmcmVlemUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBpZD0iYW5pcjMyIiBhdHRyaWJ1dGVOYW1lPSJyIiBmcm9tPSIxNSIgdG89IjAiIGJlZ2luPSJhbmlyMzEuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXIzMyIgYXR0cmlidXRlTmFtZT0iciIgZnJvbT0iMCIgdG89IjAiIGJlZ2luPSJhbmlyMzIuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXIzNCIgYXR0cmlidXRlTmFtZT0iciIgZnJvbT0iMCIgdG89IjE1IiBiZWdpbj0iYW5pcjMzLmVuZCIgZHVyPSIwLjEyNXMiIGZpbGw9ImZyZWV6ZSI+PC9hbmltYXRlPjxhbmltYXRlIGlkPSJhbmlyMzUiIGF0dHJpYnV0ZU5hbWU9InIiIGZyb209IjE1IiB0bz0iMTUiIGJlZ2luPSJhbmlyMzQuZW5kIiBkdXI9IjAuMzc1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXgzMSIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjUwIiB0bz0iODQiIGJlZ2luPSIwczthbml4MzguZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXgzMiIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209Ijg0IiB0bz0iODQiIGJlZ2luPSJhbml4MzEuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXgzMyIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209Ijg0IiB0bz0iODQiIGJlZ2luPSJhbml4MzIuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXgzNCIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209Ijg0IiB0bz0iMTYiIGJlZ2luPSJhbml4MzMuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXgzNSIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE2IiB0bz0iMTYiIGJlZ2luPSJhbml4MzQuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXgzNiIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE2IiB0bz0iMTYiIGJlZ2luPSJhbml4MzUuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXgzNyIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE2IiB0bz0iNTAiIGJlZ2luPSJhbml4MzYuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXgzOCIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjUwIiB0bz0iNTAiIGJlZ2luPSJhbml4MzcuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PC9jaXJjbGU+PGNpcmNsZSBjeD0iODQiIGN5PSI1MCIgcj0iMTUiIGZpbGw9InJnYmEoMjUzLDgsOCwwLjQ4OSkiIHRyYW5zZm9ybT0icm90YXRlKDAgNTAgNTApIj48YW5pbWF0ZSBpZD0iYW5pcjQxIiBhdHRyaWJ1dGVOYW1lPSJyIiBmcm9tPSIxNSIgdG89IjAiIGJlZ2luPSIwczthbmlyNDQuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXI0MiIgYXR0cmlidXRlTmFtZT0iciIgZnJvbT0iMCIgdG89IjAiIGJlZ2luPSJhbmlyNDEuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXI0MyIgYXR0cmlidXRlTmFtZT0iciIgZnJvbT0iMCIgdG89IjE1IiBiZWdpbj0iYW5pcjQyLmVuZCIgZHVyPSIwLjEyNXMiIGZpbGw9ImZyZWV6ZSI+PC9hbmltYXRlPjxhbmltYXRlIGlkPSJhbmlyNDQiIGF0dHJpYnV0ZU5hbWU9InIiIGZyb209IjE1IiB0bz0iMTUiIGJlZ2luPSJhbmlyNDMuZW5kIiBkdXI9IjAuNjI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXg0MSIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209Ijg0IiB0bz0iODQiIGJlZ2luPSIwczthbml4NDguZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXg0MiIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209Ijg0IiB0bz0iMTYiIGJlZ2luPSJhbml4NDEuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXg0MyIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE2IiB0bz0iMTYiIGJlZ2luPSJhbml4NDIuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXg0NCIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE2IiB0bz0iMTYiIGJlZ2luPSJhbml4NDMuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXg0NSIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE2IiB0bz0iNTAiIGJlZ2luPSJhbml4NDQuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXg0NiIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjUwIiB0bz0iNTAiIGJlZ2luPSJhbml4NDUuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXg0NyIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjUwIiB0bz0iODQiIGJlZ2luPSJhbml4NDYuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PGFuaW1hdGUgaWQ9ImFuaXg0OCIgYXR0cmlidXRlTmFtZT0iY3giIGZyb209Ijg0IiB0bz0iODQiIGJlZ2luPSJhbml4NDcuZW5kIiBkdXI9IjAuMTI1cyIgZmlsbD0iZnJlZXplIj48L2FuaW1hdGU+PC9jaXJjbGU+PC9zdmc+'}));
	        
	        selectors.append($('<div></div>', { class : 'col-sm-12 text-right'}).append($('<button></button>', { class : 'cbtn cbtn-canon-red-o pf-clear'}).text('Clear All')));
	        selectors.append(this.$loadingImage.hide());
	        
	        this._createLevel(selectors, this.options.initialLevel, this.options.levelLabels[this.options.initialLevel]);
	        
	        this._addOpenProductFinderClickHandler();
	        this._addCloseButtonHandler();
	        this._initializeTypeAhead();
	        this._addLevelClickHandler();
	        this._addOptionSelectHandler();
	        
	        this._adjustTextHeights();
	        
	    },
	    /**
	     * Adjusts the height of the 2 <div>s that contain the intro texts for left and right hand sides, to make sure that they are equal height
	     * so that the layout looks good
	     */
	    _adjustTextHeights: function() {	    		    			
			var typeaheadTextHeight = $('#typeahead-text').height();
			if (typeaheadTextHeight === 0) {
				typeaheadTextHeight = 44;
			}
	    	$('#navigator-text').css('height', typeaheadTextHeight + 'px');			    		  
	    },
	    _createTypeahead: function(el) {
	    	var self = this;	    	
	    	var outerDiv = $('<div></div>',{ class: 'col-xs-12 col-sm-6 text-center col-sm-offset-3', id: 'typeahead'});
	    	outerDiv.append('<h4 id="typeahead-text">' + self._labels.introText + '</h4>');
	    	
	    	var inputGroup = $('<div></div>',{ class: 'input-group'});
	    	var modelInput = $('<input></input>', {type: 'text', id: 'modelName', class: 'form-control', placeholder: self._labels.placeholder}).attr('autocomplete', 'off').attr('size', '60');
	    	modelInput.keydown(function(e) {
	    		self._clearErrors();
	    		if (e.which != 13 && e.which != 9) {
	    			var $btn = $('#btn-get');
	    			$btn.removeData('model');
	    		}
	    		if(e.which == 9){
        			e.preventDefault();
        			var $btn = $('#btn-get');
	        	    if ($btn.data('model') != undefined) {
	        	    	$('#btn-get').trigger('mouseover');
	        	    }
        		}	
	    	});
	    	
	    	inputGroup.append(modelInput);
	    		    		  
	    	var button = $('<div></div>', {id: 'btn-get', class: 'input-group-addon cbg-dark-gray-1 cbr-dark-gray-1 cf-white pf-select-btn'});
	    		    	
	    	button.text(self._labels.buttonText);
	    	button.click(function(e) {	
	    		e.preventDefault();	  
	    		var $btn = $('#btn-get');	    		
	    		if ($btn.data('model') != undefined) {    			
	    			CoreMetricsWrapper.createElementTag($btn.text()+'-'+$btn.data('model').title + ' / ' + $btn.data('model').model_id, document.title + '- MODEL NAME/NUMBER ENTRY',null);
	    			self._trigger('selected', e, $btn.data('model'));	    			
	    		}	    		    		
	    	});
	    	button.hover(
	    		function() {
	    			var $this = $(this);
	    			if ($this.data('model') != undefined) {
	    				$this.addClass('cbtn-canon-red');	
	    			}
	    		}, function() {	    			
	    			$(this).removeClass('cbtn-canon-red');	
	    		}
			);
	    	inputGroup.append(button);
	    	
	    	inputGroup.keypress(function(e) {
	    		if(e.which == 13) {
	        		var $btn = $('#btn-get');
	        	    if ($btn.data('model') != undefined) {	
	        	    	$btn.trigger('mouseout');
	        	    	CoreMetricsWrapper.createElementTag($btn.text() + ' - ' + $btn.data('model').title,'Open',null);        	    	
		    			self._trigger('selected', e, $btn.data('model'));	    			
		    		}
	        	}
        	});
	    	
	    	var innerDiv = $('<div></div>',{ class: 'form-group'});
	    	innerDiv.append(inputGroup);
	    	
	    	outerDiv.append(innerDiv);
	    	
	    	el.append(outerDiv);
	    },
	    /**
	     * Tries to lookup the labels to use from WCM for the supplied identifier. If no labels are found, returns the default labels
	     * @param labelIdentifier  	The identifier to lookup
	     * @returns  A JSON object with the labels to use for the Product Finder texts
	     */
	    _getLabelsFromWCM: function(labelIdentifier) {
	    	var returnLabel = defaultLabels;
	    	$.ajax({
		        url: '/internet/wcm/connect/us/canon_newweb_content/sa_navigation/sa_explore/sa_explorecanon/nl_explorecanonhome?srv=cmpnt&source=library&cmpntid=dea4dc79-52a0-41f3-8c36-8e7ca648ee9b',		        
		        type: 'GET',
		        datatype:'json',
		        async: false
			}).then(function(labels) {					
				var labelsJson = JSON.parse(labels);
				if (labelsJson.hasOwnProperty(labelIdentifier)) {					
					returnLabel = $.extend( {}, labelsJson["default"], labelsJson[labelIdentifier] );					
				}  else {
					returnLabel = labelsJson["default"];
				}
			});
	    	
	    	return returnLabel;
	    },
	    /**
	     * This method will insert an HTML comment tag inside the DOM with the actual error message so a developer can see what the problem is, 
	     * but to the end user, we display a more generic error
	     * @param text  	The detailed error message
	     */
	    _setError: function(text) {
	    	this._devComment.html('<!--' + text + '-->');
	    	this._errorMessage.text(this._labels.genericErrorMessage).show();
	    },
	    /**
	     * Clears the developer comment tag and the error message field
	     */
	    _clearErrors: function() {
	    	this._devComment.html('');
	    	this._errorMessage.text('').hide();
	    },
	    _createDropdown: function(el) {
	    	var outerDiv = $('<div></div>',{ class: 'col-xs-12 col-sm-5 text-center', style: 'display: none;'});
	    	outerDiv.append('<h4 id="navigator-text">' + this._labels.rightHandSideIntroText + '</h4>');
	    	
	    	var inputGroup = $('<div></div>',{ class: 'input-group'});	    	
	    	var button = $('<div></div>', {class: 'input-group-addon cbg-dark-gray-1 cbr-dark-gray-1 cf-white pf-open', style: 'cursor: pointer'});
	    	button.attr('data-prf-context', this.options.context);
	    	button.append($('<span></span>', {class: 'pf-open-on'}));
	    	button.append(this.options.productFinderButtonLabel);
	    	inputGroup.append(button);
	    	
	    	var innerDiv = $('<div></div>',{ class: 'form-group'});
	    	innerDiv.append(inputGroup);
	    	
	    	outerDiv.append(innerDiv);
	    	
	    	el.append(outerDiv);
	    },	   
	    _addOpenProductFinderClickHandler: function() {
	    	var self = this;
	    	
	    	$('.pf-open').click(function(e){
				e.preventDefault();
		        $('.pf-open span').toggleClass('pf-open-on pf-open-off');        
		        $('.pf-all-selectors').slideToggle();	
		        self._clearErrors();
		        
		        var $this = $(this);
				if ($this.find('span').hasClass('pf-open-off')) {
					
					context = $this.attr('data-prf-context');
					
					self._getItemsForPathFromWCM(context, WCM_PRODUCT_BASE_PATH).done(function(data) {
						
						if (data) {
						
							if (data.message !== '') {
								self._setError(data.message);								
							} else {
								self._clearErrors();	
								var items = data.items;
								
								var level0Dropdown = $('#level' + self.options.initialLevel);
								level0Dropdown.empty();
								
								items.sort(self._sortBy('title', false, null));
								$.each(items, function(idx, option) {
									
									var listItem = $("<li class='col-xs-12 col-md-3 col-sm-4' data-depth='0' data-name='" + option.name +  "' title='" + option.title + "' data-path='" + option.path + "'>" + decodeURIComponent(option.title) + "</li>");
									level0Dropdown.append(listItem);
									
									if (option.isLeaf === 'true') {
										listItem.data('item', option);
										listItem.attr('data-isleaf', '1');										
									}
									
								});	
								
								self._trigger('levelloaded', e, { level: 0 });
							}																																		
						}
						
					}).fail(function(data, textStatus) {
						self._setError(textStatus);						
					});
				}	
	    	});
	    },
	    /**
	     * Calls a WCM service to fetch the items to display in the Product Finder right hand side navigator
	     * @param context  		The context of the Product Finder instance
	     * @param productPath  	The productPath that the user selected. This method will return all the immediate children of this product path
	     * @returns  The jQuery Ajax promise
	     */
	    _getItemsForPathFromWCM: function(context, productPath){
	    	var self = this;
	    	this.$loadingImage.show();
	    	return $.ajax({
		        url: this.options.productFinderHierarchyRHSUrl,		        
		        type: 'POST',
		        datatype:'json',		       		  
		        timeout: 10000,
		        data: {"context" : context, "productPath" : productPath}
			}).always(function(){
				self.$loadingImage.hide();
			});
	    },
	    _addOptionSelectHandler: function() {
	    	var self = this;
	    	$(document).on('click', '.pf-selector ul.pf-options li', function() {
				var $this = $(this);			
				$this.closest('.pf-selector').find('small').html($this.text());
				
				var $curentLevel = $this.closest('div.pf-level');
				var currentDepth = $this.attr('data-depth');				
				var selectedPath = $this.attr('data-path');
				var nextDepth = Number(currentDepth) + 1;
				var $selectors = $('div.pf-all-selectors');
				
				// remove all the levels that came behind this one
				$curentLevel.nextAll('div.pf-level').remove();
				$('button.pf-continue').remove();
				
				if ($this.attr('data-isleaf') === '1') {
					var currentElement = $this.data('item');
										
					if ($('button.pf-continue').length === 0) {								
						$selectors.append($('<div></div>', { class : 'col-sm-12 text-center'}).append($('<button></button>', { class : 'pf-continue cbtn cbtn-light-gray-1'}).data('model', currentElement).text(self._labels.buttonText)));
						$('button.pf-continue').click(function(e) {	
							e.preventDefault();
							
			    			var selectedHierarchy = '';
			    			$('div.pf-selector small').each(function() {
			    				selectedHierarchy = selectedHierarchy + $(this).text() + '>';
			    			});
			    			
			    			selectedHierarchy = selectedHierarchy.substring(0, selectedHierarchy.length - 1);			    			
			    			
			    			CoreMetricsWrapper.createElementTag($(this).text() + ' - ' + selectedHierarchy + ' / ' + $(this).data('model').model_id, document.title + '- PRODUCT FINDER', null);
			    			
							self._trigger('selected', e, currentElement);					    			
							$(this).removeData('model');
							self.closeProductFinder();
						});
					} else {
						$('button.pf-continue').data('model', currentElement);
					}	
				} else {					
					self._getItemsForPathFromWCM(context, selectedPath).done(function(data) {	
						
						if (data) {
							if (data.message === '') {
								self._clearErrors();
								var items = data.items;
								var lowestLevel = false;
								
								items.sort(self._sortBy('title', false, null));
								var newLevel = self._createLevel($selectors, nextDepth, self.options.levelLabels[nextDepth]);
								var levelDropdown = $('#level' + nextDepth);
								levelDropdown.empty();	
															
								$.each(items, function(idx, option) {		
									var listItem = $("<li data-depth='" + nextDepth + "' data-name='" + option.name +  "' title='" + option.title + "' data-path='" + option.path + "'>" + decodeURIComponent(option.title) + "</li>");
									listItem.addClass('col-xs-12 col-md-3 col-sm-4');										
									levelDropdown.append(listItem);
									
									if (option.isLeaf === 'true') {
										listItem.data('item', option);
										listItem.attr('data-isleaf', '1');
										lowestLevel = true;
										newLevel.find('h3').text(self.options.levelLabels[self.options.levelLabels.length-1]);
										
										if (self.options.showImages) {
											if ($('#devicetype-mobile').is(':visible')) {	    				
												listItem.prepend('<img src="' + WCM_BASE_URL + option.small_thumbnailImageUrl + '" class="img-responsive" /><br/>');
							    			} else if ($('#devicetype-tablet').is(':visible')) {	    				
							    				listItem.prepend('<img src="' + WCM_BASE_URL + option.medium_thumbnailImageUrl + '" class="img-responsive" /><br/>');
							    			} else {	    				
							    				listItem.prepend('<img src="' + WCM_BASE_URL + option.large_thumbnailImageUrl + '" class="img-responsive" /><br/>');
							    			}								
										}
									}
								});
								
								newLevel.find('.pf-selector').click();
								
								if (lowestLevel && !levelDropdown.hasClass('products-list')) {
									levelDropdown.addClass('products-list');								
								}	
								
								self._trigger('levelloaded', e, { level: nextDepth });
							} else {
								self._setError(data.message);
							}
						}
												
					}).fail(function(data, textStatus) {
						self._setError(textStatus);						
					});
				}			
			});		
	    },
	    _sortBy: function(field, reverse, primer){

	 	   var key = primer ? 
	 	       function(x) {return primer(x[field]);} : 
	 	       function(x) {return x[field];};

	 	   reverse = !reverse ? 1 : -1;

	 	   return function (a, b) {
	 	       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	 	     }; 
	 	},
	    _createLevel: function(el, level, label) {
	    	
	    	var outerDiv = $('<div></div>', {class: 'col-sm-12 pf-level', style: 'cursor: pointer'});
	    	var innerDiv = $('<div></div>', {class: 'pf-selector text-center cbr-light-gray-1'});
	    	outerDiv.append(innerDiv);
	    	if (level === this.options.initialLevel) {
	    		outerDiv.addClass('first-level');
	    	}
	    	
	    	innerDiv.append($('<h3></h3>').text(label));
	    	innerDiv.append($('<i></i>',{class: 'fa fa-angle-down pull-right'}));
	    	innerDiv.append($('<small></small>'));
	    	innerDiv.append($('<ul></ul>',{class: 'pf-options clearfix products-list', id: 'level' + level}));
	    	innerDiv.click(function(){});
	    	el.append(outerDiv);
	    	
	    	return outerDiv;
	    },
	    _addLevelClickHandler: function() {
	    	$(document).on('click', '.pf-selector', function() {
	    		var $this = $(this);
	    		$this.toggleClass('active');
	    		$this.find('.pf-options').fadeToggle(0);
	            var $icons = $this.find('i');
	            if ($icons.hasClass("fa-angle-down") ){
	                $icons.removeClass("fa-angle-down").addClass("fa-angle-up");
	            } else {
	                $icons.removeClass("fa-angle-up").addClass("fa-angle-down");
	            }
	        });
	    },
	    closeProductFinder: function() {
	    	$('.pf-open span').removeClass('pf-open-off').addClass('pf-open-on'); 
	    	$('div.pf-level').not('.first-level').remove();
	    	$('button.pf-continue').remove();
	        $('.pf-all-selectors').hide();
	        $('.pf-selector small').text('');
	    },	    
	    updateContext: function(newContext) {	    	
	    	this.closeProductFinder();
	    	this.options.context = newContext;	
	    	$('div.pf-open').attr('data-prf-context', newContext);
	    	
	    	if (newContext === 'supplies-accessorytype') {
	    		WCM_PRODUCT_BASE_PATH = 'canon_newweb_products/products/supplies-accessories';
	    	} else {
	    		WCM_PRODUCT_BASE_PATH = 'canon_newweb_products/products';
	    	}
	    },
	    updateButtonLabels: function(newLabel) {
	    	$('#btn-get').text(newLabel);
	    	if ($('button.pf-continue').length > 0) {
	    		$('button.pf-continue').text(newLabel);
	    	}
	    },
	    updateLevelLabels: function(newLabels) {
	    	this.options.levelLabels = newLabels;   
	    	$('div.first-level').find('h3').text(newLabels[0]);
	    },
	    showTypeahead: function(show) {	    	
	    	if (show) {
	    		$('#product-finder').show();	
	    		$('button.pf-close').show();	
	    		this.closeProductFinder();
	    	} else {
	    		$('div.pf-open').click();
	    		$('#product-finder').hide();	
	    		$('button.pf-close').hide();	
	    	}
	    },
	    _addCloseButtonHandler: function() {
	    	var self = this;
	    	$('.pf-clear').click(function(e) {
		    	e.preventDefault();
		    	$('div.pf-level').not('.first-level').remove();
		    	$('button.pf-continue').remove();		        
		        $('.pf-selector small').text('');
		        self._clearErrors();
		    });
	    },	   
	    _initializeTypeAhead: function() {
	    	var self = this;
	    	var _timeout = null;
		    var _keyboardDelay = 700;
		    var models = [];
		    var _typeaheadInitialized = false;
		    var queryArray = [];
		    
	    	$('#modelName').typeahead({
	    		source: function (query, process) {
	    			
    				if (_typeaheadInitialized) {
	    				return process(models);
	    			}
	    			
	    			 if (_timeout) {
	                     clearTimeout(_timeout);
	                 }
	    			 _timeout = setTimeout(function() {    				 
	    				 return $.post(self.options.productFinderHierarchyUrl, {context: self.options.context}, function (data) { 	    					 	
	    					 	$.each(data.sa.items, function walker(key, value) {	    					 		
	    					 		if (value.title !== undefined && value.model_id !== '') {
	    					 			models.push(value);
	    					 		}
	    					 	
	    						    if (value !== null && typeof value === "object") {
	    						        // Recurse into children
	    						        $.each(value, walker);
	    						    }
	    						});	   
	    			
	    					 	models = Utils.uniqueList(models, 'model_id');
	    					 	
	    					 	models.sort(self._sortBy('title', false, null));
	    					 	
	    					 	_typeaheadInitialized = true;
	    	    	            return process(models);
	    	    	        });
	    			 }, _keyboardDelay);    	        
	    	    },
	    	    matcher: function(item) {
	    	    	var matched = false;
	    	    	if (item) {
	    	    		var title = Utils.normalize(item.title);
	    	    		var inputQuery = this.query.trim();
	    	    		queryArray = inputQuery.split(' ');
	    	    		for(var i = 0;i<queryArray.length;i++){
	    	    			var qWord = queryArray[i];
	    		    		if(qWord.trim().length > 0){
		    	    			var queryRegExp = new RegExp(Utils.normalize(queryArray[i]), 'gi');
		    	    			var regMatch = title.match(queryRegExp);
				    	        if (regMatch !== null) {
				    	        	var matchIndex = regMatch.index;
				    	        	matched = true;
				    	        	var titleSplit = title.split(new RegExp('(' + queryArray[i] + ')', 'gi'));
				    	        	if(titleSplit.length > 2){
				    	        		for(var j=2; j<titleSplit.length; j++){
				    	        			if(titleSplit[j].trim().length > 0){
				    	        				title += titleSplit[j];
				    	        			}
				    	        		}
				    	        	}else{
				    	        		title = '';
				    	        	}
				    	        }else{
				    	        	matched = false;
				    	        	break;
				    	        }
	    		    		}
	    	    		}
	    	    	}
	    	    	
	    	    	return matched;
	    	    },
	    	    highlighter: function(item) {
	    	      var highlightVal = item;
	    	      item = '';
		    	  for(var j = 0;j<queryArray.length;j++){
		    		var qWord = queryArray[j];
		    		if(qWord.trim().length > 0){
		    			highlightVal = highlightVal.replace(new RegExp('(' + Utils.denormalize(qWord) + ')', 'ig'), function ($1, match) {		    		  
	  			    	    return '<strong>' + match + '</strong>';
	  			    	});
	  	    			if(j+1<queryArray.length){
	  	    				var splitItem = highlightVal.split('</strong>');
	  	    				if(splitItem.length > 1){
	  	    					highlightVal = splitItem[1].replace("<strong>", "").replace("</strong>", "");
	  	    					item += splitItem[0] + '</strong>';
	  	    				}
	  	    			}else{
	  	    				item += highlightVal;
	  	    			}
		    		}else{
  	    				item += highlightVal;
  	    			}
  	    		  }
		    	  return item;
		    	},
	    	    displayText: function(model) {  	    	    	
	    	    	return $('<div/>').html(model.title).text();
	    	    },
	    	    afterSelect: function(model) {
	    	    	$('#btn-get').show();
	    	    	$('#btn-get').data('model', model);
	    	    }
	    	});
	    }
	});
})(jQuery);