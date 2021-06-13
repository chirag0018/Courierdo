export const RoutesFetch = (path, options = {}) =>
  fetch(`${path}`, options).then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error("Something Went Wrong! Please Try Again");
  });
