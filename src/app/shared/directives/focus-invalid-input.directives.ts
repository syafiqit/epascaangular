import { Directive, HostListener, ElementRef, ContentChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';

@Directive({
  selector: '[focusInvalidInput]'
})
export class FocusInvalidInputDirective {
  @ContentChild(NgSelectComponent) select: NgSelectComponent;

  constructor(private el: ElementRef) {}

  @HostListener('submit')
  onFormSubmit() {
    const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');

    if (invalidControl) {
      if (invalidControl.tagName === "NG-SELECT") {
        this.select.focus();
        return;
      }
      invalidControl.focus();
    }

  }

  @HostListener('click', ['$event.target'])
  onClick(e){
    if(e.attributes.role?.value === 'tab'){
      const invalidControl = this.el.nativeElement.querySelector('.ng-invalid');
      if (invalidControl) {
        invalidControl.focus();
      }
    }
  }
}
