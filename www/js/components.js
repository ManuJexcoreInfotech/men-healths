function loadComponents() {
  console.log('loading components...');
  $("#component-sidebar").load("component-sidebar.html");
  $("#component-header").load("component-header.html");
  // $("#component-header").append(sidebar);
  // $("#component-header").append(header);
  $("#component-footer").load("component-footer.html");
}

$(document).ready(function() {
  console.log('ready..');
  setTimeout(loadComponents(), 5000);

});

// $(document).on('pageinit', function() {
//   console.log('ready..');
//   loadComponents();
// });

//
// $(window).load(function() {
//   console.log('load..');
//   loadComponents();
// });
