<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.socket.io/socket.io-1.4.3.js"></script>
    <script src="./client.js"></script>
    <script src="./api/config"></script>  <!-- Loaded via REST API -->
    <title>Socket.io websocket example for OpenShift</title>
  </head>
  <body>
  <div id="top">Trying to connect websocket... But nothing seems to happen... :)</div>
  <div id="mid">Round-trip time: <span id="ping"></span></div>
    <script>
      window.onload = function() {
        var client = new Client();
      };
    </script>
  </body>
</html>