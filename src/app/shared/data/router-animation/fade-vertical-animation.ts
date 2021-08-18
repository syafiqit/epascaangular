import { trigger, animate, transition, style, state } from '@angular/animations';

export const fadeVerticalAnimation = trigger("fadeVerticalAnimation", [
  state(
    "void",
    style({
      height: "0px",
      overflow: "hidden"
    })
  ),
  transition(":enter", [
    animate(
      "500ms ease-in-out",
      style({
        height: "*",
        overflow: "hidden"
      })
    )
  ]),
  transition(":leave", [
    animate(
      "500ms ease-in-out",
      style({
        height: "0px",
        overflow: "hidden"
      })
    )
  ])
]);
