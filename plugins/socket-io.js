import io from "socket.io-client";
import store from "../store/store";

class Io {

    constructor() {
    }

    init() {

        let user = store.getters.app("user"),
            options = {
                suioUrl: "https://support.send-up.net/",
                suioPath: "/suio",
                room: `pim-${user.idc}`,
            },
            payload = {
                userId : user.id,
                username : user.name,
                room : options.room,
            }
        ;

        this.socket = io(options.suioUrl + 'chat/', {path: options.suioPath});
        this.options = options;
        this.payload = payload;

        this.socket.emit('join', this.payload); // join room

        this.socket.on('connect', () => {
            console.log( `Connect : ${this.socket.id} ` + this.options.room );
        });

        this.socket.on('reconnect', (attempt) => {
            setTimeout(() => {
                this.socket.emit('join', this.payload); // join room
            }, 1000);

        });

        this.socket.on('join', (data) => {
            console.log('join', data);
        });

        this.socket.on('leave', (data) => {
            console.log('leave');
        });

        this.socket.on('message', (data) => {
            // pim:import
            // pim:toaster
            document.dispatchEvent(new CustomEvent(data.message.type, { 'detail': data.message }));
        });
    }
}

const socket = new Io();

export default socket;


