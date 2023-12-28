import "./index.css";
import { useEffect, useState } from "preact/hooks";

import { render } from "preact";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import AuthForm from "./components/AuthForm";
import { Calculator, Result } from "./components/Calculator";
import Calculations from "./components/Calculations";
import ExtendedCalculator from "./components/ExtendedCalculator";

export function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tariff, setTariff] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setTariff("demo");
      } else {  
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <>
      <section>
        {tariff === "free" ? (
          <>
            <Calculator />
          </>
        ) : (
          <ExtendedCalculator />
        )}
      </section>

      {!currentUser && (
        <section className="info">
          <AuthForm setCurrentUser={setCurrentUser} />{" "}
        </section>
      )}
      {currentUser && tariff !== "free" && (
        <section className="info">
          <Calculations currentUser={currentUser} />{" "}
        </section>
      )}
    </>
  );
}

render(<App />, document.getElementById("app"));
