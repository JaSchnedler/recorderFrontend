
$(document).ready(function(){
    console.log('login.js loaded');
    //listeners();
});


function listeners() {
    $('#usernameSubmit').on('click' , readVal);

}

function readVal() {
    console.log("hello world");
    var inputVal = $('#usernameInput').val();
    $.get('/loginsuccess/'+inputVal).done(
    );

}