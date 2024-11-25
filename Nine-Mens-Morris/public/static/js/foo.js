function make_request(command, value) {
  const xhr = new XMLHttpRequest();

  xhr.open("POST", "http://twserver.alunos.dcc.fc.up.pt:8008/register", true);
  xhr.withCredentials = true;
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const data = JSON.parse(xhr.responseText);
    }
  };
  xhr.send(JSON.stringify({ nick: command, password: value }));
}
