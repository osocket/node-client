# node-client

## Install
``
npm i osocket
``



### example :

```JS

import {OpenSocket} from 'osocket';

const config = {

    developer_id : '...',
    project_id:'...',
    client_token:'.....',


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
  console.log('onConnect',msg);
}

function onReceive(msg){
    console.log('onReceive',msg);
}

function onRegister(result){
    console.log('onRegister',result);
}

function onDisconnect(){
    console.log('onDisconnect');
}

```
