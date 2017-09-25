var projectDatesArray = [];
var projectDates = {
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
var projectDatesOR = projectDates;

if ($("body").attr("id") == "profile") {
  var profileID = window.location.pathname.split("/")[2];
  var profilePage = window.location.pathname.split("/")[3];

  portfolio.maxFilters = 2;
  portfolio.grid = 4;
  portfolio.user = profileID;
  portfolio.chart = true;

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

      google.charts.load("current", {
        "packages": ["corechart"]
      });
      google.charts.setOnLoadCallback(function() {
        portfolio.load();
      });
    },
    error: apiError
  });
}

function drawChart() {
  projectDatesArray = [];
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
    },
    backgroundColor: {
      fill: "transparent"
    },
    colors: ["#618f62"]
  };

  var chart = new google.visualization.LineChart(document.getElementById("history-chart"));
  chart.draw(dataTable, options);
}
