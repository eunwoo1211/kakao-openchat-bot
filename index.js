const express = require("express");
const app = express();
app.use(express.json());

// ✅ 여기에 정확한 오픈채팅방 이름 입력
const ALLOWED_ROOM = "테스트";

// ✅ 감지할 금지어들
const bannedWords = ["소", "양", "돼지"];

let warns = {}; // { userId: count }

app.post("/webhook", (req, res) => {
  const room = req.body.userRequest.room?.name || "";
  const text = req.body.userRequest.utterance;
  const userId = req.body.userRequest.user.id;

  // ❌ 다른 방이면 반응 안 함
  if (room !== ALLOWED_ROOM) return res.json({});

  // 🔴 금지어 감지
  if (bannedWords.some(w => text.includes(w))) {
    warns[userId] = (warns[userId] || 0) + 1;
    return res.json({
      template: {
        outputs: [
          {
            simpleText: {
              text: `⚠️ 금지어 사용 감지!\n경고 ${warns[userId]}회`
            }
          }
        ]
      }
    });
  }

  return res.json({});
});

app.listen(3000, () => console.log("Server running"));
