export interface ConfirmationConfig
{
    title?: string;
    message?: string;
    icon?: {
        show?: boolean;
        name?: 'alert-triangle' | 'check-circle' | 'x-circle' | 'help-circle' | 'info';
        color?: 'primary' | 'accent' | 'basic' | 'info' | 'success' | 'warning' | 'error';
    };
    actions?: {
        confirm?: {
            show?: boolean;
            label?: string;
            color?: 'primary' | 'accent' | 'warn';
        };
        cancel?: {
            show?: boolean;
            label?: string;
        };
    };
    dismissible?: boolean;
}
