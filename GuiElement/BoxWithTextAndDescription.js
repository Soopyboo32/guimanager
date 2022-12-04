import SoopyHoverChangeEvent from "../EventListener/SoopyHoverChangeEvent";

const { default: SoopyBoxElement } = require("./SoopyBoxElement");
const { default: SoopyTextElement } = require("./SoopyTextElement");

class BoxWithTextAndDescription extends SoopyBoxElement {
    constructor() {
        super();

        this.text = new SoopyTextElement().setMaxTextScale(2).setLocation(0, 0, 0.8, 0.6)
        this.description = new SoopyTextElement().setMaxTextScale(1).setLocation(0.05, 0.6, 0.7, 0.4)

        this.addChild(this.description).addChild(this.text)


        let hoverEvent = new SoopyHoverChangeEvent()

        hoverEvent.setHandler(() => {
            if (this.hovered) {
                this.text.setMaxTextScale(2.5, 1000)
                this.dirtyDisplayList(1000)

                if (this.color[0] + this.color[1] + this.color[2] < 0.5 * (255 + 255 + 255)) {
                    this.setColorOffset(10, 10, 10, 100)
                } else {
                    this.setColorOffset(-10, -10, -10, 100)
                }
            } else {
                this.text.setMaxTextScale(2, 500)

                this.setColorOffset(0, 0, 0, 100)

                this.dirtyDisplayList(500)
            }

        })

        this.addEvent(hoverEvent)
    }

    setText(text) {
        this.text.setText(text)
        this.dirtyDisplayList()
        return this;
    }

    setDesc(text) {
        this.description.setText(text)
        this.dirtyDisplayList()
        return this;
    }
}

export default BoxWithTextAndDescription