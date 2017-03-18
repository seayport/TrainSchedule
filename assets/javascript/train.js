$(document).ready(function() {
// initialize firebase
// =========================================
  var config = {
      apiKey: "AIzaSyCKuo8Y26m59VgbsfLcsWcxkxhqeRVwwhE",
      authDomain: "trainschedule-12246.firebaseapp.com",
      databaseURL: "https://trainschedule-12246.firebaseio.com",
      storageBucket: "trainschedule-12246.appspot.com",
      messagingSenderId: "832723061501"
    };

  firebase.initializeApp(config);

  //display current time//console.log(moment().format("DD/MM/YY hh:mm A"));
  var clientTime = (moment().format("MM/DD/YY hh:mm A"));
    $("#clientTime").append(clientTime);

//create a variable to reference the database
  var database = firebase.database();

// Set up variables
  var trainName = "";
  var destination = "";
  var start = 0;
  var frequency = 0;
  var nextTime = [];

 // Capture Button Click
    $("#add-train-btn").on("click", function() {
    // Don't refresh the page!
      event.preventDefault();

    // Grabbed values from text boxes
      trainName = $("#train-name-input").val().trim();
      destination = $("#place-input").val().trim();
      start = $("#start-input").val().trim();
      frequency = $("#frequency-input").val().trim();

      console.log(start);

      // Code for handling the push
      database.ref().set({
        trainName: trainName,
        destination: destination,
        start: start,
        frequency: frequency,
        //client timestamp
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
      });
 
     // Clear the form
    $("#train-name-input").val(" ");
    $("#place-input").val(" ");
    $("#start-input").val(" ");
    $("#frequency-input").val(" ");
 });

    // Firebase watcher + initial loader HINT: .on("value")
  database.ref().on("child_added", function(childSnapshot) {
 
 console.log(snapshot.val().name);
 
// Store everything into a variable. t stand for train ya'll.
    var tName = childSnapshot.val().trainName;
    var tDestination = childSnapshot.val().Destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrainTime;

// To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain 
//time and find the modulus between the difference and the frequency  
    var differenceTimes = moment().diff(moment.unix(tFirstTrain), "minutes");
    var tRemainder = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency;
    var tMinutes = tFrequency - tRemainder;

// To calculate the arrival time, add the tMinutes to the currrent time
    var tArrival = moment().add(tMinutes, "m").format("hh:mm A");
     
    if (tMinutes <= 5 ) {
    $("#5min").append(
        "<tr>" +
        "<td>" + tName + "</td>" +
        "<td>" + tDestination + "</td>" +
        "<td>" + tFrequency + "</td>" +
        "<td>" + tArrival + "</td>" +
        "<td><font color='red'>" + tMinutes + "</td></font>" + "</tr>");
    return;
    }

//Pushing to the DOM
    $("#mainTable").append(
        "<tr>" +
        "<td>" + tName + "</td>" +
        "<td>" + tDestination + "</td>" +
        "<td>" + tFrequency + "</td>" +
        "<td>" + tArrival + "</td>" +
        "<td>" + tMinutes + "</td>" + "</tr>"
    );   
// Handle the errors
  }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
   });

});
    
