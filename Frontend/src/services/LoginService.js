import http from "../http-common";

const LoginService = data => (
	http.post("/users/login", data)
		.then(res => res.status)
)

export default LoginService;