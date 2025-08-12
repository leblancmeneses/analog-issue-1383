import { injectLoad } from '@analogjs/router';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { load } from './about.server';

@Component({
  template: `
  <div>
    <h1>About! {{ serverData().server }}</h1>
  </div>
  `,
})
export default class AboutComponent {
  serverData = toSignal(injectLoad<typeof load>(), { requireSync: true });
}
