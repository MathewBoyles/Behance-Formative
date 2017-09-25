if ($("body").attr("id") == "profile") {
  var profileID = window.location.pathname.split("/")[2];
  var profilePage = window.location.pathname.split("/")[3];

  if (profilePage !== "stats") profilePage = "profile";

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
      $("#profile-wrapper").html(html);

      $("#profile-sidebar > *").hide().fadeIn(500);

      if (profilePage == "stats") {
        google.charts.load("current", {
          "packages": ["corechart"]
        });
        google.charts.setOnLoadCallback(drawChart);
      } else portfolio.load();
    },
    error: apiError
  });
}

var projectDates;

function drawChart() {
  $.ajax({
    url: "https://www.behance.net/v2/users/" + profileID + "/projects",
    data: {
      client_id: config.client_id,
      per_page: 100,
      page: 1
    },
    dataType: "jsonp",
    success: function(data) {
      var projectDatesArray = [];
      projectDates = {
        "January": 0,
        "February": 0,
        "March": 0,
        "April": 0,
        "May": 0,
        "June": 0,
        "July": 0,
        "August": 0,
        "September": 0,
        "October": 0,
        "November": 0,
        "December": 0
      };

      for (var i = 0; i < data.projects.length; i++) projectDates[moment(data.projects[i].published_on * 1000).format("MMMM")]++;

      for (var key in projectDates) {
        projectDatesArray.push({
          Month: key,
          Count: projectDates[key]
        });
      }

      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn("string", "Month");
      dataTable.addColumn("number", "Project Count");

      for (var l = 0; l < projectDatesArray.length; l++) dataTable.addRow([projectDatesArray[l].month, projectDatesArray[l].Count]);

      var maxValue = Object.keys(projectDates).map(function(key) {
        return projectDates[key];
      });
      maxValue = Math.max.apply(null, maxValue);

      var options = {
        title: "Posts per Month",
        width: "100%",
        height: "100%",
        legend: "none",
        vAxis: {
          title: "Project Count",
          minValue: maxValue,
          gridlines: {
            count: (maxValue + 1)
          }
        },
        hAxis: {
          title: "Month",
          showTextEvery: 1
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById("history-chart"));
      chart.draw(dataTable, options);

      $("#loading").fadeOut();
    }
  });
}
