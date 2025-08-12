import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { injectLoad } from '@analogjs/router';
import { load } from './index.server';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { injectAPIPrefix } from '@analogjs/router/tokens';

@Component({
  imports: [RouterLink],
  template: `
  <div>
  <a [routerLink]="['/about']" 
    class="underline p-3 mb-4 text-blue-600 hover:text-blue-200 focus:bg-blue-200 hover:opacity-75 focus:opacity-75 visited:text-blue-900">
    about
  </a>
    <h1>server fetched from _analog route: {{ serverData().server }}.</h1>
    <p>client requesting from api endpoint: {{clientHttpData().client}}.</p>
  </div>
  `,
})
export default class IndexComponent {
  serverData = toSignal(injectLoad<typeof load>(), { requireSync: true });
  clientHttpData = signal<{client: string}>({client: ''});

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly httpClient: HttpClient,) {
    const isBrowser = isPlatformBrowser(this.platformId);
    if (isBrowser) {
      firstValueFrom(this.httpClient.get<{client: string}>(`${injectAPIPrefix()}/v1/hello`)).then(response => {
        this.clientHttpData.set(response);
      }).catch(error => {
        this.clientHttpData.set({client: 'Error fetching data'});
        console.error(error);
      });
    }
  }
}
