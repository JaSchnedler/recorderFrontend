
$(document).ready(function(){
    console.log('login.js loaded');
    //listeners();
});


function listeners() {
    $('#logOutBtn').on('click' , readVal);

}

function readVal() {
    console.log("hello world");
    var inputVal = $('#usernameInput').val();
    $.get('/loginsuccess/'+inputVal).done(
    );

}