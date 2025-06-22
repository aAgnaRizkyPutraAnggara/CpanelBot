// xy.js
require('./settings')
require('./index') // Memastikan index.js dijalankan terlebih dahulu untuk inisialisasi global.JHONALEY_CPANEL
require('./src/message')
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const {
  Client
} = require('ssh2');
const {
  exec
} = require('child_process');
const Tiktok = require("@tobyg74/tiktok-api-dl");
const {
  igdl
} = require('btch-downloader');
const yts = require('yt-search');
const ffmpeg = require('fluent-ffmpeg');
const pino = require("pino");
const ytdl = require('@distube/ytdl-core');
const {
  UploadFileUgu
} = require('./src/lib/uploader.js');
const {
  formatLog
} = require('./src/lib/logger')
const pinterest = require('./src/lib/pinterest');
const { createCanvas, registerFont } = require('canvas');
const Jimp = require('jimp');

module.exports = async (xy, bot, chatUpdate, store) => {
  try {
    const thumbnailPath = path.join(__dirname, "src/image/thumbnail.mp4");
    const paket = path.join(__dirname, 'src/image/paket.jpg'); // Variabel paket didefinisikan di sini

    const warnFile = path.join(__dirname, "./src/database/warns.json");

    const seller = JSON.parse(fs.readFileSync('./src/database/seller.json'));
    const sellerPath = './src/database/seller.json';
    let privateSeller = JSON.parse(fs.readFileSync('./src/database/private_seller.json')); // Load private seller data
    const privateSellerPath = './src/database/private_seller.json'; // Path for private seller data
    let publicPartner = JSON.parse(fs.readFileSync('./src/database/public_partner.json')); // Load public partner data
    const publicPartnerPath = './src/database/public_partner.json'; // Path for public partner data
    let privatePartner = JSON.parse(fs.readFileSync('./src/database/private_partner.json')); // Load private partner data
    const privatePartnerPath = './src/database/private_partner.json'; // Path for private partner data

    const owners = JSON.parse(fs.readFileSync('./owner.json', 'utf8'));
    const db_respon_list = JSON.parse(fs.readFileSync('./src/database/list.json'));
    const tokenPath = path.join(__dirname, './src/database/token.json');

    // MENGHAPUS: const { JHONALEY_CPANEL } = require('./index'); // Baris ini tidak diperlukan dan bisa menyebabkan masalah
    // Variabel global.JHONALEY_CPANEL akan tersedia secara otomatis setelah require('./index')
    
    const {
      addResponList1,
      delResponList1,
      isAlreadyResponList1,
      isAlreadyResponList1Group,
      sendResponList1,
      updateResponList1,
      getDataResponList1
    } = require('./src/lib/addlist');
    const {
      startWhatsAppSession,
      sessions,
      restoreWhatsAppSessions
    } = require("./src/lib/connectwa")

    async function getBuffer(url) {
      const res = await axios.get(url, {
        responseType: "arraybuffer"
      });
      return Buffer.from(res.data);
    }

    function readWarnDB() {
      if (!fs.existsSync(warnFile)) return {};
      return JSON.parse(fs.readFileSync(warnFile, "utf8"));
    }

    function saveWarnDB(data) {
      fs.writeFileSync(warnFile, JSON.stringify(data, null, 2));
    }

    let warnDB = readWarnDB();
    let pendingWarns = new Map();

    const sleep = async (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    function generateReadableString(length) {
      const words = ["sky", "cloud", "wind", "fire", "storm", "light", "wave", "stone", "shadow", "earth"];
      const randomWord = words[Math.floor(Math.random() * words.length)];
      const randomNumber = Math.floor(100 + Math.random() * 900); // 3-digit number
      return randomWord + randomNumber;
    }

    const prefix = '/'; // Variabel prefix didefinisikan di sini
    const userId = xy.message.from.id;
    const chatId = xy.message.chat.id;
    const message = xy.message.text;
    const userName = xy.message.from.first_name;

    const body = xy.message.text || xy.message.caption ||
      (xy.message.document ? xy.message.document.file_name : '') ||
      (xy.message.video ? xy.message.video.file_name : '') ||
      (xy.message.audio ? xy.message.audio.file_name : '') ||
      (xy.message.voice ? '[Voice Message]' : '') ||
      (xy.message.sticker ? '[Sticker]' : '') ||
      (xy.message.animation ? '[GIF]' : '');

    const command = body.startsWith(prefix) ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase() : "";
    const args = body.trim().split(/ +/).slice(1);
    const q = text = args.join(" ");

    const reply = (teks) => {
      xy.telegram.sendMessage(chatId, teks);
    };

    const isCmd = body.startsWith(prefix)
    if (!xy.telegram.botInfo) {
      xy.telegram.botInfo = await xy.telegram.getMe();
    }

    const isOwner = owners.includes(String(xy.message.from.id));
    const now = Date.now();

    const validSellers = seller.filter(s => s.expiresAt > now);
    const validPrivateSellers = privateSeller.filter(s => s.expiresAt > now); 
    const validPublicPartners = publicPartner.filter(p => p.expiresAt > now); 
    const validPrivatePartners = privatePartner.filter(p => p.expiresAt > now); 


    if (validSellers.length !== seller.length) {
      fs.writeFileSync(sellerPath, JSON.stringify(validSellers, null, 2));
    }
    if (validPrivateSellers.length !== privateSeller.length) { 
      fs.writeFileSync(privateSellerPath, JSON.stringify(validPrivateSellers, null, 2));
    }
    if (validPublicPartners.length !== publicPartner.length) { 
      fs.writeFileSync(publicPartnerPath, JSON.stringify(validPublicPartners, null, 2));
    }
    if (validPrivatePartners.length !== privatePartner.length) { 
      fs.writeFileSync(privatePartnerPath, JSON.stringify(validPrivatePartners, null, 2));
    }

    const isSeller = validSellers.some(item =>
      item.id === String(xy.message.from.id)
    );
    const isPrivateSeller = validPrivateSellers.some(item => 
        item.id === String(xy.message.from.id)
    );
    const isPublicPartner = validPublicPartners.some(item => 
        item.id === String(xy.message.from.id)
    );
    const isPrivatePartner = validPrivatePartners.some(item => 
        item.id === String(xy.message.from.id)
    );

    const isGroup = xy.message.chat.type.includes("group");

    const groupName = isGroup ? xy.message.chat.title : "";
    const groupId = isGroup ? xy.message.chat.id : "";
    const participants = isGroup ? await xy.getChatAdministrators() : [];
    const groupAdmins = participants.map(admin => admin.user.id);
    const isBotGroupAdmins = groupAdmins.includes(xy.telegram.botInfo.id) || false;
    const isGroupAdmins = groupAdmins.includes(xy.message.from.id) || false;

    if (isCmd) {
      console.log(formatLog(command, args, userName, userId, isGroup, groupName, groupId));
    }

    // Fungsi helper untuk mendapatkan konfigurasi panel yang benar
    function getPanelConfig(cmd) {
      if (cmd.endsWith('prvt')) {
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

    switch (command) {

      case "tes":
        xy.telegram.sendMessage(chatId, "Pesan yang dikirim");
        break

      case "restart": // Perintah restart asli
        if (!isOwner) return reply(mess.owner);
        reply("🔄 Restarting bot...");
        await sleep(1000); // Tunggu sebentar
        process.exit(1); // Memicu restart melalui run.js
        break;
      
      // MENGHAPUS: case "restartbot": // Command restartbot baru dengan password - DIHAPUS
      //   if (!isOwner) return reply(mess.owner);
      //   if (!text) return reply('📌 Masukkan kunci utama untuk me-restart bot.');
      //   // Menggunakan global.JHONALEY_CPANEL yang didefinisikan di index.js
      //   if (text === global.JHONALEY_CPANEL) { 
      //     reply("🔄 Memulai ulang bot...");
      //     await sleep(1000); 
      //     process.exit(1); 
      //   } else {
      //     reply('❌ Kunci utama salah!');
      //   }
      //   break;

      case "shutdown":
        if (!isOwner) return reply(mess.owner);

        reply("⚠️ Shutting down xy.telegram...");
        await sleep(3000);
        reply('Sukses')
        await sleep(3000);
        process.exit(); // Keluar dari terminal tanpa restart otomatis
        break;

      // Command untuk mengubah API key PLTA utama (public)
      case 'setapi':
        if (!isOwner) return reply(mess.owner);
        if (!text) return reply('📌 Masukkan API key PLTA yang baru.');
        global.plta = text;
        fs.writeFileSync('./settings.js', fs.readFileSync('./settings.js', 'utf8').replace(/global\.plta\s*=\s*['"].*?['"],/, `global.plta = '${text}',`));
        return reply('✅ API key PLTA utama berhasil diperbarui.');

      // Command untuk mengubah API key PLTC utama (public)
      case 'setcapi':
        if (!isOwner) return reply(mess.owner);
        if (!text) return reply('📌 Masukkan API key PLTC yang baru.');
        global.pltc = text;
        fs.writeFileSync('./settings.js', fs.readFileSync('./settings.js', 'utf8').replace(/global\.pltc\s*=\s*['"].*?['"],/, `global.pltc = '${text}',`));
        return reply('✅ API key PLTC utama berhasil diperbarui.');

      // Command untuk mengubah API key PLTA private
      case 'setapi_prvt':
        if (!isOwner) return reply(mess.owner);
        if (!text) return reply('📌 Masukkan API key PLTA private yang baru.');
        global.plta_prvt = text;
        fs.writeFileSync('./settings.js', fs.readFileSync('./settings.js', 'utf8').replace(/global\.plta_prvt\s*=\s*['"].*?['"],/, `global.plta_prvt = '${text}',`));
        return reply('✅ API key PLTA private berhasil diperbarui.');

      // Command untuk mengubah API key PLTC private
      case 'setcapi_prvt':
        if (!isOwner) return reply(mess.owner);
        if (!text) return reply('📌 Masukkan API key PLTC private yang baru.');
        global.pltc_prvt = text;
        fs.writeFileSync('./settings.js', fs.readFileSync('./settings.js', 'utf8').replace(/global\.pltc_prvt\s*=\s*['"].*?['"],/, `global.pltc_prvt = '${text}',`));
        return reply('✅ API key PLTC private berhasil diperbarui.');
      
      // Command untuk mengubah URL domain public
      case 'seturl':
        if (!isOwner) return reply(mess.owner);
        if (!text) return reply('📌 Masukkan URL domain public yang baru.');
        global.domain = text;
        fs.writeFileSync('./settings.js', fs.readFileSync('./settings.js', 'utf8').replace(/global\.domain\s*=\s*['"].*?['"],/, `global.domain = '${text}',`));
        return reply('✅ URL domain public berhasil diperbarui.');

      // Command untuk mengubah URL domain private
      case 'seturl_prvt':
        if (!isOwner) return reply(mess.owner);
        if (!text) return reply('📌 Masukkan URL domain private yang baru.');
        global.domain_prvt = text;
        fs.writeFileSync('./settings.js', fs.readFileSync('./settings.js', 'utf8').replace(/global\.domain_prvt\s*=\s*['"].*?['"],/, `global.domain_prvt = '${text}',`));
        return reply('✅ URL domain private berhasil diperbarui.');

        // --- Commands for CPanel 1 ---
      case "delusr":
      case "delsrv":
      case "listpanel":
      case "listusr":
      case "listadmin":
      case "1gb":
      case "2gb":
      case "3gb":
      case "4gb":
      case "5gb":
      case "6gb":
      case "7gb":
      case "8gb":
      case "9gb":
      case "10gb":
      case "unli":
      case "createadmin":
        // Fallthrough to handle standard commands with global config
        handlePanelCommands(command, text, xy, isOwner, isSeller, isPrivateSeller, isPublicPartner, isPrivatePartner, reply, getPanelConfig(command), paket, prefix);
        break;

        // --- Commands for CPanel 2 (Private) ---
      case "delusr_prvt":
      case "delsrv_prvt":
      case "listpanel_prvt":
      case "listusr_prvt":
      case "listadmin_prvt":
      case "1gb_prvt":
      case "2gb_prvt":
      case "3gb_prvt":
      case "4gb_prvt":
      case "5gb_prvt":
      case "6gb_prvt":
      case "7gb_prvt":
      case "8gb_prvt":
      case "9gb_prvt":
      case "10gb_prvt":
      case "unli_prvt":
      case "createadmin_prvt":
        handlePanelCommands(command, text, xy, isOwner, isSeller, isPrivateSeller, isPublicPartner, isPrivatePartner, reply, getPanelConfig(command), paket, prefix);
        break;

      case 'addseller':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('Penggunaan yang benar: \n/addseller ID_Telegram,durasi,waktu\n\nWaktu bisa menit,jam,hari dan bulan\n\nContoh: /addseller 272818828,1,jam');
        }

        let args_addseller = text.split(',');
        if (args_addseller.length !== 3) {
          return reply('Format salah! Gunakan: /addseller ID_Telegram,durasi,waktu\n\nWaktu bisa menit,jam,hari dan bulan\n\nContoh: /addseller 272818828,1,jam');
        }

        let userID_addseller = args_addseller[0];
        let duration_addseller = parseInt(args_addseller[1]);
        let timeUnit_addseller = args_addseller[2].toLowerCase();

        if (isNaN(duration_addseller) || duration_addseller <= 0) {
          return reply('Durasi harus berupa angka yang valid!');
        }

        let timeMultiplier = {
          'menit': 60 * 1000,
          'jam': 60 * 60 * 1000,
          'hari': 24 * 60 * 60 * 1000,
          'bulan': 30 * 24 * 60 * 60 * 1000
        };

        if (!timeMultiplier[timeUnit_addseller]) {
          return reply('Format waktu tidak valid! Gunakan: menit, jam, hari, atau bulan.');
        }

        let expiryTime = Date.now() + duration_addseller * timeMultiplier[timeUnit_addseller];

        let existingSeller = seller.find(s => s.id === userID_addseller);
        if (existingSeller) {
          return reply(`ID Telegram ${userID_addseller} sudah menjadi seller.`);
        }

        seller.push({
          id: userID_addseller,
          expiresAt: expiryTime
        });
        fs.writeFileSync('./src/database/seller.json', JSON.stringify(seller, null, 2));

        return reply(`ID Telegram ${userID_addseller} telah ditambahkan ke daftar seller selama ${duration_addseller} ${timeUnit_addseller}.`);

      case 'delseller':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('Penggunaan yang benar: \n/delseller ID_Telegram\n\n[Image of example]');
        }

        let index_delseller = seller.findIndex(s => s.id === text);
        if (index_delseller !== -1) {
          seller.splice(index_delseller, 1);
          fs.writeFileSync('./src/database/seller.json', JSON.stringify(seller, null, 2));
          return reply(`ID Telegram ${text} telah dihapus dari daftar seller.`);
        } else {
          return reply(`ID Telegram ${text} tidak ditemukan dalam daftar seller.`);
        }
        break;

      case 'listseller':
        if (!isOwner) return reply(mess.owner);
        if (seller.length === 0) {
          return reply('Belum ada seller yang terdaftar.');
        }

        let sellerList = [];

        for (let s of seller) {
          let remainingTime = s.expiresAt - Date.now();
          if (remainingTime <= 0) {
            seller = seller.filter(item => item.id !== s.id);
            fs.writeFileSync('./src/database/seller.json', JSON.stringify(seller, null, 2));
            continue;
          }

          let remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
          let remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

          let timeLeft = remainingHours > 0 ?
            `${remainingHours} jam ${remainingMinutes} menit` :
            `${remainingMinutes} menit`;

          try {
            let chat = await xy.telegram.getChat(s.id);
            let name = chat.first_name + (chat.last_name ? ' ' + chat.last_name : '');
            sellerList.push(`🆔 *ID:* ${s.id}\n👤 *Nama:* ${name}\n⏳ *Waktu Tersisa:* ${timeLeft}`);
          } catch (err) {
            sellerList.push(`🆔 *ID:* ${s.id}\n👤 *Nama:* Tidak ditemukan\n⏳ *Waktu Tersisa:* ${timeLeft}`);
          }
        }

        let message_listseller = `📜 *Daftar Seller:*\n\n${sellerList.join('\n\n')}`;
        return xy.telegram.sendMessage(chatId, message_listseller, {
          parse_mode: 'Markdown'
        });

        break;
      
      // New commands for Private Reseller management
      case 'addreseller_prvt':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('Penggunaan yang benar: \n/addreseller_prvt ID_Telegram,durasi,waktu\n\nWaktu bisa menit,jam,hari dan bulan\n\nContoh: /addreseller_prvt 272818828,1,jam');
        }

        let args_addprivateseller = text.split(',');
        if (args_addprivateseller.length !== 3) {
          return reply('Format salah! Gunakan: /addreseller_prvt ID_Telegram,durasi,waktu\n\nWaktu bisa menit,jam,hari dan bulan\n\nContoh: /addreseller_prvt 272818828,1,jam');
        }

        let userID_addprivateseller = args_addprivateseller[0];
        let duration_addprivateseller = parseInt(args_addprivateseller[1]);
        let timeUnit_addprivateseller = args_addprivateseller[2].toLowerCase();

        if (isNaN(duration_addprivateseller) || duration_addprivateseller <= 0) {
          return reply('Durasi harus berupa angka yang valid!');
        }

        let privateTimeMultiplier = {
          'menit': 60 * 1000,
          'jam': 60 * 60 * 1000,
          'hari': 24 * 60 * 60 * 1000,
          'bulan': 30 * 24 * 60 * 60 * 1000
        };

        if (!privateTimeMultiplier[timeUnit_addprivateseller]) {
          return reply('Format waktu tidak valid! Gunakan: menit, jam, hari, atau bulan.');
        }

        let privateExpiryTime = Date.now() + duration_addprivateseller * privateTimeMultiplier[timeUnit_addprivateseller];

        let existingPrivateSeller = privateSeller.find(s => s.id === userID_addprivateseller);
        if (existingPrivateSeller) {
          return reply(`ID Telegram ${userID_addprivateseller} sudah menjadi reseller private.`);
        }

        privateSeller.push({
          id: userID_addprivateseller,
          expiresAt: privateExpiryTime
        });
        fs.writeFileSync(privateSellerPath, JSON.stringify(privateSeller, null, 2));

        return reply(`ID Telegram ${userID_addprivateseller} telah ditambahkan ke daftar reseller private selama ${duration_addprivateseller} ${timeUnit_addprivateseller}.`);

      case 'delreseller_prvt':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('Penggunaan yang benar: \n/delreseller_prvt ID_Telegram\n\n[Image of example]');
        }

        let index_delprivateseller = privateSeller.findIndex(s => s.id === text);
        if (index_delprivateseller !== -1) {
          privateSeller.splice(index_delprivateseller, 1);
          fs.writeFileSync(privateSellerPath, JSON.stringify(privateSeller, null, 2));
          return reply(`ID Telegram ${text} telah dihapus dari daftar reseller private.`);
        } else {
          return reply(`ID Telegram ${text} tidak ditemukan dalam daftar reseller private.`);
        }
        break;

      case 'listreseller_prvt':
        if (!isOwner) return reply(mess.owner);
        if (privateSeller.length === 0) {
          return reply('Belum ada reseller private yang terdaftar.');
        }

        let privateSellerList = [];

        for (let s of privateSeller) {
          let remainingTime = s.expiresAt - Date.now();
          if (remainingTime <= 0) {
            privateSeller = privateSeller.filter(item => item.id !== s.id);
            fs.writeFileSync(privateSellerPath, JSON.stringify(privateSeller, null, 2));
            continue;
          }

          let remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
          let remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

          let timeLeft = remainingHours > 0 ?
            `${remainingHours} jam ${remainingMinutes} menit` :
            `${remainingMinutes} menit`;

          try {
            let chat = await xy.telegram.getChat(s.id);
            let name = chat.first_name + (chat.last_name ? ' ' + chat.last_name : '');
            privateSellerList.push(`🆔 *ID:* ${s.id}\n👤 *Nama:* ${name}\n⏳ *Waktu Tersisa:* ${timeLeft}`);
          } catch (err) {
            privateSellerList.push(`🆔 *ID:* ${s.id}\n👤 *Nama:* Tidak ditemukan\n⏳ *Waktu Tersisa:* ${timeLeft}`);
          }
        }

        let message_listprivateseller = `📜 *Daftar Reseller Private:*\n\n${privateSellerList.join('\n\n')}`;
        return xy.telegram.sendMessage(chatId, message_listprivateseller, {
          parse_mode: 'Markdown'
        });

        break;

      // New commands for Public Partner management
      case 'addpartner':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('Penggunaan yang benar: \n/addpartner ID_Telegram,durasi,waktu\n\nWaktu bisa menit,jam,hari dan bulan\n\nContoh: /addpartner 272818828,1,jam');
        }

        let args_addpublicpartner = text.split(',');
        if (args_addpublicpartner.length !== 3) {
          return reply('Format salah! Gunakan: /addpartner ID_Telegram,durasi,waktu\n\nWaktu bisa menit,jam,hari dan bulan\n\nContoh: /addpartner 272818828,1,jam');
        }

        let userID_addpublicpartner = args_addpublicpartner[0];
        let duration_addpublicpartner = parseInt(args_addpublicpartner[1]);
        let timeUnit_addpublicpartner = args_addpublicpartner[2].toLowerCase();

        if (isNaN(duration_addpublicpartner) || duration_addpublicpartner <= 0) {
          return reply('Durasi harus berupa angka yang valid!');
        }

        let publicPartnerTimeMultiplier = {
          'menit': 60 * 1000,
          'jam': 60 * 60 * 1000,
          'hari': 24 * 60 * 60 * 1000,
          'bulan': 30 * 24 * 60 * 60 * 1000
        };

        if (!publicPartnerTimeMultiplier[timeUnit_addpublicpartner]) {
          return reply('Format waktu tidak valid! Gunakan: menit, jam, hari, atau bulan.');
        }

        let publicPartnerExpiryTime = Date.now() + duration_addpublicpartner * publicPartnerTimeMultiplier[timeUnit_addpublicpartner];

        let existingPublicPartner = publicPartner.find(p => p.id === userID_addpublicpartner);
        if (existingPublicPartner) {
          return reply(`ID Telegram ${userID_addpublicpartner} sudah menjadi partner publik.`);
        }

        publicPartner.push({
          id: userID_addpublicpartner,
          expiresAt: publicPartnerExpiryTime
        });
        fs.writeFileSync(publicPartnerPath, JSON.stringify(publicPartner, null, 2));

        return reply(`ID Telegram ${userID_addpublicpartner} telah ditambahkan ke daftar partner publik selama ${duration_addpublicpartner} ${timeUnit_addpublicpartner}.`);

      case 'delpartner':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('Penggunaan yang benar: \n/delpartner ID_Telegram\n\n[Image of example]');
        }

        let index_delpublicpartner = publicPartner.findIndex(p => p.id === text);
        if (index_delpublicpartner !== -1) {
          publicPartner.splice(index_delpublicpartner, 1);
          fs.writeFileSync(publicPartnerPath, JSON.stringify(publicPartner, null, 2));
          return reply(`ID Telegram ${text} telah dihapus dari daftar partner publik.`);
        } else {
          return reply(`ID Telegram ${text} tidak ditemukan dalam daftar partner publik.`);
        }
        break;

      case 'listpartner':
        if (!isOwner) return reply(mess.owner);
        if (publicPartner.length === 0) {
          return reply('Belum ada partner publik yang terdaftar.');
        }

        let publicPartnerList = [];

        for (let p of publicPartner) {
          let remainingTime = p.expiresAt - Date.now();
          if (remainingTime <= 0) {
            publicPartner = publicPartner.filter(item => item.id !== p.id);
            fs.writeFileSync(publicPartnerPath, JSON.stringify(publicPartner, null, 2));
            continue;
          }

          let remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
          let remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

          let timeLeft = remainingHours > 0 ?
            `${remainingHours} jam ${remainingMinutes} menit` :
            `${remainingMinutes} menit`;

          try {
            let chat = await xy.telegram.getChat(p.id);
            let name = chat.first_name + (chat.last_name ? ' ' + chat.last_name : '');
            publicPartnerList.push(`🆔 *ID:* ${p.id}\n👤 *Nama:* ${name}\n⏳ *Waktu Tersisa:* ${timeLeft}`);
          } catch (err) {
            publicPartnerList.push(`🆔 *ID:* ${p.id}\n👤 *Nama:* Tidak ditemukan\n⏳ *Waktu Tersisa:* ${timeLeft}`);
          }
        }

        let message_listpublicpartner = `📜 *Daftar Partner Publik:*\n\n${publicPartnerList.join('\n\n')}`;
        return xy.telegram.sendMessage(chatId, message_listpublicpartner, {
          parse_mode: 'Markdown'
        });

        break;

      // New commands for Private Partner management
      case 'addpartner_prvt':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('Penggunaan yang benar: \n/addpartner_prvt ID_Telegram,durasi,waktu\n\nWaktu bisa menit,jam,hari dan bulan\n\nContoh: /addpartner_prvt 272818828,1,jam');
        }

        let args_addprivatepartner = text.split(',');
        if (args_addprivatepartner.length !== 3) {
          return reply('Format salah! Gunakan: /addpartner_prvt ID_Telegram,durasi,waktu\n\nWaktu bisa menit,jam,hari dan bulan\n\nContoh: /addpartner_prvt 272818828,1,jam');
        }

        let userID_addprivatepartner = args_addprivatepartner[0];
        let duration_addprivatepartner = parseInt(args_addprivatepartner[1]);
        let timeUnit_addprivatepartner = args_addprivatepartner[2].toLowerCase();

        if (isNaN(duration_addprivatepartner) || duration_addprivatepartner <= 0) {
          return reply('Durasi harus berupa angka yang valid!');
        }

        let privatePartnerTimeMultiplier = {
          'menit': 60 * 1000,
          'jam': 60 * 60 * 1000,
          'hari': 24 * 60 * 60 * 1000,
          'bulan': 30 * 24 * 60 * 60 * 1000
        };

        if (!privatePartnerTimeMultiplier[timeUnit_addprivatepartner]) {
          return reply('Format waktu tidak valid! Gunakan: menit, jam, hari, atau bulan.');
        }

        let privatePartnerExpiryTime = Date.now() + duration_addprivatepartner * privatePartnerTimeMultiplier[timeUnit_addprivatepartner];

        let existingPrivatePartnerEntry = privatePartner.find(p => p.id === userID_addprivatepartner);
        if (existingPrivatePartnerEntry) {
          return reply(`ID Telegram ${userID_addprivatepartner} sudah menjadi partner private.`);
        }

        privatePartner.push({
          id: userID_addprivatepartner,
          expiresAt: privatePartnerExpiryTime
        });
        fs.writeFileSync(privatePartnerPath, JSON.stringify(privatePartner, null, 2));

        return reply(`ID Telegram ${userID_addprivatepartner} telah ditambahkan ke daftar partner private selama ${duration_addprivatepartner} ${timeUnit_addprivatepartner}.`);

      case 'delpartner_prvt':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('Penggunaan yang benar: \n/delpartner_prvt ID_Telegram\n\n[Image of example]');
        }

        let index_delprivatepartner = privatePartner.findIndex(p => p.id === text);
        if (index_delprivatepartner !== -1) {
          privatePartner.splice(index_delprivatepartner, 1);
          fs.writeFileSync(privatePartnerPath, JSON.stringify(privatePartner, null, 2));
          return reply(`ID Telegram ${text} telah dihapus dari daftar partner private.`);
        } else {
          return reply(`ID Telegram ${text} tidak ditemukan dalam daftar partner private.`);
        }
        break;

      case 'listpartner_prvt':
        if (!isOwner) return reply(mess.owner);
        if (privatePartner.length === 0) {
          return reply('Belum ada partner private yang terdaftar.');
        }

        let privatePartnerList = [];

        for (let p of privatePartner) {
          let remainingTime = p.expiresAt - Date.now();
          if (remainingTime <= 0) {
            privatePartner = privatePartner.filter(item => item.id !== p.id);
            fs.writeFileSync(privatePartnerPath, JSON.stringify(privatePartner, null, 2));
            continue;
          }

          let remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
          let remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

          let timeLeft = remainingHours > 0 ?
            `${remainingHours} jam ${remainingMinutes} menit` :
            `${remainingMinutes} menit`;

          try {
            let chat = await xy.telegram.getChat(p.id);
            let name = chat.first_name + (chat.last_name ? ' ' + chat.last_name : '');
            privatePartnerList.push(`🆔 *ID:* ${p.id}\n👤 *Nama:* ${name}\n⏳ *Waktu Tersisa:* ${timeLeft}`);
          } catch (err) {
            privatePartnerList.push(`🆔 *ID:* ${p.id}\n👤 *Nama:* Tidak ditemukan\n⏳ *Waktu Tersisa:* ${timeLeft}`);
          }
        }

        let message_listprivatepartner = `📜 *Daftar Partner Private:*\n\n${privatePartnerList.join('\n\n')}`;
        return xy.telegram.sendMessage(chatId, message_listprivatepartner, {
          parse_mode: 'Markdown'
        });

        break;

      case 'addowner':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('📌 Penggunaan yang benar:\n/addowner ID_Telegram\n(ID harus berupa angka).');
        }

        if (owners.includes(text)) {
          return reply(`⚠️ ID Telegram ${text} sudah menjadi Owner.`);
        } else {
          owners.push(text);
          fs.writeFileSync('./owner.json', JSON.stringify(owners));
          return reply(`✅ ID Telegram ${text} telah ditambahkan ke daftar Owner!`);
        }
        break;

      case 'delowner':
        if (!isOwner) return reply(mess.owner);
        if (!text) {
          return reply('📌 Penggunaan:\n/delowner ID_Telegram\n[Image of example]');
        }

        const index1 = owners.indexOf(text);
        if (index1 !== -1) {
          owners.splice(index1, 1);
          fs.writeFileSync('./owner.json', JSON.stringify(owners));
          return reply(`✅ ID Telegram ${text} telah dihapus dari daftar Owner.`);
        } else {
          return reply(`⚠️ ID Telegram ${text} tidak ditemukan dalam daftar Owner.`);
        }
        break;

      case 'listowner':
        if (!isOwner) return reply(mess.owner);
        if (owners.length === 0) {
          return reply('🚫 Belum ada Owner yang terdaftar.');
        }

        let ownerList = [];

        for (let id of owners) {
          try {
            let chat = await xy.telegram.getChat(id);
            let name = chat.first_name + (chat.last_name ? ' ' + chat.last_name : '');
            ownerList.push(`🆔 *ID:* ${id}\n👑 *Nama:* ${name}`);
          } catch (err) {
            ownerList.push(`🆔 *ID:* ${id}\n👑 *Nama:* Tidak ditemukan`);
          }
        }

        let message1 = `📜 *Daftar Owner:*\n\n${ownerList.join('\n\n')}`;
        return xy.telegram.sendMessage(chatId, message1, {
          parse_mode: 'Markdown'
        });

        break;

      case 'cekidtele':
        const replyToMessage = xy.message.reply_to_message;
        if (replyToMessage && replyToMessage.forward_from) {
          const forwardedUserId = replyToMessage.forward_from.id;
          return reply(`ID Telegram pengguna yang meneruskan pesan ini adalah: ${forwardedUserId}`);
        } else if (replyToMessage) {
          return reply('🚫 Harap gunakan pesan yang diteruskan dari orang lain. Jika mau dapatkan id orang');
        } else {
          return reply(`ID Telegram Anda adalah: ${userId}`);
        }
        break;

      case 'qris':
        const qrImageUrl = 'src/image/qris.jpg'; // Gambar QRIS
        const qrisCaption = '📲 Ini adalah QRIS untuk pembayaran. Silakan scan!';

        await xy.telegram.sendPhoto(chatId, {
          source: qrImageUrl
        }, {
          caption: qrisCaption
        });
        break;


      case 'changeqris':
        if (!isOwner) return reply(mess.owner);
        if (xy.message.photo) {
          const photoId = xy.message.photo[xy.message.photo.length - 1].file_id;

          xy.telegram.getFileLink(photoId)
            .then((fileLink) => {
              const fs = require('fs');
              const https = require('https');
              const path = './src/image/qris.jpg'; // Gambar QRIS yang lama

              https.get(fileLink, (response) => {
                const fileStream = fs.createWriteStream(path);
                response.pipe(fileStream);

                fileStream.on('finish', () => {
                  fileStream.close();

                  xy.telegram.sendPhoto(chatId, {
                    source: path
                  }, {
                    caption: `📸 QRIS telah diperbarui. Silakan scan!`
                  });
                });
              });
            })
            .catch((error) => {
              console.log('Error downloading user image:', error);
            });
        } else {
          xy.telegram.sendMessage(chatId, 'Harap kirimkan gambar untuk mengganti QRIS!');
        }
        break;

      case 'tourl': {
        if (!xy.message.reply_to_message || (!xy.message.reply_to_message.photo && !xy.message.reply_to_message.video)) {
          return reply(`📌 *Reply gambar atau video dengan caption* \`${prefix + command}\``);
        }

        let fileId = xy.message.reply_to_message.photo ?
          xy.message.reply_to_message.photo[xy.message.reply_to_message.photo.length - 1].file_id :
          xy.message.reply_to_message.video.file_id;

        try {
          let file = await xy.telegram.getFile(fileId);
          let fileUrl = `https://api.telegram.org/file/bot${xy.telegram.token}/${file.file_path}`;

          let filePath = path.join(__dirname, path.basename(file.file_path));

          let response = await axios({
            url: fileUrl,
            responseType: 'stream'
          });

          let writer = fs.createWriteStream(filePath);
          response.data.pipe(writer);

          writer.on('finish', async () => {
            try {
              let uploaded = await UploadFileUgu(filePath);
              reply(`✅ *Berhasil diunggah!*\n🔗 *URL:* ${uploaded.url}`);
              fs.unlinkSync(filePath); // Hapus file setelah upload
            } catch (uploadError) {
              reply(`❌ Gagal mengunggah file.`);
              console.error(uploadError);
            }
          });

          writer.on('error', (err) => {
            reply(`❌ Gagal menyimpan file.`);
            console.error(err);
          });

        } catch (err) {
          reply(`❌ Gagal mengambil file dari Telegram.`);
          console.error(err);
        }
      }
      break;

      case 'sticker': {
        if (!xy.message.reply_to_message ||
          (!xy.message.reply_to_message.photo && !xy.message.reply_to_message.video)) {
          return reply(`📌 *Reply gambar atau video dengan perintah* \`${prefix + command}\``);
        }

        let fileId, isVideo = false;

        if (xy.message.reply_to_message.photo) {
          fileId = xy.message.reply_to_message.photo[xy.message.reply_to_message.photo.length - 1].file_id;
        } else if (xy.message.reply_to_message.video) {
          fileId = xy.message.reply_to_message.video.file_id;
          isVideo = true;
        }

        try {
          let file = await xy.telegram.getFile(fileId);

          if (!file.file_path) {
            return reply(`❌ Gagal mengambil file dari Telegram. file_path tidak ditemukan.`);
          }

          let fileUrl = `https://api.telegram.org/file/bot${xy.telegram.token}/${file.file_path}`;
          let inputPath = path.join(__dirname, path.basename(file.file_path));
          let outputPath = inputPath.replace(/\.[^/.]+$/, isVideo ? ".webm" : ".webp");

          let response = await axios({
            url: fileUrl,
            responseType: 'stream'
          });

          let writer = fs.createWriteStream(inputPath);
          response.data.pipe(writer);

          writer.on('finish', async () => {
            if (isVideo) {
              exec(`ffmpeg -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease" -c:v libvpx-vp9 -b:v 500k -an "${outputPath}"`, async (err) => {
                if (err) {
                  console.error(err);
                  return reply(`❌ Gagal mengonversi video ke stiker.`);
                }

                await xy.telegram.sendSticker(chatId, {
                  source: outputPath
                });

                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
              });

            } else {
              exec(`ffmpeg -i "${inputPath}" -vf "scale=512:512:force_original_aspect_ratio=decrease" -qscale 50 "${outputPath}"`, async (err) => {
                if (err) {
                  console.error(err);
                  return reply(`❌ Gagal mengonversi gambar ke stiker.`);
                }

                await xy.telegram.sendSticker(chatId, {
                  source: outputPath
                });

                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
              });
            }
          });

          writer.on('error', (err) => {
            console.error(err);
            reply(`❌ Gagal menyimpan file dari Telegram.`);
          });

        } catch (err) {
          console.error(err);
          reply(`❌ Gagal mengambil file dari Telegram.`);
        }
      }
      break;

      case 'toimage':
      case 'toimg': {
        if (!xy.message.reply_to_message || !xy.message.reply_to_message.sticker) {
          return reply(`📌 *Reply stiker dengan perintah* \`${prefix + command}\``);
        }

        let fileId = xy.message.reply_to_message.sticker.file_id;

        try {
          let file = await xy.telegram.getFile(fileId);

          if (!file.file_path) {
            return reply(`❌ Gagal mengambil file dari Telegram. file_path tidak ditemukan.`);
          }

          let fileUrl = `https://api.telegram.org/file/bot${xy.telegram.token}/${file.file_path}`;
          let inputPath = path.join(__dirname, path.basename(file.file_path));
          let outputPath = inputPath.replace(".webp", ".png"); // Ubah ke PNG

          let response = await axios({
            url: fileUrl,
            responseType: 'stream'
          });

          let writer = fs.createWriteStream(inputPath);
          response.data.pipe(writer);

          writer.on('finish', async () => {
            exec(`ffmpeg -i "${inputPath}" "${outputPath}"`, async (err) => {
              fs.unlinkSync(inputPath);

              if (err) {
                console.error(err);
                return reply(`❌ Gagal mengonversi stiker ke gambar.`);
              }

              await xy.telegram.sendPhoto(chatId, {
                source: outputPath
              }, {
                caption: "✅ *Berhasil dikonversi ke gambar!*"
              });

              fs.unlinkSync(outputPath);
            });
          });

          writer.on('error', (err) => {
            console.error(err);
            reply(`❌ Gagal menyimpan file dari Telegram.`);
          });

        } catch (err) {
          console.error(err);
          reply(`❌ Gagal mengambil stiker dari Telegram.`);
        }
      }
      break;

      case 'tovideo': {
        if (!xy.message.reply_to_message || !xy.message.reply_to_message.sticker) {
          return reply(`📌 *Reply stiker dengan perintah* \`${prefix + command}\``);
        }

        let fileId = xy.message.reply_to_message.sticker.file_id;
        let isAnimated = xy.message.reply_to_message.sticker.is_animated;
        let isVideoSticker = xy.message.reply_to_message.sticker.is_video;

        try {
          let file = await xy.telegram.getFile(fileId);

          if (!file.file_path) {
            return reply(`❌ Gagal mengambil file dari Telegram. file_path tidak ditemukan.`);
          }

          let fileUrl = `https://api.telegram.org/file/bot${xy.telegram.token}/${file.file_path}`;

          let ext = file.file_path.endsWith('.webm') ? '.webm' : '.webp';
          let inputPath = path.join(__dirname, `sticker${ext}`);
          let outputPath = inputPath.replace(ext, ".mp4"); // Ubah ke MP4

          let response = await axios({
            url: fileUrl,
            responseType: 'stream'
          });

          let writer = fs.createWriteStream(inputPath);
          response.data.pipe(writer);

          writer.on('finish', async () => {
            exec(`ffmpeg -i "${inputPath}" -movflags faststart -pix_fmt yuv420p -vf "scale=512:512:force_original_aspect_ratio=decrease" "${outputPath}"`, async (err) => {
              fs.unlinkSync(inputPath);

              if (err) {
                console.error(err);
                return reply(`❌ Gagal mengonversi stiker ke video.`);
              }

              await xy.telegram.sendVideo(chatId, {
                source: outputPath
              }, {
                caption: "✅ *Berhasil dikonversi ke video!*"
              });

              fs.unlinkSync(outputPath);
            });
          });

          writer.on('error', (err) => {
            console.error(err);
            reply(`❌ Gagal menyimpan file dari Telegram.`);
          });

        } catch (err) {
          console.error(err);
          reply(`❌ Gagal mengambil stiker dari Telegram.`);
        }
      }
      break;

      case "installtemastellar": {
        if (!isOwner) return reply(`❌ *Hanya owner yang bisa menggunakan perintah ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format salah!*\n\nGunakan:\n/installtemastellar ipvps,pwvps\n\n[Image of example]`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai instalasi tema Stellar di VPS ${ipvps}...*`);

          ssh.exec(`bash <(curl -s https://raw.githubusercontent.com/XieTyyOfc/themeinstaller/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal menjalankan perintah install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("xietyofc\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("1\n"); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Stellar berhasil diinstall di VPS ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *IP atau password VPS salah!*`);
        }).connect(connSettings);
      }
      break;

      case "installtemadarknate": {
        if (!isOwner) return reply(`❌ *Hanya owner yang bisa menggunakan perintah ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format salah!*\n\nGunakan:\n/installtemadarknate ipvps,pwvps\n\n[Image of example]`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai instalasi tema Darknate di VPS ${ipvps}...*`);

          ssh.exec(`bash <(curl -s https://raw.githubusercontent.com/XieTyyOfc/themeinstaller/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal menjalankan perintah install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("xietyofc\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("2\n"); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Darknate berhasil diinstall di VPS ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *IP atau password VPS salah!*`);
        }).connect(connSettings);
      }
      break;

      case "installtemaenigma": {
        if (!isOwner) return reply(`❌ *Hanya owner yang bisa menggunakan perintah ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format salah!*\n\nGunakan:\n/installtemaenigma ipvps,pwvps,linkmedsos\n\n[Image of example]`);
        }

        let [ipvps, passwd, linkmed] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai instalasi tema Enigma di VPS ${ipvps}...*`);

          ssh.exec(`bash <(curl -s https://raw.githubusercontent.com/XieTyyOfc/themeinstaller/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal menjalankan perintah install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("xietyofc\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("3\n"); // Pilih Stellar
              }

              if (output.includes("Masukkan Link Nomor Telegram/Whatsapp:")) {
                stream.write(`${linkmed}\n`); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Enigma berhasil diinstall di VPS ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *IP atau password VPS salah!*`);
        }).connect(connSettings);
      }
      break;

      case "installtemabilling": {
        if (!isOwner) return reply(`❌ *Hanya owner yang bisa menggunakan perintah ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format salah!*\n\nGunakan:\n/installtemabilling ipvps,pwvps\n\n[Image of example]`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai instalasi tema Billing di VPS ${ipvps}...*`);

          ssh.exec(`bash <(curl -s https://raw.githubusercontent.com/XieTyyOfc/themeinstaller/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal menjalankan perintah install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("xietyofc\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("4\n"); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Billing berhasil diinstall di VPS ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *IP atau password VPS salah!*`);
        }).connect(connSettings);
      }
      break;

      case "installtemaiceminecraft": {
        if (!isOwner) return reply(`❌ *Hanya owner yang bisa menggunakan perintah ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format salah!*\n\nGunakan:\n/installtemaiceminecraft ipvps,pwvps\n\n[Image of example]`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai instalasi tema IceMinecraft di VPS ${ipvps}...*`);

          ssh.exec(`bash <(curl -s https://raw.githubusercontent.com/XieTyyOfc/themeinstaller/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal menjalankan perintah install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("xietyofc\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("5\n"); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema IceMinecraft berhasil diinstall di VPS ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *IP atau password VPS salah!*`);
        }).connect(connSettings);
      }
      break;

      case "installtemanook": {
        if (!isOwner) return reply(`❌ *Hanya owner yang bisa menggunakan perintah ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format salah!*\n\nGunakan:\n/installtemanook ipvps,pwvps\n\n[Image of example]`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai instalasi tema Nook di VPS ${ipvps}...*`);

          ssh.exec(`bash <(curl -s https://raw.githubusercontent.com/XieTyyOfc/themeinstaller/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal menjalankan perintah install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("xietyofc\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("6\n"); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Nook berhasil diinstall di VPS ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *IP atau password VPS salah!*`);
        }).connect(connSettings);
      }
      break;

      case "installtemanightcore": {
        if (!isOwner) return reply(`❌ *Hanya owner yang bisa menggunakan perintah ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format salah!*\n\nGunakan:\n/installtemanightcore ipvps,pwvps\n\n[Image of example]`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Memulai instalasi tema Nightcore di VPS ${ipvps}...*`);

          ssh.exec(`bash <(curl -s https://raw.githubusercontent.com/XieTyyOfc/themeinstaller/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal menjalankan perintah install!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("xietyofc\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("1\n"); // Pilih install
              }

              if (output.includes("Pilih tema yang ingin diinstall:")) {
                stream.write("7\n"); // Pilih Stellar
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema Nightcore berhasil diinstall di VPS ${ipvps}!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *IP atau password VPS salah!*`);
        }).connect(connSettings);
      }
      break;

      case "uninstalltema": {
        if (!isOwner) return reply(`❌ *Hanya owner yang bisa menggunakan perintah ini!*`);

        if (!text || text.split(",").length < 2) {
          return reply(`❌ *Format salah!*\n\nGunakan:\n/uninstalltema ipvps,pwvps\n\n[Image of example]`);
        }

        let [ipvps, passwd] = text.split(",").map(a => a.trim());

        const connSettings = {
          host: ipvps,
          port: 22,
          username: 'root',
          password: passwd
        };

        const ssh = new Client();
        ssh.on('ready', () => {
          reply(`🔄 *Menghapus tema di VPS ${ipvps}...*`);

          ssh.exec(`bash <(curl -s https://raw.githubusercontent.com/XieTyyOfc/themeinstaller/master/install.sh)`, (err, stream) => {
            if (err) return reply(`❌ *Gagal menjalankan perintah uninstall!*`);

            stream.on('data', (data) => {
              const output = data.toString().trim();
              console.log(`STDOUT: ${output}`);

              if (output.includes("Masukkan token:")) {
                stream.write("xietyofc\n");
              }

              if (output.includes("Pilih aksi:")) {
                stream.write("2\n"); // Pilih uninstall
              }
            });

            stream.on('close', () => {
              ssh.end();
              reply(`✅ *Tema berhasil dihapus dari VPS ${ipvps}, panel kembali ke default!*`);
            });

            stream.stderr.on('data', (data) => {
              console.log(`STDERR: ${data}`);
            });
          });
        }).on('error', (err) => {
          console.log(`Connection Error: ${err}`);
          reply(`❌ *IP atau password VPS salah!*`);
        }).connect(connSettings);
      }
      break;

      case "ai": {
        if (!text) return reply(`❌ *Format salah!*\n\nGunakan:\n/ai <pertanyaan>\n\n[Image of example]`);

        const query = encodeURIComponent(text);

        const url = `https://www.gravinity.my.id/query.php?query=${query}`;

        const axios = require('axios');
        axios.get(url)
          .then(response => {
            const data = response.data;

            if (data && data.data) {
              reply(data.data);
            } else {
              reply(`❌ *Gagal mendapatkan respons dari AI!*`);
            }
          })
          .catch(error => {
            console.log(`Error: ${error}`);
            reply(`❌ *Terjadi kesalahan saat menghubungi AI!*`);
          });
      }
      break;

      case 'connect':
        if (!isOwner) return reply(mess.owner);
        if (!text[0]) return reply('Gunakan: /connect nomor_telepon');

        const number = text; // Ambil angka dari argumen pertama
        if (sessions.has(number)) return reply(`WhatsApp ${number} sudah terhubung.`);

        xy.telegram.sendMessage(chatId, `🔄 Memulai koneksi ke WhatsApp ${number}...`)
          .then((sentMessage) => {
            connectwa.startWhatsAppSession(number, chatId, sentMessage.message_id)
              .then(() => xy.telegram.sendMessage(chatId, `✅ Proses koneksi ke WhatsApp ${number} sedang berjalan.`))
              .catch((err) => xy.telegram.sendMessage(chatId, `❌ Gagal menghubungkan WhatsApp ${number}: ${err.message}`));
          });

        break;

      case 'send':
        if (!isOwner) return reply(mess.owner);
        if (text.length < 2) return reply('Gunakan: /send nomor_tujuan, teks_pesan');

        let [targetNumber, textMessage] = text.split(",").map(a => a.trim());
        targetNumber = targetNumber.replace(/\D/g, ''); // Bersihkan nomor tujuan

        console.log("DEBUG: Sesi setelah restore:", [...sessions.keys()]);

        console.log("DEBUG: Sesi berhasil disimpan di Map:", [...sessions.keys()]);

        if (!targetNumber) return reply('Nomor tujuan tidak valid.');
        if (!textMessage) return reply('Pesan tidak boleh kosong.');
        if (sessions.size === 0) return reply('Tidak ada sesi WhatsApp yang aktif.');

        const sessionNumber = Array.from(sessions.keys())[0];
        const waClient = sessions.get(sessionNumber);

        if (!waClient) return reply(`Sesi WhatsApp ${sessionNumber} tidak ditemukan.`);

        try {
          const jid = targetNumber.includes("@") ? targetNumber : `${targetNumber}@s.whatsapp.net`;
          await waClient.sendMessage(jid, {
            text: textMessage
          });
          reply(`✅ Pesan berhasil dikirim ke ${targetNumber} menggunakan sesi ${sessionNumber}`);
        } catch (error) {
          console.error(`⚠️ Gagal mengirim pesan ke ${targetNumber}:`, error);
          reply(`❌ Gagal mengirim pesan ke ${targetNumber}. Error: ${error.message}`);
        }
        break;

      case 'addlist':
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
        if (!text.includes("@")) return reply(`_Cara Addlist Dengan Benar_\n\n/addlist Namalist@isilist\n\nLakukan Dengan Benar Jangan Sampai Salah\n\nAtau bisa juga dengan mengirim gambar dengan caption: /${command} tes@apa`);

        let [text1, text2] = text.split("@").map(a => a.trim());

        if (isAlreadyResponList1(chatId, text1, db_respon_list)) {
          return reply(`❌ List respon dengan key: *${text1}* sudah ada di grup ini.`);
        }

        if (xy.message.photo) {
          try {
            let fileId = xy.message.photo[xy.message.photo.length - 1].file_id;

            let fileUrl = await xy.telegram.getFileLink(fileId);

            addResponList1(chatId, text1, text2, true, fileUrl, db_respon_list);
            reply(`✅ Berhasil menambah List menu dengan gambar: *${text1}*`);
          } catch (error) {
            console.error("❌ Gagal mengambil gambar:", error);
            return reply("⚠️ Terjadi kesalahan saat mengambil gambar dari Telegram.");
          }
        } else {
          addResponList1(chatId, text1, text2, false, '-', db_respon_list);
          reply(`✅ Berhasil menambah List menu: *${text1}*`);
        }
        break;

      case 'list':
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (db_respon_list.length === 0) return reply(`Belum ada list message di database/group ini.`);

        let filteredList = db_respon_list.filter(item => item.id === chatId);
        if (filteredList.length === 0) return reply(`Belum ada list message terdaftar di grup ini.`);

        let buttons = filteredList.map(item => [{
          text: `🛍️ ${item.key}`,
          callback_data: `list_${chatId}_${item.key}`
        }]);

        xy.telegram.sendMessage(chatId, `📋 *List Menu di Grup Ini* 📋\nSilakan pilih salah satu dari list di bawah ini:`, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: buttons
          }
        });
        break;

      case 'dellist': {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!text) return reply(`_Cara Delete List_\n\n.dellist [Nama List Yg Ingin Dihapus]\n\n[Image of example]`);

        if (db_respon_list.length === 0) return reply(`Belum ada list message di database.`);

        let index = db_respon_list.findIndex(item => item.id === chatId && item.key === text);
        if (index === -1) return reply(`List dengan nama "${text}" tidak ditemukan.`);

        db_respon_list.splice(index, 1);
        reply(`✅ List "${text}" berhasil dihapus.`);
        break;
      }

      case 'updatelist': {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        const [namaList, isiList] = text.split("@").map(s => s.trim());

        if (!namaList || !isiList) {
          return reply(`_Cara Update List_\n\n.updatelist NamaList@IsiListBaru\n\n[Image of example]`);
        }

        let index = db_respon_list.findIndex(item => item.id === chatId && item.key === namaList);
        if (index === -1) return reply(`List dengan nama "${namaList}" tidak ditemukan.`);

        db_respon_list[index].response = isiList;
        reply(`✅ Response pada list "${namaList}" berhasil diperbarui menjadi:\n\n"${isiList}"`);
        break;
      }

      case 'dellistall': {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        let listData = JSON.parse(fs.readFileSync("./src/database/list.json", "utf8"));

        const groupID = chatId;

        const newListData = listData.filter(item => item.id !== groupID);

        fs.writeFileSync('./src/database/list.json', JSON.stringify(newListData, null, 2));

        reply("✅ Semua list di grup ini telah dihapus.");
        break;
      }

      case 'welcome': {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        const groupID = chatId;
        const input = text // Pastikan `text[0]` ada
        console.log("DEBUG: Input user untuk welcome:", input); // Debugging

        const status = input === "on" ? true : input === "off" ? false : null;
        if (status === null) return reply("⚠️ Gunakan 'on' atau 'off'. Contoh: /welcome on");

        let listData = [];
        try {
          listData = JSON.parse(fs.readFileSync('./src/database/weleave.json', 'utf8'));
        } catch (error) {
          console.error("Gagal membaca database, membuat baru...");
        }

        const groupIndex = listData.findIndex(item => item.id === groupID);
        if (groupIndex !== -1) {
          listData[groupIndex].welcome = status;
        } else {
          listData.push({
            id: groupID,
            welcome: status,
            leave: false
          });
        }

        fs.writeFileSync('./src/database/weleave.json', JSON.stringify(listData, null, 2));

        reply(`✅ Fitur *Welcome* telah ${status ? "diaktifkan ✅" : "dinonaktifkan ❌"}.`);
        break;
      }

      case 'leave': {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        const groupID = chatId;
        const input = text;
        console.log("DEBUG: Input user untuk leave:", input); // Debugging

        const status = input === "on" ? true : input === "off" ? false : null;
        if (status === null) return reply("⚠️ Gunakan 'on' atau 'off'. Contoh: /leave on");

        let listData = [];
        try {
          listData = JSON.parse(fs.readFileSync('./src/database/weleave.json', 'utf8'));
        } catch (error) {
          console.error("Gagal membaca database, membuat baru...");
        }

        const groupIndex = listData.findIndex(item => item.id === groupID);
        if (groupIndex !== -1) {
          listData[groupIndex].leave = status;
        } else {
          listData.push({
            id: groupID,
            welcome: false,
            leave: status
          });
        }

        fs.writeFileSync('./src/database/weleave.json', JSON.stringify(listData, null, 2));

        reply(`✅ Fitur *Leave* telah ${status ? "diaktifkan ✅" : "dinonaktifkan ❌"}.`);
        break;
      }

      case 'antilink': {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        const groupID = chatId;
        const input = text; // Pastikan hanya membaca argumen pertama
        console.log("DEBUG: Input user untuk antilink:", input); // Debugging

        if (input !== "on" && input !== "off") {
          return reply("⚠️ Gunakan 'on' atau 'off'. Contoh: /antilink on");
        }

        const status = input === "on"; // Jika "on" maka true, jika "off" maka false

        let listData = [];
        try {
          listData = JSON.parse(fs.readFileSync('./src/database/antilink.json', 'utf8'));
        } catch (error) {
          console.error("Gagal membaca database, membuat baru...");
        }

        const groupIndex = listData.findIndex(item => item.id === groupID);
        if (groupIndex !== -1) {
          listData[groupIndex].antilink = status;
        } else {
          listData.push({
            id: groupID,
            antilink: status
          });
        }

        fs.writeFileSync('./src/database/antilink.json', JSON.stringify(listData, null, 2));

        reply(`✅ Fitur *Anti-Link* telah ${status ? "diaktifkan ✅" : "dinonaktifkan ❌"}.`);
        break;
      }

      case "kick": {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        if (!xy.message.reply_to_message) return reply("⚠️ Balas pesan pengguna yang ingin dikick.");

        const userId = xy.message.reply_to_message.from.id;

        try {
          const member = await xy.telegram.getChatMember(chatId, userId);
          if (member.status === "administrator" || member.status === "creator") {
            return reply("⚠️ Tidak bisa menendang admin atau pemilik grup.");
          }

          await xy.telegram.banChatMember(chatId, userId);
          await xy.telegram.unbanChatMember(userId, chatId); // Agar bisa join lagi setelah dikick

          reply(`✅ Berhasil mengeluarkan pengguna.`);
        } catch (error) {
          console.error("❌ Gagal mengeluarkan pengguna:", error);
          reply("⚠️ Gagal mengeluarkan pengguna. Pastikan bot memiliki izin untuk mengeluarkan anggota.");
        }
        break;
      }

      case "add": {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        if (text.length === 0) return reply("⚠️ Masukkan ID pengguna yang ingin ditambahkan.\n[Image of example]");

        const userId = text[0];

        try {
          const chatInviteLink = await xy.telegram.createChatInviteLink(chatId, {
            expire_date: Math.floor(Date.now() / 1000) + 3600, // Link berlaku 1 jam
            member_limit: 1, // Batas 1 pengguna
          });

          await xy.telegram.sendMessage(text, `✅ Anda telah diundang ke grup. Klik link berikut untuk bergabung:\n${chatInviteLink.invite_link}`);
          reply(`✅ Link undangan telah dikirim ke pengguna.`);
        } catch (error) {
          console.error("❌ Gagal mengirim link undangan:", error);
          reply("⚠️ Gagal mengirim link undangan. Pastikan ID pengguna benar dan bot dapat mengirim pesan ke mereka.");
        }
        break;
      }

      case "close": {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        try {
          await xy.telegram.setChatPermissions(chatId, {
            can_send_messages: false,
            can_send_media_messages: false,
            can_send_polls: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false,
            can_change_info: false,
            can_invite_users: false,
            can_pin_messages: false
          });

          reply("✅ Grup telah *ditutup*. Hanya admin yang dapat mengirim pesan.");
        } catch (error) {
          console.error("❌ Gagal menutup grup:", error);
          reply("⚠️ Gagal menutup grup. Pastikan bot memiliki izin untuk mengubah pengaturan grup.");
        }
        break;
      }

      case "open": {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        try {
          await xy.telegram.setChatPermissions(chatId, {
            can_send_messages: true,
            can_send_media_messages: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
            can_change_info: false,
            can_invite_users: false,
            can_pin_messages: false
          });

          reply("✅ Grup telah *dibuka*. Semua anggota dapat mengirim pesan.");
        } catch (error) {
          console.error("❌ Gagal membuka grup:", error);
          reply("⚠️ Gagal membuka grup. Pastikan bot memiliki izin untuk mengubah pengaturan grup.");
        }
        break;
      }

      case "changetitle": {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!text.length) return reply("⚠️ Harap masukkan nama grup baru.\n[Image of example]");

        const newTitle = text;

        try {
          await xy.telegram.setChatTitle(chatId, newTitle);
          reply(`✅ Nama grup berhasil diubah menjadi: *${newTitle}*`);
        } catch (error) {
          console.error("❌ Gagal mengubah nama grup:", error);
          reply("⚠️ Gagal mengubah nama grup. Pastikan bot memiliki izin.");
        }
        break;
      }

      case "changedesk": {
        if (!xy.message.chat || !xy.message.chat.id) return reply(mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!text.length) return reply("⚠️ Harap masukkan deskripsi baru.\n[Image of example]");

        const newDescription = text;

        try {
          await xy.telegram.setChatDescription(chatId, newDescription);
          reply("✅ Deskripsi grup berhasil diubah.");
        } catch (error) {
          console.error("❌ Gagal mengubah deskripsi grup:", error);
          reply("⚠️ Gagal mengubah deskripsi grup. Pastikan bot memiliki izin.");
        }
        break;
      }

      case "changeppgc":
        if (!xy.chat.type.includes("group")) return xy.reply("❌ Perintah ini hanya bisa digunakan di grup.");
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!("photo" in xy.message)) return reply("❌ Kirim atau balas foto dengan perintah ini untuk mengubah foto profil grup.");

        try {
          const chatId = xy.chat.id;
          const botMember = await xy.getChatMember(xy.botInfo.id);

          if (!["administrator", "creator"].includes(botMember.status)) {
            return xy.reply("❌ Bot harus menjadi admin untuk mengubah foto profil grup.");
          }

          const userMember = await xy.getChatMember(xy.from.id);
          if (!["administrator", "creator"].includes(userMember.status)) {
            return xy.reply("❌ Kamu harus menjadi admin untuk mengganti foto grup.");
          }

          const fileId = xy.message.photo.pop().file_id;
          const fileLink = await xy.telegram.getFileLink(fileId);
          const response = await axios.get(fileLink.href, {
            responseType: "arraybuffer"
          });

          const tempPath = `./temp_${chatId}.jpg`;
          fs.writeFileSync(tempPath, response.data);

          await xy.telegram.setChatPhoto(chatId, {
            source: tempPath
          });
          fs.unlinkSync(tempPath);

          xy.reply("✅ Foto profil grup berhasil diubah!");
        } catch (error) {
          console.error("❌ Gagal mengubah foto profil grup:", error);
          xy.reply("❌ Terjadi kesalahan saat mengubah foto profil grup.");
        }
        break;

      case "promote":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!xy.message.reply_to_message) return xy.reply("⚠️ Balas pesan pengguna yang ingin dipromosikan menjadi admin.");

        let userToPromote = xy.message.reply_to_message.from.id;
        try {
          await xy.telegram.promoteChatMember(chatId, userToPromote, {
            can_change_info: false,
            can_delete_messages: true,
            can_invite_users: true,
            can_restrict_members: true,
            can_pin_messages: true,
            can_manage_chat: true
          });
          xy.reply(`✅ @${xy.message.reply_to_message.from.username || xy.message.reply_to_message.from.first_name} telah dipromosikan menjadi admin.`);
        } catch (error) {
          console.error("❌ Gagal mempromosikan pengguna:", error);
          xy.reply("❌ Terjadi kesalahan saat mempromosikan pengguna.");
        }
        break;

      case "demote":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!xy.message.reply_to_message) return xy.reply("⚠️ Balas pesan pengguna yang ingin dicabut adminnya.");

        let userToDemote = xy.message.reply_to_message.from.id;
        try {
          await xy.telegram.promoteChatMember(chatId, userToDemote, {
            can_change_info: false,
            can_delete_messages: false,
            can_invite_users: false,
            can_restrict_members: false,
            can_pin_messages: false,
            can_manage_chat: false
          });
          xy.reply(`✅ @${xy.message.reply_to_message.from.username || xy.message.reply_to_message.from.first_name} telah dicabut status adminnya.`);
        } catch (error) {
          console.error("❌ Gagal mencabut status admin pengguna:", error);
          xy.reply("❌ Terjadi kesalahan saat mencabut status admin pengguna.");
        }
        break;

      case "delete":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!xy.message.reply_to_message) return xy.reply("⚠️ Balas pesan yang ingin dihapus dengan perintah `/delete`.");

        try {
          await xy.telegram.deleteMessage(chatId, xy.message.reply_to_message.message_id);
          xy.reply("✅ Pesan berhasil dihapus.", {
            reply_to_message_id: xy.message.message_id
          });
        } catch (error) {
          console.error("❌ Gagal menghapus pesan:", error);
          xy.reply("❌ Terjadi kesalahan saat menghapus pesan.");
        }
        break;

      case "pin":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!xy.message.reply_to_message) return xy.reply("⚠️ Balas pesan yang ingin disematkan dengan perintah `/pin`.");

        try {
          await xy.telegram.pinChatMessage(chatId, xy.message.reply_to_message.message_id);
          xy.reply("📌 Pesan berhasil disematkan.", {
            reply_to_message_id: xy.message.message_id
          });
        } catch (error) {
          console.error("❌ Gagal menyematkan pesan:", error);
          xy.reply("❌ Terjadi kesalahan saat menyematkan pesan.");
        }
        break;

      case "unpin":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!xy.message.reply_to_message) return xy.reply("⚠️ Balas pesan yang ingin dilepas dari sematan dengan perintah `/unpin`.");

        try {
          await xy.telegram.unpinChatMessage(chatId, xy.message.reply_to_message.message_id);
          xy.reply("📌 Pesan berhasil dilepas dari sematan.", {
            reply_to_message_id: xy.message.message_id
          });
        } catch (error) {
          console.error("❌ Gagal melepas sematan:", error);
          xy.reply("❌ Terjadi kesalahan saat melepas sematan.");
        }
        break;

      case "createpolling":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);
        if (!text) return xy.reply("⚠️ Masukkan pertanyaan polling dan opsi jawaban.\n\n[Image of example]", {
          parse_mode: "Markdown"
        });

        try {
          let [question, ...options] = text.split(",").map(a => a.trim());

          if (!question || options.length < 2) {
            return xy.reply("⚠️ Format salah! Minimal harus ada 2 opsi jawaban.\n\n[Image of example]", {
              parse_mode: "Markdown"
            });
          }

          await xy.telegram.sendPoll(chatId, question, options, {
            is_anonymous: false
          });
          xy.reply("📊 Polling berhasil dibuat!", {
            reply_to_message_id: xy.message.message_id
          });
        } catch (error) {
          console.error("❌ Gagal membuat polling:", error);
          xy.reply("❌ Terjadi kesalahan saat membuat polling.");
        }
        break;

      case "groupstats":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);

        try {
          const chat = await xy.telegram.getChat(chatId);
          const memberCount = await xy.telegram.getChatMembersCount(chatId);
          const admins = await xy.telegram.getChatAdministrators(chatId);

          let message = `📊 *Statistik Grup*\n\n`;
          message += `📌 *Nama Grup:* ${chat.title}\n`;
          message += `🆔 *ID Grup:* ${chatId}\n`;
          message += `👥 *Total Anggota:* ${memberCount}\n`;
          message += `👮‍♂️ *Total Admin:* ${admins.length}\n`;

          xy.reply(message, {
            parse_mode: "Markdown"
          });

        } catch (error) {
          console.error("❌ Gagal mengambil statistik grup:", error);
          xy.reply("❌ Terjadi kesalahan saat mengambil statistik grup.");
        }
        break;

      case "linkgroup":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        try {
          const inviteLink = await xy.telegram.exportChatInviteLink(chatId);
          xy.reply(`🔗 *Link Undangan Grup:*\n${inviteLink}`, {
            parse_mode: "Markdown"
          });

        } catch (error) {
          console.error("❌ Gagal mendapatkan link grup:", error);
          xy.reply("❌ Terjadi kesalahan saat mengambil link grup. Pastikan bot adalah admin dan memiliki izin mengundang anggota.");
        }
        break;

      case "warn":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        let targetUser = xy.message.reply_to_message?.from;
        if (!targetUser) return xy.reply("⚠️ Balas pesan anggota yang ingin diberi peringatan.");

        let userId_warn = targetUser.id;
        let reason = text || "Tanpa alasan";

        if (!warnDB[userId_warn]) warnDB[userId_warn] = [];

        warnDB[userId_warn].push(reason);
        saveWarnDB(warnDB);

        let warnCount = warnDB[userId_warn].length;
        let warnMsg = `⚠️ ${targetUser.first_name} telah diperingatkan!\n🔹 Alasan: ${reason}\n📌 Total peringatan: ${warnCount}/3`;

        let sentMessage = await xy.telegram.sendMessage(chatId, warnMsg, {
          reply_markup: {
            inline_keyboard: [
              [{
                text: "❌ Batalkan Peringatan",
                callback_data: `cancel_warn_${userId_warn}`
              }]
            ]
          }
        });

        pendingWarns.set(userId_warn, sentMessage.message_id);

        // Hapus pesan yang di-reply
        if (xy.message.reply_to_message) {
          await xy.telegram.deleteMessage(chatId, xy.message.reply_to_message.message_id);
        }

        if (warnCount >= 3) {
          await xy.telegram.kickChatMember(chatId, userId_warn);
          delete warnDB[userId_warn];
          saveWarnDB(warnDB);
          await xy.telegram.sendMessage(chatId, `🚨 ${targetUser.first_name} telah dikeluarkan karena mencapai batas peringatan.`);
        }
        break;

      case "warns":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);

        let target_warns = xy.message.reply_to_message?.from;
        if (!target_warns) return xy.reply("⚠️ Balas pesan anggota untuk melihat peringatannya.");

        let warns = warnDB[target_warns.id] || [];
        if (warns.length === 0) return xy.reply(`✅ <b>${target_warns.first_name}</b> belum memiliki peringatan.`, {
          parse_mode: "HTML"
        });

        let warnList = warns.map((r, i) => `${i + 1}. ${r}`).join("\n");
        xy.reply(`⚠️ Peringatan untuk <b>${target_warns.first_name}</b>:\n\n${warnList}`, {
          parse_mode: "HTML"
        });
        break;

      case "resetwarn":
        if (!xy.chat.type.includes("group")) return xy.reply(global.mess.group);
        if (!isGroupAdmins && !isOwner) return reply(mess.admin);

        let resetUser = xy.message.reply_to_message?.from;
        if (!resetUser) return xy.reply("⚠️ Balas pesan anggota untuk menghapus peringatannya.");

        delete warnDB[resetUser.id];
        saveWarnDB(warnDB);
        xy.reply(`✅ Peringatan <b>${resetUser.first_name}</b> telah dihapus.`, {
          parse_mode: "HTML"
        });
        break;

      case 'tiktokslide': {
        if (!text) return reply(`Gunakan perintah ini dengan cara ${prefix + command} *url*\n\n[Image of example]`);

        await reply('⏳ Sedang memproses...');

        try {
          let result = await Tiktok.Downloader(text, {
            version: "v1",
            proxy: null
          });

          if (result.status === "success") {
            const push = [];
            let i = 1;

            if (result.result.music && result.result.music.playUrl[0]) {
              const audioUrl = result.result.music.playUrl[0];
              await xy.telegram.sendAudio(chatId, {
                url: audioUrl
              }, {
                caption: '🎵 Audio TikTok'
              });
            }

            if (result.result.type === "image" && result.result.images && result.result.images.length > 0) {
              const images = result.result.images;
              const author = result.result.author;
              const description = result.result.description;
              const statistics = result.result.statistics;
              const urlCreator = result.result.author.url;

              for (let imageUrl of images) {
                await xy.telegram.sendPhoto(chatId, {
                  url: imageUrl
                }, {
                  caption: `📸 Gambar ke-${i++}\n👤 ${author.nickname}\n📝 ${description}`
                });
              }

              await xy.telegram.sendMessage(chatId, {
                text: `📊 Statistik:\n👀 Views: ${statistics.playCount}\n🔄 Shares: ${statistics.shareCount}\n💬 Comments: ${statistics.commentCount}\n📥 Downloads: ${statistics.downloadCount}\n👤 Creator: [${author.nickname}](${urlCreator})`,
                parse_mode: "Markdown"
              });
            } else {
              await xy.telegram.sendMessage(chatId, {
                text: `⚠️ Konten TikTok yang diberikan tidak berupa audio maupun gambar.`
              });
            }
          } else {
            await xy.telegram.sendMessage(chatId, {
              text: `❌ Gagal mengunduh TikTok.`
            });
          }
        } catch (error) {
          console.error(`Error processing TikTok: ${error}`);
          await xy.telegram.sendMessage(chatId, {
            text: `❌ Terjadi kesalahan saat memproses TikTok.`
          });
        }

        break;
      }

      case 'pinterest':
      case 'pin': {
        if (!text) return reply(`• *Example:* ${prefix + command} Nakano Miku`);

        await reply('⏳ Sedang mencari gambar...');

        try {
          let images = await pinterest(text);

          if (images.length === 0) {
            return xy.telegram.sendMessage(chatId, {
              text: `❌ Tidak ditemukan gambar untuk "${text}".`
            });
          }

          images = images.sort(() => Math.random() - 0.5);

          let selectedImages = images.slice(0, 5);
          let i = 1;

          for (let imageUrl of selectedImages) {
            await xy.telegram.sendPhoto(chatId, imageUrl, {
              caption: `📸 Gambar ke-${i++}`
            });
          }

          await xy.telegram.sendMessage(chatId, {
            text: `✅ Berikut hasil pencarian Pinterest untuk "${text}".`
          });

        } catch (error) {
          console.error('Error fetching Pinterest images:', error);
          await xy.telegram.sendMessage(chatId, {
            text: `❌ Terjadi kesalahan saat mengambil gambar dari Pinterest.`
          });
        }
      }
      break;

      case 'remini': {
        if (!xy.message.reply_to_message.photo) {
          return reply('Dimana gambarnya? Reply gambar dengan perintah ini.');
        }

        await reply('⏳ Sedang memproses gambar...');

        const {
          remini
        } = require('./src/lib/remini');

        try {
          let fileId = xy.message.reply_to_message.photo[xy.message.reply_to_message.photo.length - 1].file_id;
          let fileLink = await xy.telegram.getFileLink(fileId);
          let response = await axios.get(fileLink, {
            responseType: 'arraybuffer'
          });

          let hasil = await remini(response.data, "enhance");

          await xy.telegram.sendPhoto(chatId, {
            source: outputPath
          }, {
            caption: `✨ Gambar telah ditingkatkan kualitasnya!`
          });

        } catch (error) {
          console.error("Error di Remini:", error);
          await xy.telegram.sendMessage(chatId, {
            text: "❌ Gagal meningkatkan kualitas gambar."
          });
        }

        break;
      }

      case 'qc': {
        if (!isOwner) return reply(mess.owner);

        let teks = xy.message.reply_to_message ? xy.message.reply_to_message.text : text ? text : "";
        if (!teks) return reply("Cara penggunaan: /qc teks (atau reply pesan)");

        let userId = xy.message.reply_to_message ? xy.message.reply_to_message.from.id : userId; // Menggunakan userId yang sudah dideklarasikan
        let username = xy.message.reply_to_message ? xy.message.reply_to_message.from.first_name : userName; // Menggunakan userName yang sudah dideklarasikan

        let avatar;
        try {
          let photos = await xy.telegram.getUserProfilePhotos(userId);
          avatar = photos.total_count > 0 ?
            await xy.telegram.getFileLink(photos.photos[0][0].file_id) :
            "https://i0.wp.com/telegra.ph/file/134ccbbd0dfc434a910ab.png"; // Gambar avatar default jika tidak ada foto profil
        } catch (err) {
          console.error("Gagal mengambil foto profil:", err);
          avatar = "https://i0.wp.com/telegra.ph/file/134ccbbd0dfc434a910ab.png";
        }

        const json = {
          type: "quote",
          format: "png",
          backgroundColor: "#FFFFFF",
          width: 700,
          height: 580,
          scale: 2,
          "messages": [{
            "entities": [],
            "avatar": true,
            "from": {
              "id": 1,
              "name": username,
              "photo": {
                "url": avatar
              }
            },
            "text": teks,
            "replyMessage": {}
          }],
        };

        axios.post("https://bot.lyo.su/quote/generate", json, {
            headers: {
              "Content-Type": "application/json"
            },
          })
          .then(async (res) => {
            const buffer = Buffer.from(res.data.result.image, "base64");
            await xy.telegram.sendSticker(chatId, {
              source: buffer
            });
          })
          .catch(err => {
            console.error(err);
            reply("Gagal membuat QC.");
          });

        break;
      }

      case 'brat': {
        if (!text) return xy.reply('Masukkan teks untuk stiker.\n\n[Image of example]');

        async function BratGenerator(teks) {
          let width = 512;
          let height = 512;
          let margin = 20;
          let wordSpacing = 50;
          const canvas = createCanvas(width, height);
          const ctx = canvas.getContext('2d');

          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          let fontSize = 280;
          let lineHeightMultiplier = 1.3;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillStyle = 'black';

          registerFont('./src/lib/arialnarrow.ttf', {
            family: 'Narrow'
          });

          let words = teks.split(' ');
          let lines = [];

          let rebuildLines = () => {
            lines = [];
            let currentLine = '';
            for (let word of words) {
              let testLine = currentLine ? `${currentLine} ${word}` : word;
              let lineWidth = ctx.measureText(testLine).width + (currentLine.split(' ').length - 1) * wordSpacing;
              if (lineWidth < width - 2 * margin) {
                currentLine = testLine;
              } else {
                lines.push(currentLine);
                currentLine = word;
              }
            }
            if (currentLine) {
              lines.push(currentLine);
            }
          };

          ctx.font = `${fontSize}px Narrow`;
          rebuildLines();

          while (lines.length * fontSize * lineHeightMultiplier > height - 2 * margin) {
            fontSize -= 2;
            ctx.font = `${fontSize}px Narrow`;
            rebuildLines();
          }

          let lineHeight = fontSize * lineHeightMultiplier;
          let y = margin;
          for (let line of lines) {
            let wordsInLine = line.split(' ');
            let x = margin;
            for (let word of wordsInLine) {
              ctx.fillText(word, x, y);
              x += ctx.measureText(word).width + wordSpacing;
            }
            y += lineHeight;
          }

          let buffer = canvas.toBuffer('image/png');
          let image = await Jimp.read(buffer);
          image.blur(3);
          let blurredBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

          return xy.replyWithSticker({
            source: blurredBuffer
          });
        }

        await BratGenerator(text);
        break;
      }

      default:
        // Handle direct responses from `db_respon_list` for group chats
        if (isGroup && isAlreadyResponList1Group(chatId, command, db_respon_list)) {
          sendResponList1(xy, command, db_respon_list);
        }
        break;
    }
  } catch (e) {
    console.log(e);
  }
}

// Fungsi untuk menangani perintah terkait panel secara dinamis
async function handlePanelCommands(command, text, xy, isOwner, isSeller, isPrivateSeller, isPublicPartner, isPrivatePartner, reply, panelConfig, paket, prefix) {
  const cleanCommand = command.replace('_prvt', '');
  const isPrivatePanelCommand = command.endsWith('_prvt');

  // Define which commands are inherently owner-only regardless of public/private panel
  // Perintah admin umum untuk panel publik
  const publicPanelAdminCommands = [
    "delusr", "delsrv", "listusr", "listadmin", "createadmin", "deladmin" // Tambah deladmin
  ];
  
  // Perintah admin umum untuk panel private
  const privatePanelAdminCommands = [
    "delusr", "delsrv", "listusr", "listadmin", "createadmin", "deladmin" // Base commands, akan ditambahi _prvt
  ];

  // Perintah pembuatan sumber daya (1gb, 2gb, dst.)
  const resourceCreationCommands = [
    "1gb", "2gb", "3gb", "4gb", "5gb", "6gb", "7gb", "8gb", "9gb", "10gb", "unli"
  ];

  // --- Logika Kontrol Akses ---
  if (isPrivatePanelCommand) { // Ini adalah perintah untuk Panel Private
    if (publicPanelAdminCommands.includes(cleanCommand)) { // Ini berlaku untuk perintah admin yang sama di kedua panel
        // Perintah admin panel private (seperti delusr_prvt, createadmin_prvt, dll.)
        // Hanya Owner atau Private Partner yang bisa mengakses
        if (!isOwner && !isPrivatePartner) {
            return reply(global.mess.owner); // Menggunakan mess.owner karena ini fitur khusus/privat
        }
    } else if (resourceCreationCommands.includes(cleanCommand)) {
        // Perintah pembuatan sumber daya panel private (seperti 1gb_prvt)
        // Hanya Owner atau Reseller Private yang bisa mengakses
        if (!isOwner && !isPrivateSeller) {
            return reply(global.mess.owner); // Menggunakan mess.owner karena ini fitur khusus/privat
        }
    }
  } else { // Ini adalah perintah untuk Panel Publik
    if (publicPanelAdminCommands.includes(cleanCommand)) {
        // Perintah admin panel publik (seperti delusr, createadmin, dll.)
        // Hanya Owner atau Public Partner yang bisa mengakses
        if (!isOwner && !isPublicPartner) {
            return reply(global.mess.owner); // Menggunakan mess.owner untuk saat ini
        }
    } else if (resourceCreationCommands.includes(cleanCommand)) {
        // Perintah pembuatan sumber daya panel publik (seperti 1gb)
        // Hanya Owner atau Reseller Publik yang bisa mengakses
        if (!isOwner && !isSeller) {
            return reply(global.mess.seller);
        }
    }
  }

  // Lanjutkan dengan logika perintah yang sebenarnya, karena akses sudah diperiksa
  const {
    domain,
    plta,
    pltc,
    loc,
    eggs
  } = panelConfig;

  switch (cleanCommand) {
    case "delusr":
    case "delusr_prvt": { // Tangani delusr dan delusr_prvt
      if (!text || !/^\d+$/.test(text))
        return reply(`*Format salah!*

Penggunaan:
${prefix + command} user_id

[Image of example]`);

      let userIdToDelete = text;

      let f = await fetch(`${domain}/api/application/users/${userIdToDelete}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${plta}`
        }
      });

      let data = {};
      let textResponse = await f.text();

      if (textResponse) {
        try {
          data = JSON.parse(textResponse);
        } catch (err) {
          return reply(`Gagal memproses respons API: ${err.message}`);
        }
      }

      if (data.errors) {
        return reply(`Gagal menghapus user: ${JSON.stringify(data.errors[0], null, 2)}`);
      }

      reply(`✅ User dengan ID ${userIdToDelete} dari panel *${panelConfig.name}* berhasil dihapus.`);
    }
    break;

    case "delsrv":
    case "delsrv_prvt": { // Tangani delsrv dan delsrv_prvt
      if (!text)
        return reply(`*Format salah!*

Penggunaan:
${prefix + command} server_id

[Image of example]`);

      let serverIdToDelete = text;

      let f = await fetch(`${domain}/api/application/servers/${serverIdToDelete}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${plta}`
        }
      });

      let data = {};
      let textResponse = await f.text();

      if (textResponse) {
        try {
          data = JSON.parse(textResponse);
        } catch (err) {
          return reply(`Gagal memproses respons API: ${err.message}`);
        }
      }

      if (data.errors) {
        return reply(`Gagal menghapus server: ${JSON.stringify(data.errors[0], null, 2)}`);
      }

      reply(`✅ Server dengan ID ${serverIdToDelete} dari panel *${panelConfig.name}* berhasil dihapus.`);
    }
    break;

    case 'listpanel':
    case 'listpanel_prvt':
      let halamanPanel = parseInt(text.split(" ")[1]) || 1;

      if (halamanPanel > 25) return reply("⚠️ Maksimal hanya bisa melihat sampai halaman 25!");

      try {
        let response = await fetch(`${domain}/api/application/servers?page=${halamanPanel}&per_page=25`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${plta}`
          }
        });

        let hasil = await response.json();

        if (!response.ok) {
          return reply(`🚫 Gagal mendapatkan data dari panel *${panelConfig.name}*. Kode error: ${response.status}`);
        }

        if (hasil.errors) {
          return reply(`⚠️ Kesalahan ditemukan di panel *${panelConfig.name}*: ${JSON.stringify(hasil.errors[0], null, 2)}`);
        }

        if (!hasil.data || hasil.data.length === 0) {
          return reply(`📌 Tidak ada server yang terdaftar dalam sistem panel *${panelConfig.name}*.`);
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
        const callbackBase = command.includes('_prvt') ? 'listpanel_prvt' : 'listpanel';

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

        let sentMessage = await xy.telegram.sendMessage(chatId, daftarServer, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: buttons.length > 0 ? [buttons] : []
          }
        });

        global.lastListPanelMessageId = sentMessage.message_id;

      } catch (err) {
        console.log("❗ Error:", err);
        reply(`⚠️ Terjadi kesalahan: ${err.message}`);
      }
      break;


    case 'listusr':
    case 'listusr_prvt':
      let halamanUsr = text[1] || '1';

      try {
        let response = await fetch(`${domain}/api/application/users?page=${halamanUsr}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${plta}`
          }
        });

        let hasil = await response.json();

        if (!response.ok) {
          return reply(`❌ Gagal mengambil data dari panel *${panelConfig.name}*. Kode error: ${response.status}`);
        }

        if (hasil.errors) {
          return reply(`⚠️ Kesalahan saat memproses permintaan di panel *${panelConfig.name}*: ${JSON.stringify(hasil.errors[0], null, 2)}`);
        }

        if (!hasil.data || hasil.data.length === 0) {
          return reply(`📌 Tidak ada pengguna yang ditemukan di panel *${panelConfig.name}*.`);
        }

        let daftarUser = `👥 *Daftar Pengguna Terdaftar (${panelConfig.name})* 👥\n`;
        daftarUser += "━━━━━━━━━━━━━━━━━━━━━━━\n";

        for (let user of hasil.data) {
          let info = user.attributes;
          daftarUser += `🆔 *User ID*: \`${info.id}\`\n`;
          daftarUser += `🔸 *Username*: ${info.username}\n`;
          daftarUser += "───────────────────────\n";
        }

        daftarUser += `📄 *Halaman*: ${hasil.meta.pagination.current_page}/${hasil.meta.pagination.total_pages}\n`;
        daftarUser += `📊 *Total Pengguna*: ${hasil.meta.pagination.count}`;

        xy.telegram.sendMessage(chatId, daftarUser, {
          parse_mode: "Markdown"
        });

        if (hasil.meta.pagination.current_page < hasil.meta.pagination.total_pages) {
          xy.telegram.sendMessage(chatId, `➡️ Gunakan perintah: \`/${cleanCommand}${command.endsWith('_prvt') ? '_prvt' : ''} ${hasil.meta.pagination.current_page + 1}\` untuk melihat halaman berikutnya.`, {
            parse_mode: "Markdown"
          });
        }
      } catch (err) {
        console.log("❗ Error:", err);
        reply(`⚠️ Terjadi kesalahan: ${err.message}`);
      }
      break;

    case 'listadmin':
    case 'listadmin_prvt':
      let halamanAdmin = text[1] || '1';

      try {
        let response = await fetch(`${domain}/api/application/users?page=${halamanAdmin}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${plta}`
          }
        });

        let hasil = await response.json();

        if (!response.ok) {
          return reply(`❌ Gagal mengambil daftar admin dari panel *${panelConfig.name}*. Kode error: ${response.status}`);
        }

        if (hasil.errors) {
          return reply(`⚠️ Terjadi kesalahan di panel *${panelConfig.name}*: ${JSON.stringify(hasil.errors[0], null, 2)}`);
        }

        let daftarAdmin = hasil.data.filter(user => user.attributes.root_admin === true);

        if (daftarAdmin.length === 0) {
          return reply(`🚫 Tidak ada admin yang terdaftar di panel *${panelConfig.name}*.`);
        }

        let pesanAdmin = `👑 *Daftar Administrator (${panelConfig.name})* 👑\n`;
        pesanAdmin += "━━━━━━━━━━━━━━━━━━━━━━━\n";

        for (let admin of daftarAdmin) {
          let info = admin.attributes;
          pesanAdmin += `🆔 *Admin ID*: \`${info.id}\`\n`;
          pesanAdmin += `🔹 *Nama*: ${info.username}\n`;
          pesanAdmin += "───────────────────────\n";
        }

        pesanAdmin += `📄 *Halaman*: ${hasil.meta.pagination.current_page}/${hasil.meta.pagination.total_pages}\n`;
        pesanAdmin += `📊 *Total Admin*: ${daftarAdmin.length}`;

        xy.telegram.sendMessage(chatId, pesanAdmin, {
          parse_mode: "Markdown"
        });

        if (hasil.meta.pagination.current_page < hasil.meta.pagination.total_pages) {
          xy.telegram.sendMessage(chatId, `➡️ Gunakan perintah: \`/${cleanCommand}${command.endsWith('_prvt') ? '_prvt' : ''} ${hasil.meta.pagination.current_page + 1}\` untuk melihat halaman berikutnya.`, {
            parse_mode: "Markdown"
          });
        }
      } catch (err) {
        console.log("❗ Error:", err);
        xy.telegram.sendMessage(chatId, `⚠️ Terjadi kesalahan: ${err.message}`);
      }
      break;

    case 'deladmin':
    case 'deladmin_prvt': {
      if (!text || !/^\d+$/.test(text))
        return reply(`*Format salah!*

Penggunaan:
${prefix + command} user_id

[Image of example]`);

      let adminIdToDelete = text;

      let f = await fetch(`${domain}/api/application/users/${adminIdToDelete}/toggle-admin`, {
        method: "PATCH", // Menggunakan PATCH untuk mengubah status admin
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${plta}`
        }
      });

      let data = {};
      let textResponse = await f.text();

      if (textResponse) {
        try {
          data = JSON.parse(textResponse);
        } catch (err) {
          return reply(`Gagal memproses respons API: ${err.message}`);
        }
      }

      if (data.errors) {
        return reply(`Gagal menghapus status admin: ${JSON.stringify(data.errors[0], null, 2)}`);
      }

      if (data.attributes && data.attributes.root_admin === false) {
          reply(`✅ Status admin untuk User ID ${adminIdToDelete} dari panel *${panelConfig.name}* berhasil dihapus.`);
      } else {
          reply(`⚠️ Gagal menghapus status admin untuk User ID ${adminIdToDelete} dari panel *${panelConfig.name}*. Pastikan ID valid dan bukan admin terakhir.`);
      }
    }
    break;

    case "1gb":
    case "2gb":
    case "3gb":
    case "4gb":
    case "5gb":
    case "6gb":
    case "7gb":
    case "8gb":
    case "9gb":
    case "10gb":
    case "unli": {
      // Akses kontrol untuk perintah ini kini ditangani di awal handlePanelCommands
      let ram, disk, cpu;
      const userInput = text;
      console.log(userInput);

      switch (cleanCommand) {
        case "1gb":
          ram = "1024";
          disk = "1024";
          cpu = "40";
          break;
        case "2gb":
          ram = "2048";
          disk = "2048";
          cpu = "60";
          break;
        case "3gb":
          ram = "3072";
          disk = "3072";
          cpu = "80";
          break;
        case "4gb":
          ram = "4096";
          disk = "4096";
          cpu = "100";
          break;
        case "5gb":
          ram = "5120";
          disk = "5120";
          cpu = "120";
          break;
        case "6gb":
          ram = "6144";
          disk = "6144";
          cpu = "140";
          break;
        case "7gb":
          ram = "7168";
          disk = "7168";
          cpu = "160";
          break;
        case "8gb":
          ram = "8192";
          disk = "8192";
          cpu = "180";
          break;
        case "9gb":
          ram = "9216";
          disk = "9216";
          cpu = "200";
          break;
        case "10gb":
          ram = "10240";
          disk = "10240";
          cpu = "220";
          break;
        case "unli":
          ram = "0";
          disk = "0";
          cpu = "0";
          break;
      }

      let t = userInput.split(",");
      if (t.length < 3) {
        return reply(`*Format salah!*\n\nPenggunaan:\n/${command} sendwa/sendtele,username,nowa/idtele\n\n[Image of example]`);
      }

      let sendType = t[0].trim();
      let username = t[1].trim();
      let targetNumber = t[2].trim();

      if (!["sendwa", "sendtele"].includes(sendType)) {
        return reply("Pilihan pengiriman hanya boleh 'sendwa' atau 'sendtele'.");
      }

      if (!targetNumber.match(/^\d+$/)) {
        return reply(`ID tele / No. WA tujuan tidak valid.`);
      }

      let email = `${username}@yucandy.com`;

      let fCheckEmail = await fetch(`${domain}/api/application/users/email/${email}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${plta}`
        }
      });

      let checkEmailData = await fCheckEmail.json();
      if (checkEmailData.errors && checkEmailData.errors.length > 0 && checkEmailData.errors[0].meta && checkEmailData.errors[0].meta.source_field === 'email') {
        return reply(`*Email sudah terdaftar di panel ${panelConfig.name}!* Silakan pilih username lain.`);
      }

      // Modified password generation logic
      let password = username + "233"; 

      let f = await fetch(`${domain}/api/application/users`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${plta}`
        },
        body: JSON.stringify({
          email: email,
          username: username,
          first_name: username,
          last_name: username,
          language: "en",
          password: password.toString()
        })
      });

      let data = await f.json();
      if (data.errors) {
        return xy.telegram.sendMessage(chatId, JSON.stringify(data.errors[0], null, 2));
      }
      let user = data.attributes;

      let f2 = await fetch(`${domain}/api/application/nests/5/eggs/${eggs}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${pltc}`
        }
      });

      let data2 = await f2.json();
      let startup_cmd = data2.attributes.startup;

      let f3 = await fetch(`${domain}/api/application/servers`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${pltc}`
        },
        body: JSON.stringify({
          name: username,
          description: "panel pterodatcyl",
          user: user.id,
          egg: parseInt(eggs),
          docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
          startup: startup_cmd,
          environment: {
            INST: "npm",
            USER_UPLOAD: "0",
            AUTO_UPDATE: "0",
            CMD_RUN: "npm start"
          },
          limits: {
            memory: ram,
            swap: 0,
            disk: disk,
            io: 500,
            cpu: cpu
          },
          feature_limits: {
            databases: 5,
            backups: 5,
            allocations: 5
          },
          deploy: {
            locations: [parseInt(loc)],
            dedicated_ip: false,
            port_range: []
          }
        })
      });

      let res = await f3.json();
      if (res.errors) {
        return xy.telegram.sendMessage(chatId, JSON.stringify(res.errors[0], null, 2));
      }
      let server = res.attributes;

      let messageToSend = `
🎉 *Panel Berhasil Dibuat di ${panelConfig.name}!*

🔹 *Detail Panel Anda:*
────────────────────
- 𝗜𝗗: ${user.id}
- 𝗘𝗠𝗔𝗜𝗟: ${user.email}
- 𝗨𝗦𝗘𝗥𝗡𝗔𝗠𝗘: ${user.username}
- 𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗: ${password.toString()}
- 𝗟𝗢𝗚𝗜𝗡: [Klik untuk login](${domain})

⚠️ 𝗣𝗘𝗥𝗛𝗔𝗧𝗜𝗔𝗡:
────────────────────
- Masa aktif panel adalah 30 hari  
- Data bersifat pribadi, mohon disimpan dengan aman  
- Garansi berlaku 15 hari (3x replace)  
- Klaim garansi wajib menyertakan bukti chat pembelian dan bukti transfer 
`;

      if (sendType === "sendtele") {
        await xy.telegram.sendPhoto(targetNumber, {
          source: paket
        }, {
          caption: messageToSend
        });
      } else if (sendType === "sendwa") {
        const sessionNumber = Array.from(sessions.keys())[0];
        const waClient = sessions.get(sessionNumber);
        if (!waClient) return reply(`Sesi WhatsApp ${sessionNumber} tidak ditemukan.`);
        if (!sessions.has(sessionNumber)) return reply(`WhatsApp ${sessionNumber} belum terhubung.`);
        const custwa = targetNumber.includes("@") ? targetNumber : `${targetNumber}@s.whatsapp.net`;
        try {
          await waClient.sendMessage(custwa, {
            image: {
              url: paket
            },
            caption: messageToSend
          });
          reply(`✅ Detail panel telah dikirim ke WhatsApp ${targetNumber}`);
        } catch (error) {
          console.error("Gagal mengirim pesan ke WhatsApp:", error);
          reply(`❌ Gagal mengirim pesan ke WhatsApp ${targetNumber}`);
        }
      }

      let messageToSender = `✅ Panel untuk username *${username}* telah berhasil dibuat di *${panelConfig.name}* dan data telah dikirim ke *${sendType === "sendtele" ? "Telegram" : "WhatsApp"}* ${targetNumber}.`;
      await xy.telegram.sendMessage(chatId, messageToSender);
    };
    break;

    case "createadmin":
    case "createadmin_prvt": {
      // Akses kontrol untuk createadmin selalu hanya untuk owner dan ditangani di awal handlePanelCommands
      let t = text.split(",");
      if (t.length < 3)
        return reply(`*Format salah!*

Penggunaan:
/${command} sendwa/sendtele,nama,nomor_telepon

[Image of example]`);

      let sendType = t[0].trim();
      let username = t[1].trim();
      let targetNumber = t[2].replace(/[^0-9]/g, "");

      if (!["sendwa", "sendtele"].includes(sendType)) {
        return reply("Pilihan pengiriman hanya boleh 'sendwa' atau 'sendtele'.");
      }

      // Modified password generation logic
      let password = username + "233";
      let email = username + "@yucandy.com";

      let f = await fetch(`${domain}/api/application/users`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${plta}`
        },
        body: JSON.stringify({
          email: email,
          username: username,
          first_name: username,
          last_name: username,
          language: "en",
          root_admin: true,
          password: password.toString()
        })
      });

      let data = await f.json();
      if (data.errors) {
        return reply(`❌ Error: ${JSON.stringify(data.errors[0], null, 2)}`);
      }
      let user = data.attributes;

      let messageToTarget = `
✓ Admin Panel (${panelConfig.name}) Berhasil Dibuat

- 𝗜𝗗: ${user.id}
- 𝗘𝗠𝗔𝗜𝗟: ${user.email}
- 𝗨𝗦𝗘𝗥𝗡𝗔𝗠𝗘: ${user.username}
- 𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗: ${password.toString()}
- 𝗟𝗢𝗚𝗜𝗡: ${domain}

⚠️ Simpan informasi ini, kami hanya mengirimkan detail akun sekali.
`;

      if (sendType === "sendtele") {
        await xy.telegram.sendPhoto(targetNumber, {
          source: paket
        }, {
          caption: messageToTarget
        });
      } else if (sendType === "sendwa") {
        const sessionNumber = Array.from(sessions.keys())[0];
        const waClient = sessions.get(sessionNumber);
        if (!waClient) return reply(`Sesi WhatsApp ${sessionNumber} tidak ditemukan.`);

        const custwa = targetNumber.includes("@") ? targetNumber : `${targetNumber}@s.whatsapp.net`;
        try {
          await waClient.sendMessage(custwa, {
            image: {
              url: paket
            },
            caption: messageToTarget
          });
          reply(`✅ Detail admin telah dikirim ke WhatsApp *${targetNumber}*`);
        } catch (error) {
          console.error("Gagal mengirim ke WhatsApp:", error);
          reply(`❌ Gagal mengirim ke WhatsApp *${targetNumber}*`);
        }
      }

      let messageToSender = `✅ Admin *${username}* berhasil dibuat di *${panelConfig.name}* dan data telah dikirim ke *${sendType === "sendtele" ? "Telegram" : "WhatsApp"}* ${targetNumber}.`;
      await xy.telegram.sendMessage(chatId, {
        text: messageToSender
      });
    }
    break;
  }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(`Update File Terbaru ${__filename}`)
  delete require.cache[file]
  require(file)
})
