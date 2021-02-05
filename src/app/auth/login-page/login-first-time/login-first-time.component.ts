import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-first-time',
  templateUrl: './login-first-time.component.html',
})
export class LoginFirstTimeComponent implements OnInit {

  public showCurrent: boolean = false;
  public showNew: boolean = false;
  public showNewRepeat: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  showPasswordCurrent() {
    this.showCurrent = !this.showCurrent;
  }

  showPasswordNew() {
    this.showNew = !this.showNew;
  }

  showPasswordNewRepeat() {
    this.showNewRepeat = !this.showNewRepeat;
  }

}
