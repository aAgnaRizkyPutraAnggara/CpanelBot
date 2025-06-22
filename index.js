require('./settings');
require('./src/message'); // Pastikan ini ada untuk memuat semua global.menu string

const {
  Telegraf,
  Markup
} = require('telegraf');

const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const axios = require("axios");
const path = require('path');
const archiver = require('archiver');
const fetch = require('node-fetch');
const canvafy = require("canvafy");
const connectwa = require("./src/lib/connectwa");

const _0x4ced46=_0x56c0;(function(_0x5b640e,_0x389657){const _0x57bc10=_0x56c0,_0x265cd0=_0x5b640e();while(!![]){try{const _0x5622f3=parseInt(_0x57bc10(0x187))/0x1+parseInt(_0x57bc10(0x18f))/0x2*(parseInt(_0x57bc10(0x191))/0x3)+-parseInt(_0x57bc10(0x186))/0x4*(parseInt(_0x57bc10(0x190))/0x5)+parseInt(_0x57bc10(0x18e))/0x6+parseInt(_0x57bc10(0x188))/0x7+-parseInt(_0x57bc10(0x18a))/0x8*(-parseInt(_0x57bc10(0x18c))/0x9)+parseInt(_0x57bc10(0x18d))/0xa*(-parseInt(_0x57bc10(0x18b))/0xb);if(_0x5622f3===_0x389657)break;else _0x265cd0['push'](_0x265cd0['shift']());}catch(_0x38cae7){_0x265cd0['push'](_0x265cd0['shift']());}}}(_0x5e73,0xd8dc4));function _0x56c0(_0x37adfa,_0x50a4f8){const _0x5e732d=_0x5e73();return _0x56c0=function(_0x56c074,_0x3c24d5){_0x56c074=_0x56c074-0x186;let _0x18b77d=_0x5e732d[_0x56c074];return _0x18b77d;},_0x56c0(_0x37adfa,_0x50a4f8);}const ACCESS_PASSWORD=_0x4ced46(0x189);function _0x5e73(){const _0x2737ab=['10wzzXUf','6949062WzLldr','206vmFvQR','5KPNRro','39531buyZoh','6048412nSECdV','987893ywnDMf','12015255krllaq','jhonaleysc','24728dGKlQG','44273823XPIddz','3510LooDDZ'];_0x5e73=function(){return _0x2737ab;};return _0x5e73();}


const panelBillingPath = './src/database/panel-billing.json';
const thumbnailPath = path.join(__dirname, "src/image/thumbnail.jpg");
const db_respon_list = JSON.parse(fs.readFileSync('./src/database/list.json'));
const {
  addResponList1,
  delResponList1,
  isAlreadyResponList1,
  isAlreadyResponList1Group,
  sendResponList1,
  updateResponList1,
  getDataResponList1
} = require('./src/lib/addlist');
const warnFile = path.join(__dirname, "./src/database/warns.json");
let seller = JSON.parse(fs.readFileSync('./src/database/seller.json'));
let privateSeller = JSON.parse(fs.readFileSync('./src/database/private_seller.json')); // Load private seller data
let publicPartner = JSON.parse(fs.readFileSync('./src/database/public_partner.json')); // Load public partner data
let privatePartner = JSON.parse(fs.readFileSync('./src/database/private_partner.json')); // Load private partner data
const owners = JSON.parse(fs.readFileSync('./owner.json', 'utf8')); // Deklarasi owners di sini (global)


const readlineSync = require('readline-sync');

const tokenPath = path.join(__dirname, './src/database/token.json');

function askToken() {
  console.log('🔑 Masukkan Token Bot Telegram:');
  return readlineSync.question('> ').trim();
}

function getToken() {
  // Hanya meminta password saat startup awal
  console.log('🔒 Masukkan kunci utama untuk melanjutkan:');
  const enteredKey = readlineSync.question('', { hideEchoBack: true }).trim(); // Sembunyikan input kunci

function _0x5527(_0x465f10,_0x18b815){var _0x41bbed=_0x41bb();return _0x5527=function(_0x5527ba,_0x1ea661){_0x5527ba=_0x5527ba-0x1d2;var _0x447162=_0x41bbed[_0x5527ba];return _0x447162;},_0x5527(_0x465f10,_0x18b815);}var _0x2084a3=_0x5527;function _0x41bb(){var _0x5e6702=['8683409ESqwJy','63648bKbzDv','19804GYqfnH','exit','3444832LGbcOW','2973108GoIhPR','510ozLncu','120098jBtBhI','19RbxWaB','18YJjfPJ','1630peppnb','2938518rpBmuZ','❌\x20Kunci\x20utama\x20salah!\x20Program\x20dihentikan.'];_0x41bb=function(){return _0x5e6702;};return _0x41bb();}(function(_0x1d46c2,_0x34ead7){var _0x181467=_0x5527,_0xdd19c4=_0x1d46c2();while(!![]){try{var _0x20cc43=-parseInt(_0x181467(0x1d7))/0x1*(parseInt(_0x181467(0x1dd))/0x2)+-parseInt(_0x181467(0x1d4))/0x3+parseInt(_0x181467(0x1de))/0x4*(parseInt(_0x181467(0x1d5))/0x5)+parseInt(_0x181467(0x1da))/0x6+-parseInt(_0x181467(0x1dc))/0x7+-parseInt(_0x181467(0x1d3))/0x8*(-parseInt(_0x181467(0x1d8))/0x9)+-parseInt(_0x181467(0x1d9))/0xa*(-parseInt(_0x181467(0x1d6))/0xb);if(_0x20cc43===_0x34ead7)break;else _0xdd19c4['push'](_0xdd19c4['shift']());}catch(_0x50ba41){_0xdd19c4['push'](_0xdd19c4['shift']());}}}(_0x41bb,0xc32ba));enteredKey!==ACCESS_PASSWORD&&(console['error'](_0x2084a3(0x1db)),process[_0x2084a3(0x1d2)](0x1));

  console.log('✅ Kunci utama benar. Melanjutkan...');

  if (fs.existsSync(tokenPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
      if (data.token && data.token.trim() !== '') {
        return data.token.trim();
      }
    } catch (err) {
      console.log('⚠️ Gagal membaca token.json, meminta token baru...');
    }
  }

  const token = askToken();

  if (!token) {
    console.log('❌ Token kosong! Program dihentikan.');
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(tokenPath), { recursive: true });
  fs.writeFileSync(tokenPath, JSON.stringify({ token }, null, 2));
  console.log('✅ Token berhasil disimpan!');
  
  return token;
}

const botToken = getToken();
const bot = new Telegraf(botToken);

function readWarnDB() {
  try {
    if (fs.existsSync(warnFile)) {
      return JSON.parse(fs.readFileSync(warnFile, "utf8"));
    }
    return {}; // Jika file tidak ada, kembalikan objek kosong
  }
  catch (error) {
    console.error("❌ Error membaca warnDB:", error);
    return {}; // Jika terjadi error, kembalikan objek kosong agar tidak crash
  }
}

function saveWarnDB(data) {
  try {
    fs.writeFileSync(warnFile, JSON.stringify(data, null, 2));
  }
  catch (error) {
    console.error("❌ Error menyimpan warnDB:", error);
  }
}

let warnDB = readWarnDB();
let pendingWarns = new Map();







async function backupAndSend(xy) {
  const foldersToBackup = [
  'src',
  'sessions'
  ];
  const filesToBackup = [
    'package.json',
    'bot.js',
    'run.js',
    'owner.json',
    'settings.js',
    'xy.js',
    'index.js'
  ];

  const zipFileName = 'backup.zip';

  const output = fs.createWriteStream(zipFileName);
  const archive = archiver('zip', {
    zlib: {
      level: 9
    }
  });

  output.on('close', async () => {
    await sendBackupToTelegram(xy, zipFileName);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  for (const folder of foldersToBackup) {
    const folderPath = `./${folder}`;
    if (fs.existsSync(folderPath)) {
      archive.directory(folderPath, folder);
    } else {
      console.log(`📂 Folder '${folderPath}' tidak ditemukan.`);
    }
  }

  for (const file of filesToBackup) {
    const filePath = `./${file}`;
    if (fs.existsSync(filePath)) {
      archive.file(filePath, {
        name: file
      });
    } else {
      console.log(`📄 File '${filePath}' tidak ditemukan.`);
    }
  }

  archive.finalize();
}

async function sendBackupToTelegram(xy, zipFileName) {
  try {
    const ownerId = owners[0]; // Menggunakan owners dari scope global

    if (!ownerId || isNaN(ownerId)) {
      console.error('❌ ID Owner tidak valid atau tidak ditemukan.');
      return;
    }

    const fileSize = fs.statSync(zipFileName).size / (1024 * 1024);
    const formattedDate = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta'
    });

    const caption = `📦 *Backup Bot Berhasil!* 📦\n\n📁 *Ukuran*: ${fileSize.toFixed(2)} MB\n📆 *Tanggal*: ${formattedDate}\n\n✅ Simpan backup ini dengan baik!`;

await xy.telegram.sendDocument(ownerId, {
  source: zipFileName
}, {
  caption,
  parse_mode: 'Markdown'
});
    console.log(`📤 Backup dikirim ke owner: ${ownerId}`);

  } catch (error) {
    console.error('❌ Gagal mengirim backup ke Telegram:', error.message);
  } finally {
    // Pastikan file zip dihapus setelah dikirim atau jika terjadi error
    if (fs.existsSync(zipFileName)) {
      fs.unlinkSync(zipFileName);
    }
  }
}

function checkExpiredSellers() {
  let now = Date.now();
  let updatedSellers = seller.filter(s => s.expiresAt > now);
  let updatedPrivateSellers = privateSeller.filter(s => s.expiresAt > now); 
  let updatedPublicPartners = publicPartner.filter(s => s.expiresAt > now); 
  let updatedPrivatePartners = privatePartner.filter(s => s.expiresAt > now); 

  if (updatedSellers.length !== seller.length) {
    seller = updatedSellers;
    fs.writeFileSync('./src/database/seller.json', JSON.stringify(seller, null, 2));
    console.log('✅ Seller publik yang expired telah dihapus otomatis.');
  }

  if (updatedPrivateSellers.length !== privateSeller.length) {
    privateSeller = updatedPrivateSellers;
    fs.writeFileSync('./src/database/private_seller.json', JSON.stringify(privateSeller, null, 2));
    console.log('✅ Reseller private yang expired telah dihapus otomatis.');
  }

  if (updatedPublicPartners.length !== publicPartner.length) {
    publicPartner = updatedPublicPartners;
    fs.writeFileSync('./src/database/public_partner.json', JSON.stringify(publicPartner, null, 2));
    console.log('✅ Partner publik yang expired telah dihapus otomatis.');
  }

  if (updatedPrivatePartners.length !== privatePartner.length) {
    privatePartner = updatedPrivatePartners;
    fs.writeFileSync('./src/database/private_partner.json', JSON.stringify(privatePartner, null, 2));
    console.log('✅ Partner private yang expired telah dihapus otomatis.');
  }
}


function runBot() {

  (async () => {
    await connectwa.restoreWhatsAppSessions();
    console.log("✅ Semua sesi berhasil direstore. Bot siap digunakan.");
  })();

  setInterval(() => {
    backupAndSend(bot);
  }, 21600000);

  setInterval(() => {
    checkExpiredSellers(bot);
  }, 3000);

   bot.start((xy) => {
    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [{
            text: 'Website',
            callback_data: 'website_info'
          }], 
          [{
            text: 'Kreator Script',
            callback_data: 'creator'
          }],
          [{
              text: 'Buka Menu',
              callback_data: 'mainmenu'
            } // Tombol untuk buka menu
          ]
        ]
      }
    };

    xy.reply('Hallo Selamat Datang di Jhonaley Cpanel\n\nSilahkan Menikmati :)', inlineKeyboard);
  });

bot.action("website_info", (ctx) => {
  ctx.reply(
    "📜 Website:\nbeli panel atau nokos? langsung ke website kita aja kak!",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Klik di sini",
              url: "https://jhonaley.web.id"
            }
          ]
        ]
      }
    }
  );
});

bot.action("creator", (ctx) => {
  ctx.reply(
    "👤 Kreator Bot:\nUntuk informasi lebih lanjut, klik tombol di bawah.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "💬 Chat Kreator",
              url: "https://t.me/danangvalentp"
            }
          ]
        ]
      }
    }
  );
});
    
  async function sendMainMenu(xy) {
    // Mendapatkan informasi pengguna dan obrolan untuk menentukan hak akses
    const userId = xy.from.id;
    // Menggunakan owners dari scope global, tidak perlu deklarasi ulang di sini
    let sellerData = JSON.parse(fs.readFileSync('./src/database/seller.json'));
    let privateSellerData = JSON.parse(fs.readFileSync('./src/database/private_seller.json')); // Baca data private seller
    let publicPartnerData = JSON.parse(fs.readFileSync('./src/database/public_partner.json')); // Baca data public partner
    let privatePartnerData = JSON.parse(fs.readFileSync('./src/database/private_partner.json')); // Baca data private partner

    const now = Date.now();
    const isOwner = owners.includes(String(userId));
    const isSeller = sellerData.some(s => s.id === String(userId) && s.expiresAt > now);
    const isPrivateSeller = privateSellerData.some(s => s.id === String(userId) && s.expiresAt > now); 
    const isPublicPartner = publicPartnerData.some(p => p.id === String(userId) && p.expiresAt > now); // Cek public partner
    const isPrivatePartner = privatePartnerData.some(p => p.id === String(userId) && p.expiresAt > now); // Cek private partner


    let statusUser = "User Biasa";
    let durationDisplay = ""; 

    if (isOwner) {
      statusUser = "Owner";
    } else if (isPrivatePartner) { // Prioritaskan Partner Private
      statusUser = "Partner Private";
      const userPrivatePartner = privatePartnerData.find(p => p.id === String(userId));
      if (userPrivatePartner) {
        const remainingTime = userPrivatePartner.expiresAt - now;
        if (remainingTime > 0) {
          const totalSeconds = Math.floor(remainingTime / 1000);
          const days = Math.floor(totalSeconds / (3600 * 24));
          const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          if (days > 0) {
            durationDisplay = `\n• Durasi: ${days} hari, ${hours} jam, ${minutes} menit`;
          } else if (hours > 0) {
            durationDisplay = `\n• Durasi: ${hours} jam, ${minutes} menit`;
          } else if (minutes > 0) {
            durationDisplay = `\n• Durasi: ${minutes} menit, ${seconds} detik`;
          } else {
            durationDisplay = `\n• Durasi: ${seconds} detik`;
          }
        } else {
          durationDisplay = "\n• Durasi: Expired"; 
        }
      }
    } else if (isPublicPartner) { // Kemudian Partner Publik
        statusUser = "Partner Publik";
        const userPublicPartner = publicPartnerData.find(p => p.id === String(userId));
        if (userPublicPartner) {
            const remainingTime = userPublicPartner.expiresAt - now;
            if (remainingTime > 0) {
                const totalSeconds = Math.floor(remainingTime / 1000);
                const days = Math.floor(totalSeconds / (3600 * 24));
                const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                if (days > 0) {
                    durationDisplay = `\n• Durasi: ${days} hari, ${hours} jam, ${minutes} menit`;
                } else if (hours > 0) {
                    durationDisplay = `\n• Durasi: ${hours} jam, ${minutes} menit`;
                } else if (minutes > 0) {
                    durationDisplay = `\n• Durasi: ${minutes} menit, ${seconds} detik`;
                } else {
                    durationDisplay = `\n• Durasi: ${seconds} detik`;
                }
            } else {
                durationDisplay = "\n• Durasi: Expired";
            }
        }
    } else if (isPrivateSeller) { // Kemudian Reseller Private
      statusUser = "Reseller Private";
      const userPrivateSeller = privateSellerData.find(s => s.id === String(userId));
      if (userPrivateSeller) {
        const remainingTime = userPrivateSeller.expiresAt - now;
        if (remainingTime > 0) {
          const totalSeconds = Math.floor(remainingTime / 1000);
          const days = Math.floor(totalSeconds / (3600 * 24));
          const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          if (days > 0) {
            durationDisplay = `\n• Durasi Reseller: ${days} hari, ${hours} jam, ${minutes} menit`;
          } else if (hours > 0) {
            durationDisplay = `\n• Durasi Reseller: ${hours} jam, ${minutes} menit`;
          } else if (minutes > 0) {
            durationDisplay = `\n• Durasi Reseller: ${minutes} menit, ${seconds} detik`;
          } else {
            durationDisplay = `\n• Durasi Reseller: ${seconds} detik`;
          }
        } else {
          durationDisplay = "\n• Durasi Reseller: Expired"; 
        }
      }
    } else if (isSeller) { // Kemudian Reseller Publik
      statusUser = "Reseller Publik";
      const userSeller = sellerData.find(s => s.id === String(userId));
      if (userSeller) {
        const remainingTime = userSeller.expiresAt - now;
        if (remainingTime > 0) {
          const totalSeconds = Math.floor(remainingTime / 1000);
          const days = Math.floor(totalSeconds / (3600 * 24));
          const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          if (days > 0) {
            durationDisplay = `\n• Durasi Reseller: ${days} hari, ${hours} jam, ${minutes} menit`;
          } else if (hours > 0) {
            durationDisplay = `\n• Durasi Reseller: ${hours} jam, ${minutes} menit`;
          } else if (minutes > 0) {
            durationDisplay = `\n• Durasi Reseller: ${minutes} menit, ${seconds} detik`;
          } else {
            durationDisplay = `\n• Durasi Reseller: ${seconds} detik`;
          }
        } else {
          durationDisplay = "\n• Durasi Reseller: Expired";
        }
      }
    }

    const info = `
🤖 INFO BOT

• Nama Bot: Jhonaley Cpanel
• Status Kamu: ${statusUser}${durationDisplay}
• Version: 2.0.0
• Website: www.jhonaley.web.id
• WhatsApp: 639305637643

🔘 Silakan pilih menu:`;

    // Urutan tombol sesuai permintaan: Partner Private, Partner Publik, Reseller Private, Reseller Publik, ... umum, Owner (terbawah)
    const mainMenuButtons = [
      // Partner Panels (teratas)
      ...(isOwner || isPrivatePartner ? [[Markup.button.callback("🖥️ Partner Panel Private", "partnerpanel_private")]] : []),
      ...(isOwner || isPublicPartner ? [[Markup.button.callback("🖥️ Partner Panel Publik", "partnerpanel_public")]] : []),
      // Reseller Panels
      ...(isOwner || isPrivateSeller ? [[Markup.button.callback("🛒 Reseller Panel Private", "resellerpanel_private")]] : []),
      ...(isOwner || isSeller ? [[Markup.button.callback("🛒 Reseller Panel Publik", "resellerpanel")]] : []),
      // Menu umum lainnya
      [Markup.button.callback("🛠️ Tools Menu", "toolsmenu")],
      [Markup.button.callback("📥 Downloader Menu", "downloadermenu")],
      [Markup.button.callback("🛍️ Store Menu", "storemenu")],
      [Markup.button.callback("🎛️ Installer Panel", "installermenu")],
      [Markup.button.callback("👥 Group Menu", "groupmenu")],
      // Owner Menu (terbawah)
      ...(isOwner ? [[Markup.button.callback("📌 Owner Menu", "ownermenu")]] : []),
    ];


    try {
      await xy.replyWithPhoto({
        source: thumbnailPath
      }, {
        caption: info,
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard(mainMenuButtons),
      });
    } catch (error) {
      console.error("❌ Gagal mengirim gambar:", error);
    }
  }

  // Objek menus didefinisikan di sini dan mengambil caption dari global.menu strings
  const menus = {
    ownermenu: {
      caption: global.ownermenu,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    toolsmenu: {
      caption: global.toolsmenu,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    downloadermenu: {
      caption: global.downloadermenu,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    resellerpanel: { // Ini adalah Reseller Panel Publik
      caption: global.resellerpanel,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    resellerpanel_private: { // New: Reseller Panel Private
      caption: global.resellerpanel_private,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    partnerpanel_public: { // Corrected: Partner Panel Publik
      caption: global.partnerpanel_public, // Now uses the correctly renamed global variable
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    partnerpanel_private: { // Corrected: Partner Panel Private
      caption: global.partnerpanel_private, // Now uses the correctly renamed global variable
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    storemenu: {
      caption: global.storemenu,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    installermenu: {
      caption: global.installermenu,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
    groupmenu: {
      caption: global.groupmenu,
      buttons: [
        [Markup.button.callback("⬅️ Kembali", "mainmenu")]
      ],
    },
  };

  bot.command("menu", async (xy) => {
    await sendMainMenu(xy);
  });

  Object.keys(menus).forEach((menu) => { // Menggunakan objek menus lokal
    bot.action(menu, async (xy) => {
      const userId = xy.from.id;
      const owners = JSON.parse(fs.readFileSync('./owner.json', 'utf8'));
      let sellerData = JSON.parse(fs.readFileSync('./src/database/seller.json'));
      let privateSellerData = JSON.parse(fs.readFileSync('./src/database/private_seller.json')); // Baca data private seller
      let publicPartnerData = JSON.parse(fs.readFileSync('./src/database/public_partner.json')); // Baca data public partner
      let privatePartnerData = JSON.parse(fs.readFileSync('./src/database/private_partner.json')); // Baca data private partner
      const now = Date.now();
      const isOwner = owners.includes(String(userId));
      const isSeller = sellerData.some(s => s.id === String(userId) && s.expiresAt > now);
      const isPrivateSeller = privateSellerData.some(s => s.id === String(userId) && s.expiresAt > now); 
      const isPublicPartner = publicPartnerData.some(p => p.id === String(userId) && p.expiresAt > now);
      const isPrivatePartner = privatePartnerData.some(p => p.id === String(userId) && p.expiresAt > now);


      // Periksa akses untuk menu tertentu
      if (menu === "resellerpanel" && !(isOwner || isSeller)) { // Reseller Panel Publik
        return xy.answerCbQuery(global.mess.seller, { show_alert: true }); 
      }
      if (menu === "resellerpanel_private" && !(isOwner || isPrivateSeller)) { // Reseller Panel Private
        return xy.answerCbQuery(global.mess.owner, { show_alert: true }); 
      }
      if (menu === "partnerpanel_public" && !(isOwner || isPublicPartner)) { // Partner Panel Publik
          return xy.answerCbQuery(global.mess.owner, { show_alert: true }); 
      }
      if (menu === "partnerpanel_private" && !(isOwner || isPrivatePartner)) { // Partner Panel Private
        return xy.answerCbQuery(global.mess.owner, { show_alert: true }); 
      }
      if ((menu === "ownermenu" || menu === "installermenu") && !isOwner) { // OwnerMenu dan InstallerMenu hanya untuk Owner
        return xy.answerCbQuery(global.mess.owner, { show_alert: true }); 
      }


      try {
        await xy.editMessageMedia({
          type: "photo",
          media: {
            source: thumbnailPath
          },
          caption: menus[menu].caption, // Menggunakan objek menus lokal
        }, {
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard(menus[menu].buttons) // Menggunakan objek menus lokal
        });
      } catch (error) {
        console.error("❌ Gagal mengedit pesan:", error);
        await xy.reply(menus[menu].caption, { // Menggunakan objek menus lokal
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard(menus[menu].buttons) // Menggunakan objek menus lokal
        });
      }
    });
  });

  bot.action("mainmenu", async (xy) => {
    await sendMainMenu(xy); // Panggil sendMainMenu untuk menghasilkan tombol secara dinamis
  });

  bot.on('sticker', (ctx) =>
    ctx.reply('👍')

  )





  bot.on("new_chat_members", async (ctx) => {
    ctx.message.new_chat_members.forEach(async (user) => {
      let fileUrl = "https://i.ibb.co.com/0y40cqKM/images-1.jpg";

      try {
        const photos = await ctx.telegram.getUserProfilePhotos(user.id);
        if (photos.total_count > 0) {
          const fileId = photos.photos[0][0].file_id;
          const file = await ctx.telegram.getFile(fileId);
          fileUrl = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;

          const response = await axios.get(fileUrl, {
            responseType: "arraybuffer"
          });
          if (response.status !== 200) throw new Error("Gagal mengambil gambar");
        }
      } catch (error) {
        console.error("Gagal mengambil foto profil:", error);
      }

      let chatInfo = await ctx.telegram.getChat(ctx.chat.id);
      let groupName = chatInfo.title || "Grup Ini";
      // FIX: Perbaikan SyntaxError pada baris ini, menggunakan operator ||
      let groupDesc = ctx.chat.description ? ctx.chat.description.substring(0, 200) : "Tidak ada deskripsi.";


      try {
        const welcomeImage = await new canvafy.WelcomeLeave()
          .setAvatar(fileUrl)
          .setBackground("image", "https://i.ibb.co.com/0y40cqKM/images-1.jpg")
          .setTitle("Welcome")
          .setDescription(`Selamat datang, ${user.first_name}`)
          .setBorder("#2a2e35")
          .setAvatarBorder("#2a2e35")
          .setOverlayOpacity(0.3)
          .build();

        fs.writeFileSync("welcome.png", Buffer.from(welcomeImage));

        await ctx.telegram.sendPhoto(ctx.chat.id, {
          source: "welcome.png"
        }, {
          caption: `🎉 Selamat datang di *${groupName}*, ${user.first_name}!\n\n📌 *Deskripsi Grup:* ${groupDesc}`,
          parse_mode: "Markdown"
        });
      } catch (err) {
        console.error(`Gagal membuat gambar:`, err);
      }
    });
  });


  bot.on("left_chat_member", async (ctx) => {
    const user = ctx.message.left_chat_member;
    let fileUrl = "https://i.ibb.co.com/0y40cqKM/images-1.jpg";

    try {
      const photos = await ctx.telegram.getUserProfilePhotos(user.id);
      if (photos.total_count > 0) {
        const fileId = photos.photos[0][0].file_id;
        const file = await ctx.telegram.getFile(fileId);
        fileUrl = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;

        const response = await axios.get(fileUrl, {
          responseType: "arraybuffer"
        });
        if (response.status !== 200) throw new Error("Gagal mengambil gambar");
      }
    } catch (error) {
      console.error("Gagal mengambil foto profil:", error);
    }

    try {
      const leaveImage = await new canvafy.WelcomeLeave()
        .setAvatar(fileUrl)
        .setBackground("image", "https://i.ibb.co.com/0y40cqKM/images-1.jpg")
        .setTitle("Goodbye")
        .setDescription(`${user.first_name} telah keluar.`)
        .setBorder("#ff0000")
        .setAvatarBorder("#ff0000")
        .setOverlayOpacity(0.3)
        .build();

      fs.writeFileSync("leave.png", Buffer.from(leaveImage));

      await ctx.telegram.sendPhoto(ctx.chat.id, {
        source: "leave.png"
      }, {
        caption: `👋 Sampai jumpa, ${user.first_name}!`
      });
    } catch (err) {
      console.error("Gagal membuat gambar:", err);
    }
  });








  bot.on("callback_query", async (xy) => {
    const callbackQuery = xy.callbackQuery;
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    const chatId = msg?.chat.id;
    const messageId = msg?.message_id;

    if (data.startsWith("list_")) {
      let [, chatId, key] = data.split("_");
      chatId = parseInt(chatId);

      if (msg.chat.id !== chatId) return await xy.answerCbQuery();

      let getData = db_respon_list.find(item => item.id === chatId && item.key === key);

      if (!getData) {
        return await xy.answerCbQuery("❌ Data tidak ditemukan!", {
          show_alert: true
        });
      }

      if (getData.isImage && getData.image_url !== "-") {
        try {
          const response = await axios.get(getData.image_url, {
            responseType: "arraybuffer"
          });
          const imagePath = `./temp_${chatId}_${key}.jpg`; // Simpan sementara

          fs.writeFileSync(imagePath, response.data);

          await xy.replyWithPhoto({
            source: imagePath
          }, {
            caption: `📌 *${key}*\n\n${getData.response}`,
            parse_mode: "Markdown"
          });

          fs.unlinkSync(imagePath);
        } catch (error) {
          await xy.reply("❌ Gagal mengunduh atau mengirim gambar.");
        }
      } else {
        await xy.reply(`📌 *${key}*\n\n${getData.response}`, {
          parse_mode: "Markdown"
        });
      }
      await xy.answerCbQuery();
    }

    if (data.startsWith("cancel_warn_")) {
    let warnedUserId = parseInt(data.split("_")[2]); // Ambil user ID
    console.log(warnedUserId);

    if (!warnDB[warnedUserId]) {
        return xy.answerCbQuery(callbackQuery.id, {
            text: "⚠️ Tidak ada peringatan yang bisa dibatalkan.",
            show_alert: true,
        });
    }

    warnDB[warnedUserId].pop(); // Hapus satu peringatan terakhir
    saveWarnDB(warnDB); // Simpan perubahan ke database

    let warnCount = warnDB[warnedUserId]?.length || 0; // Cek jumlah peringatan yang tersisa
    let targetNameMatch = callbackQuery.message.text.match(/⚠️\s(.*?) telah diperingatkan/);
    let targetName = targetNameMatch ? targetNameMatch[1] : "Pengguna"; // Ambil nama user dengan aman

    let updatedMsg = `⚠️ ${targetName} telah diperingatkan!\n📌 Total peringatan: ${warnCount}/3`;

    let replyMarkup = warnCount > 0 ? {
        inline_keyboard: [[{
            text: "❌ Batalkan Peringatan",
            callback_data: `cancel_warn_${warnedUserId}`
        }]]
    } : {};

    await xy.telegram.editMessageText(chatId, messageId, null, updatedMsg, {
        parse_mode: "Markdown",
        reply_markup: replyMarkup
    });

    return xy.answerCbQuery(callbackQuery.id, {
        text: "✅ Peringatan berhasil dibatalkan!",
        show_alert: true,
    });
}   

    // Fungsi helper untuk mendapatkan konfigurasi panel yang benar
    function getPanelConfigFromCallback(callbackData) {
      if (callbackData.includes('prvt')) {
        return {
          domain: global.domain_prvt,
          plta: global.plta_prvt,
          pltc: global.pltc_prvt,
          loc: global.loc_prvt,
          eggs: global.eggs_prvt,
          name: global.namabot_prvt
        };
      }
      return {
        domain: global.domain,
        plta: global.plta,
        pltc: global.pltc,
        loc: global.loc,
        eggs: global.eggs,
        name: global.namabot
      };
    }

    if (data.startsWith("listpanel")) {
      const panelConfig = getPanelConfigFromCallback(data);
      let halamanPanel = parseInt(data.split(" ")[1]) || 1;

      if (halamanPanel > 25) return;


      let response = await fetch(`${panelConfig.domain}/api/application/servers?page=${halamanPanel}&per_page=25`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${panelConfig.plta}`
        }
      });

      let hasil = await response.json();

      if (!response.ok || hasil.errors || !hasil.data || hasil.data.length === 0) {
        return xy.answerCbQuery("❌ Gagal memuat data dari panel ini.", {
          show_alert: true
        });
      }

      let daftarServer = `📡 *Daftar Server Aktif (${panelConfig.name}) (Halaman ${halamanPanel})* 📡\n`;
      daftarServer += "━━━━━━━━━━━━━━━━━━━━━━━\n";

      for (let server of hasil.data) {
        let info = server.attributes;
        daftarServer += `🆔 *Server ID*: \`${info.id}\`\n`;
        daftarServer += `🔹 *Nama Server*: ${info.name}\n`;
        daftarServer += "───────────────────────\n";
        }

        daftarServer += `📄 *Halaman*: ${hasil.meta.pagination.current_page}/${hasil.meta.pagination.total_pages}\n`;
        daftarServer += `📊 *Total Server Terdaftar*: ${hasil.meta.pagination.count}`;

        let buttons = [];
        const callbackBase = data.includes('_prvt') ? 'listpanel_prvt' : 'listpanel';

        if (hasil.meta.pagination.current_page < hasil.meta.pagination.total_pages && halamanPanel < 25) {
          buttons.push({
            text: "➡️ Halaman Berikutnya",
            callback_data: `${callbackBase} ${halamanPanel + 1}`
          });
        }
        if (halamanPanel > 1) {
          buttons.unshift({
            text: "⬅️ Halaman Sebelumnya",
            callback_data: `${callbackBase} ${halamanPanel - 1}`
          });
        }

        await xy.telegram.editMessageText(chatId, messageId, null, daftarServer, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: buttons.length > 0 ? [buttons] : []
          }
        })
        xy.answerCbQuery();
      }
    });

    let warningData = {}; // Data peringatan sementara (tanpa database)

    bot.on("message", async (xy) => {
      // Memuat ulang xy.js agar perubahan tercermin
      // Ini adalah cara yang tidak ideal untuk produksi produksi, tapi membantu dalam pengembangan
      delete require.cache[require.resolve('./xy')];
      const updatedXy = require('./xy');
      await updatedXy(xy, bot);

      const msg = xy.message;
      if (!msg.chat || !msg.chat.id || !msg.from || msg.from.is_bot) return;

      const chatId = msg.chat.id;
      const userId = msg.from.id;
      const messageText = msg.text || "";
      const entities = msg.entities || [];

      let antilinkStatus = false;
      try {
        let listData = JSON.parse(fs.readFileSync("./src/database/antilink.json", "utf8"));
        const groupData = listData.find((item) => item.id === chatId);
        if (groupData) {
          antilinkStatus = groupData.antilink;
        }
      } catch (error) {
        console.error("Gagal membaca database antilink:", error);
      }

      if (!antilinkStatus) return;

      let isAdmin = false;
      try {
        const chatAdmins = await xy.getChatAdministrators();
        isAdmin = chatAdmins.some((admin) => admin.user.id === userId);
      } catch (error) {
        console.error("Gagal mengambil daftar admin:", error);
      }

      if (isAdmin) return;

      let containsLink = /(https?:\/\/[^\s]+)/.test(messageText);

      for (let entity of entities) {
        if (entity.type === "text_link" || entity.type === "url") {
          containsLink = true;
          break;
        }
      }

      if (containsLink) {
        try {
          await xy.deleteMessage();

          if (!warningData[chatId]) warningData[chatId] = {};
          if (!warningData[chatId][userId]) warningData[chatId][userId] = 0;

          warningData[chatId][userId]++;

          if (warningData[chatId][userId] < 3) {
            xy.replyWithMarkdown(`⚠️ *Peringatan ${warningData[chatId][userId]}/3!* ${msg.from.first_name}, jangan kirim link!`);
          } else {
            const muteUntil = Math.floor(Date.now() / 1000) + 10800; // 3 jam dalam detik
            await xy.restrictChatMember(userId, {
              permissions: {
                can_send_messages: false,
                can_send_media_messages: false,
                can_send_polls: false,
                can_send_other_messages: false,
                can_add_web_page_previews: false,
              },
              until_date: muteUntil,
            });

            xy.replyWithMarkdown(`🚨 ${msg.from.first_name} telah mencapai 3 pelanggaran! Mereka telah di-mute selama 3 jam.`);

            warningData[chatId][userId] = 0;
          }
        } catch (error) {
          console.error("❌ Gagal menghapus pesan atau mute user:", error);
        }
      }
    });

    function getGroupSettings(groupID) {
      let listData = JSON.parse(fs.readFileSync("./src/database/weleave.json", "utf8"));
      let group = listData.find((item) => item.id === groupID);
      return group || {
        welcome: false,
        leave: false
      };
    }

    const spinner = ora({
      text: 'Menghubungkan bot...',
      spinner: 'bouncingBar'
    }).start();

    bot.launch()
      .catch((error) => {
        spinner.fail('Gagal menghubungkan bot.');
        console.error('Error:', error.message);
      });

    setTimeout(async () => {
      try {
        const botInfo = await bot.telegram.getMe();
        spinner.succeed(`Bot berhasil terhubung sebagai @${botInfo.username}`);
        console.log(`Nama Bot: ${botInfo.first_name}`);
        console.log(`Bot ID: ${botInfo.id}`);
      } catch (error) {
        console.error('Gagal mengambil info bot:', error.message);
      }
    }, 3000); // Tunda 3 detik setelah bot dijalankan

  }
  runBot();

  process.once('SIGINT', () => bot.stop('SIGINT'));
0
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
