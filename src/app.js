const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function repoExists(request, response, next) {
  const { id } = request.params;

  const repoAlreadyExists = repositories.find((repo) => repo.id === id);

  if (!repoAlreadyExists) {
    return response.status(400).json({ error: "Repository not found" });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepository);

  return response.status(200).json(newRepository);
});

app.put("/repositories/:id", repoExists, (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const updatedReposity = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories[repositoryIndex] = updatedReposity;

  return response.json(updatedReposity);
});

app.delete("/repositories/:id", repoExists, (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", repoExists, (request, response) => {
  const { id } = request.params;

  let repository = repositories.find((repo) => repo.id === id);

  repository = {
    ...repository,
    likes: (repository.likes += 1),
  };

  repositories.filter((repo) => {
    if (repo.id === id) repository;
    return repo;
  });

  return response.status(200).json(repository);
});

module.exports = app;
