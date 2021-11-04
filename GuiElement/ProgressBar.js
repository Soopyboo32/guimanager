import SoopyNumber from "../Classes/SoopyNumber";
import SoopyRenderEvent from "../EventListener/SoopyRenderEvent";

const { default: SoopyBoxElement } = require("./SoopyBoxElement");

class ProgressBar extends SoopyBoxElement{
    constructor(){
        super();
        
        let renderEvent = new SoopyRenderEvent()

        this.showPercentageVal = false

        this.progress = new SoopyNumber(0)

        renderEvent.setHandler(()=>{
            let progressNum = this.progress.get()

            Renderer.drawRect(Renderer.color(0,255,0), this.location.getXExact(), this.location.getYExact(), this.location.getWidthExact()*progressNum, this.location.getHeightExact())

            if(this.showPercentageVal){
                Renderer.drawString("§0" + (progressNum*100).toFixed(1) + "%", this.location.getXExact()+this.location.getWidthExact()/2-Renderer.getStringWidth((progressNum*100).toFixed(1) + "%")/2, this.location.getYExact()+this.location.getHeightExact()/2-8/2)
            }
        })

        this.innerObject.addEvent(renderEvent)
    }

    setProgress(num, anim=500){
        this.progress.set(num, anim)
        return this;
    }

    showPercentage(val){
        this.showPercentageVal = val
        return this;
    }
}

export default ProgressBar