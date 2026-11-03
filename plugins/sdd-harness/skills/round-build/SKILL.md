---
name: round-build
description: 승인된 docs/roundNN/plan.md 대로 구현하고, verifier 에이전트로 spec 기준 검증해 docs/roundNN/review.md 에 적은 뒤 지적 사항을 고친다.
argument-hint: "[roundNN]"
disable-model-invocation: true
---

# round-build · 구현 → 검증 → 조치

## 0. 규칙 먼저
- 프로젝트 루트의 `CLAUDE.md` 를 읽는다. 코드 규칙, 패키지 · 실행 규칙(테스트 · 린트 명령)을 그대로 따른다.

## 1. 대상 라운드와 전제 확인
- 인자로 라운드가 주어졌으면(`$ARGUMENTS`) 그 라운드, 아니면 `docs/ROADMAP.md` 에서 상태가 `완료` 가 아닌 첫 라운드.
- `docs/roundNN/spec.md` 와 `plan.md` 가 둘 다 있어야 한다. 없으면 멈추고 `round-start` · `round-plan` 을 먼저 하라고 알린다.
- 이번 대화에서 사람이 plan 을 승인했는지 확인한다. 분명하지 않으면 묻는다.

## 2. 구현
- plan 의 절 순서대로 한다. 선행 정리(0절)가 있으면 그것부터 하고, 끝나면 기존 테스트가 그대로 통과하는지 확인한다.
- plan 에 없는 기능, 파일, 리팩터링은 하지 않는다. plan 대로 할 수 없으면 멈추고 사람에게 알린다.
- 테스트는 plan 의 tests 절대로 쓴다. 테스트를 지우거나 약하게 고쳐서 통과시키지 않는다.
- Hook 이나 권한 규칙에 막힌 작업은 다른 명령으로 우회하지 않는다. 멈추고 사람에게 무엇이 왜 막혔는지 보고한다.
- 구현이 끝나면 `CLAUDE.md` 에 적힌 테스트 · 린트 명령을 직접 돌려 통과를 확인한다.

## 3. 검증 (verifier 에이전트)
- `verifier` 서브에이전트(이 플러그인의 `sdd-harness:verifier`)를 부른다. 프롬프트에 넣을 것:
  - 라운드 번호와 `docs/roundNN/spec.md` · `plan.md` 경로
  - 바꾼 파일 목록
  - "코드를 고치지 말고 보고만 하라"
- 구현한 쪽의 설명이나 결론을 verifier 에게 미리 주지 않는다. 다른 눈으로 보게 한다.

## 4. `docs/roundNN/review.md` 쓰기
지난 라운드 review 와 같은 모양으로 쓴다. 이 단계에서 채우는 절:

```
# roundNN review

## 진행 방식
## 구현 (plan 0~N절)     (절마다 실제로 한 것, plan 과 달라진 점과 이유)
## 검증 결과 (verifier)  (결론, 통과한 것, 지적 1..N 을 번호로)
## 조치                   (지적마다: 고침 / 다음 라운드로 넘김 + 이유)
```

- verifier 의 지적은 요약하더라도 빼지 않는다.
- 정리(cleaner), 종료 조건 점검, 회고는 `round-close` 에서 채운다.

## 5. 조치
- 지적마다 고칠지 넘길지 정한다.
  - 코드 버그 · 테스트 빈틈: 고치고 테스트를 더한다.
  - spec 이 정하지 않아 생긴 빈칸: 사람에게 어떻게 정할지 묻고, 정해지면 spec · plan 에도 규칙을 더한 뒤 고친다.
  - 범위 밖이거나 동작이 크게 바뀌는 것: 고치지 않고 "다음 라운드로 넘기는 것" 후보로 적는다.
- 고친 뒤 테스트 · 린트를 다시 돌린다. 고친 것이 크면 verifier 를 한 번 더 부른다.
- review.md 의 조치 절을 실제 결과로 갱신한다.

## 6. 멈추기
- SSOT 와 ROADMAP 은 아직 고치지 않는다.
- 사람에게 구현 · 검증 · 조치 요약과 남은 지적을 보여 주고, 다음 단계는 `round-close` 라고 알려 준다.
