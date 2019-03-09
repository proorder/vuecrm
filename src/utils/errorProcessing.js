import setAuthorizationToken from "./setAuthorizationToken";

export default error => {
  if (error.response === undefined) {
    return;
  }
  if (error.response.status === 401) {
    setAuthorizationToken(false);
  } else if (error.response.status === 400) {
    // Требуется создать tost о не загруженном файле
  }
};
