import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PermissionsComponent } from './permissions.component';
import { PermissionService } from '../../services/permission.services';
import { AuthService } from '../../services/auth.services';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Login } from '../../auth/login/login';
import { of } from 'rxjs';


fdescribe('PermissionComponent', () => {

  const permissionServiceStub: jasmine.SpyObj<PermissionService> = jasmine.createSpyObj(
    'permissionService',
    ['createPermission']
  );
  let permissionService: PermissionService
  let permissionComponent: PermissionsComponent;
  let fixture: ComponentFixture<PermissionsComponent>;
  let httpTestingController: HttpTestingController;
  let formBuilder: FormBuilder;
  let router: Router;
  let routes = [{
    path: 'create-permission',
    component: PermissionsComponent
  }]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [ PermissionsComponent ],
      providers: [
        {provide: PermissionService, useValue: permissionServiceStub},
        FormBuilder
      ]
  })
  .compileComponents()
    .then(() => {
    permissionService = TestBed.get(PermissionService);
    httpTestingController = TestBed.get(HttpTestingController);
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsComponent);
    permissionComponent = fixture.componentInstance;
    fixture.detectChanges();
    permissionComponent.ngOnInit();
     
  });

  it('should create login component', () => {
    expect(permissionComponent).toBeTruthy();
  });

  it('should have a permissionForm property', () => {
    expect(permissionComponent.permissionForm).toBeTruthy();
  });
  it('should have form controls', () => {
    expect(permissionComponent.permissionForm.controls).toBeTruthy(); 
  });

  it(`should contain correct form control names`, async(inject([FormBuilder ],(fb: FormBuilder ) => { 
    expect(typeof(permissionComponent.permissionForm.controls)).toEqual('object');
    expect(Object.keys(permissionComponent.permissionForm.controls)).toContain('enabled');
    expect(Object.keys(permissionComponent.permissionForm.controls)).toContain('permissionGroup');
    expect(Object.keys(permissionComponent.permissionForm.controls)).toContain('permissionName');
  })));

  it(`form should be invalid when empty `, async(inject([FormBuilder ], (fb: FormBuilder ) => {
    permissionComponent.permissionForm.controls['enabled'].setValue('true');
    permissionComponent.permissionForm.controls['permissionGroup'].setValue('TEST_GROUPING');
    permissionComponent.permissionForm.controls['permissionName'].setValue('EDIT_ADMIN');
    expect(permissionComponent.permissionForm.valid).toBeTruthy();
  })));

  it(`should have valid enabled value`, async(inject([FormBuilder ],(fb: FormBuilder ) => {
    permissionComponent.permissionForm.controls['enabled'].setValue('true');
    expect(permissionComponent.permissionForm.controls['enabled'].value).toBe('true');
  })));

  it(`should have valid permission grouping value`, async(inject([FormBuilder ],(fb: FormBuilder ) => {
    permissionComponent.permissionForm.controls['permissionGroup'].setValue('TEST_GROUPING');
    expect(permissionComponent.permissionForm.controls['permissionGroup'].value).toBe('TEST_GROUPING');
  })));

  it(`should have valid permission name value`, async(inject([FormBuilder ],(fb: FormBuilder ) => {
    permissionComponent.permissionForm.controls['permissionName'].setValue('EDIT_ADMIN');
      expect(permissionComponent.permissionForm.controls['permissionName'].value).toBe('EDIT_ADMIN');
  })));

  it(`should authenticate user when form is submitted`, async(inject([FormBuilder ],(fb: FormBuilder) => {
    
    permissionComponent.permissionForm.controls['enabled'].setValue('false');
    permissionComponent.permissionForm.controls['permissionGroup'].setValue('TEST_EDITING');
    permissionComponent.permissionForm.controls['permissionGroup'].setValue('EDIT_USERS');

    permissionServiceStub.createPermission.and.returnValue(of());
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    expect(permissionServiceStub.createPermission.calls.any()).toBeTruthy();
    expect(permissionServiceStub.createPermission).toHaveBeenCalledWith({
      enabled: permissionComponent.permissionForm.controls['enabled'].value,
      permissionCode:  permissionComponent.permissionForm.controls['permissionCode'].value,
      permissionGrouping:  permissionComponent.permissionForm.controls['permissionGroup'].value,
      permissionName:  permissionComponent.permissionForm.controls['permissionName'].value
    });
   
  })));
});