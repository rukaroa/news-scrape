//get article json
$(document).on("click", "#get-articles", function() {
    $.getJSON("/articles", function(data) {
        $("#saved-notes").empty()
        $("#articles").empty()
        for (var i = 0; i < data.length; i++) {
            //for each article
            var p = $("<p>");
            var item = data[i];

            p.attr("data-id", item._id);
            p.append("<b>Title:</b> <i>" + item.title + "</i> <br/>");
            p.append("<b>Link:</b> " + item.link + "<br/> <hr>");

            $("#articles").append(p);
        }
    });
});

//get notes
$(document).on("click", "#get-notes", function() {
    $.getJSON("/notes", function(data) {
        $("#articles").empty()
        $("#saved-notes").empty()
        for (var i = 0; i < data.length; i++) {
            //for each article
            var p = $("<p>");
            var item = data[i];

            p.attr("data-id", item._id);
            p.append("<b>Title:</b> <i>" + item.title + "</i> <br/>");
            p.append("<b>Note:</b> " + item.body + "<br/> <hr>");

            $("#saved-notes").append(p);
        }
    });
});
//not sure what's wrong with this block
// //whenever a p tag is clicked
// $(document).on("click", "p", function(){
// 	//empty notes
// 	$("#notes").empty();
// 	//store p tag ID
// 	var id = $(this).attr("data-id");
// 	console.log(id);

// 	$.ajax({
// 		method: "GET",
// 		url: "/articles/" + id
// 	}).done(function(data){
// 		console.log(data);

// 		//article title
// 		$("#notes").append("<h2>" + data.title + "</h2>");
// 		//note title
// 		$("#notes").append("<input id='titleinput' name='title' value='title'>");
// 		//text area
// 		$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
// 		//submit button
// 		$("#notes").append("<button data-id'" + data._id + "' id='savenote'>Save Note</button>");

// 		//if note exists in article, place note title in input and body of note in body textarea
// 		if (data.note) {
// 			$("#titleinput").val(data.note.title);
// 			$("#bodyinput").val(data.note.body);
// 		}
// 	});
// });

// //when savenote button is clicked
// $(document).on("click", "#savenote", function(){
// 	//get note ID
// 	var id = $(this).attr("data-id");
// 	console.log(id);

// 	//use POST request to change note
// 	$.ajax({
// 		method: "POST",
// 		url: "/articles/" + id,
// 		data: {
// 			title: $("#titleinput").val(),
// 			body: $("bodyinput").val()
// 		}
// 	}).done(function(data) {
// 		console.log(data);
// 		//empty notes after posting
// 		$("#notes").empty();
// 	});

// 	//removes title and input after posting
// 	$("#titleinput").val("title");
// 	$("#bodyinput").val("");
// });

//working block
// Whenever someone clicks a p tag
$(document).on("click", "#articles p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the note information to the page
        .done(function(data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#saved-notes p", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/notes/" + thisId
        })
        // With that done, add the note information to the page
        .done(function(data) {
            var button = $("<button>");
            button.attr("data-id", thisId);
            button.attr("id", "delete-note");
            button.append("Delete Note")

            var h2 = $("<h2>");
            h2.append(data.title);

            var p = $("<p>");
            p.append(data.body);

            $("#notes").append(h2, p, button);
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .done(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

//delete note
$(document).on("click", "#delete-note", function() {
    var thisId = $(this).attr("data-id");
    console.log(thisId);

    $.ajax({
        method: "GET",
        url: "/deleteNotes/" + thisId
    }).done(function(data) {
        $("#notes").empty();
        $("#notes").html("DELETED!");
    });
});