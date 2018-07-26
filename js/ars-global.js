
$(document).ready( function() {       
	
	// ----------- Toggle Icon For Mobile ------------------
	$('.product-target').on('click', function() {
		$(this).find('.cbtn').toggleClass('fa-angle-down fa-angle-up');
	});

	// ----------------- Clear Forms -----------------------
	$('#resetBilling, #resetShipping ').hide();

	$("#addNewBilling").on('click', function() {
		$('#billing-address-select').hide();
		$('#removeBilling').hide();
		$('#resetBilling').show();
		$(this).closest('.billing-address').find("input").val("");
		$(this).closest('.billing-address').find("#billingstate, #billingphone").val("0");
	});
	$("#resetBilling").on('click', function() {
		$('#billing-address-select').show();
		$('#removeBilling').show();
	 	$(this).hide();
		$(this).closest('form')[0].reset();
	});
	//----------------------------------------------------
	$("#addNewShipping").on('click', function() {
		$('#shipping-address-select').toggle();
		$('#removeShipping').hide();
		$('#resetShipping').show();
		$(this).closest('.shipping-address').find("input").val("");
		$(this).closest('.shipping-address').find("#shippingstate").val("0");
		
	});
	$("#resetShipping").on('click', function() {
		$('#shipping-address-select').show();
		$('#removeShpping').show();
	 	$(this).hide();
		$(this).closest('form')[0].reset();
	});
	//----------------------------------------------------
	

	// ----------- Mobile Slide ouut Menu ------------------
	$("#toggle").on('click', function() {
		$('#menu').toggleClass("active");
	});

}); // doc-ready

//--------------- Page Loading Items --------------
$(".overlay").css('display', 'block');
$(".loading").css('display', 'block');

function loaded() {
	$(".overlay").fadeOut(200);
	$(".loading").fadeOut(200);
	$(".custom-container").css('visibility','visible').hide().fadeIn(200);
}

// -------------- Modal Openers ------------------------
// ----------- Cancel Service Modal --------------------
function cancelServiceDialog() {
	$('#cancelServiceModal').show();
	$(".overlay").css('display', 'block');
}

// ----------- Order History Modal ---------------------
function orderHistoryDialog() {
	$('#orderHistoryModal').show();
	$(".overlay").css('display', 'block');
}

// ----------- Manage Billing Modal --------------------
function manageBillingDialog() {
	$('#manageBillingModal').show();
	$(".overlay").css('display', 'block');
}

// ----------- Manage Shipping Modal -------------------
function manageShippingDialog() {
	$('#manageShippingModal').show();
	$(".overlay").css('display', 'block');
}

// ------- Escape key close for convenience ------------
$(document).keydown(function(e) {
	if (e.keyCode == 27) {
		$('#menu').removeClass("active");
		$('#btnControl').prop('checked', false);
	}
});

//-------------- Close Any Modal ----------------------
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


//-------------- Open/Close Tooltip ------------------
$('#showTooltip').hover(function() {
    $("#maxTooltip").fadeIn(200);
});

$(".close-tooltip").on("click", function () {
    $("#maxTooltip").fadeOut(200);
});