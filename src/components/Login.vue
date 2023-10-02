<template>
  <div id="content">
    <div class="container">
      <form @submit.prevent="submit">
        <h2 id="over" class="mb-3">Login</h2>
        <div class="input">
          <label for="email">Email address</label>
          <input
            class="form-control"
            type="text"
            name="email"
            placeholder="email@adress.com"
            v-model="v$.form.email.$model"
          />
          <span class="errorMessage" v-if="v$.form.email.$error">
            {{ v$.form.email.$errors[0].$message }}
          </span>
        </div>
        <div class="input">
          <label for="password">Password</label>
          <input
            class="form-control"
            type="password"
            name="password"
            placeholder="password123"
            v-model="v$.form.password.$model"
          />
          <span class="errorMessage" v-if="v$.form.password.$error">
            {{ v$.form.password.$errors[0].$message }}
          </span>
        </div>
        <div class="alternative-option mt-4">
          You don't have an account?
          <span> <router-link to="/register">Register</router-link></span>
        </div>

        <div id="container_login">
          <button type="submit" class="mt-4 submit-btn" id="login_button">
            Login
          </button>
        </div>

        <div id="googleBtn">
          <GoogleLogin :callback="callback" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { mapActions } from "vuex";
import { decodeCredential } from "vue3-google-login";

export default {
  setup: () => ({ v$: useVuelidate() }),
  data: () => ({
    form: {
      email: "",
      password: "",
      showEmailError: false,
    },
  }),
  validations() {
    return {
      form: {
        email: { required, email },
        password: { required },
      },
    };
  },
  methods: {
    ...mapActions(["LogIn"]),
    async submit() {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;
      await this.LogIn(this.form);
      this.$router.push("/");
    },
    async callback(response) {
      const userData = decodeCredential(response.credential);
      let email = userData.email;
      let sub = userData.sub;
      let psw = "UfoodAPICall" + sub;

      let form = {
        email: email,
        password: psw,
      };

      await this.LogIn(form);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
#content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid lightgray;
  padding: 4rem 4rem;
  border-radius: 5px;
  background: #fefefe;
}

#googleBtn {
  display: flex;
  justify-content: space-evenly;
  margin-top: 10%;
  align-items: flex-end;
}

.container {
  width: 400px;
  max-width: 95%;
}

.input {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input > label {
  text-align: start;
}

.input > input {
  margin-top: 6px;
  height: 38px !important;
}

#container_login {
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn {
  position: relative;
  left: 15%;
  padding: 1em 2.5em;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 700;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  transform: translateX(-50%);
}

.submit-btn:hover {
  background-color: #198754;
  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
  color: #fff;
  transform: translate(-50%, -7px);
}

.submit-btn:active {
  transform: translate(-50%, -1px);
}

.alternative-option {
  text-align: center;
}

.alternative-option > span {
  color: #0d6efd;
  cursor: pointer;
}

.cancel:hover {
  background-color: red;
}

.errorMessage {
  color: red;
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
}

@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0 20px;
  }

  #content {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .submit-btn {
    font-size: 10px;
    padding: 0.8em 2em;
  }

  .input > label {
    font-size: 14px;
  }

  .input > input {
    font-size: 14px;
  }

  .errorMessage {
    font-size: 12px;
  }

  .alternative-option {
    font-size: 14px;
  }

  .alternative-option > span {
    font-size: 14px;
  }
}

#over {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: left;
  margin-top: 20px;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}
</style>
