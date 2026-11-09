import type {YMapEntity} from '@yandex/ymaps3-types';
import {getSizeCssValue} from '../utils/cssHelpers';
import {YMapDrawerControlReactifyOverride} from './react/YMapDrawerControlReactifyOverride';
import {YMapDrawerControlVuefyOptions, YMapDrawerControlVuefyOverride} from './vue/YMapDrawerControlVuefyOverride';
import {YMapDrawerButton} from './YMapDrawerButton';
import {YMapDrawerContent} from './YMapDrawerContent';
import './YMapDrawerControl.css';

export type Position = 'left' | 'right' | 'top' | 'bottom';

const VERTICAL_POSITIONS: Position[] = ['top', 'bottom'];
const HORIZONTAL_POSITIONS: Position[] = ['left', 'right'];

export type VerticalTriggerPosition = 'top' | 'center' | 'bottom';
export type HorizontalTriggerPosition = 'left' | 'center' | 'right';

export type YMapDrawerTransitionDurationProps = {open: number; close: number};
export type YMapDrawerContentProps = () => HTMLElement | YMapEntity<unknown>;

export interface YMapDrawerControlProps {
    /** Specifies which side of the map the sidebar opens from (default: "left"). */
    position: Position;
    /** Duration of the open/close animation in milliseconds (default: 500). */
    transitionDuration?: number | YMapDrawerTransitionDurationProps;
    /** Flag indicating whether the drawer is open. Also allows programmatic opening/closing of the drawer. Required parameter. */
    open: boolean;
    /** Fixed width of the drawer. If not specified, the drawer adjusts to the content's width. */
    width?: string | number;
    /** Maximum width of the drawer. */
    maxWidth?: string | number;
    /** Minimum width of the drawer. */
    minWidth?: string | number;
    /** Fixed height of the drawer. If not specified, the drawer adjusts to the content's height. */
    height?: string | number;
    /** Maximum height of the drawer. */
    maxHeight?: string | number;
    /** Minimum height of the drawer. */
    minHeight?: string | number;
    /** Drawer button control lick. */
    onOpenChange?: (open: boolean) => void;
    /** Vertical position of the button that opens the drawer. */
    verticalTriggerPosition?: VerticalTriggerPosition;
    /** Horizontal position of the button that opens the drawer. */
    horizontalTriggerPosition?: HorizontalTriggerPosition;
    /** Function that returns the sidebar's content as an HTMLElement or an entity (YMapEntity) with useDomContext inside. */
    content: YMapDrawerContentProps;
}

const defaultProps = Object.freeze({
    position: 'left',
    transitionDuration: 500,
    verticalTriggerPosition: 'center',
    horizontalTriggerPosition: 'center'
});

type DefaultProps = typeof defaultProps;

export class YMapDrawerControl extends ymaps3.YMapComplexEntity<YMapDrawerControlProps, DefaultProps> {
    static defaultProps = defaultProps;

    static [ymaps3.overrideKeyReactify] = YMapDrawerControlReactifyOverride;

    static [ymaps3.overrideKeyVuefy] = YMapDrawerControlVuefyOverride;
    static [ymaps3.optionsKeyVuefy] = YMapDrawerControlVuefyOptions;

    private _drawerContainer: HTMLElement;
    private _contentEntity: YMapDrawerContent;
    private _buttonEntity: YMapDrawerButton;

    private get _transitionDuration(): number {
        const {transitionDuration, open} = this._props;
        if (typeof transitionDuration === 'number') {
            return transitionDuration;
        }
        return open ? transitionDuration.open : transitionDuration.close;
    }

    private get _width(): string {
        return getSizeCssValue({
            originalValue: this._props.width,
            currentPosition: this._props.position,
            ignorePositions: VERTICAL_POSITIONS,
            ignorePositionValue: '100%',
            defaultValue: ''
        });
    }
    private get _minWidth(): string {
        return getSizeCssValue({
            originalValue: this._props.minWidth,
            currentPosition: this._props.position,
            ignorePositions: VERTICAL_POSITIONS,
            ignorePositionValue: '',
            defaultValue: ''
        });
    }
    private get _maxWidth(): string {
        return getSizeCssValue({
            originalValue: this._props.maxWidth,
            currentPosition: this._props.position,
            ignorePositions: VERTICAL_POSITIONS,
            ignorePositionValue: '',
            defaultValue: ''
        });
    }
    private get _height(): string {
        return getSizeCssValue({
            originalValue: this._props.height,
            currentPosition: this._props.position,
            ignorePositions: HORIZONTAL_POSITIONS,
            ignorePositionValue: '100%',
            defaultValue: ''
        });
    }
    private get _minHeight(): string {
        return getSizeCssValue({
            originalValue: this._props.minHeight,
            currentPosition: this._props.position,
            ignorePositions: HORIZONTAL_POSITIONS,
            ignorePositionValue: '',
            defaultValue: ''
        });
    }
    private get _maxHeight(): string {
        return getSizeCssValue({
            originalValue: this._props.maxHeight,
            currentPosition: this._props.position,
            ignorePositions: HORIZONTAL_POSITIONS,
            ignorePositionValue: '',
            defaultValue: ''
        });
    }

    constructor(props: YMapDrawerControlProps) {
        super(props);
    }

    protected _onAttach() {
        this._drawerContainer = document.createElement('div');
        this._drawerContainer.classList.add('ymaps3--drawer-control-container', this._props.position);
        this._drawerContainer.classList.toggle('open', this._props.open);
        this._updateTransitionDuration();
        this._updateSizes();

        this.root.container.appendChild(this._drawerContainer);
        ymaps3.useDomContext(this, this._drawerContainer, this._drawerContainer);

        this._contentEntity = new YMapDrawerContent({content: this._props.content});
        this.addChild(this._contentEntity);

        this._buttonEntity = new YMapDrawerButton({
            open: this._props.open,
            position: this._props.position,
            onOpenChange: this._props.onOpenChange,
            verticalTriggerPosition: this._props.verticalTriggerPosition,
            horizontalTriggerPosition: this._props.horizontalTriggerPosition
        });
        this.addChild(this._buttonEntity);
    }

    protected _onUpdate(propsDiff: Partial<YMapDrawerControlProps>, oldProps: YMapDrawerControlProps): void {
        if (propsDiff.position !== undefined) {
            this._updateTransitionDuration(true);
            this._drawerContainer.classList.replace(oldProps.position, propsDiff.position);
            this._updateSizes();
            this._buttonEntity.update({position: propsDiff.position});
        }

        if (propsDiff.open !== undefined) {
            this._updateTransitionDuration();
            this._drawerContainer.classList.toggle('open', propsDiff.open);
            this._buttonEntity.update({open: propsDiff.open});
        }

        if (propsDiff.transitionDuration !== undefined) {
            this._updateTransitionDuration();
        }

        if (propsDiff.content !== undefined) {
            this._contentEntity.update({content: propsDiff.content});
        }

        if (this._props.width !== oldProps.width) {
            this._drawerContainer.style.width = this._width;
        }
        if (this._props.minWidth !== oldProps.minWidth) {
            this._drawerContainer.style.minWidth = this._minWidth;
        }
        if (this._props.maxWidth !== oldProps.maxWidth) {
            this._drawerContainer.style.maxWidth = this._maxWidth;
        }

        if (this._props.height !== oldProps.height) {
            this._drawerContainer.style.height = this._height;
        }
        if (this._props.minHeight !== oldProps.minHeight) {
            this._drawerContainer.style.minHeight = this._minHeight;
        }
        if (this._props.maxHeight !== oldProps.maxHeight) {
            this._drawerContainer.style.maxHeight = this._maxHeight;
        }

        if (propsDiff.verticalTriggerPosition !== undefined) {
            this._buttonEntity.update({verticalTriggerPosition: propsDiff.verticalTriggerPosition});
        }
        if (propsDiff.horizontalTriggerPosition !== undefined) {
            this._buttonEntity.update({horizontalTriggerPosition: propsDiff.horizontalTriggerPosition});
        }
    }

    protected _onDetach() {
        this.removeChild(this._contentEntity);
        this.removeChild(this._buttonEntity);
    }

    private _updateTransitionDuration(disable = false) {
        this._drawerContainer.style.transition = disable
            ? 'none'
            : `transform ${this._transitionDuration}ms ease-in-out`;
    }

    private _updateSizes() {
        this._drawerContainer.style.width = this._width;
        this._drawerContainer.style.minWidth = this._minWidth;
        this._drawerContainer.style.maxWidth = this._maxWidth;

        this._drawerContainer.style.height = this._height;
        this._drawerContainer.style.minHeight = this._minHeight;
        this._drawerContainer.style.maxHeight = this._maxHeight;
    }
}
