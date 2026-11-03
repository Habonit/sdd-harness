# sdd-harness

라운드 단위 스펙 주도 개발 진행 방식을 묶은 Claude Code 플러그인이다.
한 라운드는 `spec → plan → build → close` 순서로 가고, spec 과 plan 뒤에는 사람의 승인을 받는다.

## 스킬
| 명령 | 하는 일 |
|---|---|
| `/sdd-harness:round-start [roundNN]` | ROADMAP · SSOT · 지난 라운드 문서를 읽고 `docs/roundNN/spec.md` 를 쓴다. 승인 대기 |
| `/sdd-harness:round-plan [roundNN]` | 승인된 spec 으로 `docs/roundNN/plan.md` 를 쓴다. 승인 대기 |
| `/sdd-harness:round-build [roundNN]` | plan 대로 구현, verifier 검증 → `review.md`, 지적 조치 |
| `/sdd-harness:round-close [roundNN]` | cleaner 정리, SSOT 갱신, CLAUDE.md 종료 조건 점검, ROADMAP 완료 표시 |

## 에이전트
- `verifier`: spec 기준 검증. 코드를 고치지 않고 보고만 한다
- `cleaner`: 죽은 코드와 어긋난 문서 정리. 기능을 추가하지 않는다

## Hook
- `SessionStart`: `docs/ROADMAP.md` 표에서 상태가 `완료` 가 아닌 첫 라운드를 찾아 "현재 라운드: roundNN" 을 알린다. Node.js 가 필요하다.

## 프로젝트가 갖춰야 할 것
- `CLAUDE.md`: 코드 규칙, 테스트 · 린트 명령, 라운드 종료 조건 (플러그인은 이 규칙을 담지 않고 읽어서 따른다)
- `docs/ROADMAP.md` (`| roundNN | 목표 | 상태 |` 표), `docs/SSOT.md`, `docs/roundNN/`
