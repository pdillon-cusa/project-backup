// ----------- Toggle Icon For Mobile ------------------
$(document).ready( function() {       
	
	$('.product-target').on('click', function() {
		$(this).find('.cbtn').toggleClass('fa-angle-down fa-angle-up');
	});

	$("#addNewBilling").on('click', function () {
		$('#billing-address-select').toggle();
		$(this).closest('form').find("input[type=text], textarea").val("");
	});

	$("#addNewShipping").on('click', function () {
		$('#shipping-address-select').toggle();
		$(this).closest('form').find("input[type=text], textarea").val("");
	});

	$("#resetShipping").on('click', function () {
		$('#shipping-address-select').show();
		$(this).closest('form')[0].reset();
	});

	$("#resetBilling").on('click', function () {
		$('#billing-address-select').show();
		$(this).closest('form')[0].reset();
	});



	

});

// ----------- Mobile Slide ouut Menu ------------------
$("#toggle").on('click', function() {
	$('#menu').toggleClass("active");
});
// ------- Escape key close for convenieance -----------
$(document).keydown(function(e) {
	if (e.keyCode == 27) {
		$('#menu').removeClass("active");
		$('#btnControl').prop('checked', false);
	}
});

// ----------- Cancel Service Modal --------------------
function cancelServiceDialog() {
	$('#cancelServiceModal').show();
	$(".overlay").css('display', 'block');
}

// ----------- Order History Modal --------------------
function orderHistoryDialog() {
	$('#orderHistoryModal').show();
	$(".overlay").css('display', 'block');
}

// ----------- Manage Billing Modal --------------------
function manageBillingDialog() {
	$('#manageBillingModal').show();
	$(".overlay").css('display', 'block');
}

// ----------- Manage Shipping Modal --------------------
function manageShippingDialog() {
	$('#manageShippingModal').show();
	$(".overlay").css('display', 'block');
}

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
	$(".large-modal").fadeOut(200);
	$(".med-modal").fadeOut(200);
}
$(document).keydown(function(e) {
    if (e.keyCode == 27) { closeModal() }
});
$(".close-overlay").on("click", function () {
    closeModal();
});


// $('#addNew').on('click', function() {
// 	//$('#billing-address-select').hide();
// 	alert('in')
// 	document.getElementById('billing-address')[0].reset;
// });





//----------- Edit Credit Card Info -----------------
// $('#edit').on("click", function() {
// 	var originalText = $("#cc-num").html();
// 	var newElement = $("<input id='cc-num-edited' type='text' class='form-control short' />");
// 	var newElementText = newElement.val(originalText);
// 	$("#cc-num").replaceWith(newElementText);
// 	newElementText.focus();
// 	$(this).hide();
// 	$("#done").show();
//   });
  

//   $('#done').on("click",function() {
// 	  var newArea = $('input#cc-num-edited');   // Get textarea
// 	  var newText = newArea.val();   // Get it's value
// 	  var newElement = $("<span id='cc-num' />"); // Create new element
// 	  var newElAndText = newElement.html(newText); 
// 	  // ^ Add edited text (must use html method not val)
// 	  newArea.replaceWith(newElAndText); // Replace with new element and text
// 	  $("#edit").show();
// 	  $(this).hide();
  
//   });  





// //--------- Drop Down Datatlist and Type-Ahead --------------
// (function(win,doc) {
// 	if (doc.querySelectorAll) {
// 		var inputs = doc.querySelectorAll('input[list]'),
// 			  total = inputs.length;
// 		for (var i=0; i<total; i++) {
// 			var input = inputs[i],
// 				id = input.getAttribute('list'),
// 				list = doc.getElementById(id),
// 				options = list.getElementsByTagName('option'),
// 				amount = options.length
// 				//rand = Math.floor(Math.random()*amount),
// 				// option = options[rand],
// 				// value = option.getAttribute('value');
// 			//input.setAttribute('placeholder',value);
// 		}
// 	}
// })(this,this.document);


