# Canvas-input

A simple and easy to use input bar for canvas.

# Usage

- Import the canvas-input.js or canvas-input.min.js file
```HTML
    <script src="canvas-input.js"></script>
```

- Create a new instance of 'CanvasInput' with your canvas and parameters 
```javascript

        // Function called on input submit
        function onSubmit(text)
        {
          console.log("The user has inserted:", text);
        }
        
        // Creating a new CanvasInput with a few parameters
        var canvasInput = new CanvasInput(canvas,
            {
                pos_x: 40,
                pos_y: 50,
                submit_callback: onSubmit
            });

```

- Call the 'render' function of your 'CanvasInput' in a loop

```javascript
        // Set an interval to clear the canvas and call the render function every 10ms
        setInterval(() => {
            // Clear the canvas
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            // Render the canvasInput element
            canvasInput.render();
        }, 10);

```

# Parameters

|Parameter name|Type|Default value|Action|
|---|---|---|---|
|pos_x|Integer|0|Horizontal position on the canvas|
|pos_y|Integer|0|Vertical position on the canvas|
|width|Integer|150|Width of the element|
|height|Integer|30|Height of the element|
|background_color|String|#FFFFFF|Background color of the element|
|contour_width|Integer|1|Width of the contour (0 for none)|
|contour_color|String|Black|Color of the contour|
|text_size|Integer|15|Size of the text (in pixels)|
|text_font|String|Arial|Font of the text|
|text_color|String|Black|Color of the text|
|submit_callback|Function|null|Function called when the 'enter' key is pressed, the input content is passed as parameter|
|placeholder|String| Enter text here ...|Placeholder displayed when no text is inserted|
|allow_overflow|Boolean|true|If true, allow to insert an unlimited number of characters|
|change_cursor_on_hover|Boolean|true|If true, the cursor will change on hover of the element|
