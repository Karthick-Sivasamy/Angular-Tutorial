import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: '../header/header.html',
  styleUrl: '../header/header.css',
})
export class Header {}
