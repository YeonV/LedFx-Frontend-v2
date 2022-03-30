export const formatTime = (dura: number) => {
  let seconds: string | number;
  let minutes: string | number;
  seconds = Math.floor((dura / 1000) % 60);
  minutes = Math.floor((dura / (1000 * 60)) % 60);
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${seconds}`;
};

export const test = (dura: number) => {
  let seconds: string | number;
  let minutes: string | number;
  seconds = Math.floor((dura / 1000) % 60);
  minutes = Math.floor((dura / (1000 * 60)) % 60);
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${seconds}`;
};
