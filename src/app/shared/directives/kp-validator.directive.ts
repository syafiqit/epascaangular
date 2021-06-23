import { Directive } from '@angular/core';
import { AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[kpValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: KpValidatorDirective,
    multi: true
  }]
})
export class KpValidatorDirective implements Validator {

  kod=['01', '21', '22', '23', '24', '02', '25', '26', '27', '03',
    '28', '29', '04', '30', '05', '31', '59', '06', '32', '33',
    '07', '34', '35', '08', '36', '37', '38', '39', '09', '40',
    '10', '41', '42', '43', '44', '11', '45', '46', '12', '47',
    '48', '49', '13', '50', '51', '52', '53', '14', '54', '55',
    '56', '57', '15', '58', '16', '82']

  validate(control: AbstractControl) : {[key: string]: any} | null {

    if(control.value && control.value.length == 12){
      const kp = control.value.substring(6,8);
      if (this.kod.indexOf(kp) != -1) {
        return null;
      }
      else {
        return { 'stateCodeInvalid': true };
      }
    }

    if (control.value && control.value.length < 12) {
      return { 'valueInvalid': true };
    }

    else {
      return null;
    }
  }
}
