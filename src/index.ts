import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "async-file";

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

export class Cache {
  private pathToFile!: string;
  private data!: { [key: string]: any };

  async init() {
    this.pathToFile = path.resolve(dirName, "../.cache/", "data.json");

    if (await fs.exists(this.pathToFile)) {
      await this.readData();
    } else {
      this.data = {};
      await this.createDirAndFile();
    }
  }

  async get(key: string) {
    await this.readData();

    return this.data[key];
  }

  async getAll() {
    await this.readData();

    return this.data;
  }

  async set(key: string, value: any) {
    await this.readData();

    this.data[key] = value;

    await this.saveData();
  }

  async delete(key: string) {
    await this.readData();

    delete this.data[key];

    await this.saveData();
  }

  async deleteAll() {
    this.data = {};

    await this.saveData();
  }

  private async createDirAndFile() {
    await fs.createDirectory(path.resolve(dirName, "../.cache/"));
    await fs.writeFile(this.pathToFile, JSON.stringify(this.data));
  }

  private async readData() {
    const jsonString = await fs.readFile(this.pathToFile, "utf8");
    this.data = JSON.parse(jsonString);
  }

  private async saveData() {
    await fs.writeFile(this.pathToFile, JSON.stringify(this.data));
  }
}
