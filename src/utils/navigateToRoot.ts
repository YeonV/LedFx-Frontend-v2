export function navigateToRoot() {
  // 1. Create a URL object from the current location.
  const currentUrl = new URL(window.location.href)

  // 2. Create a URLSearchParams object to gather ALL parameters.
  // Start with any parameters that might be in the main search part.
  const allParams = new URLSearchParams(currentUrl.search)

  // 3. Check if the hash itself contains a query string and merge those params.
  if (currentUrl.hash.includes('?')) {
    const hashQueryString = currentUrl.hash.split('?')[1]
    const hashParams = new URLSearchParams(hashQueryString)

    // Add params from the hash to our collection. `set` overwrites any
    // duplicates from the main search, which is usually desired.
    hashParams.forEach((value, key) => {
      allParams.set(key, value)
    })
  }

  // 4. Now, we build the new hash string. Start with the root path.
  let newHash = '#/'

  // 5. If we collected any parameters, convert them to a string and append.
  const finalQueryString = allParams.toString()
  if (finalQueryString) {
    newHash += '?' + finalQueryString
  }
  // newHash is now either `"#/"` or `"#/?param=value&..."`

  // 6. Finally, modify the original URL object.
  // IMPORTANT: Clear the main search part completely.
  currentUrl.search = ''
  // Set the new hash we just built.
  currentUrl.hash = newHash

  // 7. Navigate.
  window.location.href = currentUrl.href
}
