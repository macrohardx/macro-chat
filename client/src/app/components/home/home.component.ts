import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

    private socket;
    constructor(private modalService: NgbModal, private http: HttpClient) {         
    }
    ngOnInit() {
        this.socket = io('https://LAPTOP-LNDR:5000', { path: '/macro-chat/socket-connection', transports: ['websocket'] })

        this.socket.on('connection', () => {
            console.log('connected')
        })

        this.socket.on('disconnect', () => {
            console.log('disconnected');
        })

    }

    disconnect() {
        this.socket.disconnect();
    }

}
