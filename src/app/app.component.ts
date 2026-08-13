import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/services/i18n.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="aqarflow-root" [dir]="i18n.direction()" [lang]="i18n.language()">
      <router-outlet />
    </main>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly i18n = inject(I18nService);
}
