/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import SoopyRenderEvent from "../EventListener/SoopyRenderEvent"
import SoopyGuiElement from "./SoopyGuiElement"
import SoopyNumber from "./../Classes/SoopyNumber"

import RenderLib from "../renderLibs"
import renderLibs from "../renderLibs"

/**
 * A box.
 * @class
 */
class SoopyImageElement extends SoopyGuiElement{
    /**
     * Creates a {@link SoopyBoxElement}
     * @constructor
     */
    constructor(){

        super()

        this.image = undefined
        this.SloadHeightFromImage = false

        this.onImageHeightChangeFunc = undefined

        let renderEvent = new SoopyRenderEvent()

        renderEvent.setHandler((mouseX, mouseY, partialTicks)=>{
            if(this.image !== undefined && this.image !== null && this.image !== "LOADING"){
                this.image.draw(this.location.getXExact(), this.location.getYExact(), this.location.getWidthExact(), this.location.getHeightExact())
            }
        })

        this.events.push(renderEvent)
    }

    setImage(url){
        this.image = renderLibs.getImageNoDownload(url)
        if(this.image === undefined || this.image === "LOADING"){
            new Thread(()=>{
                this.image = renderLibs.getImage(url, true)

                if(this.SloadHeightFromImage){
                    this.location.size.y.set(this.location.size.x.get()*this.image.getTextureHeight()/this.image.getTextureWidth())
                    if(this.onImageHeightChangeFunc){
                        this.onImageHeightChangeFunc[0].call(this.onImageHeightChangeFunc[1])
                    }
                }

            }).start()
        }else{
            if(this.SloadHeightFromImage){
                this.location.size.y.set(this.location.size.x.get()*this.image.getTextureHeight()/this.image.getTextureWidth())
                if(this.onImageHeightChangeFunc){
                    this.onImageHeightChangeFunc[0].call(this.onImageHeightChangeFunc[1])
                }
            }
        }

        return this
    }

    loadHeightFromImage(){
        if(this.image){
            this.location.size.y.set(this.location.size.x.get()*this.image.getTextureHeight()/this.image.getTextureWidth())
            if(this.onImageHeightChangeFunc){
                this.onImageHeightChangeFunc[0].call(this.onImageHeightChangeFunc[1])
            }
        }else{
            this.SloadHeightFromImage = true
        }

        return this
    }

    onImageHeightChange(func, obj){
        this.onImageHeightChangeFunc = [func, obj]
        
        return this
    }
}

export default SoopyImageElement