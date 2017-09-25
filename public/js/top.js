$(window).scroll(function() {
  if ($(window).scrollTop() >= 150) $("#toTop:hidden").fadeIn(500);
  else $("#toTop:not(.fading)").addClass("fading").fadeOut(500, function() {
    $(this).removeClass("fading");
  });
});

$el = $("<div />");
$el
  .attr("id", "toTop")
  .click(function() {
    $("html,body").animate({
      scrollTop: 0
    }, 500);
  })
  .append("<i />")
  .find("i:last")
  .addClass("fa")
  .addClass("fa-chevron-up");
$("body").append($el);
