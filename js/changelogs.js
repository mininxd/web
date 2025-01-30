let version = "1.3"
if(localStorage.getItem("changelogs") == version) {
  changelogs.classList.add("hidden")
}
closeChangelog.addEventListener('click', () => {
  changelogs.classList.add("hidden")
  localStorage.setItem("changelogs", version)
})

