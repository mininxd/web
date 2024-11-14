gsap.registerPlugin(Draggable)

function drag(elem) {
Draggable.create(elem, {
  type: "x,y",
  inertia: true,
  allowEventDefault: true,
  zIndexBoost:true
});
}

drag("#changelogs")