var mixer = mixitup($("#mixitup-container"), {
    selectors: {
        target: '.portfolio-item'
    },
    animation: {
        duration: 300
    }
});


// Get Lightfarm Studio Data
$.ajax({
  url: "http://www.behance.net/v2/projects?client_id=8hRTUTjbwsJrLqGZ0kgxT48GBmkwwM5g",
  dataType: "jsonp",
  success: function(data){
    console.log(data);
  },
  error: function(){
    console.log("something went wrong.");
  }
});
