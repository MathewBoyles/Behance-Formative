$.fn.popup = function(fun, options) {
  var defaults = {
    backdrop: true,
    click: true,
    keyboard: true
  };
  var settings = $.extend({}, defaults, options);

  if (fun == "toggle") {
    this.popup((this.is(":visible") ? "hide" : "show"), options);
    return this;
  }

  this.data({
    "popupSettings": settings
  });

  this.find(".popup-backdrop")
    .filter(function() {
      return !$(this).data("popupInit");
    })
    .data({
      "popupInit": 1
    })
    .click(function() {
      if ($(this).parent().data("popupSettings").click) $(this).parent().popup("hide");
    });

  if (fun == "hide") {
    $("body").css("overflow", "auto");
    this.trigger("close");
    this.find(".popup-container")
      .animate({
        "top": 0 - (this.find(".popup-container").height() * 1.5)
      }, 500, function() {
        $(this).trigger("closed");
      });
    this.find(".popup-backdrop")
      .fadeOut(500, function() {
        $(this).parent().hide();
      });
  } else if (fun == "show" || !fun) {
    $("body").css("overflow", "hidden");
    this.find(".popup-backdrop,.popup-container").hide();
    this.show();
    this.find(".popup-container")
      .css({
        "top": 0 - (this.find(".popup-container").height() * 1.5)
      })
      .show()
      .animate({
        "top": "50%"
      }, 500, function() {
        $(this).trigger("opened");
      });
    if (this.data("popupSettings").backdrop) this.find(".popup-backdrop").fadeIn(500);
    else this.find(".popup-backdrop").css({
      "opacity": 0
    }).show();
  }

  return this;
};

$(document).keyup(function(e) {
  if (e.keyCode == 27 && $(".popup:visible").length) {
    $(".popup:visible").filter(function() {
      return $(this).data("popupSettings").keyboard;
    }).popup("hide");
  }
});
