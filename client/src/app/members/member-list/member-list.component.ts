import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_interfaces/member';
import { Pagination } from 'src/app/_interfaces/pagination';
import { User } from 'src/app/_interfaces/user';
import { UserParams } from 'src/app/_interfaces/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Female'}]

  constructor(private membersService: MembersService) {
       this.userParams = this.membersService.getUserParams();
     }

  ngOnInit(): void {
    this.loadMembers()
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.membersService.setUserParams(this.userParams)
    this.loadMembers();
  }

  resetFilters() {
    this.userParams = this.membersService.resetUserParams();
    this.loadMembers();
  }

  loadMembers() {
    this.membersService.setUserParams(this.userParams)
    this.membersService.getMembers(this.userParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }


}
