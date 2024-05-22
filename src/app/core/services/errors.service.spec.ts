import { TestBed } from '@angular/core/testing';
import { ErrorService } from './errors.service';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('ErrorService', () => {
  let service: ErrorService;
  let snackBar: MatSnackBar;
  let snackBarSpy: jasmine.Spy;
  let snackBarRefSpy: jasmine.SpyObj<MatSnackBarRef<any>>;

  const testMessage = 'Test Error Message';
  const testAction = 'Acknowledge';

  beforeEach(() => {
    snackBarRefSpy = jasmine.createSpyObj('MatSnackBarRef', ['afterDismissed', 'dismiss']);

    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [ErrorService]
    });

    service = TestBed.inject(ErrorService);
    snackBar = TestBed.inject(MatSnackBar);

    snackBarSpy = spyOn(snackBar, 'open').and.returnValue(snackBarRefSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a MatSnackBar with the correct message and duration', () => {
    service.showError(testMessage, testAction);

    expect(snackBarSpy).toHaveBeenCalledWith(testMessage, testAction, {
      duration: service.durationInSeconds * 1000
    });
  });

  it('should call action callback when MatSnackBar is dismissed', (done) => {
    const actionCallback = jasmine.createSpy('actionCallback');
    const dismissResponse: MatSnackBarDismiss = { dismissedByAction: true };

    snackBarRefSpy.afterDismissed.and.returnValue(of(dismissResponse));

    service.showError(testMessage, testAction, actionCallback);

    snackBarRefSpy.afterDismissed().subscribe(() => {
      expect(actionCallback).toHaveBeenCalled();
      done();
    });
  });

  
  it('should dismiss the current snackbar before showing a new one', () => {
    const firstMessage = 'First Error Message';
    const secondMessage = 'Second Error Message';

    // Show the first error message
    service.showError(firstMessage, testAction);
    expect(service.currentRef).toBeDefined();
    expect(snackBarSpy).toHaveBeenCalledWith(firstMessage, testAction, {
      duration: service.durationInSeconds * 1000
    });

    // Show the second error message, which should dismiss the first one
    service.showError(secondMessage, testAction);
    expect(snackBarRefSpy.dismiss).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalledWith(secondMessage, testAction, {
      duration: service.durationInSeconds * 1000
    });
  });
});