import { useState } from "preact/hooks";
import { Calculator, Result } from "./Calculator";

const ExtendedCalculator = () => {
  const [result, setResult] = useState(null);
  return (
    <>
      <a href="mailto:calculatorpenalty@gmail.com">Сообщение в поддержку</a>
      <Calculator setResult={setResult} />
      {result && <Result result={result} />}

      <form>
        <label htmlFor="email">Почта: </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Введите почту"
        />
        <a href="mailto:calculatorpenalty@gmail.com">
          Отправить результаты на почту
        </a>
        <button type="button">Досудебная претензию</button>
        <button type="button">Исковое заявление</button>
        <button type="submit">Сохранить</button>
      </form>
    </>
  );
};

export default ExtendedCalculator;
