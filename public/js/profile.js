if ($("body").attr("id") == "profile") {
  var profileID = window.location.pathname.split("/")[2];

  portfolio.maxFilters = 2;
  portfolio.grid = 4;
  portfolio.user = profileID;

  $.ajax({
    url: "http://www.behance.net/v2/users/" + profileID,
    data: {
      client_id: config.client_id
    },
    dataType: "jsonp",
    success: function(data) {
      var template = $("#profileData").html();
      var compiledTemplate = Template7.compile(template);

      var html = compiledTemplate(data.user);
      $("#profile-sidebar").html(html);

      portfolio.load();
    }
  });
}
