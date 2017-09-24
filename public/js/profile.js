if ($("body").attr("id") == "profile") {
  var profileID = window.location.pathname.split("/")[2];
  var profilePage = window.location.pathname.split("/")[3];

  if(profilePage !== "stats") profilePage = "profile";

  portfolio.maxFilters = 2;
  portfolio.grid = 4;
  portfolio.user = profileID;

  $.ajax({
    url: "https://www.behance.net/v2/users/" + profileID,
    data: {
      client_id: config.client_id
    },
    dataType: "jsonp",
    success: function(data) {
      document.title = data.user.display_name + " | " + document.title;

      var template = $("#profileData").html();
      var compiledTemplate = Template7.compile(template);
      var context = data.user;
      context.current_page = profilePage;

      var html = compiledTemplate(context);
      $("#profile-sidebar").html(html);

      $("#profile-sidebar > *").hide().fadeIn(500);

      if(profilePage == "stats") {
        $("#profile-stats").show();
        $("#mixitup-container").remove();
        $("#loading").fadeOut();
      } else portfolio.load();
    },
    error: apiError
  });
}
