import { Component, EventEmitter, Input,  Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button, ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { PrimeTemplate } from 'primeng/api';
import { TProfileTypes } from '../types/profile-types';
import { ProfileTypeService } from '../../service/profile-type.service';
import { InputText } from 'primeng/inputtext';
import { NgForOf, NgIf } from '@angular/common';

@Component({
    selector: 'app-editor-profile-types',
    imports: [FormsModule, ButtonDirective, Dialog, PrimeTemplate, InputText, Button, NgForOf, NgIf],
    providers: [ProfileTypeService],
    template: `
        <p-dialog [(visible)]="displayEditProfile" [modal]="true" [closable]="false" [style]="{ width: '300px' }" header="Product Description">
            <div class="flex gap-2 mb-4">
                <input type="text" pInputText [(ngModel)]="newProfileName" [ngModelOptions]="{ standalone: true }" placeholder="Enter profile name" class="border px-2 py-1 flex-1 rounded-md" />
                <button (click)="addProfile()" class="bg-blue-500 text-white px-3 py-1 rounded-md">Add</button>
            </div>
            <div>
                <div class="flex flex-col" *ngFor="let prof of profileType; trackBy: trackByCode">
                    <div class="flex justify-between">
                        <div class="mb-2 p-2 border-blue-100 bg-gray-100 rounded-[10px] ">{{ prof.name }}</div>
                        <div class="flex gap-x-2">
                            <p-button (click)="deleteProfile(prof.id)" icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger"></p-button>
                            <p-button (click)="editProfile(prof)" icon="pi pi-pencil" [rounded]="true" [text]="true" severity="warn"></p-button>
                        </div>
                    </div>
                </div>
            </div>
            <div *ngIf="editingProfile" class="mt-4">
                <h5>Edit Profile</h5>
                <div class="flex gap-2 mb-4">
                    <input type="text" pInputText [(ngModel)]="editingProfile.name" [ngModelOptions]="{ standalone: true }" placeholder="Enter profile name" class="border px-2 py-1 flex-1 rounded-md" />
                    <button (click)="updateProfile()" class="bg-green-500 text-white px-3 py-1 rounded-md">Update</button>
                </div>
            </div>
            <ng-template pTemplate="header">
                <div class="w-full flex items-center justify-between">
                    <h4>Profile Types</h4>
                    <button pButton icon="pi pi-times" (click)="close()"></button>
                </div>
            </ng-template>
        </p-dialog>
    `,
    standalone: true
})
export class EditorProfileTypesComponent {
    @Input() displayEditProfile: boolean = false;
    @Input() profileType: any[] = [];
    @Output() closeDialog = new EventEmitter<void>();
    @Input() fetchProfileTypes: (() => void) | undefined = undefined;
    newProfileName = '';
    editingProfile: any;

    constructor(private profileTypeService: ProfileTypeService) {}

    addProfile() {
        if (this.newProfileName.trim()) {
            const newProfile: TProfileTypes = {
                code: this.profileType.length > 0 ? Math.max(...this.profileType.map((p) => p.code)) + 1 : 1,
                name: this.newProfileName.trim()
            };

            this.profileTypeService.addProfileType(newProfile).subscribe(
                (res) => {
                    this.profileType.push(res);
                    this.newProfileName = '';
                    this.fetchProfileTypes?.();
                    this.close();
                },
                (error) => {
                    console.error('Error adding profile type', error);
                }
            );
        }
    }

    deleteProfile(profileId: string) {
        this.profileTypeService.deleteProfileType(profileId).subscribe(
            (res) => {
                this.fetchProfileTypes?.();
                this.profileType = this.profileType.filter((profile) => profile.id !== profileId);
            },
            (error) => {
                console.error('Error deleting profile type', error);
            }
        );
    }

    editProfile(profile: any) {
        this.editingProfile = { ...profile };
    }

    updateProfile() {
        if (this.editingProfile && this.editingProfile.name.trim()) {
            this.profileTypeService.updateProfileType(this.editingProfile).subscribe(
                (res) => {
                    const index = this.profileType.findIndex((p) => p.id === this.editingProfile?.id);
                    if (index !== -1) {
                        this.profileType[index] = res;
                    }
                    this.editingProfile = null;
                    this.fetchProfileTypes?.();
                    this.close();
                },
                (error) => {
                    console.error('Error updating profile type', error);
                }
            );
        }
    }

    close() {
        this.closeDialog.emit();
        this.resetForm();
    }

    resetForm() {
        this.newProfileName = '';
        this.editingProfile = null;
    }

    trackByCode(index: number, item: TProfileTypes) {
        return item.code;
    }
}
