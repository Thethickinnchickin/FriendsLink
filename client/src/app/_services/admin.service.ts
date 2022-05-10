import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ModeratePhoto } from '../_interfaces/moderatePhoto';
import { User } from '../_interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getUsersWithRoles() {
    return this.http.get<Partial<User>[]>(this.baseUrl + 'admin/users-with-roles');
  }

  getUnapprovedPhtots() {
    return this.http.get<any[]>(this.baseUrl + 'admin/photos-to-approve');
  }

  moderatePhoto(photo: ModeratePhoto) {
    return this.http.put(this.baseUrl + "admin/moderate-photo", photo);
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post(this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles, {});
  }
}
