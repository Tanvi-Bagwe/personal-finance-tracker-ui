import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { AppStore } from '../../shared/service/app-store/app-store.service';

@Component({
  selector: 'app-header',
  imports: [MatIcon, MatIconButton, MatToolbar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(readonly appStore: AppStore) {
    console.log(this.appStore.isLoggedIn());
  }

}
