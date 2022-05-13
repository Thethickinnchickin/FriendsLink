import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs';
import { Member } from 'src/app/_interfaces/member';
import { Message } from 'src/app/_interfaces/message';
import { User } from 'src/app/_interfaces/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];
  user: User;
  loading: boolean = false;

  constructor(public presence: PresenceService, private membersService: MembersService,
    public messageService: MessageService, private accountService: AccountService,
     private route: ActivatedRoute, private router: Router) {
       this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
       this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      }



  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
    })

    // Getting tab heading from request params
    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })


    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false        
      }

    ]
    this.galleryImages = this.getImages();


  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      console.log(photo);
      if(photo.isApproved) {
        imageUrls.push({
          small: photo?.url,
          medium: photo?.url,
          big: photo?.url
        })        
      }

    }
    return imageUrls;
  }

  loadMember() {

    this.membersService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(member => {
      this.member = member;
    })
  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.userName).subscribe(messages => {
      this.loading = true;
      this.messages = messages;
      this.loading = false;
    })
  }

  selectTab(tabId: number) {
    console.log(this.memberTabs)
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0)  {
      this.messageService.createHubConnection(this.user, this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }
  }

        
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

}
