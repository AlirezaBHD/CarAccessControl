import * as signalR from '@microsoft/signalr';
import {API_CONFIG} from "./api.js";

class SignalRService {
    constructor() {
        this.connection = null;
        this.onNewAccessEvent = null;
    }

    startConnection = async () => {
        try {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(`${API_CONFIG.BASE_URL}/hubs/access-events`)
                .withAutomaticReconnect()
                .build();

            this.connection.on('NewAccessEvent', (accessEvent) => {
                if (this.onNewAccessEvent) {
                    this.onNewAccessEvent(accessEvent);
                }
            });

            await this.connection.start();
            console.log('SignalR Connected');

            await this.connection.invoke('JoinAccessEventGroup');

        } catch (err) {
            console.error('SignalR Connection Error: ', err);
            setTimeout(() => this.startConnection(), 5000);
        }
    };

    stopConnection = async () => {
        if (this.connection) {
            await this.connection.invoke('LeaveAccessEventGroup');
            await this.connection.stop();
        }
    };

    setOnNewAccessEvent = (callback) => {
        this.onNewAccessEvent = callback;
    };
}

export default new SignalRService();