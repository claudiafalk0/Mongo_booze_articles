function displayResults(data) {
    // Add to the table here...
    for (var i = 0; i < data.length; i++) {
        $("#addCarousel").append(`<div class='carousel-item'>
            <img src='${data[i].image}' class='d-block w-100' style='padding-top: 25px;' alt='cocktail image'/>
            <div class='carousel-caption d-none d-md-block'>
            <div id='infoBox'>${data[i].title}
            <a class="btn btn-primary" href='https://www.liquor.com/${data[i].link}' role='button' style='text-align:center'>View Article</a>
            <button type='button' data-id= '${data[i]._id}' class="btn btn-primary" data-toggle='modal' data-target='noteModal' style = 'text-align:center'>
            Make Notes
            </button>
            </div>
            </div>
            </div>`
    )};
    $("#addCarousel").find('.carousel-item').first().addClass('active');
};



$.getJSON('/articles', function (data) {
    displayResults(data);
});

$(document).on("click", "button", function() {
    // Empty the notes from the note section
    $("#notesModal").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notesTitle").append(data.title);
        // An input to enter a new title
        $("#newTitle").append();
        // A textarea to add a new note body
        $("textarea").append();
        // A button to submit a new note, with the id of the article saved to it
        $("#saveChanges").append("<data-id='" + data._id + "'>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#newTitle").val(data.note.title);
          // Place the body of the note in the body textarea
          $("textarea").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#saveChanges", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#newTitle").val(),
        // Value taken from note textarea
        body: $("textarea").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#newTitle").val("");
    $("textarea").val("");
  });