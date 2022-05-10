import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Photo } from 'src/app/_interfaces/photo';
import { User } from 'src/app/_interfaces/user';
import { ModeratePhoto} from 'src/app/_interfaces/moderatePhoto';
import { UserParams } from 'src/app/_interfaces/userParams';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-admin-photo-card',
  templateUrl: './admin-photo-card.component.html',
  styleUrls: ['./admin-photo-card.component.css']
})
export class AdminPhotoCardComponent implements OnInit {
  @Input() user: any;
  photos: Photo[];

  constructor(private adminService: AdminService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.photos = [];
    for(let photo of this.user.photos){
      this.photos.push(photo);
    }
  }

  moderatePhoto(photo: any)
  {
    var photoToUpdate: ModeratePhoto =  {
      id: photo.id,
      url: photo.url,
      userName: this.user.userName,
      isApproved: photo.isApproved
    }

    this.removeApprovedPhoto(photo);

    this.adminService.moderatePhoto(photoToUpdate).subscribe(() =>{
      this.toastr.info("You have approved " + this.user.userName + " photo")
    });
  }

  removeApprovedPhoto(photo: Photo) {
    var photoIndex = this.photos.indexOf(photo);
    this.photos.splice(photoIndex, 1)
  }

}
