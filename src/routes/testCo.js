const express = require('express')


// router func kullanımı örnek buradan diğer routes/task ve user dosyalarına aktarıldı
const router = new express.Router() // bu yapıyı başla folder da oluşturarak burayı (index.js) sadeleştireceğiz
router.get('/testCo', (req, res) => {
    res.send('This is from my other router')
})
//app.use(router) // bu satır olmadan router.get veya router.post çalışmaz
//bu satırı index js e taşıdık. routeler burada. buradan export edip index te bu dosyayı alıyoruz. Ayrıca app.use ile orada middleware i eklememiz lazım.

module.exports = router