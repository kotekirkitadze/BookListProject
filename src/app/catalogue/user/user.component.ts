import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SaveDataService } from 'src/app/services/save-data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private http: HttpClient,
    private currentUser: AuthService,
    private navRouting: Router,
    private loadingService: LoadingService,
    private fireStoreService: SaveDataService) { }

  ngOnInit(): void {
    this.fireStoreService.getItem().subscribe((user) => {
      this.userName = user?.name;
      this.userEmail = this.currentUser.getCurrentUser().email;
    })
  }

  userName: string;
  userEmail: string;
  deleteUser() {
    this.fireStoreService.deleteUser(this.currentUser);
  }

}
