// Source: script.js
// Get Lightfarm Studio Data
$.ajax({
  url: "http://www.behance.net/v2/projects?client_id=8hRTUTjbwsJrLqGZ0kgxT48GBmkwwM5g",
  dataType: "jsonp",
  success: function(data){
    var categories = [];
    for (var i = 0; i < data.projects.length; i++) {
      for (var i_i = 0; i_i < data.projects[i].fields.length; i_i++) {
        if(categories.indexOf(data.projects[i].fields[i_i]) == -1) categories.push(data.projects[i].fields[i_i]);
      }
      var tagLine = "";
      for (var i_tag = 0; i_tag < data.projects[i].fields.length; i_tag++) {
        tagLine += " tag-" + (data.projects[i].fields[i_tag].replace(/ /g,"").toLowerCase());
      }
      $("#mixitup-container .container").append("<div class='portfolio-item col-md-3" + tagLine + "' data-id='" + data.projects[i].id + "'> " +
        "<img class='portfolio-image' src='" + data.projects[i].covers[404] + "' alt='" + data.projects[i].name.replace(/'/g,"") + "'>" +
      "</div>");
    }
    $("#mixitup-container .container .portfolio-item").click(function(){
      console.log($(this));

    });
    console.log(data.projects);
    for (var j = 0; j < categories.length; j++) {
      $("#mixitup-container .filters").append("<button class='btn' type='button' data-filter='.tag-" + categories[j].replace(/ /g,"").toLowerCase() + "'>" + categories[j] + "</button>");
    }

    var mixer = mixitup($("#mixitup-container"), {
        selectors: {
            target: '.portfolio-item'
        },
        animation: {
            duration: 300
        }
    });
  },
  error: function(){
    console.log("something went wrong.");
  }
});

// Source: popup.js
$.fn.popup = function(fun, options) {
  var defaults = {
    backdrop: true,
    click: true,
    keyboard: true
  };
  var settings = $.extend( {}, defaults, options );

  if(fun == "toggle") {
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
    .data({"popupInit": 1})
    .click(function() {
      if($(this).parent().data("popupSettings").click) $(this).parent().popup("hide");
    });

  if(fun == "hide") {
    $("body").css("overflow", "auto");
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
    $("body").css("overflow", "hidden");
    this.find(".popup-backdrop,.popup-container").hide();
    this.show();
    this.find(".popup-container")
      .css({"top": 0 - (this.find(".popup-container").height()*1.5)})
      .show()
      .animate({
        "top": "50%"
      });
    if(this.data("popupSettings").backdrop) this.find(".popup-backdrop").fadeIn(500);
    else this.find(".popup-backdrop").css({"opacity":0}).show();
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
