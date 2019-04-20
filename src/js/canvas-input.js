class CanvasInput {
    constructor(canvas, parameters) {
        // Init variables
        this.canvas = canvas;
        this.assignDefaultParameters(parameters);

        // Canvas
        this.ctx = canvas.getContext("2d");

        // Input
        this.input_text = "";
        this.input_selected = false;

        // Events

        this.addEventListeners();

        this.special_keys_callbacks = [
            { key: "Backspace", callback: this.onBackspacePress.bind(this) },
            { key: "Enter", callback: this.onEnterPress.bind(this) },
            { key: "ArrowLeft", callback: this.onArrowPress.bind(this) },
            { key: "ArrowRight", callback: this.onArrowPress.bind(this) },
            { key: "ArrowUp", callback: this.onArrowPress.bind(this) },
            { key: "ArrowDown", callback: this.onArrowPress.bind(this) },
        ];

        // Init functions calls

        this.calculateTextPosition();
        this.input_selector_pos = this.calculateSelectorPosition();
    }

    // Set the parameters or default values if the parameter is not found
    assignDefaultParameters(parameters) {
        const defaultValues = {
            pos_x: 0,
            pos_y: 0,
            width: 150,
            height: 30,
            contour_width: 1,
            contour_color: "black",
            text_size: 15,
            text_font: "Arial",
            text_color: "Black",
            submit_callback: null,
            placeholder: "Enter text here ..."
        };

        for (var key in defaultValues) {
            // if the parameter exist
            if (parameters && parameters.hasOwnProperty(key)) {
                this[key] = parameters[key];
            }
            // or else set the default value
            else {
                this[key] = defaultValues[key];
            }
        }
    }

    // Event functions

    addEventListeners() {
        // event listener to catch a click
        this.canvas.addEventListener("click", (e) => this.eventOnClick(e));
        // event listener to catch the hovering of the mouse
        this.canvas.addEventListener("mousemove", (e) => this.eventOnMouseHover(e));
        // event listener to catch the key pressed
        window.addEventListener("keydown", (e) => this.eventOnKeydown(e));
    }

    eventOnMouseHover(e) {
        // Get the mouse position
        const mousePosition = { x: e.clientX, y: e.clientY };
        // Check if the mouse is inside the elemetn
        if (this.isPositionInElement(mousePosition)) {
            // If so, change the cursor to the type: 'text'
            this.canvas.style.cursor = "text";
        }
        else {
            // If the mouse is outside of the element and the cursor type was 'text', we change it to 'auto'
            if (this.canvas.style.cursor === "text")
                this.canvas.style.cursor = "auto";
        }
    }

    eventOnClick(e) {
        // get the click position
        const clickPosition = { x: e.clientX, y: e.clientY };

        // Check if click is inside the input
        if (!this.isPositionInElement(clickPosition)) {
            // if not, set the input to not selected
            this.input_selected = false;
            return;
        }
        // if so, set the input to selected
        this.input_selected = true;
    }

    eventOnKeydown(e) {
        // leave if the input is not selected
        if (!this.input_selected)
            return;

        // If the key value is not a single character we search for a way to process it
        if (e.key.length > 1) {
            // Search if the key can be processed
            const specialKey = this.special_keys_callbacks.find((spacialKey) => { return (spacialKey.key === e.key) });
            // if so, call the function to process the key
            if (specialKey)
                specialKey.callback(e);
            return;
        }
        // set the text font and size
        this.ctx.font = this.text_size + "px " + this.text_font;

        // check if adding a character would make the text too big to display
        if (this.ctx.measureText(this.input_text + e.key).width > this.width)
            return;

        // Add the key pressed to the input text
        this.input_text += e.key;
        this.input_selector_pos = this.input_text.length;
    }

    onBackspacePress() {
        // If the backspace key is pressed and there is at least one character in the input text
        // we remove the last character
        if (this.input_text.length > 0) {
            // remove the last character from the string
            this.input_text = this.input_text.substr(0, this.input_text.length - 1);
            // Move the selector to the left
            if (this.input_selector_pos > 0)
                this.input_selector_pos--;
        }
    }

    onEnterPress() {
        // If the callback is not set or the input text is empty, leave
        if (!this.submit_callback || this.input_text.length === 0)
            return;
        // call the callback
        this.submit_callback(this.input_text);
        // clear the text
        this.input_text = "";
    }

    onArrowPress(e) {
        // Move the position of the selector
        switch (e.key) {
            case "ArrowLeft":
                if (this.input_selector_pos > 0)
                    this.input_selector_pos--;
                break;
            case "ArrowRight":
                if (this.input_selector_pos + 1 <= this.input_text.length)
                    this.input_selector_pos++;
                break;
        }
    }

    // move the element to an other location

    moveTo(newX, newY) {
        // set new positions
        this.pos_x = newX;
        this.pos_y = newY;

        // recalculate positions

        this.calculateTextPosition();
    }

    // Calcul functions

    // get the position of the text
    calculateTextPosition() {
        // Calculate the position of the text verticaly
        // The vertical position is:
        //    the position of the element
        //  + the height of the element divided by 2
        //  + the size of the text divided by 3

        this.input_text_pos = {
            x: this.pos_x,
            y: this.pos_y + (this.height / 2) + (this.text_size / 3)
        }
    }

    calculateSelectorPosition() {
        // Calculate the position of the selector
        // Get the text that is display on the left of the cursor
        var previous_text = this.input_text.substr(0, this.input_selector_pos);
        // Calculate the size of the text on the left of the cursor and add the position of the element
        return (this.input_text_pos.x + this.ctx.measureText(previous_text).width);
    }

    // Check if a position is inside the element
    isPositionInElement(position) {
        if (position.x >= this.pos_x && position.x <= this.pos_x + this.width
            && position.y >= this.pos_y && position.y <= this.pos_y + this.height) {
            return (true);
        }
        return (false);
    }

    // Display functions

    // Display the current content of the input
    drawInputText() {
        // set the font and the size of the text
        this.ctx.font = this.text_size + "px " + this.text_font;
        // Set the color of the text
        this.ctx.fillStyle = this.text_color;
        // Display the text
        this.ctx.fillText(this.input_text, this.input_text_pos.x, this.input_text_pos.y);
        // Display
        this.ctx.stroke();
    }

    // Display the contour of the input
    drawInputContour() {
        // If the contour is inferior or equal to 0, we don't display a contour
        if (this.contour_width <= 0)
            return;
        // Set the width of the contour
        this.ctx.lineWidth = this.contour_width;
        // Set the color of the contour
        this.ctx.strokeStyle = this.contour_color;
        // Draw a rectangle
        this.ctx.rect(this.pos_x, this.pos_y, this.width, this.height);
        // Display
        this.ctx.stroke();
    }

    drawInputSelector() {
        if (!this.input_selected)
            return;
        // set the font and the size of the text
        this.ctx.font = this.text_size + "px " + this.text_font;
        // Set the color of the text
        this.ctx.fillStyle = this.text_color;
        // Display the selector
        this.ctx.fillText('|', this.calculateSelectorPosition(), this.input_text_pos.y);
        // Display
        this.ctx.stroke();
    }

    drawPlaceholder() {
        // do not display the placeholder if some text is already entered
        if (this.input_text.length > 0 || !this.placeholder)
            return;
        // set the font and the size of the text
        this.ctx.font = this.text_size + "px " + this.text_font;
        // Set the color of the text
        this.ctx.fillStyle = "#808080";
        // display the placeholder
        this.ctx.fillText(this.placeholder, this.input_text_pos.x, this.input_text_pos.y);
        // Display
        this.ctx.stroke();
    }

    render() {
        // Check if the canvas is defined
        if (!this.canvas) {
            return;
        }
        this.drawPlaceholder();
        this.drawInputContour();
        this.drawInputText();
        this.drawInputSelector();
    }
};
