export function FormState() {

    return function(target) {
        /**
         * Form has errors.
         *
         * @type {boolean}
         */
        target.prototype.errors = <boolean>null;

        /**
         * Form error message.
         *
         * @type {string}
         */
        target.prototype.errorMessage = <string>'';

        /**
         * Form success message.
         *
         * @type {string}
         */
        target.prototype.successMessage = <string>'';

        /**
         * Form loading state.
         *
         * @type {boolean}
         */
        target.prototype.loading = <boolean>false;

        /**
         * Reset the form state.
         *
         * @return {void}
         */
        target.prototype.resetState = (): void => {
            this.errors = null;
            this.errorMessage = '';
            this.successMessage = '';
            this.loading = false;
        }

        return target;
    }
}
