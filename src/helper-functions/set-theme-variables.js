import { GetLocalData } from "./get-local-data";

export async function SetThemeVariables() {
    const theme = await GetLocalData("theme")
    const root = document.documentElement
    
    switch(theme) {
        case "purple": 
            root.style.setProperty('--light', '#757fa4')
            root.style.setProperty('--dark', '#242832')
            root.style.setProperty('--accent-light', '#8a95bd')
            root.style.setProperty('--accent-medium', '#7981a1')
            root.style.setProperty('--accent-dark', '#545b75')
            root.style.setProperty('--cream', '#fcfacc')
            break
        case "cottonCandy":
            root.style.setProperty('--light', '#bbd0ff')
            root.style.setProperty('--dark', '#b8c0ff')
            root.style.setProperty('--accent-light', '#ffd6ff')
            root.style.setProperty('--accent-medium', '#e7c6ff')
            root.style.setProperty('--accent-dark', '#c8b6ff')
            root.style.setProperty('--cream', '#fcfacc')
            break
        case "cobalt":
            root.style.setProperty('--light', '#e7ecef')
            root.style.setProperty('--dark', '#8b8c89')
            root.style.setProperty('--accent-light', '#a3cef1')
            root.style.setProperty('--accent-medium', '#6096ba')
            root.style.setProperty('--accent-dark', '#274c77')
            root.style.setProperty('--cream', '#fcfacc')
            break
        case "forest":
            root.style.setProperty('--light', '#c7bfa8')
            root.style.setProperty('--dark', '#654d39')
            root.style.setProperty('--accent-light', '#839f8c')
            root.style.setProperty('--accent-medium', '#607c68')
            root.style.setProperty('--accent-dark', '#475c4e')
            root.style.setProperty('--cream', '#fcfacc')
            break
        case "sepia":
            root.style.setProperty('--light', '#B9B28A')
            root.style.setProperty('--dark', '#504B38')
            root.style.setProperty('--accent-light', '#F8F3D9')
            root.style.setProperty('--accent-medium', '#EBE5C2')
            root.style.setProperty('--accent-dark', '#ded49b')
            root.style.setProperty('--cream', '#fcfacc')
            break
        default: 
            root.style.setProperty('--light', '#F0F0D7')
            root.style.setProperty('--dark', '#727D73')
            root.style.setProperty('--accent-light', '#bfcab3')
            root.style.setProperty('--accent-medium', '#AAB99A')
            root.style.setProperty('--accent-dark', '#9bad88')
            root.style.setProperty('--cream', '#fcfacc')
    }
}