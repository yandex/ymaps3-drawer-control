import {DomDetach} from '@yandex/ymaps3-types';
import './YMapDrawerContent.css';

import {YMapDrawerContentProps as CoreYMapDrawerContentProps} from './YMapDrawerControl';

export type YMapDrawerContentProps = {
    content: CoreYMapDrawerContentProps;
};

export class YMapDrawerContent extends ymaps3.YMapComplexEntity<YMapDrawerContentProps> {
    private _containerElement: HTMLElement;
    private _detachDom: DomDetach;
    private _content: ReturnType<CoreYMapDrawerContentProps>;

    protected _onAttach(): void {
        this._containerElement = document.createElement('div');
        this._containerElement.classList.add('ymaps3--drawer-control-content');
        this._content = this._props.content();

        this._attachContent();

        this._detachDom = ymaps3.useDomContext(this, this._containerElement, null);
    }

    protected _onUpdate(props: Partial<YMapDrawerContentProps>): void {
        if (props.content !== undefined) {
            this._detachContent();
            this._content = this._props.content();
            this._attachContent();
        }
    }

    protected _onDetach(): void {
        this._detachContent();
        this._detachDom();
        this._detachDom = undefined;
    }

    private _attachContent() {
        if (this._content instanceof ymaps3.YMapEntity) {
            this.addChild(this._content);
        } else {
            this._containerElement.appendChild(this._content);
        }
    }

    private _detachContent() {
        if (this._content instanceof ymaps3.YMapEntity) {
            this.removeChild(this._content);
        } else {
            this._containerElement.removeChild(this._content);
        }
    }
}
