declare namespace svelteHTML {
    interface HTMLAttributes<T> {
        'on:clickOutside'?: (event: any) => any;
    }
}