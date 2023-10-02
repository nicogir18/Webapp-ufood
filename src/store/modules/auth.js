import { useToast } from "vue-toast-notification";
import axios from "axios";

const state = {
  user: null,
  token: null,
};

const getters = {
  isAuthenticated: (state) => !!state.user && !!state.token,
  StateUser: (state) => state.user,
  StateToken: (state) => state.token,
};

const actions = {
  async Register({ dispatch }, form) {
    await axios
      .post(
        "https://ufoodapi.herokuapp.com/signup",
        new URLSearchParams({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        let UserForm = new FormData();
        UserForm.append("email", form.email);
        UserForm.append("password", form.password);
        dispatch("LogIn", UserForm);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          const $toast = useToast();
          $toast.open({
            message: "This email is already used. Please choose another one",
            type: "error",
            position: "bottom",
            duration: 6000,
            dismissible: true,
          });
        }
      });
  },

  async LogIn({ commit }, form) {
    await axios
      .post(
        "https://ufoodapi.herokuapp.com/login",
        new URLSearchParams({ email: form.email, password: form.password }),
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        const { token, ...userData } = response.data;
        commit("setUser", userData);
        commit("setToken", token);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          const $toast = useToast();
          $toast.open({
            message:
              "Login failed. Please check your email and password and try again. If you don't have an account yet, please register.",
            type: "error",
            position: "bottom",
            duration: 6000,
            dismissible: true,
          });
        }
      });
  },

  async LogOut({ commit }) {
    commit("logout");
  },
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setToken(state, token) {
    state.token = token;
  },
  logout(state) {
    state.user = null;
    state.token = null;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
