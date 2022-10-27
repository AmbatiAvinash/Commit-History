import React, { useState, useEffect } from "react";
import "./App.css";
import { Octokit } from "octokit";
import { Button, Col, Row, Card, CardTitle, CardText } from "reactstrap";
import { toast } from "react-toastify";

function App() {
  let tokenInStore = localStorage.getItem("token");
  let userInStore = localStorage.getItem("username");
  let repoInStore = localStorage.getItem("repo");
  const [token, setToken] = useState(tokenInStore || "");
  const [username, setUsername] = useState(userInStore || "");
  const [repo, setRepo] = useState(repoInStore || "");
  const [commits, setCommits] = useState([]);
  const [countdown, setCountDown] = useState(30);

  useEffect(() => {
    if (commits.length > 0) {
      const interval = setInterval(() => {
        setCountDown(countdown - 1);
        if (countdown === 1) {
          setCountDown(30);
          fetchCommits();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [countdown, commits]);

  const handleFormChange = (e) => {
    let val = e.target.value;
    if (e.target?.name === "token") {
      setToken(val);
    } else if (e.target?.name === "username") {
      setUsername(val);
    } else if (e.target?.name === "repo") {
      setRepo(val);
    }
  };

  const fetchCommits = async () => {
    const octokit = new Octokit({
      auth: token,
    });

    try {
      let commitsData = await octokit.request(
        `GET /repos/${username}/${repo}/commits`,
        {
          owner: username,
          repo: repo,
        }
      );
      if (commitsData.status === 200) {
        toast.success("Successfully fetched the commits");
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("repo", repo);
        setCommits(commitsData.data);
      } else {
        toast.error("Something went wrong");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  const formatDate = (d) => {
    console.log(d);
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    if (d.length > 0) {
      let date = new Date(d);
      let fetchedDate = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();
      return `${fetchedDate}/${months[month]}/${year}`;
    }
    return "";
  };

  return (
    <div className="App">
      <div className="title">
        <h6>
          Please enter the token here:{" "}
          <input
            type="text"
            name="token"
            value={token}
            onChange={handleFormChange}
          />
        </h6>
        <p>
          User name:{" "}
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleFormChange}
          />
        </p>
        <p>
          Repo name:{" "}
          <input
            type="text"
            name="repo"
            value={repo}
            onChange={handleFormChange}
          />
        </p>
        <div>Countdown: {countdown}</div>
        <Button
          color="primary"
          disabled={
            token?.length === 0 || username.length === 0 || repo.length === 0
          }
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
                      <p>{formatDate(com?.commit.author.date)}</p>
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
