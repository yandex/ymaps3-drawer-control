import {LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = reactify.module(ymaps3);

    const {useState, useCallback} = React;

    const {YMapDrawerControl} = reactify.module(await ymaps3.import('ymaps3-drawer-control'));

    const App = () => {
        const [open, setOpen] = useState(false);
        const content = useCallback(
            () => (
                <div>
                    <h1>Hello world!</h1>
                    <button onClick={() => setOpen(false)}>Close</button>
                </div>
            ),
            []
        );

        const onOpenChange = (value: boolean) => {
            setOpen(!value);
        };

        return (
            <YMap location={LOCATION}>
                <YMapDefaultSchemeLayer />

                <YMapDefaultFeaturesLayer />

                <YMapDrawerControl
                    position="left"
                    width={300}
                    content={content}
                    open={open}
                    onOpenChange={onOpenChange}
                />
            </YMap>
        );
    };

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('app')
    );
}
