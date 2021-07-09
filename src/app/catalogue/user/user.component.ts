import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SaveDataService } from 'src/app/services/userinfo_fire.service';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { FireCollectionApiService } from '../services';
import { finalize, map } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';


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

  constructor(private auth: AuthService,
    private fireStoreService: SaveDataService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private catalogue: FireCollectionApiService,
    private loadingService: LoadingService) { }

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

    this.loadingService.start();
    this.auth.deleteUser().pipe(finalize(() => this.loadingService.stop())).subscribe();
    this.catalogue.getBooksData()
      .pipe(map(val => {
        val.map(el => {
          this.catalogue.deleteBook(el.id);
        })
      })).subscribe();
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
    //this.
    this.translateService.get("catalogue.UserPage.PASSWORD_CHANGED").subscribe((value) => this.toastr.success(value))
  }

  updateEmail() {
    this.auth.updateEmail(this.userEmail).subscribe(() => {
      this.editEmail = false;
    })

    this.translateService.get("catalogue.UserPage.EMAIL_CHANGED").subscribe((value) => this.toastr.success(value))
  }
}
