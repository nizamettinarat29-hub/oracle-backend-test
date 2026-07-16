const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Buluttaki veritabanı bağlantı ayarları
const dbConfig = {
  user: "ADMIN", 
  password: "Sifre12345!_ornek", // Bunu ileride değiştireceğiz
  connectString: "oracledb_high"  // Bunu ileride değiştireceğiz
};

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `SELECT id, username FROM users WHERE username = :user_param AND password = :pass_param`;
    const result = await connection.execute(sql, { user_param: username, pass_param: password }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

    if (result.rows.length > 0) {
      res.status(200).json({ success: true, message: 'Giriş başarılı!', user: result.rows });
    } else {
      res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Sunucu hatası oluştu.' });
  } finally {
    if (connection) { 
      try { await connection.close(); } catch (e) { console.error(e); }
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda aktif.`));
