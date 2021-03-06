/*Reference: https://dev.to/brunooliveira/flask-series-part-6-improving-user-input-with-autocomplete-4e06*/

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += '<input type="hidden" value="' + arr[i] + '">';
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

/*An array containing the songs to search*/
d3.dsv(",", "/static/spotify_songs.csv", function(d) {
  return {
    song: d.song_name,
    artist: d.artist,
    album: d.album
  }
}).then(function(data){
  var songs=data.map(function(d){return d.song})
  song_artist=data.map(function(d){return d.song+" | "+d.artist + " | "+d.album})
  
  autocomplete(document.getElementById("autocomplete"), song_artist);
  

})

window.onload=function(){

/*https://stackoverflow.com/questions/47006027/display-values-of-multiple-input-type-range-in-one-page*/

var labels=["Much Lower (--)","Slightly Lower (-)","Similar (=)","Slightly Higher (+)","Much Higher (++)"] 
function updateLabel() {
  var limit = this.parentElement.getElementsByClassName("rangeVal")[0];
  limit.innerHTML = labels[this.value-1];
}

var slideContainers = document.getElementsByClassName("rangeslider");

for (var i = 0; i < slideContainers.length; i++) {
  var slider = slideContainers[i].getElementsByClassName("myslider")[0];
  updateLabel.call(slider);
  slider.oninput = updateLabel;
}




};

/* function range(start, end) {
var ans = [];
for (let i = start; i <= end; i++) {
    ans.push(i);
}
return ans;
}
nums=range(1,20)
console.log(nums)

$(document).ready(function(){$.each(nums,function(index,value) {
console.log('#iframe'+value)
$('#iframe'+value).on('load',function() {            
  if($.trim($(this).contents().find("div").length) == 0) {
    $(this).hide();
  } else if($.trim($(this).contents().find("pre").length)>1){
    $(this).hide();
  }
  console.log($.trim($(this).contents().length))
});
});});
*/


