const http = require("http");

const PORT = 3000;

const friends = [
  {
    id: 1,
    name: "Donald",
  },
  {
    id: 2,
    name: "Jacob",
  },
  {
    id: 3,
    name: "Philip",
  },
];

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(
      200,
      {
        "Content-Type": "text/plain",
      },
      {
        accept: "application/json",
      }
    );
    res.end("Welcome to Localhost.");
  } else if (req.method === "POST" && req.url === "/") {
    req.pipe(res); // Using pipes since req is a readable stream and res is a writable stream.
  } else if (req.method === "GET" && req.url === "/friends") {
    res.writeHead(
      200,
      {
        "Content-Type": "text/plain",
      },
      {
        accept: "application/json",
      }
    );
    res.end(JSON.stringify(friends));
  } else if (req.method === "GET" && req.url.match(/^\/friends\/+[0-9]/)) {
    const items = req.url.split("/");
    const friend = friends.find(
      (element) => element.id === parseInt(items[2], 10)
    );

    if (friend) {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(friend));
    } else {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });
      res.end(`No friend with id ${items[2]}`);
    }
  } else if (req.method === "GET" && req.url === "/messages") {
    res.writeHead(
      200,
      {
        "Content-Type": "text/plain",
      },
      {
        accept: "application/json",
      }
    );

    res.end(
      JSON.stringify({
        id: 1,
        msg: "Messages are loading from this url.",
      })
    );
  } else if (req.method === "POST" && req.url === "/friends") {
    req.on("data", (data) => {
      const friend = JSON.parse(data.toString());

      if (!friend.name) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });
        return res.end(`'name' is required`);
      }

      friends.push({
        id: friends.length + 1,
        name: friend.name,
      });
      res.writeHead(201, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(friends));
    });
  } else if (req.method === "PUT" && req.url.match(/^\/friends\/+[0-9]/)) {
    req.on("data", (data) => {
      const items = req.url.split("/");

      let friend = friends.find(
        (element) => element.id === parseInt(items[2], 10)
      );

      const update = JSON.parse(data.toString());

      if (friend) {
        friends.splice(parseInt(items[2], 10) - 1, 1, {
          id: parseInt(items[2], 10),
          name: update.name,
        });

        friend = friends.find(
          (element) => element.id === parseInt(items[2], 10)
        );

        res.writeHead(200, {
          "Content-Type": "application/json",
        });

        res.end(JSON.stringify(friend));
      } else {
        res.writeHead(404, {
          "Content-Type": "application/json",
        });

        res.end(`No friend with id ${items[2]}`);
      }
    });
  } else if (req.method === "DELETE" && req.url.match(/^\/friends\/+[0-9]/)) {
    const items = req.url.split("/");

    const friend = friends.splice(parseInt(items[2], 10) - 1, 1);

    console.log(friend);

    if (friend.length > 0) {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      return res.end(JSON.stringify(friend));
    }

    res.writeHead(404, {
      "Content-Type": "application/json",
    });
    return res.end(`No friend with ID: ${items[2]}`);
  } else {
    res.statusCode = 404;
    res.end("404 Not Found.");
  }
});

server.listen(PORT, () => {
  console.log(`The server is listening on port http://localhost:${PORT}`);
});
