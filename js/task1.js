function progressView(){
    let diagramBox = document.querySelectorAll('.memsui--progress-bar');
    diagramBox.forEach((box) => {
        box.querySelector('#total-percent').textContent = box.dataset.percent + '%';
        var progress_bar = box.querySelector('.memsui--round-progress');
        var count_dasharray = progress_bar.getBoundingClientRect().width * 3.14;
        let deg = count_dasharray * (100 - box.dataset.percent) / 100;
        progress_bar.style.strokeDasharray = count_dasharray;
        progress_bar.style.strokeDashoffset = deg;
    });
}
progressView();