import { Component } from '@angular/core';
import { Authentication, AuthGuard } from 'ngkit';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngkit-app';

  constructor(private auth: Authentication) {
    console.log(auth);
  }
}
