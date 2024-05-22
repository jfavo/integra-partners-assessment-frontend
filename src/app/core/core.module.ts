import { NgModule } from "@angular/core";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { BackendService } from "./services/backend.service";
import { ErrorService } from "./services/errors.service";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSnackBarModule } from "@angular/material/snack-bar";

@NgModule({
    declarations: [
        NavbarComponent,
    ],
    imports: [
        MatButtonModule,
        MatToolbarModule,
        MatSnackBarModule
    ],
    providers: [
        BackendService,
        ErrorService
    ],
    exports: [
        NavbarComponent,
    ],
})
export class CoreModule { }