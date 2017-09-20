function showItem(item) {
  $("#loading").fadeIn();

  if(isNaN(item)) item = $(this).data("projectData").id;

  $.ajax({
    url: "http://www.behance.net/v2/projects/" + item,
    data: {
      client_id: config.client_id
    },
    dataType: "jsonp",
    success: function(data) {
      var context = data.project;

      $.ajax({
        url: "http://www.behance.net/v2/projects/" + item + "/comments",
        data: {
          client_id: config.client_id,
          per_page: 20,
          page: 1
        },
        dataType: "jsonp",
        success: function(data) {
          context.comments = data.comments;

          var template = $("#portfolioPopup").html();
          var compiledTemplate = Template7.compile(template);
          var html = compiledTemplate(context);

          $("#portfolioPopupModal").remove();
          $("body").append(html);
          $("#portfolioPopupModal").popup();
          $("#loading").hide();
        }
      });
    }
  });
}
