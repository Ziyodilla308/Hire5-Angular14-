import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { TProduct } from './types/product-types';
import { TableModule } from 'primeng/table';

import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ProductDetails } from './components/product-details';
import { Button, ButtonDirective } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Router } from '@angular/router';

type PageType = 'create' | 'edit' | 'details';

@Component({
    selector: 'app-product',
    imports: [TableModule, Toast, ProductDetails, Button, ConfirmDialog, ButtonDirective],
    standalone: true,
    providers: [MessageService, ProductService],
    template: `
        <div>
            <p-toast />
            <div class="card">
                <div class="mb-4 flex items-center justify-between">
                    <h4>Product List</h4>
                    <button (click)="onHandleNavigatePage('create')" pButton icon="pi pi-fw pi-plus-circle">Create Product</button>
                </div>
                <p-table [value]="products" stripedRows [tableStyle]="{ 'min-width': '100%' }">
                    <ng-template #header>
                        <tr>
                            <th pSortableColumn="id">Index <p-sortIcon field="id" /></th>
                            <th pSortableColumn="sku">SKU <p-sortIcon field="sku" /></th>
                            <th pSortableColumn="name">Name <p-sortIcon field="name" /></th>
                            <th pSortableColumn="cost">Price <p-sortIcon field="cost" /></th>
                            <th>Actions</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-product>
                        <tr (click)="showDescription('details', product)">
                            <td>{{ product.id }}</td>
                            <td>{{ product.sku }}</td>
                            <td>{{ product.name }}</td>
                            <td>{{ product.cost }}</td>
                            <td >
                                <div class="flex gap-x-2">
                                    <p-button (click)="onButtonClick($event, product, 'delete')" size="small" icon="pi pi-trash" [rounded]="true" severity="danger" />
                                    <p-button (click)="onButtonClick($event, product, 'edit')" size="small" icon="pi pi-pencil" [rounded]="true" severity="warn" />
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>

            <p-confirm-dialog />
        </div>
    `
})
export class Product implements OnInit {
    products: TProduct[] = [];
    displayDescription: boolean = false;
    selectedProduct: TProduct | null = null;

    constructor(
        private productService: ProductService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getProducts();
        localStorage.removeItem('selectedProduct');
    }

    getProducts() {
        this.productService.getItems().subscribe(
            (response) => {
                this.products = response.sort((a, b) => a.id - b.id);
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: error.message
                });
            }
        );
    }



    showDescription(type: PageType, product?: TProduct) {
        this.setSelectedProductToStorage(type, product || null);
        this.router.navigate(['/productDetails']);
    }

    onHandleNavigatePage(type: PageType, product?: TProduct) {
        this.setSelectedProductToStorage(type, product || null);
        this.router.navigate(['/create']);
    }

    setSelectedProductToStorage(type: PageType, product: TProduct | null) {
        localStorage.setItem('selectedProduct', JSON.stringify({ item: type, selectedProduct: product }));
    }


    onButtonClick(event: MouseEvent, product: TProduct, action: 'delete' | 'edit') {
        event.stopPropagation();
        if (action === 'edit') {
            this.onHandleNavigatePage('edit', product);
        } else if (action === 'delete') {
            this.confirmDeleteProduct(event, product.id);
        }
    }

    confirmDeleteProduct(event: Event, id: number) {
        this.productService.confirmDeleteItems(id, event, this.getProducts.bind(this));
    }


}
