/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Enums from "../Enum"
import SoopyEventListener from "../EventListener/SoopyEventListener"
import renderLibs from "../renderLibs"

/**
 * The render background event, this will run whenever the background of the gui / gui element is rendered
 * @class
 * @extends SoopyRenderEvent
 */
class SoopyRenderEvent extends SoopyEventListener{
    
    /**
     * Creates a {@link SoopyRenderEvent}
     * @constructor
     */
    constructor(){
        super(Enums.EVENT.RENDER)
    }

    
    /**
     * Triggers the event handler with the given arguments
     * 
     * @param {Array.<any>} args The list of arguments to pass to the event handler
     */
    _trigger(caller, args){
        let boundingBox = caller.getBoundingBox()
        
        if(boundingBox){
            if(!caller.main.isDebugEnabled)renderLibs.scizzorFast(boundingBox[0], boundingBox[1], boundingBox[2]-boundingBox[0], boundingBox[3]-boundingBox[1])
            super._trigger(caller, args)
            
            if(!caller.main.isDebugEnabled)renderLibs.stopScizzor()

            if(caller.main.isDebugEnabled && caller.hovered && caller.children.map(a=>a.hovered).indexOf(true) === -1){
                Renderer.drawRect(Renderer.color(255, 0, 0, 100),boundingBox[0], boundingBox[1], boundingBox[2]-boundingBox[0], boundingBox[3]-boundingBox[1])
            }
        }
    }
}

export default SoopyRenderEvent