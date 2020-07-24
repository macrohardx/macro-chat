import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

    private modalProfilePic: NgbModalRef

    public new_img_rnd: String = '123'

    public user: any = {}

    constructor(private modalService: NgbModal, private http: HttpClient) {

    }
    
    ngOnInit() {
        this.loadUserData()
    }
    
    private loadUserData() {
        this.http.get('/api/user').subscribe((response) => {
            this.user = response
            console.log(response)
        })
    }

    public imageCropped(img) {
        this.modalProfilePic.close()
        this.saveProfilePic(img)
    }

    public openModal(modalContent) {
        this.modalProfilePic = this.modalService.open(modalContent, { size: 'lg' })
        this.modalProfilePic.result
            .then((result) => {
                //close
            }, (reason) => {
                //dismiss
            });
    }

    private saveProfilePic(img) {
        this.http.put('/api/user/profile-pic', { base64: img })
            .subscribe((response) => {
                this.new_img_rnd = new Date().getTime().toString()
            })
    }
    

}
