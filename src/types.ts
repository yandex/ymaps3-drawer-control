declare module '@yandex/ymaps3-types/import' {
    interface Import {
        (pkg: 'ymaps3-drawer-control'): Promise<typeof import('./index')>;
    }
}

export {};
