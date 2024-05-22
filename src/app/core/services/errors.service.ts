import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    /**
     * How long the error message will stay on screen for
     */
    durationInSeconds = 5;

    /**
     * Current show message if one exists
     */
    currentRef: MatSnackBarRef<TextOnlySnackBar> | undefined;

    constructor(private snackBar: MatSnackBar) {}

    /**
     * Shows an error on the screen with an action to acknowledge it
     * @param message The error message to be displayed
     * @param action The text value of the action
     * @param actionCallback A callback function that if passed will be called when
     * a user presses on the action button
     */
    showError(message: string, action: string, actionCallback?: () => any) {
        // If we have an error being shown currently, we will clear it out
        // before showing our new one.
        this.resetError();
        
        var ref = this.snackBar.open(message, action, {
            duration: this.durationInSeconds * 1000,
        });

        if (actionCallback) {
            ref.afterDismissed().subscribe(() => {
                actionCallback();
            })
        }

        this.currentRef = ref;
    }

    /**
     * Dismisses the currently shown error message
     */
    private resetError() {
        this.currentRef?.dismiss();
    }
}