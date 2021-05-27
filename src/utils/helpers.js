export const camelToSnake = (str) =>
  str[0].toLowerCase() +
  str
    .slice(1, str.length)
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const download = (content, fileName, contentType) => {
  var a = document.createElement("a");
  var file = new Blob([JSON.stringify(content, null, 4)], {
    type: contentType,
  });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};
export const drawerWidth = 240;
