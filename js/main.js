import {body} from './structure.js'
import { initialFetch, fetchImages, templeteModifier } from './preview.js'
import { checkSubs, colorConcept, preventDefault, owneraccount, time, switchScreen } from './module.js'

switch(type) {
    case 'logoutPage':
        checkSubs(true)
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
        templeteModifier(".template__modify").detailCustom().addCSS().modifyTemplateProcess()
        templeteModifier(".background-area").colorTable().gradientTable().addCSS().backgroundPreviewProcess(".background-preview")
        // End
        
        checkSubs(true)
        colorConcept()
        preventDefault()
        break
    case 'loginPage':
        checkSubs(true)
        colorConcept()
        preventDefault()
        switchScreen()
        break
    case 'theme':
        checkSubs(true)
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
        templeteModifier(".color-table").colorTable().addCSS()
        break
    case 'subscription':
        colorConcept()
        checkSubs(false)
        break
    default:
        console.log("This feature is intented for developers only. Any actions beyond this purpose will be considered hacking activities")
}