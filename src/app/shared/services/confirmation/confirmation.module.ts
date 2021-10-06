import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from './confirmation.component';
import { ConfirmationService } from './confirmation.service';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    declarations: [
        ConfirmationComponent
    ],
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        CommonModule,
        SharedModule
    ],
    providers   : [
        ConfirmationService
    ]
})
export class ConfirmationModule
{
  constructor(private _confirmationService: ConfirmationService)
  {
  }
}
