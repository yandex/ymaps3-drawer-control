import {YMapEntity} from '@yandex/ymaps3-types';
import {CustomReactify, OverrideProps, Prettify} from '@yandex/ymaps3-types/reactify/reactify';
import type TReact from 'react';
import {YMapDrawerControl as YMapDrawerControlI, YMapDrawerControlProps} from '../YMapDrawerControl';

type YMapDrawerControlReactifiedProps = Prettify<
    OverrideProps<
        YMapDrawerControlProps,
        {
            content: () => TReact.ReactElement;
        }
    >
>;

type YMapDrawerControlR = TReact.ForwardRefExoticComponent<
    Prettify<YMapDrawerControlReactifiedProps & React.RefAttributes<YMapEntity<YMapDrawerControlProps>>>
>;

export const YMapDrawerControlReactifyOverride: CustomReactify<YMapDrawerControlI, YMapDrawerControlR> = (
    YMapDrawerControlI,
    {reactify, React, ReactDOM}
) => {
    const YMapDrawerControlReactified = reactify.entity(YMapDrawerControlI);

    const YMapDrawerControlR = React.forwardRef<YMapDrawerControlI, YMapDrawerControlReactifiedProps>((props, ref) => {
        const [drawerContent] = React.useState<HTMLElement>(document.createElement('div'));
        const [content, setContent] = React.useState<React.ReactElement>();

        const drawer = React.useMemo(() => {
            setContent(props.content());
            return () => drawerContent;
        }, [props.content, drawerContent]);

        return (
            <>
                <YMapDrawerControlReactified {...props} content={drawer} ref={ref} />
                {ReactDOM.createPortal(content, drawerContent)}
            </>
        );
    });

    return YMapDrawerControlR;
};
