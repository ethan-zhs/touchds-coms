const comLibSync: any = {
    fill: () => import('./FieldFill'),
    group: () => import('./FieldGroup'),
    suite: () => import('./FieldSuite'),
    margin: () => import('./FieldMargin'),
    font: () => import('./FieldFont'),
    line: () => import('./FieldLine'),
    text: () => import('./FieldText'),
    number: () => import('./FieldNumber'),
    checkbox: () => import('./FieldCheckbox'),
    radio: () => import('./FieldRadio'),
    buttonRadio: () => import('./FieldButtonRadio'),
    iconRadio: () => import('./FieldIconRadio'),
    switch: () => import('./FieldSwitch'),
    select: () => import('./FieldSelect'),
    imageSelect: () => import('./FieldImageSelect'),
    size: () => import('./FieldSize'),
    image: () => import('./FieldImage')
}

const comLib: any = {}

async function getFieldsWithType(type: string) {
    if (!comLib[type]) {
        const com = (await (comLibSync[type] && comLibSync[type]())) || void 0
        // 确保异步回调后comLib[type]不重复定义
        !comLib[type] &&
            Object.defineProperty(comLib, type, {
                enumerable: true,
                get: function get() {
                    return com.default
                }
            })
        return com.default
    }
    return comLib[type]
}

export default getFieldsWithType
