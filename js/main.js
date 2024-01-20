import {body} from './structure.js'
import { initialFetch, fetchImages, colorTable, detail, modifyTemplateProcess } from './preview.js'
import { checkSubs, colorConcept, preventDefault } from './module.js'

switch(type) {
    case 'logoutPage':
        checkSubs()
        preventDefault()
        break
    case 'admin':
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
        break
    case 'loginPage':
        checkSubs()
        colorConcept()
        preventDefault()
        break
    case 'theme':
        checkSubs()
        colorConcept()
        preventDefault()
        break
    default:
        console.log("This feature is intented for developers only. Any actions beyond this purpose will be considered hacking activities")
}