import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SaveDataService } from 'src/app/services/save-data.service';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface User {
  name?: string;
  uid?: string;
  password?: string
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  editIcon = faEdit;
  doneIcon = faCheck;
  editName: boolean = false;
  editEmail: boolean = false;
  editPassword: boolean = false;

  constructor(private http: HttpClient,
    private currentUser: AuthService,
    private navRouting: Router,
    private loadingService: LoadingService,
    private fireStoreService: SaveDataService) { }

  ngOnInit(): void {
    this.fireStoreService.getItem().subscribe((user) => {
      this.userName = user?.name;
      this.userEmail = this.currentUser.getCurrentUser()?.email;
    })
  }


  userName: string;
  userEmail: string;
  newEmail: string;
  userPassword: string;
  deleteUser() {
    this.fireStoreService.deleteUser(this.currentUser);
  }

  edit(validator: string) {
    if (validator == "name") {
      this.editName = !this.editName;
    } else if (validator == "email") {
      this.editEmail = !this.editEmail;
    } else if (validator == "password") {
      this.editPassword = !this.editPassword;
    }
  }

  updateUserName() {
    this.fireStoreService.updateUser({
      uid: this.currentUser.getCurrentUser().uid,
      name: this.userName
    });
    this.editName = false;

  }


  updatePassword() {
    this.fireStoreService.updatePassword(this.userPassword);
    this.editPassword = false;
  }

  updateEmail() {
    this.fireStoreService.updateEmail(this.userEmail);
    this.editEmail = false;
  }
}
