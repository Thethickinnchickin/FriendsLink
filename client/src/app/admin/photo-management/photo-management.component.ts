import { Component, OnInit } from '@angular/core';
import { Photo } from 'src/app/_interfaces/photo';
import { User } from 'src/app/_interfaces/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
  users: any[];
  approvedPhotos: Photo[];
  unapprovedPhotos: Photo[];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {

    this.adminService.getUnapprovedPhtots().subscribe(users => {
      this.users = users;
      this.getUsersPhotos(users);
    });
    console.log(this.unapprovedPhotos)
  }

  getUsersPhotos(users: any){
    var photos: Photo[] = [];
    this.approvedPhotos = [];
    this.unapprovedPhotos = [];
      for(let user of users)
      {
        for(let photo of user.photos)
        {
          photos.push(photo);            
        }
      }
      for(let photo of photos)
      {

        if(photo.isApproved)
        {
          this.approvedPhotos.push(photo);
        } else {
          this.unapprovedPhotos.push(photo);
        }
      } 
  }

}
