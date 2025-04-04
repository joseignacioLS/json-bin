import fs from "fs";

const CHUNK_SIZE = 20;
const HIDDEN_COLLECTIONS = ["5-7-5", "3-5-3"];
fs.readFile("./haikus.json", { encoding: "utf8" }, (err, data) => {
  const haikus = JSON.parse(data).filter(h => h.show).sort((a, b) => b.id - a.id);
  const collections = Array.from(
    new Set(
      haikus.reduce((tags, { tags: newTags }) => [...tags, ...newTags], [])
    )
  ).filter((tag) => !HIDDEN_COLLECTIONS.includes(tag));
  const totalChunks = Math.ceil(haikus.length / CHUNK_SIZE);
  fs.writeFile(
    "./director.json",
    JSON.stringify({
      totalChunks,
      chunkSize: CHUNK_SIZE,
      collections,
    }),
    (err, data) => {
      err && console.log(err);
    }
  );
  for (let i = 0; i < totalChunks; i++) {
    fs.writeFile(
      `./chunk_${i}.json`,
      JSON.stringify(
        haikus.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
        null,
        2
      ),
      (err) => {
        if (err) {
          console.log("Error with chunk ", i);
        }
      }
    );
  }
});
