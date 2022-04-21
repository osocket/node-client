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

        this.user_token = this.userToken()

        if(this.user_token && this.user_token.length>5){
          this.register = true;
        }
        else{
          this.register = false;
        }

        var lastTime = this.lastTime();


        var query = {
            register: this.register,
            time: lastTime,
            system_id: this.system_id,
            developer_id: this.developer_id,
            project_id: this.project_id,
            client_token: this.client_token,
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

            try {

              if(message.time){
                this.lastTime(message.time);
              }

              if (message.callback) {
                socket.emit("receive-answer", message.message_id , this.userToken());
              }

            } catch (e) {
              console.error(e);
            }
        })

        socket.on('register',(ob)=>{
          this.setConfig(ob);
          this.onRegister(ob);
          this.reconnect();
        })
    }

    disconnect(){
      this.socket.disconnect();
      this.socket.offAny();
    }

    reconnect(){
      console.log('Register and reconnecting ...');
      this.disconnect();
      setTimeout(()=>{
        this.connect();
      },3000)
    }

    setConfig(json){
      try {
        var config = this.getConfig();
        fs.writeFileSync('./oconfig',JSON.stringify({
          ...config,
          ...json
        }));
      } catch (e) {
        console.error(e);
      }
    }

    getConfig(){
      try {
        return JSON.parse(fs.readFileSync('./oconfig','utf8'));
      } catch (e) {
        return {};
      }
    }

    userToken(){
      try {
        return this.getConfig().token || '';
      } catch (e) {
        return '';
      }
    }

    lastTime(update){
      var config = this.getConfig();

      if(update){
        config.lastTime = update;
        this.setConfig(config);
      }
      else{
        if(config.lastTime){
          return config.lastTime
        }
        else{
          var lastTime = new Date().getTime();
          this.lastTime(lastTime); // update lastTime
        }
      }
    }


}

export { OpenSocket }
