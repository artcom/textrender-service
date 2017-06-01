# Textrender Service

This service can render almost any form of unicode text with HTML formatting.
It is based on [PhantomJS](https://phantomjs.org) and has an express-like
routing API based on a
[gist of @trevordixon](gist.github.com/trevordixon/3061477).

## Examples

These examples are supplemental to the development-blogpost discussed here:
[Browsers as Font Renderers](http://artcom.github.io/browsers-as-font-renderers/)

Running via ``./phantomjs _examples/simple_routing.js`` gives shows the usage
of the express-like routing.

Running via ``./phantomjs _examples/render_html.js`` gives a simple example of
rendering html.

## API Endpoints

This server currently features following api endpoints:

### <url>/render/html

Receives the following json, yields an url:
``` JSON
{
    "html": "<h3>Any form of a HTML Body</h3>", // required
    "width": 255, // required width
    "height": 255, // required height
    "autoSize": false, // optional for auto resizing to fill all content
    "fixedWidth": false, // optional to restrain content to width
    "header": "<title>Page Title</title>", // optional header content
    "css": "body { font-family: monospaced; }" // optional CSS content
}
```
Optional URL ``<url>/render/html/image`` yields an alpha-transparent image
directly, instead of an url.

### <url>/render/url
Receives the following json, yields an url:
``` JSON
{
    "url": "https://google.com/", // required
    "width": 255, // required width
    "height": 255, // required height
    "autoSize": false, // optional for auto resizing to fill all content
    "fixedWidth": false, // optional to restrain content to width
    "header": "<title>Page Title</title>", // optional header content
    "css": "body { font-family: monospaced; }" // optional CSS content
}
```
Optional URL ``<url>/render/url/image`` yields an alpha-transparent image
directly, instead of an url.

### <url>/render/template
Receives the following json, renders the template given in ``public/index.html``
and yields an url:
``` JSON
{
    "type": "intro--headline", // required
    "content": "Text content, <span>with possible html</span>", // required
    "width": 255, // required width
    "height": 255, // required height
    "autoSize": false, // optional for auto resizing to fill all content
    "fixedWidth": false, // optional to restrain content to width
    "header": "<title>Page Title</title>", // optional header content
    "css": "body { font-family: monospaced; }" // optional CSS content
}
```
Optional URL ``<url>/render/template/image`` yields an alpha-transparent image
directly, instead of an url.

## License

This project is MIT licensed, further information can be found in the
``LICENSE`` file.