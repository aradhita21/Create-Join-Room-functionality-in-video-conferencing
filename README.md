Room functionality feature where seperate rooms are created and once every user in that room leaves, room is available again for the allotment to the new user.

The signaling server uses Node.js and `ws` and can be started as 
follows:
```
$ npm install
$ npm start
```
With the server running, open Chrome and go to to `https://localhost:8443` from any client on the LAN.
click on create room and note the room Id and share it with everyone
Click on join room button and enter the room ID alloted when window is promted
User will join the room ID written by him
Once every user from a particular room leaves, room is available again for the allotment to the new user.
