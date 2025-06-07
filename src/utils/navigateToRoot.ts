export function navigateToRoot() {
  // 1. Create a URL object from the current location.
  const currentUrl = new URL(window.location.href)

  // 2. Create a URLSearchParams object to manage the main query parameters.
  const mainParams = new URLSearchParams(currentUrl.search)

  // 3. Check if the hash itself contains a query string.
  if (currentUrl.hash.includes('?')) {
    // Split the hash into its path and query parts.
    const hashParts = currentUrl.hash.split('?')
    const hashQueryString = hashParts[1]

    // Create a params object for the query string found inside the hash.
    const hashParams = new URLSearchParams(hashQueryString)

    // 4. Merge the parameters from the hash into the main parameters.
    hashParams.forEach((value, key) => {
      mainParams.append(key, value)
    })
  }

  // 5. Update the URL object's main search property with the merged params.
  currentUrl.search = mainParams.toString()

  // 6. Now that all parameters are safe, reset the hash to your app's root.
  //    THIS IS THE CORRECTED LINE:
  currentUrl.hash = '#/'

  // 7. Navigate to the perfectly constructed new URL.
  window.location.href = currentUrl.href
}

// To use it:
navigateToRoot()
