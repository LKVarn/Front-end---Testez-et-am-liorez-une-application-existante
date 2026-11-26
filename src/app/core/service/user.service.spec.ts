import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should read the login token as plain text', () => {
    service.login({ login: 'test', password: 'password' }).subscribe((token) => {
      expect(token).toBe('jwt-token');
    });

    const request = httpTestingController.expectOne('/api/login');
    expect(request.request.responseType).toBe('text');
    request.flush('jwt-token');
  });
});
