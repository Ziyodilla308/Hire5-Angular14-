import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    FormArray,
    FormBuilder, FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { TProfileTypes } from '../types/profile-types';
import { ProfileTypeService } from '../../service/profile-type.service';
import { TwoDigitDecimalNumberDirective } from '../directives/two-digital-descimal-numbers.directive';
import { EditorProfileTypesComponent } from './editor-profile-types';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../service/product.service';
import { Select } from 'primeng/select';
import { KeyValueProfileComponent } from './app-key-value-profile';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-create-product',
    imports: [CommonModule, RouterLink, ReactiveFormsModule, ButtonDirective, Checkbox, DropdownModule, InputText, FormsModule, TwoDigitDecimalNumberDirective, EditorProfileTypesComponent, Select, KeyValueProfileComponent, Toast],
    providers: [ProfileTypeService, MessageService, ProductService],
    template: `
        <div class="card">
            <a routerLink="/products" class="cursor-pointer hover:text-emerald-700"><i
                class="pi pi-fw pi-arrow-circle-left"></i> Back</a>
            <div class="mt-4 mb-4">
                <h4>{{ title }}</h4>
            </div>

            <hr />

            <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
                <div class="p-4 flex flex-col gap-y-4">
                    <div class="grid gap-y-2">
                        <label>Name <span class="text-red-600">*</span></label>
                        <input type="text" pInputText formControlName="name" />
                        <span class="text-red-600" *ngIf="productForm.get('name')?.errors">Required field</span>
                    </div>
                    <div class="grid gap-y-2">
                        <label>Description <span class="text-red-600">*</span></label>
                        <input type="text" pInputText formControlName="description" />
                        <span class="text-red-600" *ngIf="productForm.get('description')?.errors">Required field</span>
                    </div>
                    <div class="grid gap-y-2">
                        <label>SKU <span class="text-red-600">*</span></label>
                        <input type="text" pInputText formControlName="sku" />
                        <span class="text-red-600" *ngIf="productForm.get('sku')?.errors">Required field</span>
                    </div>
                    <div class="grid gap-y-2">
                        <label for="productCost">Cost <span class="text-red-600">*</span></label>
                        <input id="productCost" type="text" pInputText formControlName="cost"
                               appTwoDigitDecimalNumber />
                        <span class="text-red-600" *ngIf="productForm.get('cost')?.errors">Required field</span>
                    </div>
                </div>

                <div class="mt-4">
                    <h6>Profiles</h6>

                    <div class="p-4 flex flex-col gap-y-4">
                        <div class="flex gap-x-2 items-center">
                            <div class="w-full grid gap-y-2">
                                <label>Type</label>
                                <p-select
                                    [options]="profileType"
                                    formControlName="profileTypes"
                                    [showClear]="true"
                                    optionLabel="name"></p-select>
                            </div>
                            <div class="w-[10%] mt-6">
                                <button type="button" (click)="showEditProfileDialog()" pButton>Edit Profile type
                                </button>
                            </div>
                        </div>
                        <div class="grid gap-y-2">
                            <label>Available</label>
                            <p-checkbox [binary]="true" inputId="binary" formControlName="available"></p-checkbox>
                        </div>

                        <div class="grid gap-y-2">
                            <label>Backlog</label>
                            <div class="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                                <button (click)="decrement()" type="button"
                                        class="px-4 py-2 bg-blue-500 text-white text-xs rounded-lg disabled:bg-gray-300"
                                        [disabled]="value === 0">-
                                </button>
                                <input type="number" [value]="value" formControlName="backlog" readonly
                                       class="w-10 text-center text-lg font-semibold bg-white border border-gray-300 outline-none rounded-lg" />
                                <button (click)="increment()" type="button"
                                        class="px-4 py-2 bg-blue-500 text-white text-xs rounded-lg">+
                                </button>
                            </div>
                        </div>
                        <app-key-value-profile *ngIf="productData.item === 'edit'" [(profile)]="profileKeyValue"
                                               (profileChange)="updateProfile($event)"></app-key-value-profile>
                    </div>
                </div>

                <div class="mt-6 w-full flex items-center justify-end gap-x-2">
                    <button *ngIf="productData.item === 'create'" pButton type="button" severity="danger"
                            (click)="productForm.reset()">Reset
                    </button>
                    <button type="submit" pButton>Save</button>
                </div>
            </form>

            <app-editor-profile-types [displayEditProfile]="displayEditProfile" [profileType]="profileType"
                                      (closeDialog)="displayEditProfile = false"
                                      [fetchProfileTypes]="getProfileType.bind(this)"></app-editor-profile-types>
            <p-toast />
        </div>
    `,
    standalone: true
})
export class CreateProductComponent implements OnInit, AfterViewChecked {
    profileType: TProfileTypes[] = [];
    productForm: FormGroup;
    value: number = 0;
    displayEditProfile: boolean = false;
    id: string | null | undefined;
    productData: any;
    title: string = '';
    selectedOption: any = null;
    profileKeyValue: { [key: string]: string } = {};

    constructor(
        private fb: FormBuilder,
        private profileTypeService: ProfileTypeService,
        private messageService: MessageService,
        private productService: ProductService,
        private router: Router
    ) {
        this.productForm = fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            sku: ['', Validators.required],
            cost: ['', Validators.required],
            profileTypes: [this.profileType[0]],
            available: [true],
            backlog: [null]
        });
    }

    ngAfterViewChecked() {
        this.productForm.updateValueAndValidity();
    }

    ngOnInit() {
        this.getProfileType();
        this.loadProductData();
    }

    loadProductData() {
        this.productData = JSON.parse(localStorage.getItem('selectedProduct') || '{}');

        if (this.productData.item === 'edit') {
            this.productForm.get('sku')?.disable();
            this.title = 'Edit Product';
            const { type, available, backlog, ...keyValueProfile } = this.productData?.selectedProduct?.profile ?? {};
            this.profileKeyValue = keyValueProfile;

            this.productForm?.patchValue({
                name: this.productData?.selectedProduct?.name || '',
                description: this.productData?.selectedProduct?.description || '',
                sku: this.productData?.selectedProduct?.sku || '',
                cost: this.productData?.selectedProduct?.cost || '',
                available: this.productData?.selectedProduct?.profile?.available ?? true,
                backlog: this.productData?.selectedProduct?.profile?.backlog || null,
                material: this.productData?.selectedProduct?.profile?.material || null,
                brand: this.productData?.selectedProduct?.profile?.brand || null,
                profileTypes: this.productData?.selectedProduct?.profile?.profileTypes || []
            });

            this.selectedOption = this.productData?.selectedProduct?.profile?.type || null;
        } else if (this.productData.item === 'create') {
            this.productForm.reset();
            this.title = 'Create Product';
            this.productForm.get('available')?.setValue(true);
        }
    }

    getProfileType() {
        this.profileTypeService.getProfileType().subscribe((res) => {
            this.profileType = res;
            this.setDefaultValue();
        });
    }

    updateProfile(updatedKeyValue: { [key: string]: string }) {
        this.profileKeyValue = updatedKeyValue;
    }

    setDefaultValue() {
        if (this.profileType.length > 0) {
            this.productForm.get('profileTypes')?.setValue(this.profileType[0]);
        } else {
            this.productForm.get('profileTypes')?.setValue('');
        }
    }

    getFormValue(name: string) {
        return this.productForm.controls[name]?.value;
    }

    increment() {
        this.value++;
        console.log(this.value);
    }

    decrement() {
        if (this.value > 0) {
            this.value--;
        }


    }

    showEditProfileDialog() {
        this.displayEditProfile = true;
    }

    onSubmit() {
        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter required fields!'
            });
        } else {
            const name = this.getFormValue('name');
            const description = this.getFormValue('description');
            const cost = this.getFormValue('cost');
            const type = this.getFormValue('profileTypes');
            const available = this.getFormValue('available') ?? true;
            const backlog = this.getFormValue('backlog') ?? this.value;

            const profile: Record<string, any> = {};

            if (type) profile['type'] = type.name;
            if (available) profile['available'] = available;
            if (backlog) profile['backlog'] = backlog;

            const payload: Record<string, any> = {
                name,
                description,
                cost
            };

            if (this.productData.item === 'create') {
                payload['sku'] = this.getFormValue('sku');
            }

            if (this.profileKeyValue && Object.keys(this.profileKeyValue).length > 0) {
                Object.keys(this.profileKeyValue).forEach((key) => {
                    profile[key] = this.profileKeyValue[key];
                });
            }

            if (Object.keys(profile).length > 0) {
                payload['profile'] = profile;
            }

            console.log(payload);

            if (this.productData.item === 'edit') {
                this.productService.patchUpdateItems(this.productData.selectedProduct.id, payload).subscribe((res) => {
                    console.log(res);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Product successfully added'
                    });
                    this.router.navigate(['/products']);
                });
            } else if (this.productData.item === 'create') {
                this.productService.postCreateItems(payload).subscribe((res) => {
                    console.log(res);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Product successfully added'
                    });
                    this.router.navigate(['/products']);
                });
            }
        }
    }
}
