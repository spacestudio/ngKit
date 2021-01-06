import { NGKIT_PROVIDERS } from './providers';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

@NgModule({
  imports: [HttpClientModule],
  providers: [...NGKIT_PROVIDERS]
})
export class NgKitModule {
  /**
   * ngKit module initializer.
   */
  static forRoot(options: any = {}): ModuleWithProviders<NgKitModule> {
    return {
      ngModule: NgKitModule,
      providers: [{ provide: "ngKitOptions", useValue: options }]
    };
  }
}
