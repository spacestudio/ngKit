import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NGKIT_PROVIDERS } from './providers';

@NgModule({
    imports: [HttpClientModule],
    providers: [
        ...NGKIT_PROVIDERS,
    ]
})
export class ngKitModule {
    /**
     * ngKit module initializer.
     *
     * @param  options
     */
    static forRoot(options: any): ModuleWithProviders {
        return {
            ngModule: ngKitModule,
            providers: [
                { provide: 'ngKitOptions', useValue: options },
            ]
        }
    }
}
