var track = {
    // (A) INIT
    rider : 999,   // rider id - fixed to 999 for demo
    delay : 10000, // delay between gps update (ms)
    timer : null,  // interval timer
    hDate : null,  // html date
    hLat : null,   // html latitude
    hLng : null,   // html longitude
    init : () => {
      // (A1) GET HTML
      track.hDate = document.getElementById("date");
      track.hLat = document.getElementById("lat");
      track.hLng = document.getElementById("lng");
  
      // (A2) START TRACKING
      track.update();
      track.timer = setInterval(track.update, track.delay);
    },
  
    // (B) SEND CURRENT LOCATION TO SERVER
    update : () => navigator.geolocation.getCurrentPosition(
      pos => {
        // (B1) LOCATION DATA
        var data = new FormData();
        data.append("req", "update");
        data.append("id", track.rider);
        data.append("lat", pos.coords.latitude);
        data.append("lng", pos.coords.longitude);
  
        // (B2) AJAX SEND TO SERVER
        fetch("3-ajax-track.php", { method:"POST", body:data })
        .then(res => res.text())
        .then(txt => { if (txt=="OK") {
          let now = new Date();
          track.hDate.innerHTML = now.toString();
          track.hLat.innerHTML = pos.coords.latitude;
          track.hLng.innerHTML = pos.coords.longitude;
        } else { track.error(txt); }})
        .catch(err => track.error(err));
      },
      err => track.error(err)
    ),
  
    // (C) HELPER - ERROR HANDLER
    error : err => {
      console.error(err);
      alert("An error has occured, open the developer's console.");
      clearInterval(track.timer);
    }
  };
  window.onload = track.init;