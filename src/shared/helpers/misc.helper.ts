import { FlashMessage, Nil, setContext } from "../interfaces/misc.interfaces";

function getFlash(setFlashMessage: setContext<FlashMessage>, [code, message]: [symbol, string]) {
  setFlashMessage([code, message]);

  setTimeout(() => {
    clearFlash(setFlashMessage);
  }, 1500);
}

function clearFlash(setFlashMessage: setContext<FlashMessage>) {
  setFlashMessage([Nil, ""]);
}

function readDate(date: Date | string) {
  date = typeof date === "string" ? new Date(date) : date;

  const year = String(date.getFullYear());
  const month = String(date.getMonth()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`
}

function readDateTime(datetime: Date | string) {
  datetime = typeof datetime === "string" ? new Date(datetime) : datetime;

  const year = String(datetime.getFullYear());
  const month = String(datetime.getMonth()).padStart(2, "0");
  const day = String(datetime.getDate()).padStart(2, "0");

  const hours = String(datetime.getHours()).padStart(2, "0");
  const minutes = String(datetime.getMinutes()).padStart(2, "0");
  const seconds = String(datetime.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`
}

export { clearFlash, getFlash, readDate, readDateTime }