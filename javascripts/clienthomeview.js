$(document).ready(function () {
    if (parsedSSN !== undefined) {
        getfiles(parsedSSN);
    } else {
        console.log('no ssn passed');
    }

    $('input[type=text]').on('keydown', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            search();
        }
    });
});

function downloadFile(url) {
    console.log("downloading file at: " + url);
    window.location.assign('https://' + url);
}

function search() {
    console.log('search called');
    if ($('#searchInput').val() === '') {
        getfiles(parsedSSN);
    } else {
        $.getJSON('/search/' + $('#searchInput').val() + '/' + parsedSSN, function (result) {
            populateTable(result);
        });
    }
}

function getfiles(ssn) {
    var audiofiles;
    if (ssn.length === 10 && isNaN(ssn) !== true) {

        $.getJSON('/single' + ssn, function (data) {
            audiofiles = data;
        }).done(function () {
            if (audiofiles === undefined) {
                console.log('no data available');
            } else {
                populateTable(audiofiles);
            }
        });
    } else {
        console.log('Your ssn does not seem to be 10 digit long, please log in again.');
    }
}

function populateTable(audioData) {
    if (audioData !== undefined) {
        clearTable();
        $.each(audioData, function (index, value) {
            var table = document.getElementById('tableBody');
            if (table !== undefined) {
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
                audioPlayer.autoplay = false;

                cell1.innerHTML = value.metadata.date;
                cell2.innerHTML = value.metadata.doctor;
                cell3.innerHTML = value.metadata.location;
                cell4.innerHTML = value.metadata.duration + ' min.';
                cell6.innerHTML = '<button id="DEL' + index + '" onclick="deleteFile(\'' + value._id + '\')"><i class="fa fa-trash-o" aria-hidden="true"></i></button>';
                cell5.appendChild(audioPlayer);
            } else {
                console.log('no table found');
            }
        });
    } else {
        console.log("populate table failed");
    }
}

function clearTable() {
    var table = document.getElementById('tableBody');
    if (table !== undefined) {
        while (table.rows[1]) table.deleteRow(1);
    }
}

function deleteFile(id) {
    event.preventDefault();
    console.log('deleting: ' + id);

    var confirmation = confirm("Are you sure?");

    if (confirmation === true && id !== undefined && parsedSSN !== undefined) {
        $.ajax({
            type: 'POST',
            url: '/deletefile/' + id + '/' + parsedSSN
        }).done(function (err) {
            if (err) {
                console.log(err.message);
            } else {
                //alert("did not complete the delete" + response.err);
                console.log('file deleted');
                getfiles(parsedSSN); // repopulate table
            }
        });
    }
}