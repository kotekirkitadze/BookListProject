import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SaveDataService } from 'src/app/catalogue/services/userinfo_fire.service';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { UserFacade } from './user.facade';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserFacade]
})
export class UserComponent implements OnInit {

  editIcon = faEdit;
  doneIcon = faCheck;
  editName: boolean = false;
  editEmail: boolean = false;
  editPassword: boolean = false;
  userName: string;
  userEmail: string;
  newEmail: string;
  userPassword: string;

  constructor(private auth: AuthService,
    private fireStoreService: SaveDataService,
    private userFacade: UserFacade) { }

  ngOnInit(): void {
    this.fireStoreService.getItem().subscribe((user) => {
      this.userName = user?.name;
      this.userEmail = this.auth.getCurrentUser()?.email;
    })
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
    this.userFacade.updateUserName(this.userName);
    this.editName = false;
  }


  updatePassword() {
    this.userFacade.updatePassword(this.userPassword);
    this.editPassword = false
  }

  updateEmail() {
    this.userFacade.updateEmail(this.userEmail);
    this.editEmail = false;
  }

  deleteUser() {
    this.userFacade.deleteUser();
  }
}
