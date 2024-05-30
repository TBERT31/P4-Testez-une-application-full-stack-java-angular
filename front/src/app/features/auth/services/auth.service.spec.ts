import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { expect } from '@jest/globals';
import { AuthService } from './auth.service';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send register request', () => {
    const registerRequest: RegisterRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    };

    const mockSessionInformation: SessionInformation = {
        token: 'mockToken',
        type: 'Bearer',
        id: 123,
        username: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: false
      };

    service.register(registerRequest).subscribe((sessionInfo) => {
        expect(sessionInfo).toEqual(mockSessionInformation);
    });

    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerRequest); 
    req.flush(null); 
  });

  it('should send login request', () => {
    const loginRequest: LoginRequest = {
      email: 'test@example.com',
      password: 'password123'
    };
    const mockSessionInformation: SessionInformation = {
      token: 'mockToken',
      type: 'Bearer',
      id: 123,
      username: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    service.login(loginRequest).subscribe(sessionInfo => {
      expect(sessionInfo).toEqual(mockSessionInformation);
    });

    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginRequest); 
    req.flush(mockSessionInformation); 
  });
});
