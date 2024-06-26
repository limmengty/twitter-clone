import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    loggedUser: {},
    useId: "",
    pictureProfie: ""
  }),
  actions: {
    async login(email, password) {
      try {
        const { data } = await axios.post(
          process.env.VUE_APP_ENV_SERVER + "/api/auth/login",
          {
            email: email,
            password: password,
          }
        );
        this.token = data.token;
        const response = await axios.get(
          process.env.VUE_APP_ENV_SERVER + "/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );
        this.useId = response.data.user.id;
        this.pictureProfie = "https://avatars.githubusercontent.com/u/117325886?s=400&u=1e2ddee9adada0ac73c6b06e6f9c207f1447c44c&v=4"
        console.log(this.useId);
        this.loggedUser = response.data.user;
        console.log(response.data.user)
      } catch (e) {
        console.log(e);
      }
    },
    async googleLogin(code) {
      try {
        const { data } = await axios.get(
          process.env.VUE_APP_ENV_SERVER +
            `/api/auth/google/callback?code=${code}`
        );
        this.token = data.token;
        const response = await axios.get(
          process.env.VUE_APP_ENV_SERVER + "/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );
        this.useId = response.data.user.id;
        this.pictureProfie = response.data.user.pictureImage;
        console.log(response.data.user)
        console.log(this.pictureProfie)
        this.loggedUser = response.data.user;
      } catch (e) {
        console.log(e);
      }
    },
    logout() {
      this.token = "";
      this.loggedUser = {};
    },
  },
  getters: {
    isAuthenticated() {
      return this.token !== "";
    },
    getToken() {
      return this.token;
    },
  },
  persist: false
});
