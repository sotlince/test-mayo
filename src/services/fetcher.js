class Fetcher {
  constructor() {
    this.baseUrl = 'http://localhost:4000/api'; // TODO: Cambiar a la URL de producción
  }

  async #fetch({ method = 'GET', path, body }) {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const options = { method, headers, body: JSON.stringify(body) };
    try {
      const response = await fetch(`${this.baseUrl}/${path}`, options);
      if (!response.ok) {
        throw new Error(response.statusText);   
      }
      return await response.json();
    } catch (error) {
      console.error(`Unable to ${method} /${path}:`, error);
      throw error;
    }
  }

  async get(path, opts = {}) {
    return await this.#fetch({method: 'GET', path});
  }

  async post(path, body, opts = {}) {
    return await this.#fetch({method: 'POST', path, body});
  }

  async put(path, body, opts = {}) {
    return await this.#fetch({method: 'PUT', path});
  }

  async delete(path, opts = {}) {
    return await this.#fetch({method: 'DELETE', path});
  }
}

export const fetcher = new Fetcher();
