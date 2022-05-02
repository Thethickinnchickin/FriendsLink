import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_interfaces/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  //Making current user an observable on login
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presence: PresenceService) { }

  //Logs in User using api
  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          //Setting user in local storage 
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
      })
    );
  }

  //sets current user observable
  setCurrentUser(user: User) {
    //setting roles through token
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  //On User Logout
  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null)
    this.presence.stopHubConnection(); 
  }

  //Route to register a new user
  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((response: User)=> {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
          this.currentUserSource.next(user);
        }
        return user;
      }))
  }

  //Getting decoded jwt from local storage with roles 
  getDecodedToken(token) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
