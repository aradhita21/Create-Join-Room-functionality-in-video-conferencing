const HTTPS_PORT = 8443; //default port for https is 443
const HTTP_PORT = 8001; //default port for http is 80
var express = require('express');
var app = express();
const exphbs = require('express-handlebars'); //to use handlebars with express
const bodyParser = require('body-parser');//parse the request body for authentication

const fs = require('fs');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;


const serverConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

// ----------------------------------------------------------------------------------------
app.engine('handlebars',exphbs({defaultLayout : 'main'}));//express engine, layout=main.handlebars
app.set('view engine','handlebars');//engine is viewed as handlebars
app.use(bodyParser.urlencoded({ extended: true })); //parse url request
app.use(bodyParser.json())//parse json requests
app.use("/static", express.static('./static/'));//used to access webrtc.js file in static folder
require('./routes/index')(app);//used to access index.js in routes //no need, all elements are included here


const httpsServer = https.createServer(serverConfig, app);
httpsServer.listen(HTTPS_PORT);

// ----------------------------------------------------------------------------------------
details = [];
clients = [];

room = ['abc','def','123'];
for (var i=0; i<room.length; i++){
  var client = new Array();
  var detail = new Array();
  
  details[i] = detail
  clients[i] = client } //creating 2D array of clients for all the rooms

  emptyclient = clients;
  roomUsed = []; 
  roomUnused = [];
  roomOccupied = [];
  roomAvail = room; // initially, all rooms are available


///-----------------------------------------------------------------------
// Create a server for handling websocket calls
const wss = new WebSocketServer({ server: httpsServer });

wss.on('connection', function (ws) { //connection established
  ws.on('message', function (message) {
   recv = JSON.parse(message) 

   if(recv.status == 'close'){ //if person is already joined,  
  console.log("details length", details.length, details)
    for (var j=0; j<room.length; j++){//search for the room joined
     if(recv.roomjoined == room[j]){ //broadcast to the room joined by client
      const index = roomUsed.indexOf(recv.roomjoined);
      console.log("const index", index)
      if (index > -1) {
          roomUsed.splice(index, 1);  //remove the index value and shift array by 1
          console.log(roomUsed, "roomused"); 
          roomOccupied = removeDuplicateRoom(roomUsed) //for finding room occupied
          console.log(roomOccupied, "roomoccupied");
          for(var i=0; i<details.length; i++){ //for removing client
            if(recv.uuid == details[index][i]){ //details array inclue uuid of all connected clients
              const index2 = details[index].indexOf(recv.uuid); //find index
              if (index2 > -1) {
                  details[index].splice(index2, 1); //remove uuid of user with closed status 
                clients[index].splice(index2, 1);    }//remove ws info of user with closed status
        console.log("index, index2, uuid length, client length",index,index2 ,details[index].length, clients[index].length )}
      }//for loop
       
      }
    }} }  
  

    else{
  
      if(recv.roomID == 'joined'){ //if person is already joined, 
    for (var i=0; i<room.length; i++){//search for the room joined
      if(recv.roomjoined == room[i]){ //broadcast to the room joined by client
      console.log('roomjoined : ',recv.roomjoined) 
        wss.trybroadcast(message, i) 
        break; } } //once found, break the loop
  }

  else{
    ws.room = recv.roomID //received room id of client
    console.log(recv, "recieved")
    for (var i=0; i<room.length; i++){ //search for that room
      if(ws.room == room[i]) { //when room found
        roomUsed.push(room[i]) //push in room used
        clients[i].push(ws) //push clients in 2d array, with roomid
        details[i].push(recv.uuid)
        console.log(details, "details")
        roomOccupied = removeDuplicateRoom(roomUsed) //for finding room occupied
        console.log("room occupied",roomOccupied)
        wss.trybroadcast(message, i) //broadcast message
         break; }
  }
 //{console.log('no room')}     
}
    } 

roomAvailable(room,roomOccupied,roomUnused); //find the available rooms
roomAvail = roomUnused; // for sending it to client to create room
console.log("room available", roomAvail); 
roomUnused = []; //empty it to push available rooms again
});
  ws.on('error', () => ws.terminate());
});

//-------------------------------------------------------------------
 

////-------- room available
roomAvailable = function(array1,array2,array3){ // 1 = available, 2 = rooms in server, 3 = room in use
 for(var i = 0; i < array1.length; i++){
     var found = false;
     for(var j = 0; j < array2.length; j++){ // j < is missed;
      if(array1[i] == array2[j]){
       found = true;
       break; }
    }
    if(found == false){ // find the uncommon elements from all rooms and room used
    array3.push(array1[i]);} //push those elements in available rooms
 }
}
/////------for removing duplicate rooms 
removeDuplicateRoom = function(room){
  var array = room; //rooms in server
  var outputArray = [];
  var count = 0;
  var start = false;
  for (j = 0; j < array.length; j++) { 
    for (k = 0; k < outputArray.length; k++) { 
        if ( array[j] == outputArray[k] ) { 
            start = true; } 
    } 
    count++; 
    if (count == 1 && start == false) { 
        outputArray.push(array[j]); } //push unique elemnets in the outputarray
    start = false; 
    count = 0; } 
room = outputArray;
return room;
}
///------- broadcasting to clients in room
wss.trybroadcast = function(data,roomnumber) { //send roomnumber(i) for clients to join
for(var i in clients[roomnumber]) {
         clients[roomnumber][i].send(data); //send data to all clients in room
        // console.log('received:',roomnumber);  
  } 
}

console.log('Server running.');

