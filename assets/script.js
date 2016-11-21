'use strict';

$(document).ready(function() {
    /*Set flags to false and hide the tables unless clicked*/
    var errorStatFlag = false;
    var errorNameFlag = false;
    var addAppFlag = false;
    var statFlag = false;
    var nameFlag = false;
    var errorAddFlag = false;
    var errorDelNameFlag = false;
    var errorDelStunumFlag = false;
    var clicked =false;
    $('#table').hide();
    $('#tableByStat').hide();
    $('#tableByName').hide();
    $('#CourseInfo').hide();
    $('#CourseTable').hide();
    var taObj;



/* Get all applicants */
    $('#getTa').click(function(e){
        var table = $('#table');
        let allRows = $('.getAllRows');

        allRows.remove(); //remove table and toggle view if already clicked
        table.toggle();

    
       $.get('applicants',function(data){
        
        
        taObj = data.tas;

        /* build table */
        
        for( let i = 0; i< taObj.length; i++){
            let row = $('<tr>').append(
            $('<td>').text(taObj[i].givenname),
            $('<td>').text(taObj[i].familyname),
            $('<td>').text(taObj[i].status),
            $('<td>').text(taObj[i].year)
            );
            row.attr('class', 'getAllRows')

            table.append(row);
            


            /* Sort the table. 
            Code adapted from:
            http://onwebdev.blogspot.com/2011/04/
            jquery-sorting-tables-alphabetically.html*/

            var rows = $('#table tr').get();

    
    
            rows.sort(function(a, b) {
    
            var A = $(a).children('td').eq(1).text().toUpperCase();
            var B = $(b).children('td').eq(1).text().toUpperCase();
      
            if(A < B) {
               return -1;
            }
      
            if(A > B) {
               return 1;
             }
      
            return 0;     });
            $.each(rows, function(index, row) {
    
            $('#table').children('tbody').append(row);     });
            e.preventDefault();
            //$('#table').show();
        };
     });
});


    /* Get TA by certain status*/
    $('#getTaByStat').click(function(e){

        if(statFlag){ 
     /*if user wants to find a new table remove the previous*/
            $('.rows').remove();
        }


        let statusVal = $('#status').val();

        statusVal = statusVal.toUpperCase();
        
        /*Check for invalid input*/
        if ( !statusVal ||
            (statusVal != 'UNDERGRAD' &&
            statusVal != 'MSC' &&
            statusVal != 'PHD' &&
            statusVal != 'MSCAC' &&
            statusVal != 'MENG' )){
            var list = $("#SearchByStat");
            let error = $('<p>').attr('id', 'error')
            let text = document.createTextNode( "Please type a valid status in the textbar.");
            error.append(text);
            
            if(!errorStatFlag){
                errorStatFlag = true;
                $('.rows').remove();
                list.append(error);
            }
            $('#error').remove();
                list.append(error);
    
        }else{
    
       $.get('applicants?status='+statusVal,function(data){
        let table = $('#tableByStat');


        let taAry = data.tas;

        /*Build the table*/
        

        let row = $('<tr>').append(
            $('<td>').text("Given Name"),
            $('<td>').text("Family Name"),
            $('<td>').text("Status"),
            $('<td>').text("Year")
            );
        table.append(row);
        row.addClass('rows')
        


        for( let i = 0; i< taAry.length; i++){
            let row = $('<tr>').append(
            $('<td>').text(taAry[i].givenname),
            $('<td>').text(taAry[i].familyname),
            $('<td>').text(taAry[i].status),
            $('<td>').text(taAry[i].year)
            );
            table.append(row);
            row.addClass('rows')
        }


            
            $('#tableByStat').show();
            statFlag = true;
            $('#error').remove();

     });
   }
});

/*Get TA by name */
    $('#getTaByName').click(function(e){

        /*remove previous table, if exists, to get new one */

        if(nameFlag){ 
     
            $('.courseRows').remove();

        }

        var nameVal = $('#name').val();
        
        /*Check for invalid input*/
        if ( !nameVal){
            var list = $("#SearchByFamName");
            var error = $('<div>').attr('id', 'error')
            let text = document.createTextNode("Please type a valid status in the textbar.");
            error.append(text);
            
            if(!errorNameFlag){
                errorNameFlag = true;
                $('.courseRows').remove();
                list.append(error);
            }else{
            $('#error').remove();
                list.append(error);
            }
    
        }else{
    
       $.get('applicants?fname='+nameVal,function(data){
        let table = $('#tableByName');
        let courseInfo = $('#CourseInfo');
        //var status = req.query.id;

        let taAry = data;

         
        /*Build table */       

        let firstrow = $('<tr>').append(
            $('<td>').text("Given Name"),
            $('<td>').text("Family Name"),
            $('<td>').text("Status"),
            $('<td>').text("Year")
            );
        table.append(firstrow);
        firstrow.addClass('courseRows')
        


            let nextrows = $('<tr>').append(
            $('<td>').text(taAry.givenname),
            $('<td>').text(taAry.familyname),
            $('<td>').text(taAry.status),
            $('<td>').text(taAry.year)
            );
            table.append(nextrows);
            nextrows.addClass('courseRows')

            
        nameFlag = true;
        $('#error').remove();

        /*Build course table */  

        let courseTable = $('#CourseInfo');



        let courserow = $('<tr>').append(
            $('<td>').text("Course Code"),
            $('<td>').text("Rank"),
            $('<td>').text("Experience")
            );
        courserow.addClass('courseRows')
        courseTable.append(courserow);

        for( let i = 0; i< taAry.courses.length; i++){
            let coursesrow = $('<tr>').append(
            $('<td>').text(taAry.courses[i].code),
            $('<td>').text(taAry.courses[i].rank),
            $('<td>').text(taAry.courses[i].experience)
            );
            coursesrow.addClass('courseRows')
            courseTable.append(coursesrow);

            $('#tableByName').show();
            $('#CourseInfo').show();
        }
    

     });
   }
});
    /*Append more course fields if user wants to apply
    to another course*/

    $('#addCourse').click(function(e){
        var courseField = $('#courseField');
        let courseName = $('<input/>').attr({ type: 'text', class: 'code', name: 'code'});
        let rank = $('<input/>').attr({ type: 'text', class: 'rank', name: 'rank' ,pattern: '[0-9]'});
        let experience =$('<input/>').attr({ type: 'text', class: 'experience'
            , name: 'experience', pattern: '[0-9]' });
        courseField.append("Course code:");
        courseField.append(courseName);
        courseField.append("<br/>");
        courseField.append("Rank:");
        courseField.append(rank);
        courseField.append("<br/>");
        courseField.append("Experience:");
        courseField.append(experience);
        courseField.append("<br/>");
        courseField.append("<br/>")
        }); 

    /*If user presses course submit button send it off and 
    check for errors*/

    $('#applicantForm').submit(function(){
       
        sendForm();
        return false;
    })
        
        /*Check for errors and build JSON .
        Code adapted from 
        http://stackoverflow.com
        /questions/1184624/convert
        -form-data-to-javascript-
        object-with-jquery*/

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


    function sendForm(){
        let formData = $('form').serializeArray();

    
        $.post('/applicants', formData,function(data){
            if(!addAppFlag){
            addAppFlag = true;
            $('#AddApplicant').append("Applicant has been sent for submission!");
            
        }
        })
        .fail(function(response){
            
            alert(response.responseText);
            

        });

    }

    /*Delete applicant by family name*/

    $("#delByNameButton").click(function (e) {
        e.preventDefault();
        let name = $('#delByName').val();
        
        /*delete user messges if they are there*/
        $('#delByNameError').remove();
        $('#delStunumMsg').remove();

        /*if User submitted an empty field*/

        if ( !name){
            var list = $("#DelByFname");
            var error = $('<div>').attr('id', 'delByNameError')
            let text = document.createTextNode("You can not submit an empty field.");
            error.append(text);
            

                list.append(error);
        }else{
        $.ajax({
            
            url: '/applicants?fname=' + name,
            type: 'DELETE',
            success: function result() {
                if(!errorDelNameFlag){
                errorDelNameFlag = true;
                let msg = $('<div>').attr('id', 'delStunumMsg')
                let text = document.createTextNode("Applicant has been deleted.");
                msg.append(text);
                $('#DelByFname').append(msg);
                
            }},
            error: function(response){
                alert(response.responseText);
            }
        });
    }

    });

    /*Delete applicant by student name*/

    $("#delByStunumButton").click(function (e) {
        e.preventDefault();
        let stunum = $('#delByStunum').val();
/*delete user messges if they are there*/
        $('#delByStunumError').remove();
        $('#delStunumMsg').remove();

        if ( !stunum){
            var list = $("#DelByStunumField");
            var error = $('<div>').attr('id', 'delByStunumError')
            let text = document.createTextNode("You can not submit an empty field.");
            error.append(text);
            

                list.append(error);
        }else{

        $.ajax({
            
            url: '/applicants?stunum=' + stunum,
            type: 'DELETE',
            success: function result() {
                if(!errorDelStunumFlag){
                errorDelStunumFlag = true;
                let msg = $('<div>').attr('id', 'delStunumMsg')
                let text = document.createTextNode("Applicant has been deleted.");
                msg.append(text);
                $('#DelByStunumField').append(msg);
                
            }},
            error: function(response){
                alert(response.responseText);
            }
            
        });
    }

    });

    /*Get all TAs seperated by courses*/

    $('#TaByCourseBtn').click(function(e){



        var field = $('#ListWithCourses');

        if(clicked){
            
            $('.courseTable').remove();
            clicked = false;
            return;

        }else{

        
    
       $.get('courses',function(data){
        
        $('.courseTable').toggle();
        
        
        var courseAry = JSON.parse(data);
        var courseObj = courseAry.courses;
        
        var field = $('#ListWithCourses');


        
        for( let i = 0; i< courseObj.length; i++){
            let title = $('<span>').attr('class', 'courseTable')
            let text = document.createTextNode(courseObj[i].code);
            title.append(text);
            
            field.append(title);
            title.append("<br/>");

            var course = courseObj[i].tas;
            clicked = true;

            /*Build the table*/

            var table = $('<table></table>').attr('class', 'courseTable');
            table.attr('id',courseObj[i].code);
            table.append("<tbody></tbody>");
            
            let header = $('<tr>').append(
            $('<th>').text("Ranking"),
            $('<th>').text("Experience"),
            $('<th>').text("Status"),
            $('<th>').text("Given Name"),
            $('<th>').text("Familyname")
            );
            header.attr('class','courseTable');

            table.append(header);

            for( let j = 0; j< course.length; j++){

            let row = $('<tr>').append(
            $('<td>').text(course[j].ranking),
            $('<td>').text(course[j].experience),
            $('<td>').text(course[j].status),
            $('<td>').text(course[j].givenname),
            $('<td>').text(course[j].familyname)
            );
            row.attr('class','courseTable rowsThatMatter');
            table.append(row);
            
            

            /* Sort the table. 
            Code adapted from:
            http://onwebdev.blogspot.com/2011/04/
            jquery-sorting-tables-alphabetically.html*/

            var rows = $('#'+courseObj[i].code+ ' tr').get();

    
    
            rows.sort(function(a, b) {
    
            var A = $(a).children('td').eq(0).text().toUpperCase();
            var B = $(b).children('td').eq(0).text().toUpperCase();
      
            if(A < B) {
               return -1;
            }
      
            if(A > B) {
               return 1;
             }
      
            return 0;     });
            $.each(rows, function(index, row) {
    
            $('#'+courseObj[i].code).children('tbody').append(row);     });
            e.preventDefault();

            field.append(table);
            

        };
    }
     });
   }
});

    /*Get certain TAs that applied to a certain course*/

    $('#SearchByCourseBtn').click(function(e){

        $('#error').remove();
        $('.byCourseTable').remove();

        

        var field = $('#SearchByCourseField');

        var courseName = $('#SearchByCourse').val();


        if ( !courseName){
            
            var error = $('<div>').attr('id', 'error')
            let text = document.createTextNode("Please type a valid course code in the textbar.");
            error.append(text);
            field.append(error);

    
        }else{

        

        $.get('courses?course='+courseName,function(data){
        
        
        var courseAry = JSON.parse(data);
        


        /*Build table*/

        var table = $('<table></table>').attr('class', 'byCourseTable');
            table.attr('id',courseAry.code+'one');
            table.append("<tbody></tbody>");
            
            let header = $('<tr>').append(
            $('<th>').text("Ranking"),
            $('<th>').text("Experience"),
            $('<th>').text("Status"),
            $('<th>').text("Given Name"),
            $('<th>').text("Familyname")
            );
            header.attr('class','byCourseTable');

            table.append(header);


            var course = courseAry.tas;


            for( let j = 0; j< course.length; j++){

            let row = $('<tr>').append(
            $('<td>').text(course[j].ranking),
            $('<td>').text(course[j].experience),
            $('<td>').text(course[j].status),
            $('<td>').text(course[j].givenname),
            $('<td>').text(course[j].familyname)
            );
            row.attr('class','byCourseTable ');
            table.append(row);
            
            

            /* Sort the table. 
            Code adapted from:
            http://onwebdev.blogspot.com/2011/04/
            jquery-sorting-tables-alphabetically.html*/

            var rows = $('#'+courseAry.code+ 'one tr').get();

    
    
            rows.sort(function(a, b) {
    
            var A = $(a).children('td').eq(0).text().toUpperCase();
            var B = $(b).children('td').eq(0).text().toUpperCase();
      
            if(A < B) {
               return -1;
            }
      
            if(A > B) {
               return 1;
             }
      
            return 0;     });
            $.each(rows, function(index, row) {
    
            $('#'+courseAry.code+'one').children('tbody').append(row);     });
            e.preventDefault();

            field.append(table);
        
        }

        })
        .fail(function(response){
            
            alert(response.responseText);

        });
    }
     });

        
});



