---
name: round-plan
description: 사람이 승인한 docs/roundNN/spec.md 로 docs/roundNN/plan.md 를 쓴다. 어떻게 만들지 파일 · 함수 · 테스트 단위로 정하고 사람의 승인을 기다린다. 코드는 쓰지 않는다.
argument-hint: "[roundNN]"
disable-model-invocation: true
---

# round-plan · plan 쓰기

spec 이 **무엇을** 정했다면 plan 은 **어떻게** 를 정한다. plan 만 쓰고 멈춘다.

## 0. 규칙 먼저
- 프로젝트 루트의 `CLAUDE.md` 를 읽는다. 코드 규칙(계층, 응답 형식 등)과 라운드 종료 조건이 plan 에 반영돼야 한다.

## 1. 대상 라운드와 전제 확인
- 인자로 라운드가 주어졌으면(`$ARGUMENTS`) 그 라운드, 아니면 `docs/ROADMAP.md` 에서 상태가 `완료` 가 아닌 첫 라운드.
- `docs/roundNN/spec.md` 가 없으면 멈추고 `round-start` 를 먼저 하라고 알린다.
- 이번 대화에서 사람이 spec 을 승인했는지 확인한다. 승인 여부가 분명하지 않으면 묻는다.
- spec 에 `## 사람이 정할 것` 이 남아 있으면 그것부터 사람에게 묻는다.

## 2. 읽을 것
- `docs/roundNN/spec.md`, `docs/SSOT.md`, 바로 앞 라운드의 `plan.md` · `review.md`
- spec 이 건드리는 지금 코드와 테스트 (읽기만)

## 3. `docs/roundNN/plan.md` 쓰기
지난 라운드 plan 과 같은 모양으로 쓴다. 기본 틀:

```
# roundNN plan

spec: `docs/roundNN/spec.md`

## 0. 선행 정리      (spec 의 이월분. 없으면 절을 뺀다)
## 1. <계층/모듈>     (함수 이름 · 시그니처 · 상수 · 오류 처리)
## 2. <계층/모듈>
## 3. tests           (spec 완료 기준 하나하나를 어떤 테스트로 확인하는지)
## 4. 마무리 (라운드 종료 조건)   (CLAUDE.md 의 종료 조건을 이번 라운드에 맞게 풀어 쓴다)
## 바꾸는 파일        (바꾸지 않는 파일과 그 이유도)
```

- spec 의 요구사항과 완료 기준이 plan 어딘가에 빠짐없이 대응돼야 한다. 대응이 없는 항목이 있으면 plan 을 고치거나 사람에게 묻는다.
- 경계값과 잘못된 입력 테스트를 tests 절에 이름까지 적는다.
- 마무리 절에는 verifier 검증 → review.md 기록, cleaner 정리 → review.md 기록, SSOT 갱신 항목, 테스트 · 린트 명령, ROADMAP 완료 표시를 넣는다. 명령은 `CLAUDE.md` 에 적힌 것을 그대로 쓴다.

## 4. 멈추기
- 코드, 테스트, SSOT, ROADMAP 은 **쓰지 않는다**.
- plan 을 쓰다가 spec 에 빈칸이나 모순을 찾으면 spec 을 몰래 고치지 말고 사람에게 알린다.
- 사람에게 plan 요약(단계, 바꾸는 파일, 테스트 목록)을 보여 주고 승인을 기다린다.
- 승인을 받으면 다음 단계는 `round-build` 라고 알려 준다.
