import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeServiceTs {
    toggleDark() {

      document.body.classList.toggle("dark-theme");

    }
}
