const axios = require("axios").default.create();
import request from "supertest";
import rateLimit from "axios-rate-limit";
import * as routes from "../config.api";
const express = require("express");
const cors = require("cors");
const api = rateLimit(axios, {
  maxRequests: 1,
  perMilliseconds: 2000,
});

export class HTTP {
  get = async (url: string, jwt: string, internal: boolean = false) => {
    if (internal) {
      const app = express();
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      app.use(cors());
      routes.routes(app);
      const response = (
        await request(app).get(url).set("Authorization", `Bearer ${jwt}`)
      ).text;
      return JSON.parse(response);
    } else {
      return (
        await axios.get(url, {
          headers: { Authorization: `Bearer ${jwt}` },
        })
      ).data;
    }
  };
  delete = async (url: string, jwt: string, internal: boolean = false) => {
    if (internal) {
      const app = express();
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      app.use(cors());
      routes.routes(app);
      const response = (
        await request(app).delete(url).set("Authorization", `Bearer ${jwt}`)
      ).text;
      return JSON.parse(response);
    } else {
      return (
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${jwt}` },
        })
      ).data;
    }
  };
  post = async (
    url: string,
    payload: any,
    jwt: string,
    internal: boolean = false
  ) => {
    if (internal) {
      const app = express();
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      app.use(cors());
      routes.routes(app);
      const response = (
        await request(app)
          .post(url)
          .set("Authorization", `Bearer ${jwt}`)
          .send(payload)
      ).text;
      return JSON.parse(response);
    } else {
      return await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${jwt}` },
      }).data;
    }
  };
  put = async (
    url: string,
    payload: any,
    jwt: string,
    internal: boolean = false
  ) => {
    if (internal) {
      const app = express();
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      app.use(cors());
      routes.routes(app);
      const response = (
        await request(app)
          .put(url)
          .set("Authorization", `Bearer ${jwt}`)
          .send(payload)
      ).text;
      return JSON.parse(response);
    } else {
      return await axios.put(url, payload, {
        headers: { Authorization: `Bearer ${jwt}` },
      }).data;
    }
  };
}
