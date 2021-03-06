var Article = require("./../models/Article.js");
var Note = require("./../models/Note.js");
var request = require("request");
var cheerio = require("cheerio");

module.exports = function(app) {
    //index display
    app.get("/", function(req, res) {
        res.render("index");
    });

    //scrape website
    app.get("/scrape", function(req, res) {
        request("http://reddit.com", function(error, resp, html) {
            var $ = cheerio.load(html);

            $("p.title").each(function(i, element) {

                var result = {};

                //get title and link
                result.title = $(this).text();
                result.link = $(element).children().attr("href");

                var entry = new Article(result);

                entry.save(function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                    }
                });
            });
        });

        res.send("Scape complete");
    });

    //get all articles
    app.get("/articles", function(req, res) {
        Article.find({}).sort({"_id": -1}).exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.json(doc);
            }
        });
    });

    //get article by ID
    app.get("/articles/:id", function(req, res) {
        Article.findOne({
                "_id": req.params.id
            })
            .populate("note")
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    res.json(doc);
                }
            })
    });

    //get notes
    app.get("/notes/", function(req, res) {
        Note.find({}).sort({"_id": -1}).exec(function(err, data){
                if (err) {
      return console.log(err);
    }
    else {
      res.json(data);
    }
        });
    });


    //get notes
    app.get("/notes/:id", function(req, res) {
        Note.findOne({
                "_id": req.params.id
            })
            .populate("note")
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    res.json(doc);
                }
            })
    });

    //delete notes
    app.get("/deleteNotes/:id", function(req, res) {
        Note.remove({
            "_id": req.params.id
        }, function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.send(doc);
            }
        });
    });

    //create new note or replaces existing note
    app.post("/articles/:id", function(req, res) {
        var newNote = new Note(req.body);

        newNote.save(function(err, data) {
            if (err) {
                console.log(err);
            } else {
                Article.findOneAndUpdate({
                        "_id": req.params.id
                    }, {
                        "note": data._id
                    })
                    .exec(function(err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send(doc);
                        }
                    });
            }
        });
    });
};