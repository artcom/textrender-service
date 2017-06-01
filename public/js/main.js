document.setContent = (function() {
    var container;
    document.addEventListener("DOMContentLoaded", function() {
        container = document.getElementById("content");
    });
    return function(type, content) {
        container.className = type.toLowerCase();
        container.innerHTML = content;
    };
}());

document.addEventListener("DOMContentLoaded", function() {
    var classes = [
        'intro--headline', 'chapter-overview--headline',
        'chapter-overview--image-subtitle', 'chapter--headline-chapter',
        'chapter--topic-subtitle', 'chapter--submenu-topic-title',
        'topic--headline-topic', 'topic--submenu', 'topic--bullet-points',
        'menu--active-state', 'menu--nonactive-state', 'menu--points',
        'menu--language'
    ];

    if(window.location.hash !== "#debug") {
        return;
    }

    var next = (function() {
        var i = 0;

        return function() {
            document.setContent(classes[i++ % classes.length], "Lorem ipsum dolor sit amet");
        }
    })()

    setInterval(function() {
        next();
    }, 1250);
})