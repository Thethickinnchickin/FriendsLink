import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_interfaces/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';
  users: any;

  constructor(private http: HttpClient, private accountService: AccountService) {}
  ngOnInit(): void {

    this.setCurrentUser();
  }

  //Setting current user token on application start

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'))
    this.accountService.setCurrentUser(user);
  }

  
}
