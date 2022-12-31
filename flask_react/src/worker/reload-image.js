import { createClient } from "redis";

export async function reloadImage(img_ctx) {
  console.log("Starting reloading of images in web worker");
  const client = createClient();

  client.on("error", (err) => console.log("Redis client error in web worker", err));

  await client.connect();

  // Convert image context to JSON string
  const img_ctx_json = JSON.stringify(img_ctx);

  while (true) {
    let numRemoved = await client.lRem("react_image_done", 1, img_ctx_json);

    if (numRemoved === 1) {
      console.log("Image context found for user in redis, reloading page");
      break;
    }

    // Sleep for 1 second before trying to remove from queue/redis list again
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await client.disconnect();

}
