var userListData = [];
var singleContent = [];

var soundfiles = [];
$(document).ready(function(){
    populateTable();
});

function populateTable() {
    var tableContent = "";
    $.getJSON('/users/userlist', function(data){
            userListData = data; //dont for large datasets
            $.each(data, function () {
                tableContent += '<tr>';
                tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.ssn + '">' + this.ssn + '</a></td>';
                //tableContent += '<td>' + this.soundfiles[0] + '</td>';
                tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
                tableContent += '</tr>';

            });

        $('#userList table tbody').html(tableContent);
        $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
        $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
        $('#addUserBtn').on('click' , addUser);
        $('#modifyUserBtn').on('click' , modifyUser);
        $('#searchBtn').on('click' , getfiles);
    });
}

function getfiles(){
    event.preventDefault();
    console.log("getting files from: " + 'users/single'+ $('#search').val());
    var ssn = $('input#search').val();

    $.getJSON('/users/single' + ssn, function(data){
        singleContent = data;

    }).done(function () {

        if(singleContent !== undefined) {
            $('#userssn').text(singleContent[0].ssn);
            $.each(singleContent[0].soundfiles, function (index, value) {
                var table = document.getElementById('userInfoTable');
                var row = table.insertRow(1);

                var link = document.createElement('a');
                link.textContent = '1/1/2017 - placeholder';
                link.setAttribute('href', "http://" + value);

                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.appendChild(link);
                cell2.innerHTML = "here is a place";
            });
            $('#pathlist').html(makeUL(singleContent[0].soundfiles));
        }else{
        }
    });
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
            url: 'users/adduser',
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
                url: '/users/deleteuser' + $(this).attr('rel')
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