function testFunction()
{
	$(".move").click(function() {
    $('html, body').animate({
        scrollTop: $("#middle").offset().top
    }, 2000);
});
}
