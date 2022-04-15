import { io } from "socket.io-client";
import machineId from 'node-machine-id';
import fs from 'fs';

class OpenSocket {

    constructor(options) {

        options = options || {};

        this.developer_id = options.developer_id || false;
        this.project_id = options.project_id || false;
        this.client_token = options.client_token || false;
        this.server = options.server || 'https://socket.opensocket.ir';
        this.system_id = machineId.machineIdSync(true);

        this.onConnect = options.onConnect || (()=>{});
        this.onReceive = options.onReceive || (()=>{});
        this.onDisconnect = options.onDisconnect || (()=>{});
        this.onRegister = options.onRegister || (()=>{});
    }

     connect()  {
        if (!this.developer_id || !this.project_id || !this.client_token) {
            throw new Error('Config values ​​are not set. Please set developer_id, project_id, client_token');
        }

        this.user_token = this.getUserToken()

        if(this.user_token.length>5){
          this.register = true;
        }
        else{
          this.register = false;
        }

        var query = {
            register: this.register,
            time: new Date().getTime(),
            system_id: this.system_id,
            developer_id: this.developer_id,
            project_id: this.project_id,
            client_token: this.client_token,
            token:this.user_token,
            customer:'node-client'
        }

        if (this.user_token) {
            query.token = this.user_token;
        }

        const socket = io(this.server, {
            query: query
        });

        this.socket = socket;

        socket.on("connect", () => {
          console.log('connected to OpenSocket');
          this.onConnect()
        });

        socket.on("disconnect", () => {
            this.onDisconnect();
        });

        socket.on('receive',(message)=>{
            this.onReceive(message);
        })

        socket.on('register',(ob)=>{
          try {
            fs.writeFileSync('./id',ob.token);
            this.reconnect()
          } catch (e) {

          }
            this.onRegister(ob);
        })
    }

    disconnect(){
      this.socket.disconnect();
      this.socket.offAny();
    }

    reconnect(){
      console.log('trying register and reconnect ...');
      this.disconnect();
      setTimeout(()=>{
        this.connect();
      },3000)
    }

    getUserToken(){
      try {
        return fs.readFileSync('./id','utf8');
      } catch (e) {
        return '';
      }
    }


}

export { OpenSocket }
