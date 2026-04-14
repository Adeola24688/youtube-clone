export const API_KEY = "AIzaSyDo-77v3CW0k8-lb-rWmXpgE5lcFXGH5ew";

export const value_converter = (value) => {
  if (value >= 100000) {
    return Math.floor(value / 100000) + "M";
  } else if (value >= 1000) {
    return Math.floor(value / 1000) + "K";
  } else {
    return value;
  }
};
