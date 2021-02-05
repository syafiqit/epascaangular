import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements OnInit {

  public show: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  showPassword() {
    this.show = !this.show;
  }

}
