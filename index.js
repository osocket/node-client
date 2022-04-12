import {OpenSocket} from "./OpenSocket.js";


const config = {
    developer_id : '6252a91b8092a03ad643ffe4',
    project_id:'6252a92a38d8a650240ea802',
    client_token:'c19e6a619de250beca26bbc0bd3125dd349c311007793f044ab258b11e832627',


    onConnect:onConnect,
    onReceive:onReceive,
    onRegister:onRegister,
    onDisconnect:onDisconnect,
}

var osocket = new OpenSocket(config);


/*
 * Connect to server 
*/
osocket.connect();


function onConnect(){
    console.log('connect main');
}

function onReceive(msg){
    console.log('onReceive',msg);
}

function onRegister(token){
    console.log('onRegister',token);
}

function onDisconnect(){
    console.log('onDisconnect');
}
// osocket.onConnect(()=>{
//     console.log('on connect');
// })

// import http  from 'http';
// import fs from 'fs';

// const options = {
// //   key: fs.readFileSync('key.pem'),
// //   cert: fs.readFileSync('cert.pem')
// };

// http.createServer(options, function (req, res) {
//   res.writeHead(200);
//   res.end("hello world\n");
// }).listen(8000);
