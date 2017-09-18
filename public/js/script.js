$.fn.popup = function(fun, options) {
  if(fun == "toggle") {
    this.popup((this.is(":visible") ? "hide" : "show"), options);
    return this;
  }

  this.find(".popup-backdrop")
    .filter(function() {
      return !$(this).data("popupInit");
    })
    .data({"popupInit": 1})
    .click(function() {
      $(this).parent().popup("hide");
    });

  if(fun == "hide") {
    this.find(".popup-container")
      .animate({
        "top": 0 - (this.find(".popup-container").height()*1.5)
      });
    this.find(".popup-backdrop")
      .fadeOut(500, function() {
        $(this).parent().hide();
      });
  }
  else if (fun == "show" || !fun) {
    this.find(".popup-backdrop,.popup-container").hide();
    this.show();
    this.find(".popup-container")
      .css({"top": 0 - (this.find(".popup-container").height()*1.5)})
      .show()
      .animate({
        "top": "50%"
      });
    this.find(".popup-backdrop").fadeIn(500);
  }

  return this;
};



$("#test-popup").popup("show");
