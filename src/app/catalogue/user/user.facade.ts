import { Injectable } from "@angular/core";
import { LoadingService } from "src/app/services/loading.service";
import { FireCollectionApiService } from "../services";
import { AuthService } from 'src/app/services/auth.service';
import { finalize, map } from "rxjs/operators";
import { SaveDataService } from "../services/userinfo_fire.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

@Injectable()

export class UserFacade {

  constructor(private auth: AuthService,
    private catalogue: FireCollectionApiService,
    private loadingService: LoadingService,
    private fireStoreService: SaveDataService,
    private translateService: TranslateService,
    private toastr: ToastrService) {

  }


  deleteUser() {
    this.loadingService.start();
    this.auth.deleteUser().pipe(finalize(() => {
      this.loadingService.stop()
      this.translateService
        .get("catalogue.UserPage.USER_DELETED")
        .subscribe((value) => this.toastr.success(value))
    })).subscribe();

    this.catalogue.getBooksData()
      .pipe(map(val => {
        val.map(el => {
          this.catalogue.deleteBook(el.id);
        })
      })).subscribe();
  }

  updateUserName(userName: string) {
    this.fireStoreService.updateUser({
      uid: this.auth.getCurrentUser().uid,
      name: userName
    });
    this.translateService.get("catalogue.UserPage.FULL_NAME_CHANGED").subscribe((value) => this.toastr.success(value))
  }

  updateEmail(userEmail: string) {
    this.auth.updateEmail(userEmail).subscribe(() => {
    })
    this.translateService.get("catalogue.UserPage.EMAIL_CHANGED").subscribe((value) => this.toastr.success(value))
  }

  updatePassword(userPassword: string) {
    this.auth.updatePassword(userPassword).subscribe();
    this.translateService.get("catalogue.UserPage.PASSWORD_CHANGED").subscribe((value) => this.toastr.success(value))
  }
}
