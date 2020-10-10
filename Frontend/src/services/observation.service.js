import http from "../http-common";

class ObservationDataService {
  getAll() {
    return http.get("/observations");
  }

  get(id) {
    return http.get(`/observations/${id}`);
  }


  create(data) {
    return http.post("/observations", data);
  }

  update(id, data) {
    return http.put(`/observations/${id}`, data);
  }

  delete(id) {
    return http.delete(`/observations/${id}`);
  }

  deleteAll() {
    return http.delete(`/observations`);
  }

  findByTitle(title) {
    return http.get(`/observations?title=${title}`);
  }

  uploadImage(id, data) {
    return http.put(`/observations/image_upload/${id}`, data);
  }
}

export default new ObservationDataService();