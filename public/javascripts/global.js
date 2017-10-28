var userListData = [];
var singleContent = [];

var soundfiles = [];
$(document).ready(function(){
    console.log("global.js loaded");
    parsedSSN = '1710911211'; //stub to make life easy
    if(parsedSSN !== undefined){
        getfiles(parsedSSN);
    }else{console.log('error...');}
    //console.log(singleContent);
});

function downloadFile(index){
    console.log("downloading file number: " + index + ' belonging to ' + singleContent[0].ssn);
    window.location.assign('https://' + singleContent[0].soundfiles[index]);
}

function goToLogin() {
    console.log('get login to be called now');
    $.get('/login');
}

function search(searchVal){
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

    if(ssnParsed.length === 10 && isNaN(ssnParsed) !== true){
        console.log("getting files from: " + 'users/single'+ ssnParsed);

        $.getJSON('/single' + ssnParsed, function(data){
            singleContent = data;

        }).done(function () {
            populateTable(singleContent[0].soundfiles, false);

        });
    }else{
        console.log('Your ssn does not seem to be 10 digit long, please log in again.');

    }

}
function populateTable(userdata, isPopulated){
    if(userdata !== undefined) {
        if(isPopulated){

            var table = document.getElementById('userInfoTable');
            while(table.rows[2]) table.deleteRow(2);
        }
        $.each(userdata, function (index, value) {
            console.log('creating row');
            var table = document.getElementById('userInfoTable');
            var row = table.insertRow(1);
            var link = document.createElement('a');
            link.textContent = '1/1/2017 - placeholder';
            link.setAttribute('href', "http://" + value);

            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);

            cell1.appendChild(link);
            cell2.innerHTML = "Doctor John";
            cell5.innerHTML = '<button id="DL'+index+'" onclick="javascript:downloadFile('+index+')"><i class="fa fa-download" aria-hidden="true"></i></button>';
            cell3.innerHTML = "Skejby";
            cell4.innerHTML = "Long time";
            cell6.innerHTML = "Delete?";

        });
        //$('#pathlist').html(makeUL(userdata));
        //console.log("singlecontent after populate:");
        //console.log(userdata);
    }else{
        console.log("populate table json get failed (getFiles)");
    }
}

function showUserInfo(){

    event.preventDefault();
    var thisUsername = $(this).attr('rel');
    console.log(thisUsername);
    var arrayPosition = userListData.map(function(arrayItem){return arrayItem.ssn;}).indexOf(thisUsername);
    soundfiles = userListData[arrayPosition].soundfiles;
    console.log(soundfiles);
    var thisUserObject = userListData[arrayPosition];
    $('#userssn').text(thisUserObject.ssn);
    $('#useremail').text(thisUserObject.email);
    console.log(makeUL(soundfiles));
}
function addUser(){
    event.preventDefault();

    var errorCount = 0;
    $('#addUser input').each(function (index, val) {
       if($(this).val()===''){errorCount++;}
    });

    if(errorCount ===0) {
        var newUser = {
            "ssn": $('#addUser fieldset input#inputSSN').val(),
            "email": $('#addUser fieldset input#inputEmail').val(),
            "name": $('#addUser fieldset input#inputName').val(),
            "soundfiles": [$('#addUser fieldset input#inputPath').val()]
        };

        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/adduser',
            dataType: 'JSON'
        }).done(function (response) {
            if (response.msg === '') {
                $('#addUser fieldset input').val('');
                populateTable();
                return true;
            } else {
                alert("Error" + response.msg);
                return response.msg;
            }
        });
    }else{
        alert("please fill all fields");

    }
}
function deleteUser(){
    event.preventDefault();

    var confirmation = confirm("u sure?");
    if(confirmation === true){
        $.ajax({
                type: 'DELETE',
                url: 'deleteuser' + $(this).attr('rel')
            }).done(function (response) {
                if(response === ''){
                    console.log('table populated');
                }else{
                    //alert("did not complete the delete" + response.err);
                }
        });
    }else{
        alert("user not deleted");
    }
    populateTable();
}
function modifyUser(){
    event.preventDefault();
    var confirmation = confirm("u sure?");
    if(soundfiles != undefined && soundfiles.isArray) {
        soundfiles = soundfiles.push($('#addUser fieldset input#inputPath').val());
    }else{
        console.log("array:" + soundfiles.isArray);
        soundfiles[0]='no files available yet';
    }
    var modifyUser = {
        "ssn": $('#addUser fieldset input#inputSSN').val(),
        "email": $('#addUser fieldset input#inputEmail').val(),
        "name": $('#addUser fieldset input#inputName').val(),
        "soundfiles": soundfiles,
    };

    if(confirmation === true){
        $.ajax({
            type: 'UPDATE',
            url: '/users/modifyuser' + modifyUser.ssn
        }).done(function (response) {
            if(response === ''){
                console.log('table populated');
            }else{
                //alert("did not complete the delete" + response.err);
            }
        });
    }else{
        alert("user not modified");
    }
    populateTable();

}

function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');

    for(var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');
        var link = document.createElement('a');
        link.textContent = singleContent[0].ssn.toString();
        link.setAttribute('href', "http://" + array[i]);
        // Set its contents:
        item.appendChild(link);

        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}