import SoopyRenderEvent from "../EventListener/SoopyRenderEvent";

const { default: SoopyBoxElement } = require("./SoopyBoxElement");

let gearImage = undefined
new Thread(() => {
    try {
        let buffImage = javax.imageio.ImageIO.read(new java.io.File(com.chattriggers.ctjs.CTJS.INSTANCE.configLocation.toURI().normalize().getRawPath().substr(1).replace(/\%20/, " ") + "ChatTriggers/modules/guimanager/Resources/settings_gear.png"))
        gearImage = new Image(buffImage)
        asdmarkArr.forEach(a => a.dirtyDisplayList())
        asdmarkArr = []
    } catch (e) {
        //javax.imageio.IIOException: Can't read input file! for some people idk why
    }
}).start()
let asdmarkArr = []

class BoxWithGear extends SoopyBoxElement {
    constructor() {
        super();

        if (!gearImage) asdmarkArr.push(this)

        let renderEvent = new SoopyRenderEvent()

        renderEvent.setHandler(() => {
            if (!gearImage) return

            let size = Math.min(this.location.getWidthExact(), this.location.getHeightExact())

            Renderer.translate(this.location.getXExact() + this.location.getWidthExact() / 2, this.location.getYExact() + this.location.getHeightExact() / 2)
            gearImage.draw(-size / 2, -size / 2, size, size)
        })

        this.addEvent(renderEvent)
    }
}

export default BoxWithGear