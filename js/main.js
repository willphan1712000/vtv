import {body} from './structure.js'
import { initialFetch, fetchImages, colorTable, detail, modifyTemplateProcess } from './preview.js'
import { checkSubs, colorConcept, preventDefault } from './module.js'

const bodyObj = body()
bodyObj.createBody()
bodyObj.createSubElement()
bodyObj.addCSS()

// TV Customization Preview
initialFetch()
fetchImages()
colorTable()
detail()
modifyTemplateProcess()
// End

checkSubs()
colorConcept()
preventDefault()