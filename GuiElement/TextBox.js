import SoopyBoxElement from "./SoopyBoxElement";
import EditableText from "./EditableText";

class TextBox extends SoopyBoxElement {
    constructor() {
        super()

        this.text = new EditableText().setLocation(0, 0, 1, 1)
        this.addChild(this.text)
    }

    setText(text) {
        this.text.setText(text)
        this.dirtyDisplayList()
        return this
    }

    getText() {
        return this.text.getText()
    }

    setPrefix(text) {
        this.text.setPrefix(text)
        this.dirtyDisplayList()
        return this
    }

    setSuffix(text) {
        this.text.setSuffix(text)
        this.dirtyDisplayList()
        return this
    }

    setPlaceholder(placeholder) {
        this.text.placeholder = placeholder
        this.dirtyDisplayList()
        return this;
    }

    select() {
        this.text.selected = true
        this.dirtyDisplayList()
        return this
    }

    deselect() {
        this.text.selected = false
        this.dirtyDisplayList()
        return this
    }
}

export default TextBox