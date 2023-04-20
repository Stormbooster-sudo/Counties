var mainStyleCheckBox = document.getElementById('mainStyleCheck')
var widgetStyleCheckBox = document.getElementById('widgetStyleCheck')
const handleMainStyleCheck = () =>{
  // console.log(mainStyleCheckBox.checked)
  window.localStorage.setItem("light-mode", !mainStyleCheckBox.checked)
  window.location.reload()
}
const handleWidgetStyleCheck = () =>{
  window.localStorage.setItem("light-mode-widget", !widgetStyleCheckBox.checked)
}
window.onload = async function () {
    sidenav.innerHTML += navbar(['','','active'])
    var mainStyle = window.localStorage.getItem("light-mode")
    mainStyleCheckBox.checked = !(mainStyle == 'true')
    widgetStyleCheckBox.checked = !(window.localStorage.getItem("light-mode-widget") == 'true')
    console.log(mainStyle)
    if(mainStyle == 'true'){
      lightMode()
    }
  };