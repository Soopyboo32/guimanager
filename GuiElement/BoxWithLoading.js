import SoopyRenderEvent from "../EventListener/SoopyRenderEvent";

const { default: SoopyBoxElement } = require("./SoopyBoxElement");

let startTime = Date.now()

let loadingImage = undefined
new Thread(()=>{
    let buffImage = javax.imageio.ImageIO.read(new java.io.File(com.chattriggers.ctjs.CTJS.INSTANCE.configLocation.toURI().normalize().getRawPath()+ "ChatTriggers/modules/guimanager/Resources/loading-icon.jpg"))
    loadingImage = new Image(buffImage)
}).start()

class BoxWithLoading extends SoopyBoxElement{
    constructor(){
        super();

        let renderEvent = new SoopyRenderEvent()
        

        renderEvent.setHandler(()=>{
            if(!loadingImage) return
            let rotation = (Date.now()-startTime)/2

            let size = Math.min(this.location.getWidthExact(),this.location.getHeightExact())

            Renderer.translate(this.location.getXExact()+this.location.getWidthExact()/2, this.location.getYExact()+this.location.getHeightExact()/2)
            Renderer.rotate(rotation)
            loadingImage.draw(-size/2,-size/2, size,size)
        })

        this.events.push(renderEvent)
    }
}

export default BoxWithLoading