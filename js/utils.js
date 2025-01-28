export function checkLogs() {
  if(logs.value.length <= 5) {
    errLogs.classList.add("hidden");
  } else {
    errLogs.classList.remove("hidden");
  }
}

checkLogs();