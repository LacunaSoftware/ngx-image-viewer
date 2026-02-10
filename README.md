# LacunaImageViewer [Legacy]

> [!Note]
> This project has been integrated within [Lacuna Material](https://github.com/LacunaSoftware/lacuna-material), please refer to the newer project for pull-requests and fixes.

A fork from [NgxImageViewer](https://github.com/jpilfold/ngx-image-viewer), which is a configurable Angular image viewer component.

What LacunaImageViewer has improved in NgxImageViewer:
 * This library was using `Angular` at version 5.x, and we updated it to 9.x (it important to say that it was built with Ivy) and some other packages, such as `ng-packagr`;
 * Started using `Material` as default for the buttons and icons, instead of `Font-awesome`;
 * Made it possible to use `SafeUrl` and `SafeResourceUrl` as source; 
 * Made it possible to disable dragging (`allowDrag`);
 * Made the wheel zoom work only when ctrl is pressed, to follow the way other viewers work, such as Adobe Reader (the config `wheelZoom` was renamed to `allowCtrlWheelZoom` as well);
 * Since the package `screenfull` was causing some errors in runtime, we replaced it by the package `angular-bigscreen`, which is simpler to use, and, as `screenfull`, is a wrapper of the HTML5 fullscreen API;
 * Fixed some build errors that showed up after we updated `ng-packagr` (errors related to private properties that were being used in the template, and also to callbacks with the wrong signature);
 * Fixed a bug that happened when a user was in fullscreen mode, and exited by pressing "ESC"; when doing so, the user would need to press the fullscreen button twice to activate it again. We did it by deleting ToggleFullscreenDirective and simplifying the logic of the method toggleFullscreen, from ImageViewerComponent.

## NgxImageViewer Features:
 * Compatible with Angular 2.x, 4.x and 5.x
 * Configurable
 * Rotate image
 * Zoom image
 * Drag to move image
 * Toggle fullscreen mode

## NgxImageViewer DEMO

https://angular-2wrbwp.stackblitz.io/

---

## Set up

To use default configuration, simply import ImageViewerModule into your module, like so:

```javascript
import { ImageViewerModule } from "lacuna-image-viewer";

@NgModule({
  //...
  imports: [
    //...
    ImageViewerModule.forRoot()
  ],
  //...
})
```

Then, add the component to your template, providing an array of image URLs. You can also optionally add an index, to indicate which image should be shown first. The default will be the first item in the array.

```html
<ngx-image-viewer  [src]="images" [(index)]="imageIndex"></ngx-image-viewer>
```

By default, the image viewer will fill its container. If you wish to restrict the size, simply place it within a div, and set the size constraints on the div.


If you want to use the standard icons of LacunaImageViewer, you will also need to install `@angular/cdk` and `@angular/material`, and set up your styles file to use Angular Material as well.

```
npm install --save @angular/cdk
npm install --save @angular/material
```

Otherwise, you will need to use the configuration to set different icon classes.


---

## Configuration

Configuration can be provided at module level (by passing the object as an argument to `forRoot()`), or at component level, by passing it to the `config` input. Any configuration provided at component level will override the one that was passed at module level.

The configuration object is structured as below. All values are optional, and if ommitted, the default value shown below will be used.

```javascript
{
  btnClass: 'mat-mini-fab', // The CSS class(es) that will apply to the buttons
  zoomFactor: 0.1, // The amount that the scale will be increased by
  containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
  allowCtrlWheelZoom: true, // If true, pressing ctrl and scrolling the mouse wheel will be used to zoom in and out when the cursor is inside the component
  allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
  allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
  allowDrag: true, // If true, you will be able to drag the image and move it inside the container
  btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
    zoomIn: 'material-icons zoom-in',
	zoomOut: 'material-icons zoom-out',
	rotateClockwise: 'material-icons rotate-clockwise',
	rotateCounterClockwise: 'material-icons rotate-counterclock',
	next: 'material-icons next',
	prev: 'material-icons prev',
	fullscreen: 'material-icons fullscreen',
  },
  btnShow: {
    zoomIn: true,
    zoomOut: true,
    rotateClockwise: true,
    rotateCounterClockwise: true,
    next: true,
    prev: true
  }
};
```

You can also add custom buttons, as in the example below: 

```html 
<ngx-image-viewer [src]="images" 
                  [config]="{customBtns:[{ name: 'link', icon: 'material-icons link' }]}"
                  (customEvent)="handleEvent($event)">
</ngx-image-viewer>
```

```javascript
handleEvent(event: CustomEvent) {
    console.log(`${event.name} has been click on img ${event.imageIndex + 1}`);

    switch (event.name) {
      case 'print':
        console.log('run print logic');
        break;
    }
}
```

Note: currently only 3 additional buttons is supported due to css


