import http from "../http-common";

class UserDataService {
  getAll() {
    return http.get("/users");
  }

  get(id) {
    return http.get(`/users/${id}`);
  }

  // Create a new Project
  create(data) {
    return http.post("/users", data);
  }

  update(id, data) {
    return http.put(`/users/_${id}`, data);
  }

  delete(id) {
    return http.delete(`/users/${id}`);
  }

  deleteAll() {
    return http.delete(`/users`);
  }

  findByUserName(username) {
    return http.get(`/users?username=${username}`);
  }
}

export default new UserDataService();