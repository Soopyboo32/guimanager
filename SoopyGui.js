/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
import SoopyGuiElement from './GuiElement/SoopyGuiElement';
import Enums from "./Enum"
import SoopyPosition from './Classes/SoopyPosition';
import SoopyLocation from './Classes/SoopyLocation';
import TextBox from './GuiElement/TextBox';
import SoopyContentChangeEvent from './EventListener/SoopyContentChangeEvent';
import SoopyKeyPressEvent from './EventListener/SoopyKeyPressEvent';
import Notification from './Notification';
import SoopyGlobalMouseClickEvent from './EventListener/SoopyGlobalMouseClickEvent';

/**
 * The main class of the guimanager, this one stores all the data about the gui
 * @class SoopyGui represents a gui
 */
class SoopyGui{
    /** 
     * Creates a {@link SoopyGui} for use in GUI creation
     * @constructor
     */
    constructor(){

        /**
         * The ChatTriggers gui
         * @type {Gui}
         */
         this.ctGui = new Gui()
         /**
          * The {@link SoopyGuiElement} that represents the gui
          * @type {SoopyGuiElement}
          */
         this.element = new SoopyGuiElement().setMain(this)
         /**
          * The name of the command to open the gui
          * 
          * This will end up with running "/{command}" ingame to open the gui
          * @type {String}
          */
         this.openCommand = undefined
         /**
          * Wether the gui is currently open
          * @type {Boolean}
          */
         this.isOpen = false
         /**
          * The last opened time of the gui
          * 
          * This is in the type of EPOCH milliseconds
          * @type {Number}
          */
         this.lastOpenedTime = 0
     
         /**
          * Litterally just the screen location
          * 
          * @type {SoopyLocation}
          */
         this.location = new SoopyLocation(new SoopyPosition(0,0),new SoopyPosition(1,1))

         /**
          * A list of all the ct triggers so they can get disabled on gui delete
          **/
         this.eventsList = []
    

        this.eventsList.push(this.ctGui.registerDraw((mouseX, mouseY, partialTicks) =>{
            this._render(mouseX, mouseY, partialTicks)
        }))

        this.eventsList.push(this.ctGui.registerClicked((mouseX, mouseY, button)=>{
            this._onClick(mouseX, mouseY, button)
        }))
        this.eventsList.push(this.ctGui.registerScrolled((mouseX, mouseY, scroll)=>{
            this._onScroll(mouseX, mouseY, scroll)
        }))
        this.eventsList.push(this.ctGui.registerKeyTyped((key, keyId)=>{
            this._onKeyPress.call(this, key, keyId)
        }))

        /**
         * When True this will only update the location of elements every tick instead of every frame
         * May make motion janky
         */
        this.optimisedLocations = false

        /**
         * When True this will only update the location of elements second instead of tick/frame
         * Will basicly delete animations
         * only use if your gui has no motion
         */
        this.slowLocations = false

        /**
         * Enables some things to help with debugging a gui
         */
        this.isDebugEnabled = false

        /**
         * Wether the gui is active, used to disable triggers with .destroy()
         **/
        this.enabled = true

        this.eventsList.push(register("tick",()=>{
            if(this.optimisedLocations && !this.slowLocations) this.element.triggerEvent(Enums.EVENT.RESET_FRAME_CACHES)
        }))

        this.eventsList.push(register("step",()=>{
            if(this.slowLocations) this.element.triggerEvent(Enums.EVENT.RESET_FRAME_CACHES)
        }).setFps(1))
    }

    /**
     * Set a command that will open the gui when ran
     * @param {String} commandName The name of the command to run to open the gui, "/{commandName}"
     * @return {SoopyGui} Returns the gui for method chaining
     */
    setOpenCommand(commandName){
        this.eventsList.push(register("command",()=>{
            if(this.enabled) this.open()
        }).setName(commandName))

        return this
    }

    /**
     * Opens the gui
     * @return {SoopyGui} Returns the gui for method chaining
     */
    open(){
        this.ctGui.open()
        this.isOpen = true
        this.lastOpenedTime = Date.now()

        this.element.triggerEvent(Enums.EVENT.OPEN_GUI)

        return this
    }

    /**
     * Closes the gui
     * @return {SoopyGui} Returns the gui for method chaining
     */
    close(){
        if(this.isOpen){
            Client.currentGui.close()
            this.isOpen = false
        }

        return this
    }

    /**
     * Deletes the gui, this will unregister all triggers
     * Will not actually delete the contents
     * but if you remove all references to it, it should get garbage collected
     */
    delete(){
        this.enabled = false

        this.close()

        this.eventsList.forEach(event=>{
            event.unregister()
        })

        return this
    }

    /**
     * Renders the gui
     * 
     * For internal use only
     * @param {Number} mouseX The x location of the mouse
     * @param {Number} mouseY The y location of the mouse
     * @param {Number} partialTicks The partialTicks
     */
    _render(mouseX, mouseY, partialTicks){
        this._renderBackground(mouseX, mouseY, partialTicks)

        if(!this.optimisedLocations && !this.slowLocations) this.element.triggerEvent(Enums.EVENT.RESET_FRAME_CACHES)

        this.element.triggerEvent(Enums.EVENT.RENDER, [mouseX, mouseY, partialTicks])

        Notification.doRender()
    }

    /**
     * mouse clicked handler
     * 
     * For internal use only
     * @param {Number} mouseX The x location of the mouse
     * @param {Number} mouseY The y location of the mouse
     * @param {Number} button The button that was clicked
     */
    _onClick(mouseX, mouseY, button){
        this.element.triggerEvent(Enums.EVENT.MOUSE_CLICK_GLOBAL, [mouseX, mouseY, button])
        this.element.triggerEvent(Enums.EVENT.MOUSE_CLICK, [mouseX, mouseY, button])
    }

    /**
     * mouse scrolled handler
     * 
     * For internal use only
     * @param {Number} mouseX The x location of the mouse
     * @param {Number} mouseY The y location of the mouse
     * @param {Number} scroll The scroll
     */
     _onScroll(mouseX, mouseY,scroll){
        this.element.triggerEvent(Enums.EVENT.MOUSE_SCROLL, [mouseX, mouseY, scroll])
    }

    /**
     * key press handler
     * 
     * For internal use only
     */
     _onKeyPress(key, keyId){
        this.element.triggerEvent(Enums.EVENT.KEY_PRESS, [key, keyId])

        if(keyId === 57 && this.ctGui.isControlDown()){
            //Open command console

            openCommandConsole(this)
        }
    }

    /**
     * Renders the background of the gui
     * 
     * For internal use only
     * @param {Number} mouseX The x location of the mouse
     * @param {Number} mouseY The y location of the mouse
     * @param {Number} partialTicks The partialTicks
     */
    _renderBackground(mouseX, mouseY, partialTicks){
        Renderer.drawRect(Renderer.color(0,0,0,100),0,0,Renderer.screen.getWidth(),Renderer.screen.getHeight())
    }
}

export default SoopyGui


/**
 * @param {SoopyGui} gui 
 */
function openCommandConsole(gui){
    gui._onClick(-1, -1, -1)

    let commandTextBox = new TextBox().setLocation(0.3, 1, 0.4, 0.05)
    commandTextBox.text.placeholder = "Enter command..."
    commandTextBox.location.location.y.set(0.9, 500)
    commandTextBox.text.selected = true
    gui.element.addChild(commandTextBox)

    commandTextBox.text.addEvent(new SoopyContentChangeEvent().setHandler((newVal, oldVal, resetFun)=>{
        newVal = newVal.split("§7")[0]
        let commands = Object.keys(commandConsoleCommands).filter(a=>a.toLowerCase().startsWith(newVal))
        let selectedCommand = commands[0] || ""
        let restOfText = selectedCommand.substr(newVal.length)
        commandTextBox.text.text = newVal + "§7" + restOfText
    }))
    commandTextBox.text.addEvent(new SoopyGlobalMouseClickEvent().setHandler(()=>{
        if(!commandTextBox.text.selected){
            commandTextBox.location.location.y.set(1, 500)
            setTimeout(()=>{
                gui.element.removeChild(commandTextBox)
            }, 500)
        }
    }))
    commandTextBox.text.addEvent(new SoopyKeyPressEvent().setHandler((key, keyId)=>{
        if(commandTextBox.text.selected){
            let text = commandTextBox.text.text.split("§7")[0]
            if(commandTextBox.text.cursorTextLocationId > text.length) commandTextBox.text.cursorTextLocationId = text.length
            console.log(keyId)
            if(keyId===15){//tab
                commandTextBox.setText(commandTextBox.text.text.split("§7").join(""))
            }
            if(keyId === 28){ //pressed enter, run command
                let command = text
                commandTextBox.setText("")

                let args = command.split(" ")
                let commandName = args.shift()

                if(commandConsoleCommands[commandName.toLowerCase()]){
                    commandConsoleCommands[commandName.toLowerCase()](gui, args)
                }else{
                    commandConsoleCommands["default"](gui, commandName, args)
                }
            }
        }
    }))
}

let commandConsoleCommands = {
    "enabledebug": (gui)=>{
        gui.isDebugEnabled = true
        new Notification("Enabled debug mode!", [""])
    },
    "disabledebug": (gui)=>{
        gui.isDebugEnabled = false
        new Notification("Disabled debug mode!", [""])
    },
    "disableoptimisation": (gui)=>{
        gui.optimisedLocations = false
        gui.slowLocations = false
        new Notification("Disabled optimisations", [""])
    },
    "enableoptimisation": (gui)=>{
        gui.optimisedLocations = true
        new Notification("Enabled optimisations", ["(Low setting)"])
    },
    "enableoptimisationhigh": (gui)=>{
        gui.slowLocations = true
        new Notification("Enabled optimisations", ["(High setting)"])
    },
    "default": (gui)=>{
        //unknown command
        new Notification("Unknown command", ["Use 'help' for a list of commands!"])
    }
}