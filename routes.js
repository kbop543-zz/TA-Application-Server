'use strict';

var fs = require('fs');

var taObj;
fs.readFile('turing_tas.json', 'utf-8', function(err, data) {
    if(err) throw err;
    taObj = JSON.parse(data);
});


exports.findAll = function(req, res) {


    if (req.query.status){
        exports.findByStatus();
    }
    if (req.query.familyname){
        exports.findByName();
    }

    var temp = '{"tas" : [';

    var size = taObj.tas.length;
    
    for( let i = 0; i< taObj.tas.length-1; i++){
         temp = temp + 
        ' {'+ 
            ' "stunum" :'+ ' " '+taObj.tas[i].stunum + ' " ,'+
            ' "givenname" :'+ ' " '+taObj.tas[i].givenname + ' " ,'+
            ' "familyname" :'+' " '+taObj.tas[i].familyname + ' " ,'+
            ' "status" :' +' " '+taObj.tas[i].status + ' " ,' +
            ' "year" :' +' " '+taObj.tas[i].year + ' " '+ '} ,';
    }
    // get the last element without a comma seperating the fields
    temp = temp + 
        ' {'+ 
            ' "stunum" :'+ ' " '+taObj.tas[size-1].stunum + ' " ,'+
            ' "givenname" :'+ ' " '+taObj.tas[size-1].givenname + ' " ,'+
            ' "familyname" :'+' " '+taObj.tas[size-1].familyname + ' " ,'+
            ' "status" :' +' " '+taObj.tas[size-1].status + ' " ,' +
            ' "year" :' +' " '+taObj.tas[size-1].year + ' " '+ '} ';
    temp = temp + ']' +' }';
    //var tempp = JSON.parse(temp);
    res.send(JSON.parse(temp));
    //res.send(temp);

}

exports.findByStatus = function(req, res) {
    var status = req.query.status;

    var temp = '{"tas": [';
    
    for( let i = 0; i< taObj.length; i++){
        if(taObj[i].status == status){
            temp = temp + 
        '{'+ 
            " stunum : "+ taObj[i].stunum+
            " givenname : "+ taObj[i].givenname+
            " familyname : "+taObj[i].familyname+
            " status: " +taObj[i].status,
            " year: " +taObj[i].year+
        '}'
    }
}
    temp = temp + ' ] '+'}';
    
    res.send(JSON.stringify(temp));
}

exports.findByName = function(req, res) {
    var name = req.query.familyname;

    var temp = '{"tas": [';
    
    for( let i = 0; i< taObj.length; i++){
        if(taObj[i].familyname == name){
            temp = temp + 
        '{'+ 
            " stunum : "+ taObj[i].stunum+
            " givenname : "+ taObj[i].givenname+
            " familyname : "+taObj[i].familyname+
            " status: " +taObj[i].status,
            " year: " +taObj[i].year+
        '}'
    }
}
    temp = temp + ' ] '+'}';
    
    res.send(JSON.stringify(temp));
    
}

exports.addOne = function(req, res) {
    console.log(req.body);
    var newTA = req.body;
    
    taObj.longlist.push(newTA);
    console.log("Success:");
    console.log(JSON.stringify(taObj));
    res.send("Success");
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