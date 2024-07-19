const request = require("supertest");
const app = require("./app");
const fs = require("node:fs");
const path = require("node:path");

jest.mock("node:fs");

describe("/books/:id", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  // describe("DELETE /books/:id", () => {});
});

describe("/books/:id", () => {});
