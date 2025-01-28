let version = "1.2.1"
if(localStorage.getItem("changelogs") == version) {
  changelogs.classList.add("hidden")
}
closeChangelog.addEventListener('click', () => {
  changelogs.classList.add("hidden")
  localStorage.setItem("changelogs", version)
})

