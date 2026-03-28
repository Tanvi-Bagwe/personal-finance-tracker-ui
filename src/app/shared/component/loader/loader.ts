import { Component, inject } from '@angular/core';
import { LoaderService } from '../../service/loader-service/loader-service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

// Loader component - displays loading spinner when data is being fetched
@Component({
  selector: 'app-loader',
  imports: [MatProgressSpinner],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  loaderService = inject(LoaderService);
}
