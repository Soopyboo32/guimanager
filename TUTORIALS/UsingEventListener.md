To use the event listener, you will need to create a {@link SoopyEventListener}

```js
let renderBackgroundEvent = new SoopyRenderBackgroundEvent();
```

Then you need to set a handler function on it

```js
renderBackgroundEvent.setHandler((event, guiElement, partialTicks) => {
  //Event code goes here
});
```

Then you add the event to a {@link SoopyGuiElement} with

```js
let soopyGui = new SoopyGui();

soopyGui.element.addEventListener(renderBackgroundEvent);
```
