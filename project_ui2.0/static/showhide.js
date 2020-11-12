// https://stackoverflow.com/questions/16308779/how-can-i-hide-show-a-div-when-a-button-is-clicked
var button_beg = '<button id="button" onclick="showhide()">', button_end = '</button>';
    var show_button = 'Show Spotify Results', hide_button = 'Hide Spotify Results';
    function showhide() {
        var div = document.getElementById( "hide_show" );
        var showhide = document.getElementById( "showhide" );
        if ( div.style.display !== "none" ) {
            div.style.display = "none";
            button = show_button;
            showhide.innerHTML = button_beg + button + button_end;
        } else {
            div.style.display = "block";
            button = hide_button;
            showhide.innerHTML = button_beg + button + button_end;
        }
    }
    function setup_button( status ) {
        if ( status == 'show' ) {
            button = hide_button;
        } else {
            button = show_button;
        }
        var showhide = document.getElementById( "showhide" );
        showhide.innerHTML = button_beg + button + button_end;
    }
    window.onload = function () {
        setup_button( 'hide' );
        showhide(); // if setup_button is set to 'show' comment this line
    }
