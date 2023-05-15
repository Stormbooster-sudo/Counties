var mainStyleCheckBox = document.getElementById('mainStyleCheck')
var widgetStyleCheckBox = document.getElementById('widgetStyleCheck')
var widgetAlwayTopCheckBox = document.getElementById('widgetAlwayTopCheck')
var widgetTransparentRange = document.getElementById('transparent-range')
var autoLaunchCheck = document.getElementById('autoLaunchCheck')
var rangeDisplay = document.getElementById('transparent-display')
const handleMainStyleCheck = async () => {
  window.localStorage.setItem("light-mode", !mainStyleCheckBox.checked)
  await window.electronAPI.setTheme(mainStyleCheckBox.checked)
  window.location.reload()
}
const handleWidgetStyleCheck = () => {
  window.localStorage.setItem("light-mode-widget", !widgetStyleCheckBox.checked)
}

const handleWidgetTransparent = () => {
  var value = widgetTransparentRange.value
  rangeDisplay.innerText = `${value}%`
  window.localStorage.setItem("widget-transparent", value / 100)
}

const handleWidgetAlwayTopCheck = async () => {
  var value = widgetAlwayTopCheckBox.checked
  window.localStorage.setItem("widget-alway-top", value)
  await window.electronAPI.setAlwayTop(value)
}

const handleAutoLaunchCheck = async () => {
  var value = autoLaunchCheck.checked
  window.localStorage.setItem('auto-launch', value)
  await window.electronAPI.setAutoLaunch(value)
}

window.onload = async function () {
  //load common apparence and pre-load custion time picker
  navbar(document.getElementById("sidenavbar"), ['', '', 'active'])
  exitAlertModal(document.getElementById('exit-modal'))
  var mainStyle = window.localStorage.getItem("light-mode")
  mainStyleCheckBox.checked = !(mainStyle == 'true')
  widgetStyleCheckBox.checked = !(window.localStorage.getItem("light-mode-widget") == 'true')
  autoLaunchCheck.checked = (window.localStorage.getItem("auto-launch") == 'true')
  widgetAlwayTopCheckBox.checked = (window.localStorage.getItem("widget-alway-top") == 'true')
  var widgetTrans = window.localStorage.getItem('widget-transparent')
  if (widgetTrans == null) {
    widgetTrans = 0.7
    window.localStorage.setItem('widget-transparent', widgetTrans)
  }
  rangeDisplay.innerText = `${widgetTrans * 100}%`
  widgetTransparentRange.value = widgetTrans * 100
};