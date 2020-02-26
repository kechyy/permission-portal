import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../services/auth.services';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthService', () => {
  const httpClientStub: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'http',
    ['post']
  );
  const Login = {grant_type : 'password',
        username : 'ADMIN:ADMIN',
        password : '1234567' }
  let authService: AuthService;

  let httpTestingController: HttpTestingController;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          {provide: AuthService, useValue: httpClientStub},
          AuthService
        ]
        
      })
      authService = TestBed.get(AuthService);
      httpTestingController = TestBed.get(HttpTestingController);

      let store = {};
      const mocksessionStorage = {
        getItem: (key: string): string => {
          return key in store ? store[key] : null;
        },
        setItem: (key: string, value: string) => {
          store[key] = `${value}`;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        }
      };
      /* This basically means: whenever sessionStorage.getItem is called, 
      instead, call mockLocalStorage.getItem with the same arguments, and so on.*/
      spyOn(sessionStorage, 'getItem')
        .and.callFake(mocksessionStorage.getItem);
      spyOn(sessionStorage, 'setItem')
        .and.callFake(mocksessionStorage.setItem);
      spyOn(sessionStorage, 'removeItem')
        .and.callFake(mocksessionStorage.removeItem);
      spyOn(sessionStorage, 'clear')
        .and.callFake(mocksessionStorage.clear);
    });
   
    describe('AuthService', () => {
      
      httpClientStub.post.and.returnValue(of());
      it('should perform a post to /aig-uaa/oauth/token with grant_type, username and password', () => {
        const authService = new AuthService(httpClientStub);
        
        httpClientStub.post.and.returnValue(of());
        authService.authenticate(Login)

        const formData: FormData = new FormData();
        formData.append(`grant_type`, `password`);
        formData.append('username', `ADMIN:ADMIN`);
        formData.append('password', `1234567`);
        const headers = new HttpHeaders();
        
        expect(httpClientStub.post).toHaveBeenCalledWith('/aig-uaa/oauth/token', formData, {headers: headers} );
      });

      it('should return stored token from  sessionStorage',() => {
        authService.setAuthToken('sometoken');
        expect(sessionStorage.getItem('AUTH_TOKEN')).toEqual('sometoken');
      }); 
      
      it('should return stored token from sessionStorage', () => {
        sessionStorage.setItem('AUTH_TOKEN', 'anothertoken');
        expect(authService.getAuthToken()).toEqual('anothertoken');
      });

      it('should return stored token from sessionStorage', () => {
        sessionStorage.removeItem('AUTH_TOKEN');
        expect(authService.signOut()).toEqual(undefined);
      });
    });
  });
  