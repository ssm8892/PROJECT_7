/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 * @returns a Promise that should be filled with the response of the GET request
 * parsed as a JSON object and returned in the property named "data" of an
 * object. If the request has an error, the Promise should be rejected with an
 * object that contains the properties:
 * {number} status          The HTTP response status
 * {string} statusText      The statusText from the response
 */
function fetchModel(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          reject(new Error(`HTTP Error: ${response.status} - ${response.statusText}`));
        } else {
          response.json().then((data) => {
            resolve({ data });
          }).catch(() => {
            reject(new Error("Error parsing JSON response"));
          });
        }
      })
      .catch((networkError) => {
        reject(new Error(networkError.message || "Network Error"));
      });
  });
}

export default fetchModel;
