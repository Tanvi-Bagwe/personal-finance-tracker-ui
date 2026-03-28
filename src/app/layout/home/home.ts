import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle } from '@angular/material/card';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatIcon,
    MatButton,
    MatCardContent,
    MatCard,
    MatCardHeader,
    MatCardSubtitle,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
