async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Parse JSON response
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function register(nickName, password) {
  const response = await fetchData(
    "http://twserver.alunos.dcc.fc.up.pt:8008/register",
    {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify({ nick: nickName, password: password }),
    }
  ).catch((error) => {
    console.error("Error:", error);
  });
  // console.log("responde", response);
  return response;
}

async function join(nickName, password, group, size) {
  const response = await fetchData(
    "http://twserver.alunos.dcc.fc.up.pt:8008/join",
    {
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
    }
  ).catch((error) => {
    console.error("Error:", error);
  });
  // console.log("responde", response);
  return response;
}

async function leave(nickName, password, game) {
  const response = await fetchData(
    "http://twserver.alunos.dcc.fc.up.pt:8008/leave",
    {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify({ nick: nickName, password: password, game: game }),
    }
  ).catch((error) => {
    console.error("Error:", error);
  });
  // console.log("responde", response);
  return response;
}

async function notify(nickName, password, game, cell) {
  const response = await fetchData(
    "http://twserver.alunos.dcc.fc.up.pt:8008/notify",
    {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify({
        nick: nickName,
        password: password,
        game: game,
        cell: cell,
      }),
    }
  ).catch((error) => {
    console.error("Error:", error);
  });
  // console.log("responde", response);
  return response;
}

async function ranking(group, size) {
  const response = await fetchData(
    "http://twserver.alunos.dcc.fc.up.pt:8008/ranking",
    {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify({ group: group, size: size }),
    }
  ).catch((error) => {
    console.error("Error:", error);
  });
  // console.log("responde", response);
  return response;
}

// ---------------------------------------------------------
// Authentication

// async function getUserPassword(nickName) {
//   fetchData("http://twserver.alunos.dcc.fc.up.pt:8008/register", {
//     method: "GET",
//     // headers: {
//     //   "Content-Type": "application/json",
//     // },
//     body: JSON.stringify({ nick: nickName, password: password }),
//   })
//     .then((data) => {
//       console.log("Fetched data:", data);
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

async function login(nickName, password) {}
