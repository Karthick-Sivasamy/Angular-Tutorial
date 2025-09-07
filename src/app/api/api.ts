import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-api',
  imports: [],
  templateUrl: './api.html',
  styleUrl: './api.css',
})
export class Api {
  constructor(private http: HttpClient) {}

  fakeApiStore: any[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    this.http.get<any[]>('https://fakestoreapi.com/products').subscribe({
      next: (data) => {
        this.fakeApiStore = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('API error:', err);
        this.loading = false;
      },
    });
  }
}
