const app = require('./app')

//const port = process.env.PORT || 3000;
const port = process.env.PORT; // bu heroku daki port olacak. localde 3000 de çalışıyordu yukarıdaki gib. fakat config/dev.env içine localhost portunu girdik.


app.listen(port, () => console.log(`listening on http://localhost:${port}`));


