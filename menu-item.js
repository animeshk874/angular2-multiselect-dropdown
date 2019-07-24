import { Component, TemplateRef, ContentChild, ViewContainerRef, Input } from '@angular/core';
var Item = (function () {
    function Item() {
    }
    return Item;
}());
export { Item };
Item.decorators = [
    { type: Component, args: [{
                selector: 'c-item',
                template: ""
            },] },
];
/** @nocollapse */
Item.ctorParameters = function () { return []; };
Item.propDecorators = {
    'template': [{ type: ContentChild, args: [TemplateRef,] },],
};
var Badge = (function () {
    function Badge() {
    }
    return Badge;
}());
export { Badge };
Badge.decorators = [
    { type: Component, args: [{
                selector: 'c-badge',
                template: ""
            },] },
];
/** @nocollapse */
Badge.ctorParameters = function () { return []; };
Badge.propDecorators = {
    'template': [{ type: ContentChild, args: [TemplateRef,] },],
};
var Search = (function () {
    function Search() {
    }
    return Search;
}());
export { Search };
Search.decorators = [
    { type: Component, args: [{
                selector: 'c-search',
                template: ""
            },] },
];
/** @nocollapse */
Search.ctorParameters = function () { return []; };
Search.propDecorators = {
    'template': [{ type: ContentChild, args: [TemplateRef,] },],
};
var TemplateRenderer = (function () {
    function TemplateRenderer(viewContainer) {
        this.viewContainer = viewContainer;
    }
    TemplateRenderer.prototype.ngOnInit = function () {
        this.view = this.viewContainer.createEmbeddedView(this.data.template, {
            '\$implicit': this.data,
            'item': this.item
        });
    };
    TemplateRenderer.prototype.ngOnDestroy = function () {
        this.view.destroy();
    };
    return TemplateRenderer;
}());
export { TemplateRenderer };
TemplateRenderer.decorators = [
    { type: Component, args: [{
                selector: 'c-templateRenderer',
                template: ""
            },] },
];
/** @nocollapse */
TemplateRenderer.ctorParameters = function () { return [
    { type: ViewContainerRef, },
]; };
TemplateRenderer.propDecorators = {
    'data': [{ type: Input },],
    'item': [{ type: Input },],
};
//# sourceMappingURL=menu-item.js.map