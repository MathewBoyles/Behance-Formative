var config = {
  user_id: "lightfarm",
  client_id: "THVb3iZMcUlK7Qzh2qgcbCcxk0seZlpV"
};

// 8hRTUTjbwsJrLqGZ0kgxT48GBmkwwM5g

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

loadTmpl("popup");
