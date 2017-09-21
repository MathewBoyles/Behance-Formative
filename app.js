var express = require("express");
var path = require("path");
var fs = require("fs");
var app = express();

app.use(function(request, reponse, next) {
  console.log(`${request.method} request for ${request.url}`);
  next();
});

app.use(function(request, reponse, next) {
  var pageName = request.url.split("?")[0];
  if(pageName == "/home") pageName = "/index";
  else if(pageName.substr(0,9) == "/profile/") pageName = "/profile";

  var fullLink = path.join(__dirname, "public", pageName + ".html");
  if(fs.existsSync(fullLink)) {
    reponse.header({"Content-Type": "text/html"});
    reponse.send(fs.readFileSync(fullLink));
  }

  next();
});

app.use(express.static("./public"));

app.use("/packages", express.static(path.join(__dirname, "node_modules/")));

app.listen(3000);

console.log("Server running on port 3000");
