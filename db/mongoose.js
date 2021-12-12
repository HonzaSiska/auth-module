const mongoose = require('mongoose');



mongoose.connect(process.env.MONGODB_URL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex:true
}).then(() => {
    console.log(`Connected`);
  }).catch((e) => {
    console.log(e)
  })