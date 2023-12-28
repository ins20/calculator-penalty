import { useState } from "react";
import InputMask from "react-input-mask";
import { auth } from "../firebase";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

function formatPhoneNumber(phoneNumber) {
  const digits = phoneNumber.replace(/\D/g, "");
  const formattedNumber = "+" + digits;
  return formattedNumber;
}
const AuthForm = ({setCurrentUser}) => {
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);


  const onCaptchaVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // RecaptchaVerifier
          },
        },
        auth
      );
    }
  };

  const signUp = () => {
    setLoading(true);
    onCaptchaVerify();

    const appVerifier = window.recaptchaVerifier;

    const phoneNumber = formatPhoneNumber(phone);

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOtp(true);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const otpVerify = () => {
    setLoading(false);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        setCurrentUser(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div>
      <span class="card-title">Авторизация</span>
      {loading && <>загрузка...</>}
      <form>
        {showOtp ? (
          <>
            <label for="icon_code">Код</label>

            <input
              type="text"
              id="icon_code"
              maxLength={6}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button type="button" onClick={otpVerify}>
              Авторизоваться
            </button>
          </>
        ) : (
          <>
            <div>
              <label for="telephone">Номер телефона</label>

              <InputMask
                mask="+7 (999) 999-99-99"
                type="tel"
                id="telephone"
                onChange={(e) => setPhone(e.target.value)}
                requiblue
              />
            </div>

            <button type="button" onClick={signUp}>
              Получить код
            </button>
          </>
        )}
      </form>

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default AuthForm;
