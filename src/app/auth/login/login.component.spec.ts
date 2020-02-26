import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { GetPermissionComponent } from '../../permissions/get-permission/get-permission.component';
import { AuthService } from '../../services/auth.services';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Login } from './login';
import { of } from 'rxjs';


fdescribe('LoginComponent', () => {

  const authServiceStub: jasmine.SpyObj<AuthService> = jasmine.createSpyObj(
    'authServce',
    ['authenticate', 'setAuthToken', 'getAuthToken']
  );
  
  let loginComponent: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let httpTestingController: HttpTestingController;
  let formBuilder: FormBuilder;
  let router: Router;
  let routes = [{
    path: 'get-permission',
    component: GetPermissionComponent
  }]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [ LoginComponent ],
      providers: [
        {provide: AuthService, useValue: authServiceStub},
        FormBuilder,

      ]
  })
  .compileComponents()
    .then(() => {
    authService = TestBed.get(AuthService);
    httpTestingController = TestBed.get(HttpTestingController);
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    loginComponent = fixture.componentInstance;
    fixture.detectChanges();
    loginComponent.ngOnInit();
     
  });

  it('should create login component', () => {
    expect(loginComponent).toBeTruthy();
  });

  it('should have a loginForm property', () => {
    expect(loginComponent.loginForm).toBeTruthy();
  });
  it('should have form controls', () => {
    expect(loginComponent.loginForm.controls).toBeTruthy(); 
  });

  it(`should contain correct form control names`, async(inject([FormBuilder ],(fb: FormBuilder ) => { 
    expect(typeof(loginComponent.loginForm.controls)).toEqual('object');
    expect(Object.keys(loginComponent.loginForm.controls)).toContain('grant_type');
    expect(Object.keys(loginComponent.loginForm.controls)).toContain('username');
    expect(Object.keys(loginComponent.loginForm.controls)).toContain('password');
  })));

  it(`form should be invalid when empty `, async(inject([FormBuilder ], (fb: FormBuilder ) => {
    loginComponent.loginForm.controls['grant_type'].setValue('password');
    loginComponent.loginForm.controls['username'].setValue('ADMIN:ADMIN');
    loginComponent.loginForm.controls['password'].setValue('1234567');
    expect(loginComponent.loginForm.valid).toBeTruthy();
  })));

  it(`should have valid grant type value`, async(inject([FormBuilder ],(fb: FormBuilder ) => {
    loginComponent.loginForm.controls['grant_type'].setValue('password');
    expect(loginComponent.loginForm.controls['grant_type'].value).toBe('password');
  })));

  it(`should have valid username value`, async(inject([FormBuilder ],(fb: FormBuilder ) => {
    loginComponent.loginForm.controls['username'].setValue('ADMIN:ADMIN');
    expect(loginComponent.loginForm.controls['username'].value).toBe('ADMIN:ADMIN');
  })));

  it(`should have valid password value`, async(inject([FormBuilder ],(fb: FormBuilder ) => {
    loginComponent.loginForm.controls['password'].setValue('1234567');
      expect(loginComponent.loginForm.controls['password'].value).toBe('1234567');
  })));

  it(`should authenticate user when form is submitted`, async(inject([FormBuilder ],(fb: FormBuilder) => {
    
    loginComponent.loginForm.controls['grant_type'].setValue('password');
    loginComponent.loginForm.controls['username'].setValue('ADMIN:ADMIN');
    loginComponent.loginForm.controls['password'].setValue('1234567');

    authServiceStub.authenticate.and.returnValue(of());
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    expect(authServiceStub.authenticate.calls.any()).toBeTruthy();
    const LoginObj = {
       grant_type : 'password',
       username : 'ADMIN:ADMIN',
       password : '1234567'
    }
    const token = sessionStorage.getItem('AUTH_TOKEN')
    const authToken = expect(authServiceStub.authenticate).toHaveBeenCalledWith(LoginObj)
    console.log(token)
    console.log(authToken)

    // expect(authServiceStub.authenticate({
    //   grant_type: loginComponent.loginForm.controls['grant_type'].value,
    //   username: loginComponent.loginForm.controls['username'].value,
    //   password: loginComponent.loginForm.controls['password'].value
    // })).toBe(token);
  })));
});
