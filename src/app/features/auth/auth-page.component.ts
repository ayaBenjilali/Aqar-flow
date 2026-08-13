import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-page">
      <main class="auth-layout">
        <section class="auth-brand">
          <span>AqarFlow</span>
          <h1>منصة عقارية عربية تجمع البحث، التواصل، وإدارة العملاء.</h1>
          <p>واجهة Ionic/Angular RTL جاهزة للويب والموبايل مع طبقة API قابلة للاستبدال.</p>
        </section>
        <router-outlet />
      </main>
    </div>
  `
})
export class AuthPageComponent {}
