$(document).ready(function() {
    $('#getTa').click(buildTable());
})




function buildTable(){
    console.log("um");
    $.get('applicants',function(data){
        let table = $('#table');
        let taObj = JSON.parse(data);
        let taAry = taObj.tas;
        for( let i = 0; i< taAry.length; i++){
            let row = $('<tr>').append(
            $('<td>').text(taAry[i].givenname),
            $('<td>').text(taAry[i].familyname),
            $('<td>').text(taAry[i].status),
            $('<td>').text(taAry[i].year)
            );
            table.append(row);
        }
     });
}
