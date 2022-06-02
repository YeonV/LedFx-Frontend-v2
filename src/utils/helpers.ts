/* eslint-disable @typescript-eslint/indent */
export const drawerWidth = 240;
export const frontendConfig = 4;

export const formatTime = (dura: number) => {
  let seconds: string | number;
  let minutes: string | number;
  seconds = Math.floor((dura / 1000) % 60);
  minutes = Math.floor((dura / (1000 * 60)) % 60);
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${seconds}`;
};

export const camelToSnake = (str: string) =>
  str[0].toLowerCase() +
  str
    .slice(1, str.length)
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const download = (
  content: any,
  fileName: string,
  contentType: string
) => {
  const a = document.createElement('a');
  const file = new Blob([JSON.stringify(content, null, 4)], {
    type: contentType,
  });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};

export const getOverlapping = (data: any) => {
  const tmp = {} as any;
  data.forEach(([name, start, end]: [string, number, number]) => {
    if (!tmp[name]) {
      tmp[name] = {};
      data.forEach(() => {
        tmp[name].items = [];
        tmp[name].overlap = false;
        tmp[name].items.push([start, end]);
      });
    } else {
      tmp[name].items.push([start, end]);
    }
  });
  Object.keys(tmp).forEach((e) =>
    tmp[e].items
      .sort(([startA]: [number], [startB]: [number]) => startA > startB)
      .forEach(([start, end]: [number, number], i: number) => {
        if (tmp[e].items[i + 1]) {
          const [startNew, endNew] = tmp[e].items[i + 1];
          if (startNew <= end && endNew >= start) {
            tmp[e].overlap = true;
          }
        }
      })
  );
  return tmp;
};

/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["array"] }] */
export const swap = (array: any[], i: number, j: number) => {
  [array[i], array[j]] = [array[j], array[i]];
};

export const deleteFrontendConfig = () => {
  window.localStorage.removeItem('undefined');
  window.localStorage.removeItem('ledfx-host');
  window.localStorage.removeItem('ledfx-hosts');
  window.localStorage.removeItem('ledfx-ws');
  window.localStorage.removeItem('ledfx-theme');
  window.localStorage.removeItem('ledfx-frontend');
};

export const initFrontendConfig = () => {
  if (
    parseInt(window.localStorage.getItem('ledfx-frontend') || '0', 10) >=
    frontendConfig
  ) {
    return;
  }
  deleteFrontendConfig();
  window.localStorage.setItem('ledfx-frontend', `${frontendConfig}`);
};

export const log = (...props: any[]) => {
  if (typeof props[0] === 'string') {
    // eslint-disable-next-line no-console
    console.log(
      `%c ${props[0]
        .replace('success', '')
        .replace('warning', '')
        .replace('info', '')} `,
      `padding: 3px 5px; border-radius: 5px; background: #${
        props[0].indexOf('success') !== -1
          ? '1db954; color: #fff; font-weight: 700;'
          : props[0].indexOf('info') !== -1
          ? '0dbedc; color: #fff; font-weight: 700;'
          : props[0].indexOf('warning') !== -1
          ? 'FF7514; color: #fff; font-weight: 700;'
          : '800000; color: #fff;'
      }`,
      ...props.slice(1, props.length)
    );
  }
};
