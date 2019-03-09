<template>
  <div v-if="!loaded" class="p-3">
    <div class="progress">
      <div
        class="progress-bar progress-bar-striped progress-bar-animated w-100"
        role="progressbar"
      ></div>
    </div>
  </div>
  <div v-else class="add-client-page p-3">
    <label class="row">
      <div class="col-3 d-flex align-items-center">Фамилия Имя Отчество</div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.full_name !== '' }"
          placeholder="Фамилия Имя Отчество"
          v-model="client.full_name"
        />
        <div v-if="errors.full_name !== ''" class="text-left invalid-feedback">
          {{ errors.full_name }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">
        Адрес фактического места жительства
      </div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.actual_address !== '' }"
          placeholder="Адрес фактического места жительства"
          v-model="client.actual_address"
        />
        <div
          v-if="errors.actual_address !== ''"
          class="text-left invalid-feedback"
        >
          {{ errors.actual_address }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">
        Адрес регистрации
      </div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.registration_address !== '' }"
          placeholder="Адрес регистрации"
          v-model="client.registration_address"
        />
        <div
          v-if="errors.registration_address !== ''"
          class="text-left invalid-feedback"
        >
          {{ errors.registration_address }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Email-адрес</div>
      <div class="col-9">
        <input
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors.email !== '' }"
          placeholder="Email-адрес"
          v-model="client.email"
        />
        <div v-if="errors.email !== ''" class="text-left invalid-feedback">
          {{ errors.email }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Сотовый телефон</div>
      <div class="col-9">
        <input
          v-model="client.phone"
          ref="hand_tel"
          type="tel"
          class="form-control"
          placeholder="Сотовый телефон"
          pattern="[\+]\d{1}\s[\(]\d{3}[\)]\s\d{3}[\-]\d{2}[\-]\d{2}"
        />
        <div class="text-left">
          <small>
            Это поле должно содержать телефон в формате +7 (123) 456-78-90
          </small>
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Желаемый вид кредита</div>
      <div class="col-9">
        <select
          class="form-control"
          :class="{ 'is-invalid': errors.wishful_credit !== '' }"
          v-model="client.wishful_credit"
        >
          <option value="" selected>Не выбрано</option>
          <option>Потребительский</option>
          <option>Ипотека</option>
          <option>Автокредит</option>
        </select>
        <div
          v-if="errors.wishful_credit !== ''"
          class="text-left invalid-feedback"
        >
          {{ errors.wishful_credit }}
        </div>
      </div>
    </label>
    <hr />
    <h5 class="display-5">
      Паспортные данные
    </h5>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Серия Номер</div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          placeholder="0000 000000"
          v-model="passport_serial"
          ref="passport_serial"
          pattern="\d{4}\s\d{6}"
        />
        <div class="text-left">
          <small>
            Это поле должно содержать серию и номер паспорта в формате 0000
            000000
          </small>
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Дата выдачи</div>
      <div class="col-9">
        <input
          type="date"
          class="form-control"
          v-model="passport_date"
          ref="passport_date"
          pattern="\d{2}\.\d{2}\.\d{4}"
        />
        <div class="text-left">
          <small>
            Это поле должно содержать дату в формате День.Месяц.Год
          </small>
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">
        Кем выдан, код подразделения
      </div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          placeholder="Кем выдан 000-000"
          v-model="passport_where"
        />
      </div>
    </label>
    <hr />
    <label class="row">
      <div class="col-3 d-flex align-items-center">Место рождения</div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.birthplace !== '' }"
          placeholder="Место рождения"
          v-model="client.birthplace"
        />
        <div v-if="errors.birthplace !== ''" class="text-left invalid-feedback">
          {{ errors.birthplace }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Предыдущее имя</div>
      <div class="col-9 d-flex align-items-center">
        <div class="custom-control custom-switch">
          <input
            type="checkbox"
            class="custom-control-input"
            id="customSwitch1"
            v-model="prev_name_bool"
          />
          <label class="custom-control-label" for="customSwitch1"> </label>
        </div>
        <input
          v-bind:disabled="!prev_name_bool"
          v-model="client.previous_name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.previous_name !== '' }"
          placeholder="Предыдущее имя"
        />
        <div
          v-if="errors.previous_name !== ''"
          class="text-left invalid-feedback"
        >
          {{ errors.previous_name }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">СНИЛС</div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.snils !== '' }"
          placeholder="123-456-789 0000000000"
          pattern="\d{3}[\-]\d{3}[\-]\d{3}[\s]\d{10}"
          ref="snils"
          v-model="client.snils"
        />
        <div class="text-left">
          <small
            >Это поле должно содержать СНИЛС в формате 123-456-789
            0000000000</small
          >
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Водительские права</div>
      <div class="col-9 d-flex align-items-center">
        <div class="custom-control custom-switch">
          <input
            type="checkbox"
            class="custom-control-input"
            id="customSwitch2"
            v-model="drivers_license_bool"
          />
          <label class="custom-control-label" for="customSwitch2" />
        </div>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.drivers_license !== '' }"
          placeholder="Данные водительского удостоверения"
          v-bind:disabled="!drivers_license_bool"
          v-model="client.drivers_license"
        />
        <div
          v-if="errors.drivers_license !== ''"
          class="text-left invalid-feedback"
        >
          {{ errors.drivers_license }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Дополнительные контакты</div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.additional_contacts !== '' }"
          placeholder="Дополнительные контакты"
          v-model="client.additional_contacts"
        />
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Семейное положение</div>
      <div class="col-9">
        <div class="custom-control custom-switch text-left">
          <input
            type="checkbox"
            class="custom-control-input"
            id="customSwitch3"
            v-model="client.marital_status"
          />
          <label class="custom-control-label" for="customSwitch3"
            >В браке</label
          >
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Дети до 18</div>
      <div class="col-9 d-flex align-items-center">
        <div class="custom-control custom-switch">
          <input
            type="checkbox"
            class="custom-control-input"
            id="customSwitch4"
            v-model="children_bool"
          />
          <label class="custom-control-label" for="customSwitch4" />
        </div>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.children !== '' }"
          placeholder="В каком количестве"
          v-bind:disabled="!children_bool"
          v-model="client.children"
        />
        <div v-if="errors.children !== ''" class="text-left invalid-feedback">
          {{ errors.children }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Образование</div>
      <div class="col-9">
        <select
          class="custom-select"
          :class="{ 'is-invalid': errors.education !== '' }"
          v-model="client.education"
        >
          <option value="" selected>Не выбрано</option>
          <option>Высшее</option>
          <option>Средне-специальное</option>
          <option>Средне-профессиональное</option>
          <option>Средне-общее</option>
        </select>
        <div v-if="errors.education !== ''" class="text-left invalid-feedback">
          {{ errors.education }}
        </div>
      </div>
    </label>
    <hr />
    <h5 class="display-5">
      Действующее место работы
    </h5>
    <label class="row">
      <div class="col-3 d-flex align-items-center">
        Наименование организации
      </div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.place_of_work !== '' }"
          placeholder="Наименование организации"
          v-model="client.place_of_work"
        />
        <div
          v-if="errors.place_of_work !== ''"
          class="text-left invalid-feedback"
        >
          {{ errors.place_of_work }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">ИНН организации</div>
      <div class="col-9">
        <input
          type="number"
          class="form-control"
          :class="{ 'is-invalid': errors.inn_of_work !== '' }"
          placeholder="ИНН организации"
          v-model="client.inn_of_work"
        />
        <div
          v-if="errors.inn_of_work !== ''"
          class="text-left invalid-feedback"
        >
          {{ errors.inn_of_work }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">
        Фактический адрес организации
      </div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.actual_address_of_work !== '' }"
          placeholder="Фактический адрес организации"
          v-model="client.actual_address_of_work"
        />
        <div
          v-if="errors.actual_address_of_work !== ''"
          class="text-left invalid-feedback"
        >
          {{ errors.actual_address_of_work }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Телефон организации</div>
      <div class="col-9">
        <input
          ref="work_tel"
          type="tel"
          class="form-control"
          placeholder="Телефон организации"
          pattern="[\+]\d{1}\s[\(]\d{3}[\)]\s\d{3}[\-]\d{2}[\-]\d{2}"
          v-model="client.phone_of_work"
        />
        <div class="text-left">
          <small
            >Это поле должно содержать телефон в формате +7 (123)
            456-78-90</small
          >
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Должность</div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          placeholder="Должность"
          :class="{ 'is-invalid': errors.post_on_work !== '' }"
          v-model="client.post_on_work"
        />
        <div
          v-if="errors.post_on_work !== ''"
          class="text-left invalid-feedback"
        >
          {{ errors.post_on_work }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Стаж на рабочем месте</div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.work_experience !== '' }"
          placeholder="Стаж на рабочем месте"
          v-model="client.work_experience"
        />
        <div
          v-if="errors.work_experience !== ''"
          class="text-left invalid-feedback"
        >
          {{ errors.work_experience }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Общий рабочий стаж</div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.common_experience !== '' }"
          placeholder="Общий рабочий стаж"
          v-model="client.common_experience"
        />
        <div
          v-if="errors.common_experience !== ''"
          class="text-left invalid-feedback"
        >
          {{ errors.common_experience }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Заработная плата</div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.wages !== '' }"
          placeholder="Заработная плата"
          v-model="client.wages"
        />
        <div v-if="errors.wages !== ''" class="text-left invalid-feedback">
          {{ errors.wages }}
        </div>
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">
        Работа по совместительству
      </div>
      <div class="col-9">
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.part_time_job !== '' }"
          placeholder="Работа по совместительству"
          v-model="client.part_time_job"
        />
        <div
          v-if="errors.part_time_job !== ''"
          class="text-left invalid-feedback"
        >
          {{ errors.part_time_job }}
        </div>
      </div>
    </label>
    <div class="text-center">
      <div class="badge badge-danger">{{ basicError }}</div>
    </div>
    <div v-if="basicSuccess" class="text-center">
      <div class="badge badge-success">Данные успешно сохранены!</div>
    </div>
    <div class="btn btn-primary" v-on:click="send">
      Сохранить
      <div class="progress" v-if="base_request">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style="width: 100%"
        ></div>
      </div>
    </div>
    <hr />
    <h5 class="display-5">Действующие кредиты</h5>
    <table class="table">
      <thead>
        <tr>
          <td>Наименование банка</td>
          <td>Дата получения</td>
          <td>Дата исполнения</td>
          <td>Ежемесячный платеж</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(credit, key) in loans" :key="key">
          <td>{{ credit.bank }}</td>
          <td>{{ credit.date }}</td>
          <td>{{ credit.term }}</td>
          <td>{{ credit.payment }}</td>
        </tr>
      </tbody>
    </table>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Наименование банка</div>
      <div class="col-9">
        <input
          v-model="bank_name"
          type="text"
          class="form-control"
          placeholder="Наименование банка"
        />
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">Дата получения</div>
      <div class="col-9">
        <input
          v-model="credit_date"
          type="date"
          class="form-control"
          placeholder="Дата получения"
        />
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">На срок / месяцев</div>
      <div class="col-9">
        <input
          v-model="credit_expiration"
          type="number"
          class="form-control"
          placeholder="На срок / месяцев"
        />
      </div>
    </label>
    <label class="row">
      <div class="col-3 d-flex align-items-center">
        Сумма ежемесячного платежа
      </div>
      <div class="col-9">
        <div class="form-group">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">₽</span>
            </div>
            <input
              type="number"
              class="form-control"
              v-model="credit_payment"
            />
            <div class="input-group-append">
              <span class="input-group-text">.00</span>
            </div>
          </div>
        </div>
      </div>
    </label>
    <div class="btn btn-primary" v-on:click="addCredit">
      Добавить кредит
      <div class="progress" v-if="credit_request">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style="width: 100%"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { CLIENTS, CLIENT, LOANS } from "../queries";
import errorProcessing from "../utils/errorProcessing";
/* TODO:
 * При деактивации поля(то есть после ввода информации в поле),
 * отправлять информацию на проверку на сервер
 * чтобы не дожидаясь нажатия кнопки сохранить появлялись зеленые или красные подсказки
 */
export default {
  name: "addClient",
  data() {
    return {
      client: {
        full_name: "",
        actual_address: "",
        registration_address: "",
        email: "",
        phone: "",
        wishful_credit: "",
        birthplace: "",
        previous_name: "",
        snils: "",
        drivers_license: "",
        additional_contacts: "",
        marital_status: false,
        children: "",
        education: "",
        place_of_work: "",
        inn_of_work: "",
        actual_address_of_work: "",
        phone_of_work: "",
        post_on_work: "",
        work_experience: "",
        common_experience: "",
        wages: "",
        part_time_job: ""
      },
      errors: {
        full_name: "",
        actual_address: "",
        registration_address: "",
        email: "",
        phone: "",
        wishful_credit: "",
        passport: "",
        birthplace: "",
        previous_name: "",
        snils: "",
        drivers_license: "",
        additional_contacts: "",
        marital_status: false,
        children: "",
        education: "",
        place_of_work: "",
        inn_of_work: "",
        actual_address_of_work: "",
        phone_of_work: "",
        post_on_work: "",
        work_experience: "",
        common_experience: "",
        wages: "",
        part_time_job: ""
      },
      passport_serial: "",
      passport_date: "",
      passport_where: "",
      id: null,
      bank_name: "",
      credit_date: "",
      credit_expiration: "",
      credit_payment: "",
      loans: [],
      base_request: false,
      credit_request: false,
      basicError: "",
      basicSuccess: false,
      prev_name_bool: false,
      drivers_license_bool: false,
      children_bool: false,
      loaded: false
    };
  },
  created() {
    if (this.$route.params.id !== "add") {
      this.id = this.$route.params.id;
      this.getClient();
    } else {
      this.loaded = true;
    }
  },
  methods: {
    getClient() {
      axios
        .post(CLIENTS, {
          query: `
          query {
            client(id: ${this.$route.params.id}) {
              fullName
              actualAddress
              registrationAddress
              email
              phone
              passport
              wishfulCredit
              birthplace
              previousName
              snils
              driversLicense
              additionalContacts
              maritalStatus
              children
              education
              placeOfWork
              innOfWork
              actualAddressOfWork
              phoneOfWork
              postOnWork
              workExperience
              commonExperience
              wages
              partTimeJob
              loans {
                bank
                date
                term
                payment
              }
            }
          }
        `
        })
        .then(res => {
          this.dataFetch(res.data.data.client);
          this.loaded = true;
        })
        .catch(err => {
          if (err.response === undefined) {
            this.$store.commit("connectionRefused", {
              refused: this.getClient
            });
          }
          errorProcessing(err);
        });
    },
    send() {
      if (!this.basicDataTest()) {
        return;
      }
      this.base_request = true;
      axios
        .post(CLIENT, this.basicData())
        .then(res => {
          this.basicSuccess = true;
          this.fetchBasicData(res.data);
          this.base_request = false;
        })
        .catch(err => {
          if (err.response === undefined) {
            this.$store.commit("connectionRefused", {
              refused: this.send
            });
          } else if (err.response.status === 400) {
            for (let key in err.response.data) {
              this.errors[key] = err.response.data[key][0];
            }
          }
          errorProcessing(err);
        });
    },
    addCredit() {
      if (!this.basicDataTest()) {
        return;
      }
      this.credit_request = true;
      if (this.id !== null) {
        axios
          .post(LOANS, {
            id: this.id,
            bank: this.bank_name,
            date: this.credit_date,
            term: this.credit_expiration,
            payment: this.credit_payment
          })
          .then(res => {
            this.credit_request = false;
            this.loans.push({
              bank: res.data.bank,
              date: res.data.date,
              term: res.data.term,
              payment: res.data.payment
            });
          })
          .catch(err => {
            if (err.response === undefined) {
              this.$store.commit("connectionRefused", {
                refused: this.addCredit
              });
            }
            errorProcessing(err);
          });
      } else {
        axios
          .post(LOANS, {
            general: this.basicData(),
            bank: this.bank_name,
            date: this.credit_date,
            term: this.credit_expiration,
            payment: this.credit_payment
          })
          .then(res => {
            this.fetchBasicData(res.data);
            this.loans.push({
              bank: res.data.bank,
              date: res.data.date,
              term: res.data.term,
              payment: res.data.payment
            });
            this.credit_request = false;
          })
          .catch(err => {
            if (err.response === undefined) {
              this.$store.commit("connectionRefused", {
                refused: this.addCredit
              });
            }
            errorProcessing(err);
          });
      }
    },
    fetchBasicData(data) {
      for (let el in data) {
        if (this[el] !== undefined) {
          this[el] = data[el];
        }
      }
    },
    basicData() {
      var phone = this.client.phone;
      let client = {};
      for (let key in this.client) {
        if (this.client[key] !== "") {
          client[key] = this.client[key];
        }
      }
      return {
        ...client,
        id: this.id,
        phone: phone.replace(/(\s|\(|\)|\+|-)?/g, ""),
        passport:
          this.passport_serial +
          " " +
          this.passport_date +
          " " +
          this.passport_where,
        previous_name: this.prev_name_bool ? this.client.previous_name : "",
        drivers_license: this.drivers_license_bool
          ? this.client.drivers_license
          : "",
        children: this.children_bool ? this.client.children : ""
      };
    },
    basicDataTest() {
      this.basicSuccess = false;
      if (this.client.full_name === "") {
        this.basicError = "Сначала заполните поле Ф.И.О.";
        this.errors.full_name = "Поле не может быть пустым";
        return false;
      } else if (this.$refs.hand_tel.validationMessage !== "") {
        this.basicError = this.$refs.hand_tel.validationMessage;
        return false;
      } else if (this.$refs.snils.validationMessage !== "") {
        this.basicError = this.$refs.snils.validationMessage;
        return false;
      } else if (this.$refs.passport_serial.validationMessage !== "") {
        this.basicError = this.$refs.passport_serial.validationMessage;
      } else if (this.$refs.passport_date.validationMessage !== "") {
        this.basicError = this.$refs.passport_date.validationMessage;
      } else {
        this.basicError = "";
        return true;
      }
    },
    dataFetch(data) {
      let phone = "";
      let previous_name = "";
      let drivers_license = "";
      let children = "";
      let newData = {};
      for (let key in data) {
        if (key === "phone") {
          phone = data.phone.replace(
            /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/,
            "+$1 ($2) $3-$4-$5"
          );
        } else if (key === "previousName") {
          if (data["previousName"] !== "") {
            previous_name = data.previousName;
            this.prev_name_bool = true;
          }
        } else if (key === "driversLicense ") {
          if (data["driversLicense"] !== "") {
            drivers_license = data.driversLicense;
            this.drivers_license_bool = true;
          }
        } else if (key === "children") {
          if (data["children"] !== "") {
            children = data.children;
            this.children_bool = true;
          }
        } else if (key === "loans") {
          this.loans = data.loans;
        } else if (key === "passport") {
          var passport = data.passport;
          passport = passport.replace(/(\d{4}\s\d{6})(.*)/, ($0, $1, $2) => {
            this.passport_serial = $1;
            return $2;
          });
          passport = passport.replace(
            /(\d{4}-\d{2}-\d{2})(.*)/,
            ($0, $1, $2) => {
              this.passport_date = $1;
              return $2;
            }
          );
          this.passport_where = passport.trim();
        } else {
          newData[
            key.replace(/([A-Z])/g, ($0, $1) =>
              $0.replace($1, "_" + $1.toLowerCase())
            )
          ] = data[key];
        }
      }
      this.client = {
        ...newData,
        phone,
        previous_name,
        drivers_license,
        children
      };
    }
  },
  metaInfo: {
    title: "Редактировать клиента"
  }
};
</script>

<style lang="scss">
input:invalid + div {
  color: red;
}
</style>
