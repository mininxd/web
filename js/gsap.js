gsap.registerPlugin(Draggable)

function drag(elem) {
Draggable.create(elem, {
  type: "x,y",
  inertia: true,
  allowEventDefault: true,
  zIndexBoost:true,
  // bounds: bodyEl
});
}

drag("#changelogs")
drag("#warning")

if(!navigator.userAgent.includes("Mobile")) {
  drag("#windowEl")
}