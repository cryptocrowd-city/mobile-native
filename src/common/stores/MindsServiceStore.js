import mindsService from "../services/minds.service";


export default class MindsServiceStore {
  loading = false;
  promise;

  async getSettings() {
    if (this.loading) {
      const result = await this.promise;
      this.loading = false;
      return result;
    }

    this.loading = true;

    this.promise = mindsService.getSettings();

    return await this.promise;
  }
}
