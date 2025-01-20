import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-key-value-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, InputText, ButtonDirective],
    providers: [MessageService],
    template: `
    <div class="bg-gray-100 p-2 rounded-lg">
      <h5 class="text-lg font-semibold mb-2">Custom Key-Value Pairs</h5>
      <div *ngFor="let item of keyValueList; let i = index" class="flex items-center gap-2 mb-2">
        <input pInputText type="text" class="border p-2 rounded-lg w-1/3" [value]="item.key" disabled>
        <input pInputText type="text" class="border p-2 rounded-lg w-1/3" [(ngModel)]="item.value" (ngModelChange)="updateValue(i, $event)">
        <button pButton type="button" class="bg-red-500 text-white px-3 py-1 rounded-lg" (click)="removeItem(i)">X</button>
      </div>
      <div class="flex items-center gap-2 mt-4">
        <input pInputText type="text" class="border p-2 rounded-lg w-1/3" [(ngModel)]="newKey" placeholder="Key">
        <input pInputText type="text" class="border p-2 rounded-lg w-1/3" [(ngModel)]="newValue" placeholder="Value">
        <button pButton type="button" class="bg-green-500 text-white px-3 py-1 rounded-lg" (click)="addItem()">Add</button>
      </div>
    </div>
  `
})
export class KeyValueProfileComponent {
    @Input() profile: { [key: string]: string } = {};
    @Output() profileChange = new EventEmitter<{ [key: string]: string }>();

    keyValueList: { key: string; value: string }[] = [];
    newKey = '';
    newValue = '';

    ngOnInit() {
        this.keyValueList = Object.entries(this.profile || {}).map(([key, value]) => ({ key, value }));
    }

    updateValue(index: number, value: string) {
        this.keyValueList[index].value = value;
        this.emitChanges();
    }

    addItem() {
        if (!this.newKey || !this.newValue || this.profile[this.newKey]) return;
        this.keyValueList.push({ key: this.newKey, value: this.newValue });
        this.newKey = '';
        this.newValue = '';
        this.emitChanges();
    }

    removeItem(index: number) {
        this.keyValueList.splice(index, 1);
        this.emitChanges();
    }

    emitChanges() {
        this.profileChange.emit(
            this.keyValueList.reduce((acc, item) => {
                acc[item.key] = item.value;
                return acc;
            }, {} as { [key: string]: string })
        );
    }
}
