define(function() {

    return {
        width: function() {
            return window.innerWidth || document.documentElement.clientWidth;
        },

        height: function() {
            return window.innerHeight || document.documentElement.clientHeight;
        }
    }
});