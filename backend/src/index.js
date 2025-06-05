import app from "./app.js";

app.listen(process.env.BACKEND_PORT, ()=>{
  console.log('Server listening on port', process.env.BACKEND_PORT);
})
