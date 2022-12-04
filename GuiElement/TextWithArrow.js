import SoopyHoverChangeEvent from "../EventListener/SoopyHoverChangeEvent";
import SoopyGuiElement from "./SoopyGuiElement";

const { default: SoopyTextElement } = require("./SoopyTextElement");

class TextWithArrow extends SoopyGuiElement {
    constructor() {
        super();

        this.text = new SoopyTextElement().setMaxTextScale(2).setLocation(0, 0, 0.8, 1)

        this.arrow = new SoopyTextElement().setText("§7>").setMaxTextScale(2).setLocation(0.9, 0, 0.1, 1)

        this.addChild(this.text).addChild(this.arrow)

        this.directionRight = true

        let hoverEvent = new SoopyHoverChangeEvent()

        hoverEvent.setHandler(() => {
            if (this.hovered) {
                this.arrow.setMaxTextScale(3, 1000)
                this.arrow.location.location.x.set(this.directionRight ? 0.85 : 0, 700)
                this.arrow.location.size.x.set(0.15, 700)
                this.text.setMaxTextScale(2.5, 1000)
                this.text.dirtyDisplayList(1000)
                this.arrow.dirtyDisplayList(1000)
            } else {
                this.arrow.setMaxTextScale(2, 500)
                this.arrow.location.location.x.set(this.directionRight ? 0.9 : 0, 500)
                this.arrow.location.size.x.set(0.1, 500)
                this.text.setMaxTextScale(2, 500)
                this.text.dirtyDisplayList(500)
                this.arrow.dirtyDisplayList(500)
            }
        })

        this.addEvent(hoverEvent)
    }

    /**
     * @returns {TextWithArrow}
     */
    setDirectionRight(val) {
        this.directionRight = val

        this.arrow.setText("§7" + (val ? ">" : "<")).setLocation(0, 0, 0.1, 1)
        this.text.setLocation(0.2, 0, 0.8, 1)

        this.text.dirtyDisplayList()
        this.arrow.dirtyDisplayList()
        return this
    }

    setText(text) {
        this.text.setText(text)
        this.text.dirtyDisplayList()
        return this;
    }
}

export default TextWithArrow