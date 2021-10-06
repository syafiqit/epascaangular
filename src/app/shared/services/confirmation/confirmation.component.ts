import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationConfig } from './confirmation.types';

@Component({
    selector     : 'confirmation',
    templateUrl  : './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfirmationComponent implements OnInit
{
  constructor(
      @Inject(MAT_DIALOG_DATA) public data: ConfirmationConfig,
      public matDialogRef: MatDialogRef<ConfirmationComponent>
  )
  {
  }
  ngOnInit(): void
  {

  }
}
