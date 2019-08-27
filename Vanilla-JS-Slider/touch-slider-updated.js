(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.SuperSlider = factory();
    }
}(this, function () {
    //    methods
    function superSlider(el, settings) {
        this.settings = {
            element : el
        }
    };

    //    exposed public method
    return superSlider;
}));
const selection = document.querySelector('.super-slider');
const slider = new SuperSlider(selection);
console.log(slider.settings.element);
