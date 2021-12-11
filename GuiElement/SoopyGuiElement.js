/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Enum from "../Enum"
import SoopyEventListener from "../EventListener/SoopyEventListener"
import SoopyPosition from "../Classes/SoopyPosition"
import SoopyLocation from "../Classes/SoopyLocation"
import SoopyRenderEvent from "../EventListener/SoopyRenderEvent"
import renderLibs from "../renderLibs"
import SoopyMouseScrollEvent from "../EventListener/SoopyMouseScrollEvent"

/**
 * The event listener class, you can create an event and set a handler for it
 * @class
 * @abstract
 */
class SoopyGuiElement{

    /**
     * Creates a {@link SoopyGuiElement}
     * @constructor
     */
    constructor(){
        /**
         * The list of all the events linked to this gui element
         * @type {Array.<SoopyEventListener>}
         */
        this.events = []
    
        /**
         * The parent element
         * @type {SoopyGuiElement}
         */
        this.parent = undefined
    
        /**
         * The children of this element
         * @type {Array.<SoopyGuiElement>} an array of the children
         */
        this.children = []
    
        /**
         * The location of the gui element
         * @type {SoopyLocation}
         */
        this.location = new SoopyLocation(new SoopyPosition(0,0),new SoopyPosition(1,1),undefined).enableCache()

        /**
         * Wether the gui element is hovered
         * @type {boolean}
         */
        this.hovered = false

        /**
         * Wether is is possible to scroll the gui element
         */
        this.scrollable = false

        /**
         * Lore to render when hovered
         * @type {Array<String> | undefined} //undefined to not show
         */
        this.lore = undefined

        /**
         * Wether to render this element
         * disabling will disable all events.
         */
        this.visable = true

        this.main = undefined

        this.innerObjectPaddingThing = undefined


        this.events.push(new SoopyEventListener(Enum.EVENT.RESET_FRAME_CACHES).setHandler(()=>{
            this.boundingBoxCached = undefined
            this.location.clearCache()
        }))

        this._scrollAmount = 0

        this.events.push(new SoopyMouseScrollEvent().setHandler((mouseX, mouseY, scroll)=>{
            if(this.scrollable && this.hovered){
                this._scrollAmount+= scroll*30
                let maxScroll = 0
                for(let child of this.children){
                    if(maxScroll < (child.location.getYExact()+child.location.getHeightExact()-this.location.scroll.getYAsExact(undefined, false)) - this.location.getYExact()){
                        maxScroll = (child.location.getYExact()+child.location.getHeightExact()-this.location.scroll.getYAsExact(undefined, false)) - this.location.getYExact()
                    }
                }
                maxScroll -= this.location.getHeightExact()-2
                this._scrollAmount = Math.min(Math.max(-maxScroll, this._scrollAmount), 0)
                this.location.scroll.y.set(this._scrollAmount, 100)
            }
        }))

        let renderEvent = new SoopyRenderEvent()

        renderEvent.setHandler((mouseX, mouseY)=>{
            if((!this.parent || this.parent.hovered) && mouseX > this.location.getXExact() && mouseX < this.location.getXExact()+this.location.getWidthExact()
                && mouseY > this.location.getYExact() && mouseY < this.location.getYExact()+this.location.getHeightExact()){
                this.main._hoveredElement = this

                if(this.lore){
                    //Render Lore
    
                    this.main._loreData = [mouseX, mouseY, this.lore]
                }
            }
        })

        this.events.push(renderEvent)
    }

    setMain(main){
        this.main = main
        for(let child of this.children){
            child.setMain(this.main)
        }
        return this;
    }
    
    /**
     * Triggers an event
     * @param {Enum.EVENT} eventType The type of the event
     * @param {Array.<Any>} data The data for the event
     */
    triggerEvent(eventType, data=[]){
        if(!this.visable && eventType === Enum.EVENT.RENDER) return;
        let shouldTrigger = undefined
        for(let event of this.events){
            if(event.eventType === eventType){
                if(shouldTrigger===undefined) shouldTrigger = event._shouldTrigger(this, data)
                if(shouldTrigger) event._trigger(this, data)
            }
        }

        if(shouldTrigger===undefined) shouldTrigger = true
        if(shouldTrigger){
            for(let child of this.children){
                child.triggerEvent(eventType, data)
            }
        }
    }

    /**
     * Gets the visable bounding box of the SoopyGuiElement
     * @returns {Array<Number>} array of x, y, x2, y2 if visable
     * @returns {Boolean} false if not visable
     */
    getBoundingBox(){
        if(this.boundingBoxCached){
            if(this.boundingBoxCached === "false") return false
            return this.boundingBoxCached
        }
        let outsideRect = {x1:0, y1:0, x2:Renderer.screen.getWidth(), y2:Renderer.screen.getHeight()}
        if(this.parent){
            outsideRect = this.parent.getBoundingBox()
            if(outsideRect){
                outsideRect = {x1:outsideRect[0], y1:outsideRect[1], x2:outsideRect[2], y2:outsideRect[3]}
            }else{
                this.boundingBoxCached = "false"
                return false
            }
        }

        let thisRect = {x1: this.location.getXExact(), y2:this.location.getYExact(), x2:this.location.getXExact()+this.location.getWidthExact(), y1:this.location.getYExact()+this.location.getHeightExact()}

        let res = renderLibs.getIntersectingRectangle(outsideRect, thisRect)

        if(res){
            this.boundingBoxCached = [res.x1, res.y1, res.x2, res.y2]
            return [res.x1, res.y1, res.x2, res.y2]
        }else{
            this.boundingBoxCached = "false"
            return false
        }
    }

    /**
     * Used to add a child element to this
     * @param {SoopyGuiElement} child The child to add
     * @returns {SoopyGuiElement} This for method chaining
     */
     addChild(child){
        
        if(child.parent){
            child.parent.removeChild(child)
        }

        let theParent = this.innerObjectPaddingThing || this
        child.setParent(theParent).setMain(this.main)
        theParent.children.push(child)
        return this
    }

    /**
     * Sets the lore of the element
     * @param {Array<String>} lore The lore to render
     * @returns {SoopyGuiElement} This for method chaining
     */
    setLore(lore){
        if(typeof lore !== "object") return this
        this.lore = Object.values(lore)
        return this
    }

    /**
     * Used to add a child element to this
     * @param {SoopyGuiElement} child The child to add
     * @returns {SoopyGuiElement} This for method chaining
     */
    removeChild(child){
        let theParent = this.innerObjectPaddingThing || this
        child.setParent(undefined)
        theParent.children = theParent.children.filter(c=>c.parent)
        return this
    }
    /**
     * Clears all the children of this element
     */
    clearChildren(){
        let theParent = this.innerObjectPaddingThing || this
        theParent.children.forEach(child => {
            child.setParent(undefined)
        });
        theParent.children = []
        return this
    }
    /**
     * Used to add an event
     * @param {SoopyEventListener} event The event to add
     * @returns {SoopyGuiElement} This for method chaining
     */
    addEvent(event){
        this.events.push(event)
        return this
    }

    /**
     * Set the parent element
     * @param {SoopyGuiElement} parent the parent
     */
    setParent(parent){
        this.parent = parent
        if(parent)this.location.referanceFrame = parent.location
        return this;
    }

    /**
     * Set wether is it possible to scroll
     * @param {Boolean} possible
     */
    setScrollable(possible){
        this.scrollable = possible
        return this;
    }

    /**
     * Shortcut to set the location
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {SoopyGuiElement} This for method chaining
     */
    setLocation(x, y, width, height){
        this.location.location.x.set(x)
        this.location.location.y.set(y)
        this.location.size.x.set(width)
        this.location.size.y.set(height)
        return this
    }

    setInnerObject(o){
        this.innerObjectPaddingThing = o
    }
}

export default SoopyGuiElement