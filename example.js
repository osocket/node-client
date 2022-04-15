import {OpenSocket} from "./OpenSocket.js";


const config = {
  
    developer_id : '',
    project_id:'',
    client_token:'',


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
    console.log('connect main',osocket.getUserToken());
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
