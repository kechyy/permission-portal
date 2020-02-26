import { TestBed, async, inject  } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PermissionService } from './permission.services';
import { Permission } from '../permissions/permission';

describe('PermissionService', () => {
    let permissionService: PermissionService;
    let httpTestingController: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
            PermissionService
            ]
        });
        permissionService = TestBed.get(PermissionService);
        httpTestingController = TestBed.get(HttpTestingController);
    });
    it(`should GET permissions as an Observable`, async(inject([HttpTestingController, PermissionService],
        (httpTestingController: HttpTestingController, permissionService: PermissionService) => {
    
            const getPermissionMockData = [
                {
                    "permissionCode": 48,
                    "permissionGrouping": "TEST_GROUPING",
                    "permissionName": "EDIT_USER",
                    "enabled": false
                }
            ];
            permissionService.getPermissions()
            .subscribe((permissions: Permission[]) => {
                expect(permissions.length).toBe(1);
                expect(permissions).toEqual(getPermissionMockData)
            });
    
            let req = httpTestingController.expectOne('/aig-uaa/api/permission/getAllpermissions');
            
            expect(req.request.method).toBe("GET");
            expect(req.request.responseType).toBe('json');
            expect(req.request.urlWithParams).toBe('/aig-uaa/api/permission/getAllpermissions');
            
            req.flush(getPermissionMockData);
        })));
        it(`should CREATE permissions as an Observable`, async(inject([HttpTestingController, PermissionService],
            (httpTestingController: HttpTestingController, permissionService: PermissionService) => {
        
                const createPermissionMockData = 
                {
                    "permissionCode": 48,
                    "permissionGrouping": "TEST_GROUPING",
                    "permissionName": "EDIT_USER",
                    "enabled": false
                };
                permissionService.createPermission(createPermissionMockData)
                .subscribe((permissions: Permission) => {
                    expect(typeof(permissions)).toEqual('object');
                    expect(Object.keys(permissions)).toContain('enabled');
                    expect(Object.keys(permissions)).toContain('permissionCode');
                    expect(Object.keys(permissions)).toContain('permissionName');
                    expect(Object.keys(permissions)).toContain('permissionGrouping');
                });
        
                let req = httpTestingController.expectOne('/aig-uaa/api/permission/createPermission', JSON.stringify(createPermissionMockData));
                expect(req.request.method).toBe("POST");
                expect(req.request.responseType).toBe('json');
                expect(req.request.body).toEqual(JSON.stringify(createPermissionMockData))
                expect(req.request.urlWithParams).toBe('/aig-uaa/api/permission/createPermission');
                
                req.flush(createPermissionMockData);
            })));

            it(`should UPDATE permissions as an Observable`, async(inject([HttpTestingController, PermissionService],
                (httpTestingController: HttpTestingController, permissionService: PermissionService) => {
                    const permissionCode = 23;
                    const updatePermissionMockData = 
                    {
                        "permissionCode": 48,
                        "permissionGrouping": "ADMINISTRATOR",
                        "permissionName": "UPDATE_USER",
                        "enabled": true
                    };
                    permissionService.updatePermissions(updatePermissionMockData, permissionCode)
                    .subscribe((permissions: Permission) => {
                        
                        expect(typeof(permissions)).toEqual('object');
                        expect(Object.keys(permissions)).toContain('enabled');
                        expect(Object.keys(permissions)).toContain('permissionCode');
                        expect(Object.keys(permissions)).toContain('permissionName');
                        expect(Object.keys(permissions)).toContain('permissionGrouping');
                    });
            
                    let req = httpTestingController.expectOne(`/aig-uaa/api/permission/updatePermission/${permissionCode}`, JSON.stringify(updatePermissionMockData));
                    expect(req.request.method).toBe("PUT");
                    expect(req.request.responseType).toBe('json');
                    expect(req.request.body).toEqual(JSON.stringify(updatePermissionMockData))
                    expect(req.request.urlWithParams).toBe(`/aig-uaa/api/permission/updatePermission/${permissionCode}`);
                    
                    req.flush(updatePermissionMockData);
                })));

                it(`should DELETE permissions as an Observable`, async(inject([HttpTestingController, PermissionService],
                    (httpTestingController: HttpTestingController, permissionService: PermissionService) => {
                        const permissionCode = 23;
                        permissionService.deletePermission(permissionCode)
                        .subscribe((permission: any) => {
                            // expect(permission.length).toBe(3);
                        });
                
                        let req = httpTestingController.expectOne(`/aig-uaa/api/permission/deletePermission/${permissionCode}`);
                        
                        
                        expect(req.request.method).toBe("DELETE");
                        expect(req.request.responseType).toBe('json');
                        expect(req.request.body).toBe(null);
                        expect(req.request.urlWithParams).toBe(`/aig-uaa/api/permission/deletePermission/${permissionCode}`);
                        
                    })));

                    it(`should GET permission by a specific ID as an Observable`, async(inject([HttpTestingController, PermissionService],
                        (httpTestingController: HttpTestingController, permissionService: PermissionService) => {
                            const permissionCode = 23;
                            permissionService.getPermissionsById(permissionCode)
                            .subscribe((permission: any) => {
                                console.log(permission)
                            });
                    
                            let req = httpTestingController.expectOne(`/aig-uaa/api/permission/getPermissionById/${permissionCode}`);
                            
                            expect(req.request.method).toBe("GET");
                            expect(req.request.responseType).toBe('json');
                            expect(req.request.body).toBe(null);
                            expect(req.request.urlWithParams).toBe(`/aig-uaa/api/permission/getPermissionById/${permissionCode}`);
                            
                        })));
    afterAll(() =>{
        httpTestingController.verify();
    })
});
 