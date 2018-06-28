

//--------------- Page Loading Items --------------
$(".overlay").css('display', 'block');
$(".loading").css('display', 'block');

function loaded() {
    $(".overlay").fadeOut(200);
    $(".loading").fadeOut(200);
    $(".custom-container").css('visibility','visible').hide().fadeIn(200);
}

//-------------- Close Any Modal --------------------
function closeModal() {
    $(".overlay").fadeOut(200);
    $(".custom-modal").fadeOut(200);
    $("#maxTooltip").fadeOut(200);
}
$(document).keydown(function(e) {
    if (e.keyCode == 27) { closeModal() }
});
$(".close-overlay").on("click", function () {
    closeModal();
});

//--------- Drop Down Datatlist and Type-Ahead --------------
(function(win,doc) {
	if (doc.querySelectorAll) {
		var inputs = doc.querySelectorAll('input[list]'),
			  total = inputs.length;
		for (var i=0; i<total; i++) {
			var input = inputs[i],
				id = input.getAttribute('list'),
				list = doc.getElementById(id),
				options = list.getElementsByTagName('option'),
				amount = options.length
				//rand = Math.floor(Math.random()*amount),
				// option = options[rand],
				// value = option.getAttribute('value');
			//input.setAttribute('placeholder',value);
		}
	}
})(this,this.document);


