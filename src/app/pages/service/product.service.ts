import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { TProduct } from '../products/types/product-types';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable()
export class ProductService {
    private apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
    }

    getItems(): Observable<TProduct[]> {
        return this.http.get<TProduct[]>(`${this.apiUrl}/items`);
    }

    confirmDeleteItems(
        id: number,
        event: Event,
        getAll: () => void) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to delete this product?',
            header: 'Confirm delete',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger',
            },

            accept: () => {
                this.http
                    .delete(`${this.apiUrl}/items/${id}`)
                    .pipe(
                        catchError((error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: error.message,
                            });
                            return of(null);
                        }),
                    )
                    .subscribe((res) => {
                        getAll();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Product successfully deleted',
                        });
                    });
            },
            reject: () => {
                this.messageService.add({ severity: 'info', summary: 'Great!', detail: 'The product was not deleted' });
            },
        });
    }


    postCreateItems(payload: any) {
        return this.http.post(`${this.apiUrl}/items`, payload);
    }

    patchUpdateItems(id: number, payload: any) {
        return this.http.patch(`${this.apiUrl}/items/${id}`, payload);
    }

}

