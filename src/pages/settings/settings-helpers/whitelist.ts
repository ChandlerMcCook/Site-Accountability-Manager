import { getLocalData } from "../../../helper-functions/getLocalData";
import { WhitelistPreset } from "../../../interfaces/whitelistPreset";

export async function whitelistLogic() {
    
    
    let curPreset : string | null = null 
    const whitelistPresets = await getLocalData("whitelistPresets") as WhitelistPreset[]
    const whitelistDropdown = document.getElementById("whitelistDropdown") as HTMLSelectElement

    whitelistDropdown.addEventListener("change", () => {

    })

    document.getElementById("createPreset").addEventListener("click", () => {

    })
}