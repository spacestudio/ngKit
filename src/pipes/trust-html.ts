import { DomSanitizationService, SafeHtml } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'trustHtml'
})
class TrustHtml implements PipeTransform {
    /**
     * Create pipe instance.
     * @param  {DomSanitizationService} sanitizer
     */
    constructor(private sanitizer: DomSanitizationService) { }

    /**
     * Transform html content to trusted html.
     *
     * @param  {string} value
     * @return {SafeHtml}
     */
    transform(value: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}
