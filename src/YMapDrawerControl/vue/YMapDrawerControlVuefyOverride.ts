import type TVue from '@vue/runtime-core';
import {CustomVuefyFn, CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import {YMapDrawerContentProps, YMapDrawerControl, YMapDrawerControlProps} from '../YMapDrawerControl';

export const YMapDrawerControlVuefyOptions: CustomVuefyOptions<YMapDrawerControl> = {
    props: {
        position: {type: String as TVue.PropType<YMapDrawerControlProps['position']>, required: false},
        transitionDuration: {
            type: [Object, Number] as TVue.PropType<YMapDrawerControlProps['transitionDuration']>,
            required: false
        },
        open: {type: Boolean, required: true},
        width: {type: [String, Number], required: false},
        maxWidth: {type: [String, Number], required: false},
        minWidth: {type: [String, Number], required: false},
        height: {type: [String, Number], required: false},
        maxHeight: {type: [String, Number], required: false},
        minHeight: {type: [String, Number], required: false},
        verticalTriggerPosition: {
            type: String as TVue.PropType<YMapDrawerControlProps['verticalTriggerPosition']>,
            required: false
        },
        horizontalTriggerPosition: {
            type: String as TVue.PropType<YMapDrawerControlProps['horizontalTriggerPosition']>,
            required: false
        },
        onOpenChange: {type: Function as TVue.PropType<YMapDrawerControlProps['onOpenChange']>, required: false},
        content: {type: Function as unknown as TVue.PropType<YMapDrawerContentProps>, required: true}
    }
};

type YMapDrawerControlSlots = {
    content: void;
};

export const YMapDrawerControlVuefyOverride: CustomVuefyFn<YMapDrawerControl> = (
    YMapSomeClassI,
    props,
    {vuefy, Vue}
) => {
    const YMapDrawerControlVuefied = vuefy.entity(YMapSomeClassI);
    const {content, ...overridedProps} = props;
    const YMapDrawerControlV = Vue.defineComponent({
        props: overridedProps,
        name: 'YMapDrawerControl',
        components: {YMapDrawerControlVuefied},
        slots: Object as TVue.SlotsType<YMapDrawerControlSlots>,
        setup(props, {slots, expose}) {
            const content: TVue.Ref<TVue.VNodeChild | null> = Vue.ref(null);
            const popupHTMLElement = document.createElement('div');

            const markerRef = Vue.ref<{entity: YMapDrawerControl} | null>(null);
            const markerEntity = Vue.computed(() => markerRef.value?.entity);

            const popup = Vue.computed<YMapDrawerControlProps['content']>(() => {
                content.value = slots.content?.();
                return () => popupHTMLElement;
            });
            expose({entity: markerEntity});
            return () =>
                Vue.h(
                    YMapDrawerControlVuefied,
                    {
                        ...props,
                        content: popup.value,
                        ref: markerRef
                    },
                    () => Vue.h(Vue.Teleport, {to: popupHTMLElement}, [content.value])
                );
        }
    });
    return YMapDrawerControlV;
};
