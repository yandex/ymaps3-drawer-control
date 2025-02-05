import type {YMapLocationRequest} from '@yandex/ymaps3-types';

ymaps3.import.loaders.unshift(async (pkg) => {
    if (!pkg.startsWith('@yandex/ymaps3-drawer-control')) {
        return;
    }

    if (location.href.includes('localhost')) {
        await ymaps3.import.script(`/dist/index.js`);
    } else {
        await ymaps3.import.script(`https://unpkg.com/${pkg}/dist/index.js`);
    }

    return window['@yandex/ymaps3-drawer-control'];
});

export const LOCATION: YMapLocationRequest = {
    center: [37.623082, 55.75254], // starting position [lng, lat]
    zoom: 9 // starting zoom
};
