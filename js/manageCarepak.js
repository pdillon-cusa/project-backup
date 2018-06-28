

// ------------- Manage CarePak Types Dialog -------------------
function showManageCarePakTypes(carePakTypes) {
    $("#carePakTypes").val(carePakTypes);
    $(".overlay").css('display', 'block');
    $("#manageCarePaksModal").css('display', 'block');
}


$('#showTooltip').hover(function() {
    $("#maxTooltip").fadeIn(200);
});

$(".close-tooltip").on("click", function () {
    $("#maxTooltip").fadeOut(200);
});

