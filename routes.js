var fs = require('fs');

// Putting the data in this file is a hack. Even when using
// a json file as data, we should really put the data management
// in a file separate from the routes file.
var taObj;
fs.readFile('tas.json', 'utf-8', function(err, data) {
    if(err) throw err;
    taObj = JSON.parse(data);
});


exports.findAll = function(req, res) {
    res.send(JSON.stringify(taObj));
};

exports.findByStatus = function(req, res) {
    var status = req.params.status;
    res.send(JSON.stringify(taObj.tas[status]));
};
/*
exports.addOne = function(req, res) {
    console.log(req.body);
    var newBook = req.body;
    
    bookObj.longlist.push(newBook);
    console.log("Success:");
    console.log(JSON.stringify(bookObj));
    res.send("Success");
};
*/
/* NOTE:  I was fixed the bug that prevented delete from working correctly in 
 * class (and I was clearly hallucinating when I "thought it worked" the night before.
 * The bug was the result of two mistakes.  I did not set up the ajax 
 * request correctly in showBooks.js, and I didn't turn the string into an int
 * before using it to index into the array.
 */

/* While I was thinking about different ways to pass the index of the boox
 * to delete, I realized that my original approach was not RESTful.  I have
 * reimplmented the delete function so that it includes the id as part of the
 * resource.  (See showBooks.js)
 */

/*  The original fixed but non-RESTful version of delete
exports.delOne = function(req, res) {
    console.log(req.body);
    // req.body.num gives us the value of the field with the key "num"
    // parseInt turns it into a string
    var num = parseInt(req.body.num);

    // Deleting an element from a JS array leaves an "undefined" hole,
    // it doesn't shift elements over.  Splice allows you to remove
    // an element from the array
    bookObj.longlist.splice(num-1,1);
    console.log("Success:");
    console.log(JSON.stringify(bookObj));
    res.send("Success");
};


exports.delById = function(req, res) {
    var id = parseInt(req.params.id);
    bookObj.longlist.splice(id-1,1);
    console.log("Success:");
    console.log(JSON.stringify(taObj))
    res.send("Success");
};
*/

