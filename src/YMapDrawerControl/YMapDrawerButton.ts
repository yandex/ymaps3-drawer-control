import './YMapDrawerButton.css';

import {HorizontalTriggerPosition, Position, VerticalTriggerPosition} from './YMapDrawerControl';

export type YMapDrawerButtonProps = {
    open: boolean;
    position: Position;
    onOpenChange?: (open: boolean) => void;
    verticalTriggerPosition: VerticalTriggerPosition;
    horizontalTriggerPosition: HorizontalTriggerPosition;
};

export class YMapDrawerButton extends ymaps3.YMapComplexEntity<YMapDrawerButtonProps> {
    private _buttonContainer: HTMLElement;
    private _iconElement: HTMLElement;

    protected _onAttach(): void {
        this._buttonContainer = document.createElement('div');
        this._buttonContainer.classList.add(
            'ymaps3--drawer-control-button',
            this._props.position,
            getPrefixHorizontalTriggerPosition(this._props.horizontalTriggerPosition),
            getPrefixVerticalTriggerPosition(this._props.verticalTriggerPosition)
        );
        this._buttonContainer.addEventListener('click', this._onControlClick);

        this._iconElement = document.createElement('div');
        this._iconElement.classList.add('ymaps3--drawer-control-button-icon', this._props.position);
        this._iconElement.classList.toggle('open', this._props.open);

        this._buttonContainer.appendChild(this._iconElement);
        ymaps3.useDomContext(this, this._buttonContainer, null);
    }

    protected _onUpdate(propsDiff: Partial<YMapDrawerButtonProps>, oldProps: YMapDrawerButtonProps): void {
        if (propsDiff.position !== undefined) {
            this._buttonContainer.classList.replace(oldProps.position, propsDiff.position);
            this._iconElement.classList.replace(oldProps.position, propsDiff.position);
        }

        if (propsDiff.verticalTriggerPosition !== undefined) {
            this._buttonContainer.classList.replace(
                getPrefixVerticalTriggerPosition(oldProps.verticalTriggerPosition),
                getPrefixVerticalTriggerPosition(propsDiff.verticalTriggerPosition)
            );
        }

        if (propsDiff.horizontalTriggerPosition !== undefined) {
            this._buttonContainer.classList.replace(
                getPrefixHorizontalTriggerPosition(oldProps.horizontalTriggerPosition),
                getPrefixHorizontalTriggerPosition(propsDiff.horizontalTriggerPosition)
            );
        }

        if (propsDiff.open !== undefined) {
            this._iconElement.classList.toggle('open', propsDiff.open);
        }
    }

    protected _onDetach(): void {
        this._buttonContainer.removeEventListener('click', this._onControlClick);
    }

    private _onControlClick = () => {
        this._props.onOpenChange?.(this._props.open);
    };
}

function getPrefixVerticalTriggerPosition(verticalTriggerPosition: VerticalTriggerPosition): string {
    return `vtp-${verticalTriggerPosition}`;
}

function getPrefixHorizontalTriggerPosition(horizontalTriggerPosition: HorizontalTriggerPosition): string {
    return `htp-${horizontalTriggerPosition}`;
}
