const configParser = require("configparser");
const regedit = require("regedit").promisified;
const { ipcRenderer }  = require("electron");

const background_dark = "#242424";
const background_light = "#ebebeb";
const placeholder_dark = "#323232";
const placeholder_light = "#bebebe";
const text_dark = "white";
const text_light = "black";

const misc_switch = document.getElementById("switch-misc");
switch (localStorage.getItem("exclusivefullscreen")) {
    case "true":
        misc_switch.checked = true;
        break;

    case "false":
        misc_switch.checked = false;
        break;
}


const root = document.documentElement;
const toggleswitch = document.getElementById("toggle-switch");
const icon = document.getElementById("icon");


changeTheme(localStorage.getItem("theme"));

function changeTheme(theme) {
    switch(theme) {
        case "dark":
            toggleswitch.checked = true;
            icon.textContent = "dark_mode";
            root.style.setProperty("--background-color", background_dark);
            root.style.setProperty("--placeholder-color", placeholder_dark);
            root.style.setProperty("--text-color", text_dark);
            break;
            
            case "light":
            icon.textContent = "wb_sunny";
            root.style.setProperty("--background-color", background_light);
            root.style.setProperty("--placeholder-color", placeholder_light);
            root.style.setProperty("--text-color", text_light);
            break;
    }
}

function toggleTheme() {
    if (toggleswitch.checked) {
        changeTheme("dark");
        localStorage.setItem("theme", "dark");
    } else {
        changeTheme("light");
        localStorage.setItem("theme", "light");
    }

}

const resx = document.getElementById("resx");
const resy = document.getElementById("resy");
const fpslock = document.getElementById("fpslock");

const usersettings = process.env.LOCALAPPDATA + "\\FortniteGame\\Saved\\Config\\WindowsClient\\GameUserSettings.ini";
const config = new configParser();
config.read(usersettings);

//Set placeholder config values
resx.placeholder = config.get("/Script/FortniteGame.FortGameUserSettings", "resolutionsizex");
resy.placeholder = config.get("/Script/FortniteGame.FortGameUserSettings", "resolutionsizey");
fpslock.placeholder = Math.round(config.get("/Script/FortniteGame.FortGameUserSettings", "frameratelimit") * 100)/100;

document.getElementById(config.get("/Script/FortniteGame.FortGameUserSettings", "lastconfirmedfullscreenmode")).checked = true;

function apply() {
    if (resx.value !== "") {
        config.set("/Script/FortniteGame.FortGameUserSettings", "resolutionsizex", resx.value);
        config.set("/Script/FortniteGame.FortGameUserSettings", "lastuserconfirmedresolutionsizex", resx.value);
        config.write(usersettings);
    } else {
        config.set("/Script/FortniteGame.FortGameUserSettings", "resolutionsizex", resx.placeholder);
        config.set("/Script/FortniteGame.FortGameUserSettings", "lastuserconfirmedresolutionsizex", resx.placeholder);
        config.write(usersettings);
    }

    if (resy.value !== "") {
        config.set("/Script/FortniteGame.FortGameUserSettings", "resolutionsizey", resy.value);
        config.set("/Script/FortniteGame.FortGameUserSettings", "lastuserconfirmedresolutionsizey", resy.value);
        config.write(usersettings);
    } else {
        config.set("/Script/FortniteGame.FortGameUserSettings", "resolutionsizey", resy.placeholder);
        config.set("/Script/FortniteGame.FortGameUserSettings", "lastuserconfirmedresolutionsizey", resy.placeholder);
        config.write(usersettings);
    }

    if (fpslock.value !== "") {
        config.set("/Script/FortniteGame.FortGameUserSettings", "frameratelimit", parseFloat(fpslock.value).toFixed(6));
        config.write(usersettings);
    } else {
        config.set("/Script/FortniteGame.FortGameUserSettings", "frameratelimit", parseFloat(fpslock.placeholder).toFixed(6));
        config.write(usersettings);
    }

    const radioInputs = document.querySelectorAll('.frame-winmodes input[type="radio"]');

    radioInputs.forEach(input => {
        if (input.checked) {
            config.set("/Script/FortniteGame.FortGameUserSettings", "lastconfirmedfullscreenmode", input.id);
            config.write(usersettings);
        }
    });

    const misctoggle = document.getElementById("switch-misc");

    if (misctoggle.checked == true) {
        localStorage.setItem("exclusivefullscreen", "true");

        regedit.putValue({
            "HKCU\\System\\GameConfigStore": {
                "GameDVR_DXGIHonorFSEWindowsCompatible": {
                    value: 1,
                    type: "REG_DWORD"
                }
            }
        });

        regedit.putValue({
            "HKCU\\System\\GameConfigStore": {
                "GameDVR_EFSEFeatureFlags": {
                    value: 0,
                    type: "REG_DWORD"
                }
            }
        });

        regedit.putValue({
            "HKCU\\System\\GameConfigStore": {
                "GameDVR_Enabled": {
                    value: 0,
                    type: "REG_DWORD"
                }
            }
        });

        regedit.putValue({
            "HKCU\\System\\GameConfigStore": {
                "GameDVR_FSEBehaviorMode": {
                    value: 2,
                    type: "REG_DWORD"
                }
            }
        });

        regedit.putValue({
            "HKCU\\System\\GameConfigStore": {
                "GameDVR_HonorUserFSEBehaviorMode": {
                    value: 1,
                    type: "REG_DWORD"
                }
            }
        });
    } else {
        localStorage.setItem("exclusivefullscreen", "false");

        regedit.putValue({
            "HKCU\\System\\GameConfigStore": {
                "GameDVR_DXGIHonorFSEWindowsCompatible": {
                    value: 0,
                    type: "REG_DWORD"
                }
            }
        });

        regedit.putValue({
            "HKCU\\System\\GameConfigStore": {
                "GameDVR_EFSEFeatureFlags": {
                    value: 0,
                    type: "REG_DWORD"
                }
            }
        });

        regedit.putValue({
            "HKCU\\System\\GameConfigStore": {
                "GameDVR_Enabled": {
                    value: 0,
                    type: "REG_DWORD"
                }
            }
        });

        regedit.putValue({
            "HKCU\\System\\GameConfigStore": {
                "GameDVR_FSEBehaviorMode": {
                    value: 1,
                    type: "REG_DWORD"
                }
            }
        });

        regedit.putValue({
            "HKCU\\System\\GameConfigStore": {
                "GameDVR_HonorUserFSEBehaviorMode": {
                    value: 1,
                    type: "REG_DWORD"
                }
            }
        });
    }

    ipcRenderer.send("notification", "Config saved");
}