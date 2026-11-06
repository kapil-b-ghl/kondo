# Handoff · Fastpay payments, detail and refund

| | |
| --- | --- |
| Product | FastPay (LC Payments) |
| PRD journeys | J8.2 · J8.3 · J8.4 |
| Status | ready-for-dev |
| Owner | Kapil |
| Generated | 2026-11-06 |

Filterable payments list, payment detail with fee and net breakdown and timeline, refund with the refund fee shown before confirming.

## Screens to build
- `#/p/fastpay/payments`
- `#/p/fastpay/payments/pay_7Q2KX9`
- `#/p/fastpay/payments/pay_7Q2KX9?refund=1`
- `#/p/fastpay/payments/pay_7Q2KJ2`

Open the prototype and use the dark bar at the top to switch account state. Every state below is reachable from the URL.

## States
- [ ] list
- [ ] filtered-empty
- [ ] detail
- [ ] refund-full
- [ ] refund-partial
- [ ] disputed
- [ ] failed
- [ ] no-permission

## HighRise components (use these, don't rebuild them)
| Component | Code | Figma | Audit |
| --- | --- | --- | --- |
| Alert | `HrAlert` · `src/components/alert/HrAlert.vue` | [1130:81134](https://www.figma.com/design/emjjdhZIMlqbszmzP9PdS6/HighRise-1.1?node-id=1130-81134) | matches-with-open-questions |
| App shell & left nav | `HrAppShell` · `src/components/app-shell/HrAppShell.vue` | not in Figma yet | from-prototype |
| Button | `HrButton` · `src/components/button/HrButton.vue` | [26682:45841](https://www.figma.com/design/emjjdhZIMlqbszmzP9PdS6/HighRise-1.1?node-id=26682-45841) | matches-with-open-questions |
| Card | `HrCard` · `src/components/card/HrCard.vue` | [28034:39237](https://www.figma.com/design/emjjdhZIMlqbszmzP9PdS6/HighRise-1.1?node-id=28034-39237) | from-prototype |
| Description list | `HrDescriptionList` · `src/components/description-list/HrDescriptionList.vue` | not in Figma yet | from-prototype |
| Empty State | `HrEmptyState` · `src/components/empty-state/HrEmptyState.vue` | [27168:7769](https://www.figma.com/design/emjjdhZIMlqbszmzP9PdS6/HighRise-1.1?node-id=27168-7769) | partial |
| Input Field | `HrInput` · `src/components/input/HrInput.vue` | [26683:37578](https://www.figma.com/design/emjjdhZIMlqbszmzP9PdS6/HighRise-1.1?node-id=26683-37578) | partial |
| Modal & drawer | `HrModal` · `src/components/modal/HrModal.vue` | [28471:118828](https://www.figma.com/design/emjjdhZIMlqbszmzP9PdS6/HighRise-1.1?node-id=28471-118828) | partial |
| Pagination | `HrPagination` · `src/components/pagination/HrPagination.vue` | [27457:34219](https://www.figma.com/design/emjjdhZIMlqbszmzP9PdS6/HighRise-1.1?node-id=27457-34219) | matches-with-open-questions |
| Select | `HrSelect` · `src/components/select/HrSelect.vue` | [26683:57778](https://www.figma.com/design/emjjdhZIMlqbszmzP9PdS6/HighRise-1.1?node-id=26683-57778) | partial |
| Table | `HrTable` · `src/components/table/HrTable.vue` | [28471:129338](https://www.figma.com/design/emjjdhZIMlqbszmzP9PdS6/HighRise-1.1?node-id=28471-129338) | partial |
| Tabs | `HrTabs` · `src/components/tabs/HrTabs.vue` | [26957:20865](https://www.figma.com/design/emjjdhZIMlqbszmzP9PdS6/HighRise-1.1?node-id=26957-20865) | matches |
| Tag | `HrTag` · `src/components/tag/HrTag.vue` | [26957:99489](https://www.figma.com/design/emjjdhZIMlqbszmzP9PdS6/HighRise-1.1?node-id=26957-99489) | matches-with-open-questions |
| Timeline | `HrTimeline` · `src/components/timeline/HrTimeline.vue` | not in Figma yet | from-prototype |
| Toggle | `HrToggle` · `src/components/toggle/HrToggle.vue` | [26953:5957](https://www.figma.com/design/emjjdhZIMlqbszmzP9PdS6/HighRise-1.1?node-id=26953-5957) | matches-with-open-questions |

## Tokens used directly by the screens
`--hr-color-neutral-gray-200` · `--hr-color-neutral-gray-300` · `--hr-color-neutral-gray-600` · `--hr-color-neutral-gray-800` · `--hr-color-neutral-gray-900` · `--hr-color-neutral-white-base` · `--hr-color-primary-blue-300` · `--hr-font-family` · `--hr-font-weight-semibold` · `--hr-text-5xl` · `--hr-text-md` · `--hr-text-neutral-base` · `--hr-text-neutral-title-1` · `--hr-text-on-color` · `--hr-text-sm`

## Data each payment needs
```ts
export interface Payment {
  id: string; psp: string; amt: number; status: PayStatus; customer: string; email: string;
  channel: string; channelDetail: string; method: string; date: string; refunded: number;
}
```
Money is USD. The fee shown to merchants is the sticker rate only; never show interchange, scheme fees or IC++ (PRD J8 rules).

## Behaviour to keep
- Mark an order paid from the AUTHORISATION webhook, not the browser redirect (PRD J6).
- Refund: show the refund fee and the total taken from the balance **before** the merchant confirms; take the fee only after REFUND succeeds, once per refund reference (PRD J8).
- Refund is disabled for disputed and failed payments and for people without the refund permission.
- Times in the sub-account's time zone.

## Open design questions on the components used
- **Alert:** Alert uses 8px padding with a 12px corner radius, so the icon sits close to the curved corner. Most HighRise surfaces pair 12px radius with 12–16px padding.
- **App shell & left nav:** The new left nav is not in the HighRise 1.1 file. Built from the FastPay prototype's Shared nav board and the left-nav prototype. Add it to Figma (Primary Navigation Toolbar 28471:86099 is the old top nav).
- **Card:** Card lives on the BACKLOG page in Figma, not in Components. Code uses the FastPay prototype values (gray/200 border, 12px radius). Promote a Card to the library.
- **Input Field:** 3xs (24px), 2xs (28px) and xs (32px) all use 14/20 text. In a 24px box that leaves 2px above and below. Suggest 12/17 at 3xs and 13/18 at 2xs.
- **Input Field:** 3xs focused border is blue/600; every other size uses blue/300 when focused.
- **Input Field:** Hover drops the xs shadow; focus brings it back. Confirm the shadow should disappear on hover.
- **Modal & drawer:** The Figma Side Panel (28471:97971) is a tab rail, not a detail drawer. The right drawer reuses the Modal tokens. Add a Drawer to Figma if it should differ.
- **Pagination:** The current page uses a blue/500 border. No other HighRise component uses blue/500 for a border (focus uses blue/300, hover blue/600).
- **Select:** Select md has 14px side padding, Input Field md has 12px. They sit side by side in forms, so the text does not line up. Pick one.
- **Table:** Header cells use a gray/300 bottom border while body rows in the FastPay prototype use gray/200. Figma cells share one Border property; confirm the header should be heavier.
- **Tag:** Gray tag: hover background equals default (both gray/100), only the border changes. Other colours step 50 → 100.
- **Tag:** Pink tag: active background is pink/100, every other colour uses 200 for active.
- **Tag:** lg uses the same 13/18 text as md; only height changes (28 vs 24). Confirm lg should not step to 14/20.
- **Toggle:** Disabled-on and disabled-off look identical (both gray/100 track, gray/50 knob), so a disabled toggle never shows its value. Suggest a blue/200 track for disabled-on.
- **Toggle:** Focused-off lightens the track to gray/50, lighter than its resting gray/100. Focus usually darkens or keeps the track.

## Source
- `src/playground/fastpay/Payments.vue`
- `src/playground/fastpay/parts/FastpayFrame.vue`
- `src/playground/_kit/ScenarioBar.vue`
- `src/playground/fastpay/nav.ts`
- `src/playground/fastpay/data.ts`
- `src/router.ts`
- `src/playground/fastpay/PaymentDetail.vue`
- `src/playground/fastpay/parts/RefundModal.vue`
