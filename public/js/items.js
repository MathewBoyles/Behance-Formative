var pauseHash = false;

function showItem(item) {
  $("#loading").fadeIn();

  if (isNaN(item)) item = $(this).data("projectData").id;

  $.ajax({
    url: "https://www.behance.net/v2/projects/" + item,
    data: {
      client_id: config.client_id
    },
    dataType: "jsonp",
    success: function(data) {
      if(data.project.mature_content) {
        matureFilter(data.project.url);
        return false;
      }

      var context = data.project;

      $.ajax({
        url: "https://www.behance.net/v2/projects/" + item + "/comments",
        data: {
          client_id: config.client_id,
          per_page: 20,
          page: 1
        },
        dataType: "jsonp",
        success: function(data) {
          var popupPreviousTitle = document.title;

          document.title = context.name;
          pauseHash = true;
          window.location.hash = "view=" + context.id;

          context.comments = data.comments;

          var template = $("#portfolioPopup").html();
          template = template.replace(/<!--b-->/g, "");
          var compiledTemplate = Template7.compile(template);
          var html = compiledTemplate(context);

          $("#portfolioPopupModal").remove();
          $("body").append(html);
          $("#portfolioPopupModal").popup().bind("closed", function() {
            document.title = popupPreviousTitle;
            window.history.pushState({}, document.title, window.location.href.split("#")[0]);
            $("#portfolioPopupModal").remove();
          });
          $("#loading").hide();
        },
        error: apiError
      });
    },
    error: apiError
  });
}

$(window).on("hashchange", function() {
  if (pauseHash) pauseHash = false;
  else if (window.location.hash.substr(0, 6) == "#view=" && !isNaN(window.location.hash.substr(6))) showItem(window.location.hash.substr(6));
  else if ($("#portfolioPopupModal").is(":visible")) $("#portfolioPopupModal").popup("hide");
}).trigger("hashchange");
