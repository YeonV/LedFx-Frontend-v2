/* eslint-disable */
/* eslint-disable @typescript-eslint/indent */
export const drawerWidth = 240
export const frontendConfig = 9

export const formatTime = (dura: number) => {
  let seconds: string | number
  let minutes: string | number
  seconds = Math.floor((dura / 1000) % 60)
  minutes = Math.floor((dura / (1000 * 60)) % 60)
  minutes = minutes < 10 ? `0${minutes}` : minutes
  seconds = seconds < 10 ? `0${seconds}` : seconds

  return `${minutes}:${seconds}`
}

export const camelToSnake = (str: string) =>
  str[0].toLowerCase() +
  str
    .slice(1, str.length)
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export const download = (
  content: any,
  fileName: string,
  contentType: string
) => {
  const a = document.createElement('a')
  const file = new Blob([JSON.stringify(content, null, 4)], {
    type: contentType,
  })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}

export const getOverlapping = (data: any) => {
  const tmp = {} as any
  data.forEach(([name, start, end]: [string, number, number]) => {
    if (!tmp[name]) {
      tmp[name] = {}
      data.forEach(() => {
        tmp[name].items = []
        tmp[name].overlap = false
        tmp[name].items.push([start, end])
      })
    } else {
      tmp[name].items.push([start, end])
    }
  })
  Object.keys(tmp).forEach((e) =>
    tmp[e].items
      .sort(([startA]: [number], [startB]: [number]) => startA > startB)
      .forEach(([start, end]: [number, number], i: number) => {
        if (tmp[e].items[i + 1]) {
          const [startNew, endNew] = tmp[e].items[i + 1]
          if (startNew <= end && endNew >= start) {
            tmp[e].overlap = true
          }
        }
      })
  )
  return tmp
}

export const swap = (array: any[], i: number, j: number) => {
  const arr = [...array]
  arr[i] = arr.splice(j, 1, arr[i])[0];
  return arr
}

export const deleteFrontendConfig = () => {
  window.localStorage.removeItem('undefined')
  window.localStorage.removeItem('ledfx-storage')
  window.localStorage.removeItem('ledfx-host')
  window.localStorage.removeItem('ledfx-hosts')
  window.localStorage.removeItem('ledfx-ws')
  window.localStorage.removeItem('ledfx-theme')
  window.localStorage.removeItem('ledfx-frontend')
  window.location.reload()
}

export const initFrontendConfig = () => {
  if (
    parseInt(window.localStorage.getItem('ledfx-frontend') || '0', 10) >=
    frontendConfig
  ) {
    return
  }
  deleteFrontendConfig()
  window.localStorage.setItem('ledfx-frontend', `${frontendConfig}`)
}

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
    )
  }
}

export const sleep = (ms: number) => {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const filterKeys = (obj: Record<string, any>, keys = [] as string[]) => {
  // NOTE: Clone object to avoid mutating original!
  const objct = JSON.parse(JSON.stringify(obj))

  keys.forEach((key) => delete objct[key])

  return objct
}

export const ordered = (unordered: Record<string, any>) =>
  Object.keys(unordered)
    .sort()
    .reduce((obj: any, key) => {
      // eslint-disable-next-line no-param-reassign
      obj[key] = unordered[key]
      return obj
    }, {})

export function transpose(matrix: any[][]) {
  const res = [];
  for(let i = 0;  i < matrix[0].length; i++) {
    res[i] = [] as any;
    for(let j = 0;  j < matrix.length; j++) {
      res[i][j] = matrix[j][i];
    }
  }
  return res; 
}

export const ios =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.userAgent === 'MacIntel' && navigator.maxTouchPoints > 1)