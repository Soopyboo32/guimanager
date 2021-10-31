import TextBox from "./TextBox";

class PasswordInput extends TextBox {
    constructor(){
        super()

        this.char = "*"

        this.text.getRenderText = ()=>{
            return this.char.repeat(this.text.text.length)
        }
    }
}

export default PasswordInput