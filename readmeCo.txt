start mongodb from CMD:
1. Copy the path for mongod.exe in mongodb installation folder. Basically you can copy it whereever you want.
2. Copy the path for Db data folder. Create one if this is the first itme..
3. start cmd.exe
4. Navigate to MongoDb bin directory to reach mongod.exe => cd C:\Users\Casper\mongodb\bin
5. To start the Db ==> mongod --dbpath C:\Users\Casper\mongodb-data
                            or
                            on the opening of cmd.exe without navigating to anywhere type ==>
        "C:\Users\Casper\mongodb\bin\mongod.exe" --dbpath="C:\Users\Casper\mongodb-data"
6. It is important to hava database path. Default is C:\db\data if not provided.
7. Have to keep cmd.exe open and runnig to have the MongoDB up and running.
8. Connect via Robo3T or MongoDB Compass to the DB.

C:\Users\Casper\mongodb-data
docs: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

nodemon as development dependency:
npm i nodemon --save-dev

start develpoment server in task-manager folder : ==> npm run dev  // bu script i package.json a yazmıştık
env variable ları ekledikten sonra onlar çalışabilsin diye package.json daki dev i "dev": "env-cmd -f ./config/dev.env nodemon src/index.js" şeklinde değiştirdik

SendGrid: APIKey Name NodeJS-TaskManager : SG.-sfbC-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxFZwrgpLEYDIkdg is in safe place now dev.env


MongoDB connection string mongoose.js içindedir. Onu da güven altına almak gerekir MONGODB_URL  yi .env içinde oluşturduk ve process.env.MONGODB_URL ile kod içinde ulaşabiliyoruz

JWT : user.js modelindeki userSchema.methods.generateAuthToken func ile token üretiyoruz ve orad abir secret string kullanıyorduk. Onu da oradan alıp dev.env içine taşıdık.