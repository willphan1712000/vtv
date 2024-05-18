import {body} from './structure.js'
import { initialFetch, fetchImages, colorTable, detailCustom, modifyTemplateProcess, backgroundForUploadImg } from './preview.js'
import { checkSubs, colorConcept, preventDefault, owneraccount, time } from './module.js'

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
        detailCustom()
        modifyTemplateProcess()
        backgroundForUploadImg(".background-area").render().addCSS().preview(".background-preview")
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
    case 'aicloginPage':
        preventDefault()
        break
    case 'aicadmin':
        colorConcept()
        time()
        owneraccount()
        break
    default:
        console.log("This feature is intented for developers only. Any actions beyond this purpose will be considered hacking activities")
}