import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly staticUser = { username: 'admin', password: '123456' };
    private readonly staticToken = 'Bearer 01234567890';
    private router = inject(Router);

    login(username: string, password: string): boolean {
        if (username === this.staticUser.username && password === this.staticUser.password) {
            localStorage.setItem('authToken', this.staticToken);
            return true;
        }
        return false;
    }

    logout(): void {
        localStorage.removeItem('authToken');
        this.router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }
}
