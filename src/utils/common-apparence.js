const navbar = (element, page) => {
    element.innerHTML += `
    <a href="index.html" class="${page[0]}"><i class="bi bi-house-door" style="font-size: 26px; margin-right: 1px;"></i></a>
      <a href="calendar.html" class="${page[1]}"><i class="bi bi-calendar3" style="font-size: 23px; margin-right: 3px;margin-left: 3px;"></i></a>
      <a href="setting.html" class="${page[2]}"><i class="bi bi-gear" style="font-size: 26px; margin-right: 1px;"></i></a>  
      <a class="logout-btn" style="position: fixed;bottom: 0;text-align: center;width: 3.2em;" data-bs-toggle="modal" data-bs-target="#logoutAlert"><i class="bi bi-box-arrow-left" style="font-size: 23px; margin-right: 6px;margin-left: 2px;padding-top: 4px"></i></a>
    `
}

const exitAlertModal = (element) => {
  element.innerHTML += `
    <div class="modal fade zoom-in" id="logoutAlert" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog  modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Quit?</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Are you sure you want to quit?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
          <button id="logout-btn" type="button" class="btn btn-primary" onclick="window.electronAPI.closeWindow()">Sure</button>
        </div>
      </div>
    </div>
  </div>
    `
}

const lightMode = () => {
    document.getElementsByTagName('body')[0].classList.add("light-mode")
    document.getElementById('sidenavbar').classList.add("light-mode")
    var modalHeader = document.getElementsByClassName("modal-header")
    var modalBody = document.getElementsByClassName("modal-body")
    var modalFooter = document.getElementsByClassName("modal-footer")
    for (var i = 0; i < modalHeader.length; i++) {
        modalHeader[i].classList.add('light-mode')
        modalBody[i].classList.add('light-mode')
        modalFooter[i].classList.add('light-mode')
    }
}