var Allegiance = (function() {
	
	var showSurvey = function(surveyId, cimId, pimId, modelDesc, transID) {
		var url = "https://canonusa.allegiancetech.com/cgi-bin/qwebcorporate.dll?";
		var	idx = surveyId; 
		var cim = cimId;   
		var pim = pimId;   
		var model = modelDesc;  
		var surveyTimeStamp = "";
		var finalSurveyUrl = url+"&idx="+idx+"&CIM="+cim+"&PIM="+pim+"&Model="+model+"&TransID="+transID+"&t="+surveyTimeStamp;
	
		$('#allegiance-iframe').attr('src', finalSurveyUrl);
	};
	
	return {
		showSurvey : showSurvey
	};
	
})();
