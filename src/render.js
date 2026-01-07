const blockedList = `        
<div class="lg:col-auto mb-4">
          <div id="topBlockedWrapper" class="hidden h-0 max-h0 w-full">
              <div class="card-body border border-gray-500 rounded-md p-4">
                <h1 id="top_blocked_domains_text" class="font-bold text-xl font-jetbrains mb-2">Top Blocked Domains :</h1>
                <div id="topBlocked" class="text-sm font-outfit space-y-1">
                </div>
              </div>
          </div>
        </div>
`

const wrapperElement = `
        <div id="wrapper" class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

              <!-- DNS-over-TLS -->
              <div class="flex flex-col">
                <fieldset class="field border-1 rounded-md w-full h-full flex flex-col justify-center">
                  <legend id="dns_over_tls_text" class="text-lg ml-2">DNS-over-TLS</legend>
                  <p id="dotUrl" class="text-2xl font-bold font-jetbrains px-2 tooltip break-all" data-tip="Copied!">dns.mininxd.xyz</p>
                  <p id="familyDotUrl" class="text-lg font-bold font-jetbrains px-2 tooltip break-all" data-tip="Copied!">family.dns.mininxd.xyz</p>
                </fieldset>
                <a href="https://docs-mininxd.vercel.app/dns/dot.html" target="_blank" class="mt-2">
                  <span id="how_to_connect_dot_text" class="font-jetbrains px-2 underline">
                  How To Connect DoT <i class="ri-arrow-right-up-line"></i>
                  </span>
                </a>
              </div>

              <!-- DNS-over-HTTPS -->
              <div class="flex flex-col">
                <fieldset class="field border-1 rounded-md w-full h-full flex flex-col justify-center">
                  <legend id="dns_over_https_text" class="text-lg ml-2">DNS-over-HTTPS</legend>
                  <p id="dohUrl" class="font-jetbrains font-bold text-md px-2 tooltip tooltip-xs mb-1 break-all" data-tip="Copied!">https://dns.mininxd.xyz/dns-query</p>
                  <p id="familyDohUrl" class="font-jetbrains font-bold text-md px-2 tooltip tooltip-xs mb-1 break-all" data-tip="Copied!">https://dns.mininxd.xyz/family</p>
                </fieldset>
                <a href="https://docs-mininxd.vercel.app/dns/doh.html" target="_blank" class="mt-2">
                  <span id="how_to_connect_doh_text" class="font-jetbrains px-2 underline">
                  How To Connect DoH <i class="ri-arrow-right-up-line"></i>
                  </span>
                </a>
              </div>
          </div>
        </div>
        `

if(navigator.userAgent.includes("Mobile")) {
  app.innerHTML = blockedList + wrapperElement
} else {
  app.innerHTML = wrapperElement + blockedList
}