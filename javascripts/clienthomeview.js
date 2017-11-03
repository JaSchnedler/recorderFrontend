
$(document).ready(function(){
    if(parsedSSN !== undefined){
        getfiles(parsedSSN);
    }else{console.log('error...');}
    //console.log(singleContent);
});

function downloadFile(url){
    console.log("downloading file at: " + url);
    window.location.assign('https://' + url);
}

function goToLogin() {
    console.log('get login to be called now');
    //$.get('/login');
    $.post('/addfile');
}

function search(searchval){
    console.log('search called');
    var matchArray = [];

    $.each(singleContent[0].soundfiles, function (index, value) {

        //line of thought: if the string matches:
        // the date --> add the file to the array
        // the location --> add the file to the array
        //stub for impl purposes:
        var evalVal = Math.random();
        if(evalVal < 0.5){
            matchArray.push(value);
        }
    });
    populateTable(matchArray, true);

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
                populateTable(audiofiles, false);
            }
        });
    }else{
        console.log('Your ssn does not seem to be 10 digit long, please log in again.');
    }
}

function populateTable(audioData, isPopulated){
    if(audioData !== undefined) {
        if(isPopulated){

            var table = document.getElementById('userInfoTable');
            while(table.rows[2]) table.deleteRow(2);
        }
        $.each(audioData, function (index, value) {
            var table = document.getElementById('userInfoTable');
            var row = table.insertRow(1);
            var link = document.createElement('a');
            link.textContent = audioData[index].date;
            link.setAttribute('href', "http://" + value);

            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);

            var audioPlayer = document.createElement('audio');
            //audioPlayer.src = '/audiofiles/file1.wav';
            audioPlayer.src = "/audiofiles/temp.wav";
            audioPlayer.type = 'audio/wav';
            audioPlayer.controls = 'controls';
            audioPlayer.preload = 'auto';

            cell1.appendChild(link);
            cell2.innerHTML = audioData[index].doctor;
            cell3.innerHTML = audioData[index].place;
            cell4.innerHTML = audioData[index].Duration + ' min.';
            cell5.appendChild(audioPlayer);
            cell6.innerHTML = '<button id="DEL'+index+'" onclick="deleteFile(\'' + audioData[index]._id + '\')"><i class="fa fa-trash-o" aria-hidden="true"></i></button>';
        });
    }else{
        console.log("populate table json get failed (getFiles)");
    }
}

function getAudioFilePath(path) {
    var filepath = '/getaudio';
    $.ajax({url:filepath, success: function (data) {
        console.log(data);
        filepath  = data;
    }});
    return filepath;
}

function deleteFile(objectID){
    event.preventDefault();
    console.log('deleting: ' + objectID);
    var confirmation = confirm("u sure?");
    if(confirmation === true){
        $.ajax({
                type: 'DELETE',
                url: '/deletefile' + objectID
            }).done(function (response) {
                if(response === ''){
                    console.log('table populated');
                }else{
                    //alert("did not complete the delete" + response.err);
                }
        });
    }else{
        alert("file not deleted");
    }
    getfiles(parsedSSN); //may or may not work, need data for testing
}