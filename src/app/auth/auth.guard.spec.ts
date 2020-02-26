import { TestBed, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../interceptor/auth.interceptor';

xdescribe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        },
        AuthGuard
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });
  it('should be created', inject([AuthGuard], (authGuard: AuthGuard) => {
    expect(authGuard).toBeTruthy
  }))
  it('should have an canActivate function', () => {
    inject([AuthGuard], (authGuard: AuthGuard)=> {
      expect(authGuard.canActivate).toBeTruthy();
    })
  });

});
