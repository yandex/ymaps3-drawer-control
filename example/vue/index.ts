import {LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = vuefy.module(ymaps3);

    const {YMapDrawerControl} = vuefy.module(await ymaps3.import('ymaps3-drawer-control'));

    const app = Vue.createApp({
        components: {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapDrawerControl
        },
        setup() {
            const refMap = (ref) => {
                window.map = ref?.entity;
            };
            const open = Vue.ref(false);

            const closeDrawer = () => {
                open.value = false;
            };

            const onOpenChange = (value: boolean) => {
                open.value = !value;
            };
            const onClick = () => alert('Click!');
            return {LOCATION, refMap, onClick, closeDrawer, open, onOpenChange};
        },
        template: `
            <YMap :location="LOCATION">
                <YMapDefaultSchemeLayer />

                <YMapDefaultFeaturesLayer />
                
                <YMapDrawerControl :onOpenChange="onOpenChange" position="left" :width="300" :open="open">
                    <template #content>
                        <div>
                            <h1>Hello world!</h1>
                            <button @click="closeDrawer">Close</button>
                        </div>
                    </template>
                </YMapDrawerControl>
            </YMap>`
    });
    app.mount('#app');
}
