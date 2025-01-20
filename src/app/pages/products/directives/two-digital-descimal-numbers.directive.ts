import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    standalone: true,
    selector: '[appTwoDigitDecimalNumber]'
})
export class TwoDigitDecimalNumberDirective {
    private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

    @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(private el: ElementRef, private ngControl: NgControl) {}

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }

        let current: string = this.el.nativeElement.value;
        const position = this.el.nativeElement.selectionStart;

        if (current.indexOf('.') === -1 && position === current.length) {
            if (current.length > 0) {
                current = current + '.';
            }
        }

        const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');

        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }

    @HostListener('blur', ['$event'])
    onBlur(event: Event) {
        let value = this.el.nativeElement.value;

        if (!value.includes('.')) {
            value = value + '.00';
        } else {
            const [integer, decimal] = value.split('.');
            value = decimal.length === 2 ? `${integer}.${decimal}` : `${integer}.${decimal.slice(0, 2)}`;
        }
        if (this.ngControl) {
            this.ngControl.control?.setValue(value);
        }

        this.el.nativeElement.value = value;
        this.valueChange.emit(value);
        console.log(value);
    }
}
