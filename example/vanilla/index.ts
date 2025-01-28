import {LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = ymaps3;

    const {YMapDrawerControl} = await ymaps3.import('ymaps3-drawer-control');

    map = new YMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(new YMapDefaultFeaturesLayer({}));

    let open = false;
    const drawerControl = new YMapDrawerControl({
        position: 'left',
        width: 300,
        open,
        onOpenChange: (value: boolean) => {
            open = !value;
            drawerControl.update({open});
        },
        content: () => {
            const container = document.createElement('div');

            const title = document.createElement('h1');
            title.textContent = 'Hello world';
            container.appendChild(title);

            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.addEventListener('click', () => {
                open = false;
                drawerControl.update({open: false});
            });
            container.appendChild(closeButton);

            return container;
        }
    });

    map.addChild(drawerControl);
}
