import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SaveDataService } from 'src/app/services/userinfo_fire.service';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


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
    private auth: AuthService,
    private fireStoreService: SaveDataService,
    private toastr: ToastrService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.fireStoreService.getItem().subscribe((user) => {
      this.userName = user?.name;
      this.userEmail = this.auth.getCurrentUser()?.email;
    })
  }


  userName: string;
  userEmail: string;
  newEmail: string;
  userPassword: string;
  deleteUser() {

    //unsubscribe
    this.auth.deleteUser().subscribe();
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
      uid: this.auth.getCurrentUser().uid,
      name: this.userName
    });
    this.editName = false;
    this.translateService.get("catalogue.UserPage.FULL_NAME_CHANGED").subscribe((value) => this.toastr.success(value))

  }


  updatePassword() {
    this.auth.updatePassword(this.userPassword).subscribe(
      () => this.editPassword = false);
    this.translateService.get("catalogue.UserPage.PASSWORD_CHANGED").subscribe((value) => this.toastr.success(value))
  }

  updateEmail() {
    this.auth.updateEmail(this.userEmail).subscribe(() => {
      this.editEmail = false;
    })

    this.translateService.get("catalogue.UserPage.EMAIL_CHANGED").subscribe((value) => this.toastr.success(value))
  }
}
