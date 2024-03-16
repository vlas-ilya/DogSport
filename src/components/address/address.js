function showMap(id) {
    if (!id) return;
    var modal = document.getElementById(id);
    if (!modal) return;
    var link = modal.dataset.link;
    var iframe = modal.getElementsByTagName("iframe");
    if (iframe[0].src !== link) {
        iframe[0].src = link;
    }
}

var mapLinks = document.getElementsByClassName("openMap");
for (var i = 0; i < mapLinks.length; i++) {
    mapLinks[i].onclick = function (e) {
        var id = e.target.href.split("#")[1];
        showMap(id);
    }
}

var id = window.location.href.split("#")[1]
showMap(id);
