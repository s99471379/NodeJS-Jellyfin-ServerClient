const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const jellyfinServer = 'http://localhost:8096';
const apiKey = 'xxx';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const match = file.fieldname.match(/videos_(\d+)/);
        const index = match ? match[1] : null;
        const courseId = req.body[`courseId_${index}`];
        const chapterId = req.body[`chapterId_${index}`];
        const sectionId = req.body[`sectionId_${index}`];
        const dir = `D:/hct_coding/course_id_${courseId}/chapter_id_${chapterId}/section_id_${sectionId}`;
        
        mkdirp.mkdirp(dir)
            .then(made => cb(null, dir))
            .catch(err => cb(err));
    },
    filename: function (req, file, cb) {
        const match = file.fieldname.match(/videos_(\d+)/);
        const index = match ? match[1] : null;
        const courseId = req.body[`courseId_${index}`];
        const chapterId = req.body[`chapterId_${index}`];
        const sectionId = req.body[`sectionId_${index}`];
        const filename = `${courseId}_${chapterId}_${sectionId}.mp4`;
        const filePath = path.join(`D:/hct_coding/course_id_${courseId}/chapter_id_${chapterId}/section_id_${sectionId}`, filename);

        // 檢查文件是否存在
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // 文件不存在，可以繼續儲存
                cb(null, filename);
            } else {
                // 文件已存在，回傳錯誤
                cb(new Error('File already exists'));
            }
        });
    }
});

const upload = multer({ storage: storage }).any();

app.post('/upload', upload, (req, res) => {
    // 上傳成功後，觸發Jellyfin的媒體庫掃描
    const scanUrl = `${jellyfinServer}/Library/Refresh?api_key=${apiKey}`;
    fetch(scanUrl, { method: 'POST' })
        .then(scanResponse => {
            if (scanResponse.ok) {
                res.send(`成功上傳 ${req.files.length} 個影片，並觸發媒體庫掃描！`);
            } else {
                res.status(scanResponse.status).send('上傳成功但媒體庫掃描失敗');
            }
        })
        .catch(error => {
            console.error('Error triggering media scan:', error);
            res.status(500).send('Server error during media library scan');
        });
});


app.get('/videos', async (req, res) => {
    const url = `${jellyfinServer}/Items?IncludeItemTypes=Video&recursive=true&fields=Name&api_key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
            // 過濾掉名稱為 'types-internal.d' 的影片項目
            const videoDetails = data.Items
                .filter(item => item.Name !== 'types-internal.d')
                .map(item => ({ id: item.Id, name: item.Name }));
            
            res.json(videoDetails);
        } else {
            res.status(response.status).send('Failed to fetch videos');
        }
    } catch (error) {
        console.error('Error fetching video data:', error);
        res.status(500).send('Server error');
    }
});


// 接收名稱並查找對應的影片 ID
app.post('/video', async (req, res) => {
    const videoName = req.body.name;
    const findUrl = `${jellyfinServer}/Items?IncludeItemTypes=Video&recursive=true&fields=Id,Name&api_key=${apiKey}&searchTerm=${encodeURIComponent(videoName)}`;

    try {
        const findResponse = await fetch(findUrl);
        const findData = await findResponse.json();
        if (findResponse.ok && findData.Items.length > 0) {
            const videoId = findData.Items[0].Id;
            const videoUrl = `${jellyfinServer}/Videos/${videoId}/stream.mp4?api_key=${apiKey}`;
            const videoResponse = await fetch(videoUrl);
            if (videoResponse.ok) {
                const bodyStream = videoResponse.body;
                res.writeHead(200, { 'Content-Type': 'video/mp4' });
                bodyStream.pipe(res);
            } else {
                res.status(404).send('Video not found');
            }
        } else {
            res.status(404).send('Video name not found');
        }
    } catch (error) {
        console.error('Error finding video:', error);
        res.status(500).send('Server error');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`伺服器運行在 http://localhost:${PORT}/`);
});
