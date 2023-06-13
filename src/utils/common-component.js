const navbar = (element, page) => {
    element.innerHTML += `
    <a href="index.html" class="${page[0]}"><i class="fa fa-home"></i></a>
      <a href="calendar.html" class="${page[1]}"><i class="fa fa-calendar"></i></a>
      <a href="setting.html" class="${page[2]}"><i class="fa fa-cog"></i></a>  
      <a class="logout-btn" style="position: fixed;bottom: 0;text-align: center;width: 3.2em; display: block;" data-bs-toggle="modal" data-bs-target="#logoutAlert"><i class="fa fa-sign-out"></i></a>
    `
}

const exitAlertModal = (element) => {
  element.innerHTML += `
    <div class="modal fade zoom-in" id="logoutAlert" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog  modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header" style="border: none;">
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