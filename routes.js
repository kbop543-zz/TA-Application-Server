'use strict';

var fs = require('fs');

var taObj;
var courseObj;

/*read ta file in to get applicants*/

fs.readFile('turing_tas.json', 'utf-8', function(err, data) {
    if(err) throw err;
    taObj = JSON.parse(data);
});

/*read courses file in to get courses*/

fs.readFile('courses.json', 'utf-8', function(err, data) {
    if(err) throw err;
    courseObj = JSON.parse(data);
});


/*Build get all applicants response. 
If status or name specifed, go to respective functions*/
exports.findAll = function(req, res) {


    if (req.query.status){
        exports.findByStatus(req.query.status,res);
    }
    else if (req.query.fname){
        exports.findByName(req.query.fname,res);
    }else{

    var tempTA = [];
    

    for( let i = 0; i< taObj.tas.length; i++){
        tempTA.push({
            "stunum" : taObj.tas[i].stunum,
            "givenname" : taObj.tas[i].givenname,
            "familyname" : taObj.tas[i].familyname,
            "status" : taObj.tas[i].status,
            "year" : taObj.tas[i].year});
    }

    var temp = {"tas" : tempTA };
    

    res.send(temp);
}
    

}

/*build response for get TA by status*/

exports.findByStatus = function(status,res) {



       var tempTA = [];
    

    for( let i = 0; i< taObj.tas.length; i++){
        if(status.toUpperCase() == taObj.tas[i].status.toUpperCase()){
        tempTA.push({
            "stunum" : taObj.tas[i].stunum,
            "givenname" : taObj.tas[i].givenname,
            "familyname" : taObj.tas[i].familyname,
            "status" : taObj.tas[i].status,
            "year" : taObj.tas[i].year});
    }
    }

    var temp = {"tas" : tempTA };
    

    res.send(temp);
}

/*build response for get TA by name*/

exports.findByName = function(name, res) {
     var tempTA = [];

    

    for( let i = 0; i< taObj.tas.length; i++){
        if(name.toUpperCase() == taObj.tas[i].familyname.toUpperCase()){
        tempTA.push({
            "stunum" : taObj.tas[i].stunum,
            "givenname" : taObj.tas[i].givenname,
            "familyname" : taObj.tas[i].familyname,
            "status" : taObj.tas[i].status,
            "year" : taObj.tas[i].year,
            "courses" : taObj.tas[i].courses});
    }
}


    var temp = {"tas" : tempTA };
    

    res.send(temp.tas[0]);
    
}

/*use req body to add a TA
Also validate if status is correct and course exists*/

exports.addOne = function(req, res,next) {
    var errorStunumFlag = false;
    var errorCourseFlag = false;
    var errorStatFlag = false;
    var errorCourseOnlyFlag = false;
    
    var newTA = req.body;

   

    var tempTA = [];
    var course =[];

    if(newTA.experience.length == 1){
    for(let j=0;j<courseObj.courses.length;j++){
        if(courseObj.courses[j].toUpperCase() == newTA.code.toUpperCase()){
            errorCourseOnlyFlag = true;
        }
    }}else{


    for(let k = 0; k< newTA.code.length;k++){
        for(let j=0;j<courseObj.courses.length;j++){
        if(courseObj.courses[j].toUpperCase() ===newTA.code[k].toUpperCase()){
            errorCourseFlag = true;
        }
        
    }
}
}


    if( newTA.status.toUpperCase() == "UNDERGRAD" ||
        newTA.status.toUpperCase() =="MSS" ||
        newTA.status.toUpperCase() == "PHD" ||
        newTA.status.toUpperCase() == "MSCAC" ||
        newTA.status.toUpperCase() =="MEND"){
        errorStatFlag = true;
    };

  

    for(let i=0; i<taObj.tas.length;i++){
            if(taObj.tas[i].stunum == newTA.stunum){

                errorStunumFlag= true;
            }   
        }



        if(errorStunumFlag){
            
            res.status(500).send("Error: duplicate student number");
        } else if(!errorCourseFlag && !errorCourseOnlyFlag){
            res.status(500).send("Error: that course code doesn't exist");
        }
        else if(!errorStatFlag ){
            res.status(500).send("Error: that status doesn't exist");
        }else{

            if(errorCourseOnlyFlag){
                course.push({
                    "code": newTA.code,
                    "rank": newTA.rank,
                    "experience": newTA.experience
                });
            }else{

            
                for(let j = 0; j< newTA.code.length;j++){
                course.push({
                    "code": newTA.code[j],
                    "rank": newTA.rank[j],
                    "experience": newTA.experience[j]
                });
            }
            }

            tempTA.push({
                "stunum" : newTA.stunum,
                "givenname" : newTA.givenname,
                "familyname" : newTA.familyname,
                "status" : newTA.status,
                "year" : newTA.year,
                "courses": course
            });
            req.body = tempTA;

            var temp = {"tas" : tempTA };

            taObj.tas.push(temp.tas[0]);


            res.send("Success");
        
    }

    }

/*delete a TA. If name or status specified go 
to respective functions*/
exports.delOne = function(req, res) {
    


    if (req.query.fname){
        exports.delByFname(req.query.fname,res);
    }
    else if (req.query.stunum){
        exports.delByStunum(req.query.stunum,res);
    }
}

/*delete ta by name. Check if student actually exists*/

exports.delByFname = function(name, res) {
    var flag = false;

    var indexToDel;

    for( let i = 0; i< taObj.tas.length; i++){
        if(name.toUpperCase() == taObj.tas[i].familyname.toUpperCase()){
            indexToDel = i;
            flag = true;
        }
    }
    if(!flag){
        res.status(500).send("Error: no such student");
    }else{

    taObj.tas.splice(indexToDel,1);

    res.send("Success");
}
};

/*delete ta by student name. Check if student exists*/

exports.delByStunum = function(stunum, res) {
    var flag=false;
    var indexToDel;

    for( let i = 0; i< taObj.tas.length; i++){
        if(stunum == taObj.tas[i].stunum){
            indexToDel = i;
            flag = true;
        }
    }
    if(!flag){
        res.status(500).send("Error: no such student");
    }else{

    taObj.tas.splice(indexToDel,1);

    res.send("Success");
}
};

/*Build response with all TAs and the courses they applied to*/

exports.findWithCourses = function(req, res) {


    if (req.query.course){
        exports.findByCourse(req.query.course,res);
    }else{

    var tempCour = [];
    var tempTA = []
    
for( let j = 0; j< courseObj.courses.length; j++){

    for( let i = 0; i< taObj.tas.length; i++){
        for(let k = 0; k<taObj.tas[i].courses.length;k++){
            if(courseObj.courses[j] === taObj.tas[i].courses[k].code){

                tempTA.push({
                    "code": courseObj.courses[j],
                    "stunum" : taObj.tas[i].stunum,
                    "givenname" : taObj.tas[i].givenname,
                    "familyname" : taObj.tas[i].familyname,
                    "status" : taObj.tas[i].status,
                    "year" : taObj.tas[i].year,
                    "ranking" : taObj.tas[i].courses[k].rank,
                    "experience" : taObj.tas[i].courses[k].experience,
                });

            }
            
        }

    }
    
}
for( let j = 0; j< courseObj.courses.length; j++){
    tempCour.push({
                    "code": courseObj.courses[j],
                    "tas" : []
                });
}


for( let j = 0; j< tempCour.length; j++){
    for(let i=0;i<tempTA.length;i++){
        if(tempCour[j].code ==tempTA[i].code)
            tempCour[j].tas.push({
                "stunum" : tempTA[i].stunum,
                    "givenname" : tempTA[i].givenname,
                    "familyname" : tempTA[i].familyname,
                    "status" : tempTA[i].status,
                    "year" : tempTA[i].year,
                    "ranking" : tempTA[i].ranking,
                    "experience" : tempTA[i].experience,
            })
    }
    
}
    



    var tempCourse = {"courses" : tempCour };





    res.send(JSON.stringify(tempCourse));
}
    
}

/*Build response with all TAs by user specifed course they applied to*/

exports.findByCourse = function(course, res) {

    var tempCour = [];
    var tempTA = []
    
for( let j = 0; j< courseObj.courses.length; j++){

    for( let i = 0; i< taObj.tas.length; i++){
        for(let k = 0; k<taObj.tas[i].courses.length;k++){
            if(courseObj.courses[j].toUpperCase() === taObj.tas[i].courses[k].code.toUpperCase()){

                tempTA.push({
                    "code": courseObj.courses[j],
                    "stunum" : taObj.tas[i].stunum,
                    "givenname" : taObj.tas[i].givenname,
                    "familyname" : taObj.tas[i].familyname,
                    "status" : taObj.tas[i].status,
                    "year" : taObj.tas[i].year,
                    "ranking" : taObj.tas[i].courses[k].rank,
                    "experience" : taObj.tas[i].courses[k].experience,
                });

            }
            
        }

    }
    
}
for( let j = 0; j< courseObj.courses.length; j++){
    tempCour.push({
                    "code": courseObj.courses[j],
                    "tas" : []
                });
}


for( let j = 0; j< tempCour.length; j++){
    for(let i=0;i<tempTA.length;i++){
        if(tempCour[j].code.toUpperCase() ==tempTA[i].code.toUpperCase())
            tempCour[j].tas.push({
                "stunum" : tempTA[i].stunum,
                    "givenname" : tempTA[i].givenname,
                    "familyname" : tempTA[i].familyname,
                    "status" : tempTA[i].status,
                    "year" : tempTA[i].year,
                    "ranking" : tempTA[i].ranking,
                    "experience" : tempTA[i].experience,
            })
    }
    
}
    



    var tempCourse = {"courses" : tempCour };


    var flag = false;

    var foundCourse = []



    for (let i=0;i<tempCourse.courses.length;i++){
        if(tempCourse.courses[i].code.toUpperCase() == course.toUpperCase()){
            foundCourse = {
                "code": tempCourse.courses[i].code,
                "tas" : tempCourse.courses[i].tas
            }
            flag = true;
        }
    }

    if(!flag){
        res.status(500).send("Error: no such course");
    }

    res.send(JSON.stringify(foundCourse));
    
}

