import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PermissionService } from '../../services/permission.services';
import { interval, Subscription, of, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Permission } from '../permission';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit, OnChanges, AfterViewInit {

  permissionForm: FormGroup;
  readonly subscriptions = new Subscription();
  @Input() displayModal: boolean;

  _permission: Permission;

  get permission(): Permission {
    return this._permission;
  }

  @Input()
  set permission(value: Permission) {
    this._permission = value;
    this.updateForm();
  }

  @Output() displayModalChange = new EventEmitter<boolean>(false);

  @Output() permissionCreated = new EventEmitter<Permission>();
  

  constructor(
    private fb: FormBuilder,
    private permissionService: PermissionService,
    private router: Router
  ) { }
  
  ngOnInit() {
    this.permissionForm = this.fb.group({
      enabled: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      permissionName: ['', [Validators.required, Validators.minLength, Validators.maxLength]],
      permissionGroup: ['', [Validators.required, Validators.minLength, Validators.maxLength]],
      permissionCode: ['', [/* Validators.required, */Validators.minLength, Validators.maxLength]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    /* if(changes['permission']){
      this.updateForm();
    } */
  }

  ngAfterViewInit() {
    this.updateForm()
  }

  onSubmit() {
    const rawValue = this.permissionForm.getRawValue();
    const permission = <Permission>{
      enabled: rawValue.enabled,
      permissionCode: rawValue.permissionCode,
      permissionGrouping: rawValue.permissionGroup,
      permissionName: rawValue.permissionName
  }

    const permission$: Observable<Permission> = of(permission)
    .pipe(
      mergeMap(perm => {
        if (perm.permissionCode) {
          return this.permissionService.updatePermissions(perm, perm.permissionCode)
        }
        return this.permissionService.createPermission(perm)
      })
    );
    const subscription = permission$.subscribe(
        (data) => {
          this.router.navigate(['/get-permissions']);
          this.displayModal = false;
          this.displayModalChange.emit(false);
          this.permissionCreated.emit(data);
        },
        (error) => console.log(error)
      );

    this.subscriptions.add(subscription);
  }

  private updateForm() {
    const perm = this.permission || <Permission>{};
    if (this.permissionForm) {
      this.permissionForm.patchValue({
        enabled: perm.enabled,
        permissionName: perm.permissionName,
        permissionGroup: perm.permissionGrouping,
        permissionCode: perm.permissionCode
      })
    }
  }

  hideModal() {
    this.displayModalChange.emit(false);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
