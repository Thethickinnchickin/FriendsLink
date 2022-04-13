import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { User } from '../_interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:5001/api/';

  //Making current user an observable on login
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  //Logs in User using api
  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          //Setting user in local storage 
          this.setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    );
  }

  //sets current user observable
  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  //On User Logout
  logout() {
    localStorage.removeItem('user')
    this.currentUserSource.next(null)
  }

  //Route to register a new user
  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((response: User)=> {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      }))
  }
}
