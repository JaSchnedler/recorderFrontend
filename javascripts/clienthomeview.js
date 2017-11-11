
$(document).ready(function(){
    if(parsedSSN !== undefined){
        getfiles(parsedSSN);
    }else{console.log('error...');}
    //console.log(singleContent);


    $('input[type=text]').on('keydown', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            search();
        }
    });
});

function downloadFile(url){
    console.log("downloading file at: " + url);
    window.location.assign('https://' + url);
}

function search(){
    console.log('search called');
    if($('#searchInput').val() === ''){
        getfiles(parsedSSN);
    }else{
        $.getJSON('/search/' + $('#searchInput').val() + '/' + parsedSSN, function (result) {
            populateTable(result);
        });
    }
}

function getfiles(ssnParsed){
    event.preventDefault();
    var audiofiles;
    if(ssnParsed.length === 10 && isNaN(ssnParsed) !== true){

        $.getJSON('/single' + ssnParsed, function(data){
             audiofiles = data;
        }).done(function () {
            if(audiofiles === undefined){
                console.log('no data available');
            }else {
                populateTable(audiofiles);
            }
        });
    }else{
        console.log('Your ssn does not seem to be 10 digit long, please log in again.');
    }
}

function populateTable(audioData){
    if(audioData !== undefined) {
        clearTable()
        $.each(audioData, function (index, value) {
            var table = document.getElementById('tableBody');
            var row = table.insertRow(1);

            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);

            var audioPlayer = document.createElement('audio');
            //audioPlayer.src = '/audiofiles/file1.wav';
            audioPlayer.src = "http://localhost:3001/getaudio/:" + value._id;
            audioPlayer.type = 'audio/wav';
            audioPlayer.controls = 'controls';
            audioPlayer.preload = 'auto';

            cell1.innerHTML = value.metadata.date;
            cell2.innerHTML = value.metadata.doctor;
            cell3.innerHTML = value.metadata.location;
            cell4.innerHTML = value.metadata.duration + ' min.';
            cell6.innerHTML = '<button id="DEL'+index+'" onclick="deleteFile(\'' + value._id + '\')"><i class="fa fa-trash-o" aria-hidden="true"></i></button>';
            cell5.appendChild(audioPlayer);
        });
    }else{
        console.log("populate table json get failed");
    }
}

function clearTable(){
    var table = document.getElementById('tableBody');
    while(table.rows[1]) table.deleteRow(1);
}

function deleteFile(objectID){
    event.preventDefault();
    console.log('deleting: ' + objectID);

    var confirmation = confirm("Are you sure?");

    if(confirmation === true){
        $.ajax({
                type: 'POST',
                url: '/deletefile/' + objectID + '/' + parsedSSN
            }).done(function (err) {
                if(err){
                    console.log(err.message);
                }else{
                    //alert("did not complete the delete" + response.err);
                    console.log('file deleted');
                }
        });
    }

    //getfiles(parsedSSN); //may or may not work, need data for testing

}