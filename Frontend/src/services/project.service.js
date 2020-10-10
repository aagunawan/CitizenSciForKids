import http from "../http-common";

class ProjectDataService {
  getAll() {
    return http.get("/projects");
  }

  get(id) {
    return http.get(`/projects/${id}`);
  }

  // Create a new Project
  create(data) {
    return http.post("/projects", data);
  }

  update(id, data) {
    return http.put(`/projects/_${id}`, data);
  }

  delete(id) {
    return http.delete(`/projects/${id}`);
  }

  deleteAll() {
    return http.delete(`/projects`);
  }

  findByName(name) {
    return http.get(`/projects?name=${name}`);
  }
}

export default new ProjectDataService();