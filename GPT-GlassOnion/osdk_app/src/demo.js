import { createApp } from "./app.js";
const { fleet } = createApp();
console.log(JSON.stringify(await fleet.run("Map public climate resilience resources in Virginia"), null, 2));
