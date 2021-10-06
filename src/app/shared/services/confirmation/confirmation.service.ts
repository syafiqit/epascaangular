import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { merge } from 'lodash-es';
import { ConfirmationConfig } from './confirmation.types';
import { ConfirmationComponent } from './confirmation.component';

@Injectable()
export class ConfirmationService
{
    private _defaultConfig: ConfirmationConfig = {
        title      : 'Confirm action',
        message    : 'Are you sure you want to confirm this action?',
        icon       : {
            show : true,
            name : 'alert-triangle',
            color: 'error'
        },
        actions    : {
            confirm: {
                show : true,
                label: 'Confirm',
                color: 'warn'
            },
            cancel : {
                show : true,
                label: 'Cancel'
            }
        },
        dismissible: false
    };

    /**
     * Constructor
     */
    constructor(
        private _matDialog: MatDialog
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    open(config: ConfirmationConfig = {}): MatDialogRef<ConfirmationComponent>
    {
        // Merge the user config with the default config
        const userConfig = merge({}, this._defaultConfig, config);

        // Open the dialog
        return this._matDialog.open(ConfirmationComponent, {
            autoFocus   : false,
            disableClose: !userConfig.dismissible,
            data        : userConfig
        });
    }
}
