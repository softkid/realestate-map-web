import axios from "axios";
const hostname = "http://realestate-map-api-xdpqd.run.goorm.io/api/";
// initial state
const state = () => ({
  maxDong: "",
  city: "",
  gugun: "",
  dong: "",
  citys: [],
  guguns: [],
  dongs: [],
  aptList: [],
  apt: "",
  lat: 37.5639226938053,
  lng: 126.97704584308674,
  searchType: ""
});

// getters
const getters = {
  getDong(state) {
    return state.dong;
  },
  getGugun(state) {
    return state.gugun;
  },
  getApt(state) {
    return state.apt;
  },
  aptList: state => state.aptList,
  maxDong: state => state.maxDong
};

// mutations
const mutations = {
  getCitySuccess(state, payload) {
    state.citys = payload;
  },
  getGugunSuccess(state, payload) {
    state.guguns = payload;
  },
  getDongSuccess(state, payload) {
    state.dongs = payload;
  },
  dongSearchSuccess(state, payload) {
    state.aptList = [];
    state.aptList = payload;
  },
  aptSearchSuccess(state, payload) {
    state.aptList = [];
    state.aptList = payload;
  },
  setApt(state, payload) {
    state.searchType = "apt";
    state.apt = payload;
  },
  setArea(state, payload) {
    state.searchType = "dong";
    state.city = payload[0];
    state.gugun = payload[1];
    state.dong = payload[2];
  },
  setLatLng(state, payload) {
    state.lat = payload.lat;
    state.lng = payload.lng;
  },
  setMaxArea(state, payload) {
    state.city = payload.city;
    state.gugun = payload.gugun;
    state.dong = payload.dong;
  }
};

// actions
const actions = {
  getCitys({ commit }) {
    axios
      .get( hostname + "addr/getCity")
      .then(({ data }) => {
        commit("getCitySuccess", data);
      })
      .catch(() => {
        console.log("getCity Fail" + hostname);
      });
  },
  getGuguns({ commit }, payload) {
    axios
      .get(hostname + "addr/getGugun/" + payload)
      .then(({ data }) => {
        commit("getGugunSuccess", data);
      })
      .catch(() => {
        console.log("getGugun Fail");
      });
  },
  getDongs({ commit }, payload) {
    axios
      .post(hostname + "addr/getDong", {
        city: payload[0],
        gugun: payload[1]
      })
      .then(({ data }) => {
        commit("getDongSuccess", data);
      })
      .catch(() => {
        console.log("getDong Fail");
      });
  },
  aptSearch({ commit }, payload) {
    if (payload == "") {
      alert("???????????? ??????");
      return;
    }
    commit("setApt", payload);
    axios
      .get(hostname + "house/aptSearch/" + payload)
      .then(({ data }) => {
        let apts = [];

        for (let i = 0; i < data.length; i++) {
          apts[i] = {
            ????????????: data[i].name,
            ???: data[i].dong,
            ????????????: data[i].buildYear,
            ????????????: data[i].dealYear,
            "????????????(??????)": data[i].dealAmount
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","),
            ??????: data[i].area,
            ??????: data[i].type
          };
        }
        commit("aptSearchSuccess", apts);
      })
      .catch(() => {
        alert(payload + "??? ?????? ????????? ????????????.");
      });
  },
  dongSearch({ commit }, payload) {
    if (payload[0] == "???/?????????") {
      alert("???/???????????? ???????????????.");
      return false;
    }
    if (payload[1] == "???/???/???") {
      alert("???/???/?????? ???????????????.");
      return false;
    }
    if (payload[2] == "???") {
      alert("?????? ???????????????.");
      return;
    }
    commit("setArea", payload);
    axios
      .post(hostname + "house/dongSearch", {
        city: payload[0],
        gugun: payload[1],
        dong: payload[2]
      })
      .then(({ data }) => {
        let apts = [];
        for (let i = 0; i < data.length; i++) {
          apts[i] = {
            ????????????: data[i].name,
            ???: payload[2],
            ????????????: data[i].buildYear,
            ????????????: data[i].dealYear,
            "????????????(??????)": data[i].dealAmount
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","),
            ??????: data[i].area,
            ??????: data[i].type
          };
        }
        commit("dongSearchSuccess", apts);
      })
      .catch(() => {
        console.log("dongSearch Fail");
      });
  },
  getLatLng({ commit }, payload) {
    // if (payload[0] != "") {
    //   payload[1] = state.maxDong;
    // }
    // console.log(payload[1]);

    if (payload == "???") {
      return;
    }
    axios
      .get(hostname + "addr/getLatLng/" + payload)
      .then(({ data }) => {
        commit("setLatLng", data);
      })
      .catch(() => {
        commit("getLatLng Fail");
      });
  },
  getMaxArea({ commit }, payload) {
    axios
      .get(hostname + "addr/getMaxArea/" + payload)
      .then(({ data }) => {
        commit("setMaxArea", data);
      })
      .catch(() => {
        commit("getMaxArea Fail");
      });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
