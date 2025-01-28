import type {YMapLocationRequest, YMap} from '@yandex/ymaps3-types';
import {Position, YMapDrawerControl} from './YMapDrawerControl';

describe('YMap smoke test', () => {
    const LOCATION: YMapLocationRequest = {center: [0, 0], zoom: 9};

    let container: HTMLElement, map: YMap;
    beforeEach(() => {
        container = document.createElement('div');
        Object.assign(container.style, {width: `643px`, height: `856px`});
        document.body.appendChild(container);
        map = new ymaps3.YMap(container, {location: LOCATION}, [new ymaps3.YMapDefaultSchemeLayer({})]);
    });

    afterEach(() => {
        map.destroy();
        container.remove();
    });

    it('should make map', () => {
        map.addChild(
            new YMapDrawerControl({
                position: 'left',
                verticalTriggerPosition: 'center',
                open: true,
                content: () => {
                    const element = document.createElement('div');
                    const title = document.createElement('h1');
                    title.textContent = 'Hello world';
                    element.appendChild(title);
                    return element;
                }
            })
        );
        const tree = domToJson(map.container);
        expect(tree).toMatchSnapshot();
    });
    it('should toggle open', () => {
        const drawerControl = new YMapDrawerControl({
            position: 'left',
            verticalTriggerPosition: 'center',
            open: true,
            content: () => {
                const element = document.createElement('div');
                const title = document.createElement('h1');
                title.textContent = 'Hello world';
                element.appendChild(title);
                return element;
            }
        });
        map.addChild(drawerControl);
        expect(domToJson(map.container)).toMatchSnapshot();

        // close drawer
        drawerControl.update({open: false});
        expect(domToJson(map.container)).toMatchSnapshot();
    });

    const POSITIONS: Position[] = ['left', 'right', 'top', 'bottom'];
    it.each(POSITIONS)('should position %s', (position) => {
        const drawerControl = new YMapDrawerControl({
            position,
            open: true,
            content: () => {
                const element = document.createElement('div');
                element.classList.add('drawer-content');
                return element;
            }
        });
        map.addChild(drawerControl);
        expect(domToJson(map.container)).toMatchSnapshot();

        // close drawer
        drawerControl.update({open: false});
        expect(domToJson(map.container)).toMatchSnapshot();
    });
});
