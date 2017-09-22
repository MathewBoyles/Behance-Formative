var cookies = {};
var cookiesTEMP = document.cookie.split(";");

for (var i = 0; i < cookiesTEMP.length; i++) {
  var cookieTHIS = cookiesTEMP[i].split("=");
  cookies[cookieTHIS[0]] = cookieTHIS[1];
}

var config = {
  user_id: "lightfarm",
  client_id: cookies.CLIENT_ID ? cookies.CLIENT_ID : "8hRTUTjbwsJrLqGZ0kgxT48GBmkwwM5g"
};

function numberFormat(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function breakLines(str) {
  return str.replace(/(?:\r\n|\r|\n)/g, "<br />");
}

function loadTmpl(tmpl) {
  $.ajax({
    url: "/tmpl/" + tmpl + ".html",
    success: function(data) {
      $("body").append(data);
    }
  });
}

function apiError() {
  $("#loading").hide();
  $("#apiError").remove();
  $el = $("<div />");
  $el
    .attr("id", "apiError")
    .addClass("popup")
    .addClass("popup-auto")
    .append("<div />")
    .find("div:last")
    .addClass("popup-backdrop")
    .parent()
    .append("<div />")
    .find("div:last")
    .addClass("popup-container")
    .addClass("row")
    .append("<div />")
    .find("div:last")
    .addClass("popup-content")
    .addClass("col-12")
    .append("<div />")
    .find("div:last")
    .append("<h5 />")
    .find("h5:last")
    .text("Oops, something has gone wrong!")
    .parent()
    .append("<p />")
    .find("p:last")
    .text("It appears your connection to the Behance database has been lost. Please reload and try again.");
  $("body").append($el);
  $("#apiError").popup("show", {
    click: false,
    keyboard: false
  });
}

loadTmpl("popup");
