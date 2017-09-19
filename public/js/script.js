if ($("#mixitup-container").is("*")) {
  var mixer = mixitup($("#mixitup-container"), {
    selectors: {
      target: '.portfolio-item'
    },
    animation: {
      duration: 300
    }
  });
}


// Template ajax request
// $.ajax({
//   url: "url",
//   dataType: "json",
//   success: function(data){
//     console.log(data);
//   },
//   error: function(){
//     console.log("something went wrong.");
//   }
// });
