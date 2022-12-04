/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import SoopyRenderEvent from "../EventListener/SoopyRenderEvent"
import SoopyGuiElement from "./SoopyGuiElement"
import RenderLib from "../renderLibs"
import SoopyNumber from "../Classes/SoopyNumber"
import renderLibs from "../renderLibs";
if (!GlStateManager) {
    var GL11 = Java.type("org.lwjgl.opengl.GL11"); //using var so it goes to global scope
    var GlStateManager = Java.type("net.minecraft.client.renderer.GlStateManager");
}


let Framebuffer = Java.type("net.minecraft.client.shader.Framebuffer")
const DefaultVertexFormats = Java.type("net.minecraft.client.renderer.vertex.DefaultVertexFormats")
let Tessellator = Java.type("net.minecraft.client.renderer.Tessellator").func_178181_a()
let WorldRenderer = Tessellator.func_178180_c()
const OpenGlHelper = Java.type("net.minecraft.client.renderer.OpenGlHelper")
const EXTFramebufferObject = Java.type("org.lwjgl.opengl.EXTFramebufferObject")

/**
 * text.
 * @class
 */
class SoopyTextElement extends SoopyGuiElement {
    /**
     * Creates a {@link SoopyTextElement}
     * @constructor
     */
    constructor() {

        super()

        /**
         * The text to display.
         * @type {string}
         */
        this.text = ""

        this.textDarkThemeCache = ""

        this.lastWidth = 0
        this.lastHeight = 0

        this.centeredX = true
        this.centeredY = true
        this.maxScale = new SoopyNumber(1)

        let renderEvent = new SoopyRenderEvent()

        renderEvent.setHandler((mouseX, mouseY, partialTicks) => {

            if (!this.useList || this.listDirty) {

                let textLines = this.isDarkThemeEnabled() ? this.textDarkThemeCache.split("\n") : this.text.split("\n")
                let maxWidth = 0
                for (let line of textLines) {
                    let lineWidth = Renderer.getStringWidth(ChatLib.addColor(line))
                    if (lineWidth > maxWidth) maxWidth = lineWidth
                }

                let scale = Math.min(this.maxScale.get(), this.location.getWidthExact() / (maxWidth), this.location.getHeightExact() / (10 * textLines.length))

                let renderY = this.useList ? 0 : this.location.getYExact()

                if (this.centeredY) {
                    renderY += this.location.getHeightExact() / 2 - 5 * (textLines.length - 1) * scale
                    renderY -= 9 * scale / 2
                }

                for (let index in textLines) {
                    let line = textLines[index]
                    let renderX = this.useList ? 0 : this.location.getXExact()
                    if (this.centeredX) {
                        renderX += (this.location.getWidthExact() / 2) - ((Renderer.getStringWidth(ChatLib.addColor(line)))) * scale / 2
                    }
                    RenderLib.drawString(line, renderX, renderY + index * 10 * scale, scale)
                }
            }
        })

        this.addEvent(renderEvent)
    }

    /**
     * Set the text
     * @param {string} text - The text to display.
     * @returns {SoopyTextElement} this for method chaining
     */
    setText(text) {
        if (text !== this.text) {
            this.text = text
            this.textDarkThemeCache = RenderLib.darkThemifyText(text)

            this.dirtyDisplayList()
        }
        return this
    }

    /**
     * set the max text scale
     * @param {number} maxScale - The max scale to use.
     * @returns {SoopyTextElement} this for method chaining
     */
    setMaxTextScale(maxScale, animationTime) {
        this.maxScale.set(maxScale, animationTime)
        this.dirtyDisplayList(animationTime)
        return this
    }

}

export default SoopyTextElement

function drawTexturedRect(x, y, width, height, uMin, uMax, vMin, vMax, filter) {
    GlStateManager.func_179098_w(); // enableTexture2D

    GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MIN_FILTER, filter);
    GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MAG_FILTER, filter);

    WorldRenderer.func_181668_a(7, DefaultVertexFormats.field_181707_g); //begin,  POSITION_TEX
    WorldRenderer
        .func_181662_b(x, y + height, 0)
        .func_181673_a(uMin, vMax).func_181675_d();
    WorldRenderer
        .func_181662_b(x + width, y + height, 0)
        .func_181673_a(uMax, vMax).func_181675_d();
    WorldRenderer
        .func_181662_b(x + width, y, 0)
        .func_181673_a(uMax, vMin).func_181675_d();
    WorldRenderer
        .func_181662_b(x, y, 0)
        .func_181673_a(uMin, vMin).func_181675_d();

    Tessellator.func_78381_a(); //draw

    GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MIN_FILTER, GL11.GL_NEAREST);
    GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MAG_FILTER, GL11.GL_NEAREST);
}