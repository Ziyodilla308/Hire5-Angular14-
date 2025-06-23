import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-product-description-dialog',
    imports: [Dialog, ButtonDirective, ButtonModule, NgIf, NgForOf, Checkbox, FormsModule],
    standalone: true,
    template: `
        <div class="card flex flex-col gap-y-3">
            <div>
                <a (click)="back()" class="cursor-pointer hover:text-green-600"><i class="pi pi-fw pi-arrow-circle-left"></i> Back</a>
            </div>
            <hr />

            <div>
                <h4>Product Details</h4>
            </div>

            <div class="flex gap-x-3">
                <span class="font-bold text-[15px]">Name: </span>
                <span>{{ productData?.selectedProduct?.name || '' }}</span>
            </div>
            <div class="flex gap-x-3">
                <span class="font-bold text-[15px]">Description:</span>
                <span>{{ productData?.selectedProduct?.description || '' }}</span>
            </div>
            <div class="flex gap-x-3">
                <span class="font-bold text-[15px]">SKU: </span>
                <span>{{ productData?.selectedProduct?.sku || '' }}</span>
            </div>
            <div class="flex gap-x-3">
                <span class="font-bold text-[15px]">Cost: </span>
                <span>{{ productData?.selectedProduct?.cost || '' }}</span>
            </div>

            <hr />

            <div>
                <h6>Profiles:</h6>

                <div *ngIf="productData?.selectedProduct?.profile" class="flex flex-col gap-y-3">
                    <div *ngFor="let key of objectKeys(productData.selectedProduct.profile)">
                        <div class="flex gap-x-3">
                            <span class="font-bold text-[15px]">{{ key }}:</span>
                            <p-checkbox *ngIf="key === 'available'"
                                        [(ngModel)]="productData.selectedProduct.profile[key]" binary="true" disabled> </p-checkbox>


                            <span *ngIf="key !== 'available'">{{ productData.selectedProduct.profile[key] }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ProductDetails implements OnInit {
    productData: any;

    constructor(private router: Router) {}

    ngOnInit() {
        this.loadProductDetails();
    }

    loadProductDetails() {
        this.productData = JSON.parse(localStorage.getItem('selectedProduct') || '{}');

        console.log(this.productData?.selectedProduct?.cost);
    }

    objectKeys(obj: any): string[] {
        return Object.keys(obj);
    }

    back() {
        this.router.navigate(['/products']);
        localStorage.removeItem('selectedProduct');
    }
}
