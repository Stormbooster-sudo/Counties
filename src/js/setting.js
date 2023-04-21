var mainStyleCheckBox = document.getElementById('mainStyleCheck')
var widgetStyleCheckBox = document.getElementById('widgetStyleCheck')
var widgetTransparentRange = document.getElementById('transparent-range')
var autoLaunchCheck = document.getElementById('autoLaunchCheck')
var rangeDisplay = document.getElementById('transparent-display')
const handleMainStyleCheck = () =>{
  // console.log(mainStyleCheckBox.checked)
  window.localStorage.setItem("light-mode", !mainStyleCheckBox.checked)
  window.location.reload()
}
const handleWidgetStyleCheck = () =>{
  window.localStorage.setItem("light-mode-widget", !widgetStyleCheckBox.checked)
}

const handleWidgetTransparent = () =>{
  var value = widgetTransparentRange.value
  rangeDisplay.innerText = `${value}%`
  window.localStorage.setItem("widget-transparent", value / 100)
}

const handleAutoLaunchCheck = async () =>{
  var value = autoLaunchCheck.checked
  window.localStorage.setItem('auto-launch', value)
  await window.electronAPI.setAutoLaunch(value)
  // console.log(value)
}

window.onload = async function () {
    sidenav.innerHTML += navbar(['','','active'])
    var mainStyle = window.localStorage.getItem("light-mode")
    mainStyleCheckBox.checked = !(mainStyle == 'true')
    widgetStyleCheckBox.checked = !(window.localStorage.getItem("light-mode-widget") == 'true')
    autoLaunchCheck.checked = (window.localStorage.getItem("auto-launch") == 'true')
    console.log(mainStyle)
    if(mainStyle == 'true'){
      lightMode()
    }

    var widgetTrans = window.localStorage.getItem('widget-transparent')
    if(widgetTrans == null){
      widgetTrans = 0.7
      window.localStorage.setItem('widget-transparent', widgetTrans)
    }
    console.log(widgetTrans)
    rangeDisplay.innerText = `${widgetTrans * 100}%`
    widgetTransparentRange.value = widgetTrans * 100
  };