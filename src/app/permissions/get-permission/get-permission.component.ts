import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from '../../services/permission.services';
import { AuthService } from '../../services/auth.services';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { Permission } from '../permission';


@Component({
  selector: 'app-get-permission',
  templateUrl: './get-permission.component.html',
  styleUrls: ['./get-permission.component.css']
})
export class GetPermissionComponent implements OnInit {
  readonly subscriptions = new Subscription();
  permissions: Permission[];
  display: boolean = false;
  updatePermission: Permission;
  permissionForm: FormGroup;
  selectedPermission: Permission;

  constructor(
    private readonly permissionService: PermissionService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private _router: Router
  ) { }
 
  ngOnInit(): void {
    const subscription = this.permissionService.getPermissions()
      .subscribe(
        (data) => {
          this.permissions = data;
        },
        (error) => console.log(error)
      );
    this.subscriptions.add(subscription);
  }
  
  showDialog(permission: Permission | undefined | null = null) {
    if (permission) {
      const subscription = this.permissionService.getPermissionsById(permission.permissionCode)
        .subscribe(perm => {
          this.selectedPermission = perm;
          this.display = true;
        });
      this.subscriptions.add(subscription);
      // this.display = true;
      // this.selectedPermission = permission;
      
    }

    this.display = !permission;
  }

  confirm(permissionCode: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        // Actual logic to perform a confirmation
        const subscription = this.permissionService.deletePermission(permissionCode)
          .subscribe(
            (data) => {
              this.permissions = this.permissions.filter(perm => perm.permissionCode !== permissionCode)
            },
            (error) => console.log(error)
          );
        this.subscriptions.add(subscription);
      }
    });
  }

  appendPermission(permission: Permission) {
    if (this.permissions && permission && !!this.permissions.find(perm => perm.permissionCode == permission.permissionCode)) {
      const index = this.permissions.findIndex(perm => perm.permissionCode == permission.permissionCode);
      this.permissions[index] = permission;
    } else {
      this.permissions && permission && this.permissions.push(permission);
    }
  }

  logout() {
    this.authService.signOut();
    this._router.navigate(['/login']);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
