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
        this.socket = io('http://localhost:4000', { path: '/macro-chat/socket-connection/', transports: ['websocket'] })
    }
    ngOnInit() {

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
