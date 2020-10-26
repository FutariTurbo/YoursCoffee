import Vue from 'vue'
import { Notify } from 'vant'

Vue.use(Notify)

class ValidForm {
    valid(o){
        for(let key in o){
            if(!o[key].reg.test(o[key].value)){
                Notify({
                    background: '#fef0f0',
                    color: '#f56c6c',
                    message: o[key].errorMsg
                })
                // 验证失败
                return false;
            }
        }
        // 验证成功
        return true;
    }
}

export const validForm = new ValidForm();