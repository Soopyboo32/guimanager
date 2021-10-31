/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import SoopyEventListener from "../EventListener/SoopyEventListener"
import SoopyRenderEvent from "../EventListener/SoopyRenderEvent"
import SoopyPosition from "../Classes/SoopyPosition"
import SoopyGuiElement from "./SoopyGuiElement"

import RenderLib from "../renderLibs"
import SoopyNumber from "../Classes/SoopyNumber"

/**
 * A box.
 * @class
 */
class SoopyTextElement extends SoopyGuiElement{
    /**
     * Creates a {@link SoopyTextElement}
     * @constructor
     */
    constructor(){

        super()

        /**
         * The text to display.
         * @type {string}
         */
        this.text = ""

        this.centeredX = true
        this.centeredY = true
        this.maxScale = new SoopyNumber(1)

        let renderEvent = new SoopyRenderEvent()

        renderEvent.setHandler((mouseX, mouseY, partialTicks)=>{

            let scale = Math.min(this.maxScale.get(), this.location.getWidthExact()/((Renderer.getStringWidth(ChatLib.removeFormatting(this.text)))), this.location.getHeightExact()/10)

            let renderX = this.location.getXExact()
            let renderY = this.location.getYExact()

            if(this.centeredX){
                renderX += (this.location.getWidthExact()/2)
                renderX -= (Renderer.getStringWidth(ChatLib.removeFormatting(this.text))-1)*scale/2
            }
            if(this.centeredY){
                renderY += this.location.getHeightExact()/2
                renderY -= 9*scale/2
            }

            RenderLib.drawString(this.text, renderX, renderY, scale)
        })

        this.events.push(renderEvent)
    }

    /**
     * Set the text
     * @param {string} text - The text to display.
     * @returns {SoopyTextElement} this for method chaining
     */
    setText(text){
        this.text = text
        return this
    }

    /**
     * set the max text scale
     * @param {number} maxScale - The max scale to use.
     * @returns {SoopyTextElement} this for method chaining
     */
     setMaxTextScale(maxScale, animationTime){
        this.maxScale.set(maxScale, animationTime)
        return this
     }

}

export default SoopyTextElement