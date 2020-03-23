import { NgModule, ModuleWithProviders } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { NGKIT_PROVIDERS } from "./providers";

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
