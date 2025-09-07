import { Component, signal } from '@angular/core';

import { Header } from './header/header';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // ✅ import this

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('first-angular-app');
}
