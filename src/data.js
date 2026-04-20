export const API_KEY = "AIzaSyAChxp5UmueyUN_kAIbPWZpve6-Y3kK3T8";

export const value_converter = (value) => {
  if (value >= 100000) {
    return Math.floor(value / 100000) + "M";
  } else if (value >= 1000) {
    return Math.floor(value / 1000) + "K";
  } else {
    return value;
  }
};
