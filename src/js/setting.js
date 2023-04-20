var mainStyleCheckBox = document.getElementById('mainStyleCheck')
const handleMainStyleCheck = () =>{
  console.log(mainStyleCheckBox.checked)
  window.localStorage.setItem("light-mode", !mainStyleCheckBox.checked)
  window.location.reload()
}

window.onload = async function () {
    sidenav.innerHTML += navbar(['','','active'])
    var mainStyle = window.localStorage.getItem("light-mode")
    mainStyleCheckBox.checked = !(mainStyle == 'true')
    console.log(mainStyle)
    if(mainStyle == 'true'){
      lightMode()
    }
  };