import React, { useState } from "react";
import "./App.css";
import { Octokit } from "octokit";
import { Button, Col, Row, Card, CardTitle, CardText } from "reactstrap";

function App() {
  let tokenInStore = localStorage.getItem("token");
  const [token, setToken] = useState(tokenInStore || "");
  const [commits, setCommits] = useState([]);
  console.log(commits);

  const handleTokenChange = (e) => {
    let val = e.target.value;
    setToken(val);
    localStorage.setItem("token", val);
  };

  const fetchCommits = async () => {
    const octokit = new Octokit({
      auth: token,
    });

    try {
      let commitsData = await octokit.request(
        "GET /repos/AmbatiAvinash/commit-history/commits",
        {
          owner: "AmbatiAvinash",
          repo: "commit-history",
        }
      );
      if (commitsData.status === 200) {
        setCommits(commitsData.data);
      } else {
        console.log("error");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <div className="title">
        <h3>
          Please enter the token here:{" "}
          <input type="text" value={token} onChange={handleTokenChange} />
        </h3>
        <Button
          color="primary"
          disabled={token?.length === 0}
          onClick={fetchCommits}
          className="fetchBtn"
        >
          Get Commits
        </Button>
      </div>
      <div className="commits">
        {commits.length > 0 &&
          commits.map((com, idx) => {
            return (
              <Row key={idx} className="commit">
                <Col sm="6">
                  <Card body>
                    <CardTitle tag="h5">{com?.commit.message}</CardTitle>
                    <CardText>
                      <p>{com?.commit.author.date}</p>
                      <p>{com?.commit.author.name}</p>
                    </CardText>
                  </Card>
                </Col>
              </Row>
            );
          })}
      </div>
    </div>
  );
}

export default App;
