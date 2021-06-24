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
  }

  userEmail: string = "kotekirkitadze@gmail.com";

  deleteUser() {
    this.loadingService.start();
    const url = "https://us-central1-book-catalogue-d3599.cloudfunctions.net/deleteUserByEmail";

    this.http.post(url, { "userEmail": this.userEmail }).subscribe((x) => {
      this.fireStoreService.deleteUserData(this.currentUser.getCurrentUser());
      this.currentUser.signOutUser().then(() => {
        this.navRouting.navigate(["sign-in"]);

      }).then(() => this.loadingService.stop());
    },
      (x) => console.log("failed", x));
  }



}
