const axios = require("axios");

const DEFAULT_HEADERS = {
  accept: "application/json",
  apikey: "0000000000",
  "Client-Agent": "unknown:0:unknown",
  "Content-Type": "application/json",
};

const DEFAULT_PROMPT = {
  width: 800,
  height: 600,
  color: "red",
  style: "abstract",
};

const waitfor = (x) =>
  new Promise((resolve) => {
    setTimeout(resolve, x);
  });

module.exports.fetchImageFromApi = async ({ finishLine }) => {
  const { data: { id } = {} } = await axios.post(
    "https://stablehorde.net/api/v2/generate/async",
    { ...DEFAULT_PROMPT, prompt: finishLine },
    { headers: DEFAULT_HEADERS }
  );

  let isFinished = false;

  while (!isFinished) {
    const {
      data: { finished, wait_time: waitTime, generations, ...rest } = {},
    } = await axios.get(
      `https://stablehorde.net/api/v2/generate/status/${id}`,
      {
        headers: DEFAULT_HEADERS,
      }
    );

    if (finished) return generations?.[0]?.img;

    console.log(`Waiting for ${waitTime}`);
    await waitfor(waitTime * 1000);
  }
};