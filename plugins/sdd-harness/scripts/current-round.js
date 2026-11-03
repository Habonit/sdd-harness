#!/usr/bin/env node
// SessionStart Hook: docs/ROADMAP.md 의 라운드 표를 읽고 현재 라운드를 알린다.
// 현재 라운드 = 표에서 위에서부터 처음으로 상태가 "완료"가 아닌 라운드.
// ROADMAP 이 없거나 표를 못 읽으면 아무것도 출력하지 않고 끝낸다 (세션을 막지 않는다).

const fs = require("fs");
const path = require("path");

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function projectDir() {
  let cwd = "";
  try {
    cwd = JSON.parse(readStdin() || "{}").cwd || "";
  } catch {}
  return process.env.CLAUDE_PROJECT_DIR || cwd || process.cwd();
}

function parseRounds(text) {
  const rounds = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim().startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    const m = cells[0] && cells[0].match(/^round(\d+)$/i);
    if (!m) continue;
    rounds.push({ id: cells[0], status: cells[cells.length - 1] || "" });
  }
  return rounds;
}

function main() {
  const roadmap = path.join(projectDir(), "docs", "ROADMAP.md");
  if (!fs.existsSync(roadmap)) return;

  const rounds = parseRounds(fs.readFileSync(roadmap, "utf8"));
  if (rounds.length === 0) return;

  const current = rounds.find((r) => r.status !== "완료");
  const message = current
    ? `현재 라운드: ${current.id} (ROADMAP 상태: ${current.status || "비어 있음"})`
    : `현재 라운드: 없음 (${rounds[rounds.length - 1].id}까지 완료. 다음 라운드를 ROADMAP에 더한 뒤 round-start)`;

  process.stdout.write(
    JSON.stringify({
      systemMessage: message,
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: `docs/ROADMAP.md 기준 ${message}`,
      },
    })
  );
}

try {
  main();
} catch {
  // Hook 오류로 세션 시작을 방해하지 않는다.
}
