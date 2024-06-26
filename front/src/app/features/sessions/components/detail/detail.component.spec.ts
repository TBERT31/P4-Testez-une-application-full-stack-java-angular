import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { expect } from '@jest/globals';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { DetailComponent } from './detail.component';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let sessionService: SessionService;
  let router: Router;
  let matSnackBar: MatSnackBar;

  const mockSessionService = {
    sessionInformation: { admin: true, id: 1 }
  };

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of({
      id: 1,
      name: 'Test Session',
      description: 'Test Description',
      date: new Date(),
      teacher_id: 1,
      users: [1, 2, 3],
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    delete: jest.fn().mockReturnValue(of(null)),
    participate: jest.fn().mockReturnValue(of(undefined)),
    unParticipate: jest.fn().mockReturnValue(of(undefined))
  };

  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(of({
      id: 1,
      lastName: 'Doe',
      firstName: 'John',
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockMatSnackBar = {
    open: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [
        MatSnackBarModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
      ],
      providers: [
        FormBuilder,
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1', 
              },
            },
          },
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session on init', () => {
    const mockSession: Session = {
      id: 1,
      name: 'Test Session',
      description: 'Test Description',
      date: new Date(),
      teacher_id: 1,
      users: [1, 2, 3],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockTeacher: Teacher = {
      id: 1,
      lastName: 'Doe',
      firstName: 'John',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSession));
    jest.spyOn(teacherService, 'detail').mockReturnValue(of(mockTeacher));

    component.ngOnInit();

    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    expect(teacherService.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
  });

  it('should delete session', () => {
    jest.spyOn(sessionApiService, 'delete').mockReturnValue(of(null));
    jest.spyOn(matSnackBar, 'open');
    jest.spyOn(router, 'navigate');

    component.delete();

    expect(sessionApiService.delete).toHaveBeenCalledWith('1');
    expect(matSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should participate in session', () => {
    jest.spyOn(sessionApiService, 'participate').mockReturnValue(of(undefined));

    component.participate();

    expect(sessionApiService.participate).toHaveBeenCalledWith('1', '1');
  });

  it('should unparticipate from session', () => {
    jest.spyOn(sessionApiService, 'unParticipate').mockReturnValue(of(undefined));

    component.unParticipate();

    expect(sessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
  });

  it('should go back when back button is clicked', () => {
    fixture.detectChanges();

    const backButton = fixture.debugElement.query(By.css('.back-button'));
    expect(backButton).toBeTruthy();

    const historySpy = jest.spyOn(window.history, 'back');
    backButton.triggerEventHandler('click', null);

    expect(historySpy).toHaveBeenCalled();
  });

  it('should show delete button only if user is admin', () => {
    component.isAdmin = true;
    component.sessionId = '1';
    fixture.detectChanges();
    const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
    expect(deleteButton).toBeTruthy();
  });

  it('should show unparticipate button only if user is not admin and user already participate', () => {
    component.isAdmin = false;
    component.isParticipate = true;
    fixture.detectChanges();
    const unparticipateButton = fixture.debugElement.query(By.css('.unparticipate-button'));
    expect(unparticipateButton).toBeTruthy();
  });

  it('should display teacher information correctly', () => {
    const teacher: Teacher = { id: 1, lastName: 'Doe', firstName: 'John', createdAt: new Date(), updatedAt: new Date() };
    component.teacher = teacher;
    fixture.detectChanges();
    const teacherName = fixture.debugElement.query(By.css('.teacher-name'));
    expect(teacherName.nativeElement.textContent).toContain(`${teacher.firstName} ${teacher.lastName.toUpperCase()}`);
  });

  it('should display session information correctly', () => {
    const session: Session = { id: 1, name: 'Test Session', description: 'Test Description', date: new Date(), teacher_id: 1, users: [1], createdAt: new Date(), updatedAt: new Date() };
    component.session = session;
    fixture.detectChanges();
    const sessionName = fixture.debugElement.query(By.css('.session-name'));
    expect(sessionName.nativeElement.textContent).toContain(session.name);
  });

  it('should show participate button only if user is not admin and user does not participate', async () => {
    mockSessionService.sessionInformation.admin = false;
    mockSessionApiService.detail.mockReturnValue(of({
      id: 1,
      name: 'Test Session',
      description: 'Test Description',
      date: new Date(),
      teacher_id: 1,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    mockTeacherService.detail.mockReturnValue(of({
      id: 1,
      lastName: 'Doe',
      firstName: 'John',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    component.isAdmin = false;
    component.isParticipate = false;

    fixture.detectChanges();
    const participateButton = fixture.debugElement.nativeElement.querySelector('.participate-button');
    expect(participateButton).toBeTruthy();
  });
});
