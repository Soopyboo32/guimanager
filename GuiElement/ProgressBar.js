import SoopyNumber from "../Classes/SoopyNumber";
import SoopyRenderEvent from "../EventListener/SoopyRenderEvent";

const { default: SoopyBoxElement } = require("./SoopyBoxElement");

class ProgressBar extends SoopyBoxElement{
    constructor(){
        super();
        
        let renderEvent = new SoopyRenderEvent()

        this.progress = new SoopyNumber(0)

        renderEvent.setHandler(()=>{
            let progressNum = this.progress.get()

            Renderer.drawRect(Renderer.color(0,255,0), this.location.getXExact(), this.location.getYExact(), this.location.getXExact() + this.location.getWidthExact()*progressNum, this.location.getYExact()+this.location.getHeightExact())
        })

        this.events.push(renderEvent)
    }

    setProgress(num){
        this.progress.set(num, 500)
        return this;
    }
}

export default ProgressBar