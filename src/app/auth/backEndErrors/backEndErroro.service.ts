import { Injectable } from '@angular/core';


export interface BakcEndError {
  a: any;
  code: string;
  message: string;
}


@Injectable()
export class BackEndErrorService {

  setBackEndError(error: BakcEndError) {
    if (error.code == "auth/user-not-found") {
      this.backError = "notUser"
    } else if (error.code == "auth/wrong-password") {
      this.backError = "notPassw"
    } else if (error.code == "auth/email-already-in-use") {
      this.backError = "emailInUse"
    } else {
      return null
    }
  }
  // auth/email-already-in-use"
  backError: string = null;

  get getError(): string {
    return this.backError;
  }
}


