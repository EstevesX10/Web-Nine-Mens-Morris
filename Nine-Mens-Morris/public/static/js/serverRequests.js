const SERVER = "http://twserver.alunos.dcc.fc.up.pt:8008";

async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json(); // Parse JSON response
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function register(nickName, password) {
  const response = await fetchData(`${SERVER}/register`, {
    method: "POST",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    body: JSON.stringify({ nick: nickName, password: password }),
  }).catch((error) => {
    console.error("Error:", error);
  });
  // console.log("responde", response);
  return response;
}

async function join(nickName, password, group, size) {
  const response = await fetchData(`${SERVER}/join`, {
    method: "POST",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    body: JSON.stringify({
      nick: nickName,
      password: password,
      group: group,
      size: size,
    }),
  }).catch((error) => {
    console.error("Error:", error);
  });
  // console.log("responde", response);
  return response;
}

async function leave(nickName, password, game) {
  const response = await fetchData(`${SERVER}/leave`, {
    method: "POST",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    body: JSON.stringify({ nick: nickName, password: password, game: game }),
  }).catch((error) => {
    console.error("Error:", error);
  });
  // console.log("responde", response);
  return response;
}

async function notify(nickName, password, game, index) {
  const response = await fetchData(`${SERVER}/notify`, {
    method: "POST",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    body: JSON.stringify({
      nick: nickName,
      password: password,
      game: game,
      cell: {
        square: Math.floor(index / 8),
        position: index % 8,
      },
    }),
  }).catch((error) => {
    console.error("Error:", error);
  });
  // console.log("responde", response);
  return response;
}

async function ranking(group, size) {
  const response = await fetchData(`${SERVER}/ranking`, {
    method: "POST",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    body: JSON.stringify({ group: group, size: size }),
  }).catch((error) => {
    console.error("Error:", error);
  });
  // console.log("responde", response);
  return response;
}

function hookUpdate(nick, gameId, callback) {
  const eventSource = new EventSource(
    `${SERVER}/update?nick=${nick}&game=${gameId}`
  );
  eventSource.onmessage = callback;
  return eventSource;
}
