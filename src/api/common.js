function setCookie(name, value, options = {}) {
  options = {
    path: "/", // 경로 지정
    ...options, // 아규먼트로 옵션을 넘겨줬을경우 전개연산자로 추가 갱신
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString(); // 생 Date 객체라면 형식에 맞게 인코딩
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      // 밸류가 없다면
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie; // 새로 갱신
}

// 주어진 이름의 쿠키를 반환하는데,
// 조건에 맞는 쿠키가 없다면 undefined를 반환합니다.
function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)")
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(name) {
  // 해당 쿠키 요소만 삭제
  setCookie(name, "", {
    "max-age": -1,
  });
}

function deleteAllCookies() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    deleteCookie(name.trim());
  }
  console.log("all cookies deleted !");
}

import { message } from "ant-design-vue";

const success = (msg) => {
  message.success(findObject(msg, "message"));
};
const error = (msg) => {
  message.error(findObject(msg, "message"));
};
const warning = (msg) => {
  message.warning(findObject(msg, "message"));
};

function findObject(obj, findKey) {
  let result = undefined;

  function search(obj) {
    for (const key in obj) {
      if (key === findKey) {
        result = obj[key];
        return; // message를 찾았으면 더 이상 탐색을 진행하지 않음
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        search(obj[key]); // 중첩된 객체에 대해 재귀적으로 탐색
        if (result !== undefined) {
          return; // message가 이미 찾아졌으면 더 이상 탐색을 진행하지 않음
        }
      }
    }
  }

  search(obj);
  return result;
}

function getRandomElement(arr) {
  // 배열에서 무작위 인덱스를 계산합니다.
  const randomIndex = Math.floor(Math.random() * arr.length);

  // 무작위 인덱스에 해당하는 요소를 반환합니다.
  return arr[randomIndex];
}

export {
  setCookie,
  getCookie,
  deleteCookie,
  deleteAllCookies,
  success,
  error,
  warning,
  findObject,
  getRandomElement,
};
