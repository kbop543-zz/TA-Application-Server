'use strict';

$(document).ready(function() {
    /*Set flags to false and hide the tables unless clicked*/
    var errorStatFlag = false;
    var errorNameFlag = false;
    var statFlag = false;
    var nameFlag = false;
    $('#table').hide();
    $('#tableByStat').hide();
    $('#tableByName').hide();
    $('#CourseInfo').hide();




    $('#getTa').click(function(e){
    
       $.get('applicants',function(data){
        let table = $('#table');
        let taObj = JSON.parse(data);
        //console.log(taAry);
        let taAry = taObj.tas;
        
        for( let i = 0; i< taAry.length; i++){
            let row = $('<tr>').append(
            $('<td>').text(taAry[i].givenname),
            $('<td>').text(taAry[i].familyname),
            $('<td>').text(taAry[i].status),
            $('<td>').text(taAry[i].year)
            );
            table.append(row);
            
            
            $('#getTa').prop("disabled",true);

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
            $('#table').show();
        };
     });
});
    $('#getTaByStat').click(function(e){

        if(statFlag){ 
     /*if user wants to find a new table remove the previous*/
            $('.rows').remove();
        }

        let statusVal = $('#status').val();
        
        /*Check for invalid input*/
        if ( !statusVal ||
            (statusVal != 'Undergrad' &&
            statusVal != 'MSc' &&
            statusVal != 'PhD' &&
            statusVal != 'MScAC' &&
            statusVal != 'MEng' )){
            var list = $("#SearchByStat");
            var error = $('<p>').attr('id', 'error')
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
    
       $.get('applicants?status?status='+statusVal,function(data){
        let table = $('#tableByStat');
        //var status = req.query.id;

        let taObj = JSON.parse(data);
        console.log(taObj);
        let taAry = taObj.tas;

        let row = $('<tr>').append(
            $('<td>').text("Given Name"),
            $('<td>').text("Family Name"),
            $('<td>').text("Status"),
            $('<td>').text("Year")
            );
        row.addClass('rows')
        table.append(row);
        
        for( let i = 0; i< taAry.length; i++){
            if(taAry[i].status == statusVal){
            let row = $('<tr>').append(
            $('<td>').text(taAry[i].givenname),
            $('<td>').text(taAry[i].familyname),
            $('<td>').text(taAry[i].status),
            $('<td>').text(taAry[i].year)
            );
            row.addClass('rows')
            table.append(row);


            
            $('#tableByStat').show();
            statFlag = true;
            $('#error').remove();
        }
        }
     });
   }
});

    $('#getTaByName').click(function(e){

        if(nameFlag){ 
     
            $('.rows').remove();
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
                $('.rows').remove();
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

        let taObj = JSON.parse(data);
        //console.log(taObj);
        let taAry = taObj.tas;


        let firstrow = $('<tr>').append(
            $('<td>').text("Given Name"),
            $('<td>').text("Family Name"),
            $('<td>').text("Status"),
            $('<td>').text("Year")
            );
        firstrow.addClass('rows')
        table.append(firstrow);

        for( let i = 0; i< taAry.length; i++){
            if(taAry[i].familyname == nameVal){
                var NameAry = taAry[i];
            let nextrows = $('<tr>').append(
            $('<td>').text(NameAry.givenname),
            $('<td>').text(NameAry.familyname),
            $('<td>').text(NameAry.status),
            $('<td>').text(NameAry.year)
            );
            nextrows.addClass('rows')
            table.append(nextrows);
        }
    }
            
        nameFlag = true;
        $('#error').remove();

        let courseTable = $('#CourseInfo');



        let courserow = $('<tr>').append(
            $('<td>').text("Course Code"),
            $('<td>').text("Rank"),
            $('<td>').text("Experience")
            );
        courserow.addClass('rows')
        courseTable.append(courserow);

        for( let i = 0; i< NameAry.courses.length; i++){
            let coursesrow = $('<tr>').append(
            $('<td>').text(NameAry.courses[i].code),
            $('<td>').text(NameAry.courses[i].rank),
            $('<td>').text(NameAry.courses[i].experience)
            );
            coursesrow.addClass('rows')
            courseTable.append(coursesrow);

            $('#tableByName').show();
            $('#CourseInfo').show();
        }
    

     });
   }
});



});



