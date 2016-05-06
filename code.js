// MAIN VARIABLES

//track what is in basket:
in_basket = []

window.onload=function() {
  $("#list").append("<li>wow this works</li>");
  loadData();
  setTimeout(buildPage,1);
}

function buildPage() {
  // First deal with the meal tabs
  var container = document.getElementById("tabContainer_meals");
  var innercontainer = document.getElementById("innerwrapper");
  // set current tab
  var navitem = container.querySelector(".tabs ul li");
  //store which tab we are on
  ident = navitem.id.split("_")[1];
  navitem.parentNode.setAttribute("data-current",ident);
  //set current tab with class of activetabheader
  navitem.setAttribute("class","tabActiveHeader");
  //hide two tab contents we don't need
  var pages = innercontainer.querySelectorAll(".conpage");
  for (var i = 1; i < pages.length; i++) {
    pages[i].style.display="none";
  }

  //this adds click event to tabs
  var tabs = container.querySelectorAll(".tabs ul li");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].onclick=displayMeal;
  }

  mealgroups = [0,1,2];

  for (mi in mealgroups) {
    // get tab container
    var container = document.getElementById("tabContainer_"+mealgroups[mi]);
    // set current tab
    var navitem = container.querySelector(".tabs ul li");

    if (navitem==null) {
      setTimeout(buildPage,1);
      return
    }
    //store which tab we are on
    ident = navitem.id.split("_")[1];
    navitem.parentNode.setAttribute("data-current",ident);
    //set current tab with class of activetabheader
    navitem.setAttribute("class","tabActiveHeader");

    //hide two tab contents we don't need
    var pages = container.querySelectorAll(".tabpage");
    for (var i = 1; i < pages.length; i++) {
      pages[i].style.display="none";
    }

    //this adds click event to tabs
    var tabs = container.querySelectorAll(".tabs ul li");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].onclick=displayPage;
    }
  }
}

function loadData() {
  $.getJSON("data.json",{}, function( data ){ 
    /*  # do stuff here  */ 
    recipes = data.recipes;
    buildHTML();
  });
}

function buildHTML() {
  c = 0;
  // Using RECIPES
  for (i in recipes) {
    in_basket[i] = 0;
    var recipe = recipes[i];
    var cname = recipe.name;
    var quant = recipe.quantities;
    var ings = recipe.ingredients;
    var group = recipe.group;
    var ctext = recipe.text;
    // Add the header
    $("#tabList_"+group).append("<li id=\"tabHeader_" + c + "\">" + cname + "</li>");
    // Add the content page
    $("#tabscontent_"+group).append("<div class=\"tabpage\" id=\"tabpage_"+ c + "\"> <h2>"+cname+"</h2> <ul id=\"list_"+c+"\"> </ul> <br> <p>"+ctext+"</p>  <button type=\"button\" id=\"button_"+c+"\" onclick=\"clicked("+c+");\">+</button> </div>");
    // Add the ingredients
    for (j in ings) {
      cing = ings[j];
      qtext = metric2imperial(quant[j],"cup");
      $("#list_"+c).append("<li>" + qtext + " " + cing +"</li>")
    }
    c++;
  }
}

function clicked(id) {
  var flip = [1, 0];
  var tflip = ["-","+"]
  $("#button_"+id).html(tflip[in_basket[id]]);
  in_basket[id] = flip[in_basket[id]];
  buildBasket();
}

function buildBasket() {
  $("#basketContent").empty();
  $("#groceryList").empty();
  all_ings = [];
  all_quants = [];
  for (i in in_basket) {
    if (in_basket[i]==1) {
      var recipe = recipes[i];
      $("#basketContent").append("<li>"+ recipe.name + "</li>");
      var ings = recipe.ingredients;
      var quants = recipe.quantities;
      for (j in ings) {
        cing = ings[j];
        cquant = quants[j];
        found = false;
        for (k in all_ings) {
          if (all_ings[k]==cing) {
            all_quants[k] += cquant;
            found = true;
          }
        }
        if (!found) {
          all_ings.push(cing);
          all_quants.push(cquant);
        }
      }
    }
  }

  for (i in all_ings) {
    var qtext = metric2imperial(all_quants[i],"cup");
    $("#groceryList").append("<li>"+qtext+" "+all_ings[i]+"</li>");
  }
}

function saveData() {
  $.saveJ
}

function displayMeal() {
  var current = this.parentNode.getAttribute("data-current");
  //remove class of activetabheader and hide old contents
  document.getElementById("mealtab_" + current).removeAttribute("class");
  document.getElementById("tabContainer_" + current).style.display="none";

  var ident = this.id.split("_")[1];
  //add class of activetabheader to new active tab and show contents
  this.setAttribute("class","tabActiveHeader");
  document.getElementById("tabContainer_" + ident).style.display="block";
  this.parentNode.setAttribute("data-current",ident);

}

// on click of one of tabs
function displayPage() {
  var current = this.parentNode.getAttribute("data-current");
  //remove class of activetabheader and hide old contents
  document.getElementById("tabHeader_" + current).removeAttribute("class");
  document.getElementById("tabpage_" + current).style.display="none";

  var ident = this.id.split("_")[1];
  //add class of activetabheader to new active tab and show contents
  this.setAttribute("class","tabActiveHeader");
  document.getElementById("tabpage_" + ident).style.display="block";
  this.parentNode.setAttribute("data-current",ident);
}

//Measures:
//pinch = 
//1 tsp = 5ml
//1 tbsp = 15ml
//1/4 cup = 60 ml
//1/3 cup = 80 ml
//1/2 cup = 120 ml
//1 cup = 240 ml
//1 pint = 480 ml
//1 quart = 960 ml
//1 gallon = 4*960 ml :)
function metric2imperial(grams,maxunit) {
  var amts = [4*960,960,480,240,15,5,1];
  var units = ["gallon","quart","pint","cup","tbsp","tsp","pinch"]

  var string = "";
  var passed = false;
  for (ui in units) {
    if (units[ui]==maxunit || passed) {
      // we start here!
      passed = true;
      var cur = Math.floor(grams / amts[ui]);
      var grams = grams % amts[ui];
      if (cur > 0) {
        if (cur > 1) {
          string = string + " " + cur + " " + units[ui] + "s";
        } else {
          string = string + " " + cur + " " + units[ui];
        }
      }
    }
  }
  return string;
}