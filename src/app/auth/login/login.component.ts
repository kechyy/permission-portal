import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.services';
import { Subscription } from 'rxjs';
import { Login } from './login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  readonly subscriptions = new Subscription();
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.loginForm = this.fb.group({
      grant_type: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.maxLength(7)]],
    });
  }
  onSubmit() {
    const rawValue = this.loginForm.getRawValue();
    const login = <Login>{
      grant_type: rawValue.grant_type,
      username: rawValue.username,
      password: rawValue.password
    }
    
    const subscription = this.authService.authenticate(login)
    .subscribe((token) => {
      console.log('token::::', token.access_token);
      this.authService.setAuthToken(token.access_token);
      this.router.navigate(['/get-permissions']);
      // this.router.navigate([this.returnUrl]);
    });

    this.subscriptions.add(subscription);
  }
}
