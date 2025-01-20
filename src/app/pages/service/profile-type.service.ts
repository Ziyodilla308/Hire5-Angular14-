    import { Injectable } from '@angular/core';
    import { TProfileTypes } from '../products/types/profile-types';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';

    @Injectable()

    export class ProfileTypeService {
        private apiUrl = 'http://localhost:3000/profileTypes';

        constructor(private http: HttpClient) {
        }

        getProfileType(): Observable<TProfileTypes[]> {
            return this.http.get<TProfileTypes[]>(this.apiUrl);
        }

        addProfileType(profile: TProfileTypes): Observable<TProfileTypes> {
            return this.http.post<TProfileTypes>(this.apiUrl, profile);
        }

        deleteProfileType(id: string) {
           return this.http.delete(`${this.apiUrl}/${id}`);
        }

        updateProfileType(profile: any): Observable<TProfileTypes> {
            return this.http.put<TProfileTypes>(`${this.apiUrl}/${profile.id}`, profile);
        }
    }
