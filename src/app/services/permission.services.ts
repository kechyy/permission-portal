import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { AppModule } from '../app.module';
import { Permission } from '../permissions/permission';

@Injectable({ providedIn: 'root' })
export class PermissionService {
    constructor(private http: HttpClient) {

    }
     createPermission(permission: Permission): Observable<Permission> {

        const headers = new HttpHeaders()
        .append('content-type', 'application/json;charset=UTF-8')

        return this.http.post<Permission>('/aig-uaa/api/permission/createPermission',
            JSON.stringify(permission),
            {headers: headers})
    }

    getPermissions(): Observable<Permission[]> {
        return this.http.get<Permission[]>('/aig-uaa/api/permission/getAllpermissions')
        //  return this.http.get<Permission[]>('assets/permission.json')
    }

    getPermissionsById(permissionId: number): Observable<any> {
        const headers = new HttpHeaders()
        .append('content-type', 'application/json;charset=UTF-8')
        return this.http.get<any>(`/aig-uaa/api/permission/getPermissionById/${permissionId}`)
    }

    updatePermissions( updatePermission: Permission, permissionId: number ): Observable<Permission> {
        const headers = new HttpHeaders()
        .append('content-type', 'application/json;charset=UTF-8')
        return this.http.put<Permission>(`/aig-uaa/api/permission/updatePermission/${permissionId}`,
        JSON.stringify(updatePermission),{ headers: headers })
    }

    deletePermission(permissionId: number): Observable<void> {
        const headers = new HttpHeaders()
        .append('content-type', 'application/json;charset=UTF-8')
        return this.http.delete<void>(`/aig-uaa/api/permission/deletePermission/${permissionId}`, {headers: headers})
    }
}