'use strict'
import Fields from './Fields'

const components = [
    'Text',
    'Number',
    'ButtonRadio',
    'Checkbox',
    'Fill',
    'Font',
    'Group',
    'IconRadio',
    'Image',
    'ImageSelect',
    'Line',
    'Margin',
    'Radio',
    'Select',
    'Size',
    'Switch',
    'Suite'
]

components.forEach(comName => {
    const Com = require(`./Fields/Field${comName}`)
    Fields[comName] = Com.default
})

export default Fields
