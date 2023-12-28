import { useState } from "react";
import InputMask from "react-input-mask";
import rates from "../../rates.json";

//https://dogovor-urist.ru/calculator/dogovor_neustoyka/#loanAmount=123000&dateStart=24.11.2014&dateFinish=03.08.2015&percentType=1&percent=0,5&limitPeni=10&payments=01.08.2014_1000_;25.11.2014_100000_;25.12.2015_5000_;15.11.2023_150000_;25.11.2023_5000_;26.11.2023_5000_&loans=02.10.2015_76262_;02.11.2015_87146_;02.12.2015_150153_
// const defaultValues = {
//   sum: 123000,
//   startDate: "2014-11-24",
//   endDate: "2015-08-03",
//   rate: 0.5,
//   periodicity: "day",
//   rateType: "percent",
//   maxRate: 10,
//   payments: [
//     {
//       paymentDate: "2014-11-25",
//       paymentAmount: 100000,
//       paymentNote: "First payment",
//     },
//     {
//       paymentDate: "2015-12-25",
//       paymentAmount: 5000,
//       paymentNote: "Second payment",
//     },
//     {
//       paymentDate: "2023-11-25",
//       paymentAmount: 5000,
//       paymentNote: "Second payment",
//     },
//     {
//       paymentDate: "2023-11-15",
//       paymentAmount: 150000,
//       paymentNote: "Second payment",
//     },
//     {
//       paymentDate: "2023-11-26",
//       paymentAmount: 5000,
//       paymentNote: "Second payment",
//     },
//     {
//       paymentDate: "2014-08-01",
//       paymentAmount: 1000,
//       paymentNote: "Second payment",
//     },
//   ],
//   debts: [
//     {
//       debtDate: "2015-10-02",
//       debtAmount: 76262,
//       debtNote: "Additional debt",
//     },
//     {
//       debtDate: "2015-12-02",
//       debtAmount: 150153,
//       debtNote: "Additional debt",
//     },
//     {
//       debtDate: "2015-11-02",
//       debtAmount: 87146,
//       debtNote: "Additional debt",
//     },
//   ],
// };

// https://dogovor-urist.ru/calculator/dogovor_neustoyka/#loanAmount=123000&dateStart=03.08.2015&dateFinish=24.12.2023&percentType=1&percent=0,5&limitPeni=10&payments=04.09.2015_100000_;07.12.2015_150000_&loans=02.10.2015_76262_;02.11.2015_87146_;02.12.2015_150153_
// const defaultValues = {
//   sum: 123000,
//   startDate: "2015-08-03",
//   endDate: "2023-12-24",
//   rate: 0.5,
//   periodicity: "day",
//   rateType: "percent",
//   fractionType: "periods",
//   fractionDate: "",
//   fraction: "",
//   maxRate: 10,
//   payments: [
//     {
//       paymentDate: "2015-09-04",
//       paymentAmount: 100000,
//       paymentNote: "First payment",
//     },
//     {
//       paymentDate: "2015-12-07",
//       paymentAmount: 150000,
//       paymentNote: "Second payment",
//     },
//   ],
//   debts: [
//     {
//       debtDate: "2015-10-02",
//       debtAmount: 76262,
//       debtNote: "Additional debt",
//     },
//     {
//       debtDate: "2015-12-02",
//       debtAmount: 150153,
//       debtNote: "Additional debt",
//     },
//     {
//       debtDate: "2015-11-02",
//       debtAmount: 87146,
//       debtNote: "Additional debt",
//     },
//   ],
// };

//https://dogovor-urist.ru/calculator/peni_po_stavke/#loanAmount=450000&dateStart=12.06.2014&dateFinish=27.12.2023&ratePart=1/300&rateType=4&payments=16.09.2014_25000_;16.01.2015_25000_
const defaultValues = {
  sum: 450000,
  startDate: "2014-06-12",
  endDate: "2023-12-27",
  rate: 0,
  periodicity: "day",
  rateType: "fraction",
  fractionType: "today",
  fractionDate: "",
  fraction: "1/300",
  maxRate: 0,
  payments: [
    {
      paymentDate: "2014-09-16",
      paymentAmount: 25000,
      paymentNote: "First payment",
    },
    {
      paymentDate: "2015-01-16",
      paymentAmount: 25000,
      paymentNote: "Second payment",
    },
  ],
  debts: [],
};

const reformateDate = (date) => {
  const parts = date.split(".");
  return `${parts[1]}-${parts[0]}-${parts[2]}`;
};

const parseNumber = (str) => {
  const numberString = str.replace(",", ".");
  return parseFloat(numberString);
};
const formattedDate = (date) => {
  return new Date(date).toLocaleDateString("ru-RU");
};

const formattedFraction = (fraction) => {
  return fraction
    .split("")
    .filter((e) => e !== "_")
    .join("");
};

const generatePenaltyFraction = (amount, days, rate, fraction) => {
  return (
    (amount *
      days *
      Function(`'use strict'; return (${formattedFraction(fraction)})`)() *
      rate) /
    100
  );
};

const generateFormulaFraction = (amount, days, rate, fraction) => {
  return `${amount.toFixed(2)} x ${days} x ${formattedFraction(
    fraction
  )} x ${rate}%`;
};

const generateFormula = (amount, days, rate) => {
  return `${amount.toFixed(2)} x ${days} x ${rate}%`;
};
const generateFormulaYear = (amount, days, rate) => {
  return `${amount.toFixed(2)} x ${days}/365 x ${rate}%`;
};
const generateFormulaYearLeap = (amount, days, rate) => {
  return `${amount.toFixed(2)} x ${days}/366 x ${rate}%`;
};
const generatePenaltyYear = (amount, days, rate) => {
  return (((amount * days) / 365) * rate) / 100;
};
const generatePenaltyYearLeap = (amount, days, rate) => {
  return (((amount * days) / 366) * rate) / 100;
};
const generatePenalty = (amount, days, rate) => {
  return (amount * days * rate) / 100;
};

const generateDifferenceDays = (startDate, endDate) => {
  const d1 = new Date(startDate);
  const d2 = new Date(endDate);
  const differenceInMs = d2 - d1;
  const differenceInDays =
    Math.ceil(differenceInMs / (1000 * 60 * 60 * 24)) + 1;

  return differenceInDays;
};

const generateNextDate = (prevDate) => {
  const date = new Date(prevDate);

  return date.setDate(date.getDate() + 1)
    ? new Date(date).toISOString().split("T")[0]
    : null;
};
const generateNextDateFraction = (prevDate) => {
  const date = new Date(prevDate);

  date.setDate(date.getDate() + 1)
    ? new Date(date).toISOString().split("T")[0]
    : null;

  return date;
};
const findDateForRate = (date) => {
  let findDate = formattedDate(date);

  while (!rates[findDate]) {
    findDate = formattedDate(
      new Date(reformateDate(findDate)).setDate(
        new Date(reformateDate(findDate)).getDate() - 1
      )
    );
  }
  return findDate;
};

const generateResult = (data) => {
  const result = {
    sum: 0,
    overpayment: 0,
    sumPercent: 0,
    penalties: [],
    rateType: data.rateType,
    periodicity: data.periodicity,
    fractionType: data.fractionType,
  };

  data.debts.unshift({
    debtDate: data.startDate,
    debtAmount: data.sum,
    debtNote: data.note,
  });

  data.debts.sort((a, b) => new Date(a.debtDate) - new Date(b.debtDate));
  data.payments.sort(
    (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate)
  );

  data.debts.forEach(({ debtAmount, debtDate, debtNote }) => {
    const penalty = {
      sum: 0,
      maxSum: (debtAmount * data.maxRate) / 100,
      data: [],
      debtDate,
      debtNote,
    };

    for (let i = 0; i < data.payments.length; i++) {
      const { paymentDate, paymentAmount, paymentNote } = data.payments[i];
      if (paymentAmount !== 0 && debtAmount !== 0) {
        penalty.data.push({
          debt:
            new Date(paymentDate) < new Date(debtDate) ||
            penalty.data.find(
              ({ payment }) =>
                new Date(payment.paymentDate) > new Date(data.endDate)
            )
              ? null
              : {
                  rate:
                    data.fractionType === "today"
                      ? parseNumber(rates[findDateForRate(new Date())])
                      : data.fractionType === "endPeriod"
                      ? parseNumber(rates[findDateForRate(data.endDate)])
                      : data.fractionType === "date"
                      ? parseNumber(rates[findDateForRate(data.fractionDate)])
                      : rates[
                          findDateForRate(
                            generateNextDate(
                              penalty.data.at(-1)?.payment.paymentDate
                            ) ?? debtDate
                          )
                        ],
                  debtAmount: debtAmount,
                  debtDate:
                    generateNextDate(
                      penalty.data.at(-1)?.payment.paymentDate
                    ) ?? debtDate,
                  paymentDate:
                    new Date(paymentDate) > new Date(data.endDate)
                      ? data.endDate
                      : paymentDate,
                  days: generateDifferenceDays(
                    generateNextDate(
                      penalty.data.at(-1)?.payment.paymentDate
                    ) ?? debtDate,
                    new Date(paymentDate) > new Date(data.endDate)
                      ? data.endDate
                      : paymentDate
                  ),
                  formula:
                    data.rateType === "fraction"
                      ? generateFormulaFraction(
                          debtAmount,
                          generateDifferenceDays(
                            generateNextDate(
                              penalty.data.at(-1)?.payment.paymentDate
                            ) ?? debtDate,
                            new Date(paymentDate) > new Date(data.endDate)
                              ? data.endDate
                              : paymentDate
                          ),
                          data.fractionType === "today"
                            ? parseNumber(rates[findDateForRate(new Date())])
                            : data.fractionType === "endPeriod"
                            ? parseNumber(rates[findDateForRate(data.endDate)])
                            : data.fractionType === "date"
                            ? parseNumber(
                                rates[findDateForRate(data.fractionDate)]
                              )
                            : rates[
                                findDateForRate(
                                  generateNextDate(
                                    penalty.data.at(-1)?.payment.paymentDate
                                  ) ?? debtDate
                                )
                              ],
                          data.fraction
                        )
                      : result.periodicity === "year"
                      ? generateFormulaYear(
                          debtAmount,
                          generateDifferenceDays(
                            generateNextDate(
                              penalty.data.at(-1)?.payment.paymentDate
                            ) ?? debtDate,
                            new Date(paymentDate) > new Date(data.endDate)
                              ? data.endDate
                              : paymentDate
                          ),
                          data.rate
                        )
                      : generateFormula(
                          debtAmount,
                          generateDifferenceDays(
                            generateNextDate(
                              penalty.data.at(-1)?.payment.paymentDate
                            ) ?? debtDate,
                            new Date(paymentDate) > new Date(data.endDate)
                              ? data.endDate
                              : paymentDate
                          ),
                          data.rate
                        ),
                  penaltyAmount:
                    data.rateType === "fraction"
                      ? generatePenaltyFraction(
                          debtAmount,
                          generateDifferenceDays(
                            generateNextDate(
                              penalty.data.at(-1)?.payment.paymentDate
                            ) ?? debtDate,
                            new Date(paymentDate) > new Date(data.endDate)
                              ? data.endDate
                              : paymentDate
                          ),
                          data.fractionType === "today"
                            ? parseNumber(rates[findDateForRate(new Date())])
                            : data.fractionType === "endPeriod"
                            ? parseNumber(rates[findDateForRate(data.endDate)])
                            : data.fractionType === "date"
                            ? parseNumber(
                                rates[findDateForRate(data.fractionDate)]
                              )
                            : parseNumber(
                                rates[
                                  findDateForRate(
                                    generateNextDate(
                                      penalty.data.at(-1)?.payment.paymentDate
                                    ) ?? debtDate
                                  )
                                ]
                              ),
                          data.fraction
                        )
                      : result.periodicity === "year"
                      ? generatePenaltyYear(
                          debtAmount,
                          generateDifferenceDays(
                            generateNextDate(
                              penalty.data.at(-1)?.payment.paymentDate
                            ) ?? debtDate,
                            new Date(paymentDate) > new Date(data.endDate)
                              ? data.endDate
                              : paymentDate
                          ),
                          data.rate
                        )
                      : generatePenalty(
                          debtAmount,
                          generateDifferenceDays(
                            generateNextDate(
                              penalty.data.at(-1)?.payment.paymentDate
                            ) ?? debtDate,
                            new Date(paymentDate) > new Date(data.endDate)
                              ? data.endDate
                              : paymentDate
                          ),
                          data.rate
                        ),
                },
          payment: {
            paymentAmount: Math.min(paymentAmount, debtAmount),
            paymentDate,
            paymentNote,
          },
        });

        const copyDebtAmount = debtAmount;
        debtAmount -= Math.min(paymentAmount, copyDebtAmount);
        data.payments[i].paymentAmount -= Math.min(
          paymentAmount,
          copyDebtAmount
        );

        if (
          debtAmount > 0 &&
          i === data.payments.length - 1 &&
          !penalty.data.find(
            ({ payment }) =>
              new Date(payment.paymentDate) > new Date(data.endDate)
          )
        ) {
          result.sum += debtAmount;

          const reversedRates = Object.entries(rates).reverse();
          let copyPrevRate = parseNumber(
            rates[
              findDateForRate(
                generateNextDate(penalty.data.at(-1)?.payment.paymentDate) ??
                  debtDate
              )
            ]
          );

          let prevRate = parseNumber(
            rates[
              findDateForRate(
                generateNextDate(penalty.data.at(-1)?.payment.paymentDate) ??
                  debtDate
              )
            ]
          );
          let dateFind = reformateDate(
            findDateForRate(
              generateNextDate(penalty.data.at(-1)?.payment.paymentDate) ??
                debtDate
            )
          );

          let prevDate = "";
          if (
            result.rateType === "fraction" &&
            data.fractionType === "periods"
          ) {
            for (const [key, value] of reversedRates) {
              if (
                new Date(reformateDate(key)) > new Date(dateFind) &&
                new Date(reformateDate(key)) <= new Date(data.endDate)
              ) {
                if (parseNumber(value) !== prevRate) {
                  prevRate = parseNumber(value);
                  prevDate = key;
                  break;
                }
              }
            }
          }
          penalty.data.push({
            debt: {
              debtAmount: debtAmount,
              rate:
                data.fractionType === "today"
                  ? parseNumber(rates[findDateForRate(new Date())])
                  : data.fractionType === "endPeriod"
                  ? parseNumber(rates[findDateForRate(data.endDate)])
                  : data.fractionType === "date"
                  ? parseNumber(rates[findDateForRate(data.fractionDate)])
                  : rates[
                      findDateForRate(
                        generateNextDate(
                          penalty.data.at(-1)?.payment.paymentDate
                        ) ?? debtDate
                      )
                    ],
              debtDate:
                generateNextDate(penalty.data.at(-1)?.payment.paymentDate) ??
                debtDate,
              paymentDate:
                result.rateType === "fraction" &&
                data.fractionType === "periods"
                  ? reformateDate(prevDate)
                  : result.periodicity === "year"
                  ? new Date(new Date(debtDate).getFullYear(), 11, 31)
                  : data.endDate,
              days:
                result.rateType === "fraction" &&
                result.fractionType === "periods"
                  ? generateDifferenceDays(
                      generateNextDate(
                        penalty.data.at(-1)?.payment.paymentDate
                      ) ?? debtDate,
                      reformateDate(prevDate)
                    )
                  : generateDifferenceDays(
                      generateNextDate(
                        penalty.data.at(-1)?.payment.paymentDate
                      ) ?? debtDate,
                      result.periodicity === "year"
                        ? new Date(new Date(debtDate).getFullYear(), 11, 31)
                        : data.endDate
                    ),
              formula:
                data.rateType === "fraction"
                  ? generateFormulaFraction(
                      debtAmount,
                      result.rateType === "fraction" &&
                        result.fractionType === "periods"
                        ? generateDifferenceDays(
                            generateNextDate(
                              penalty.data.at(-1)?.payment.paymentDate
                            ) ?? debtDate,
                            reformateDate(prevDate)
                          )
                        : generateDifferenceDays(
                            generateNextDate(
                              penalty.data.at(-1)?.payment.paymentDate
                            ) ?? debtDate,
                            result.periodicity === "year"
                              ? new Date(
                                  new Date(debtDate).getFullYear(),
                                  11,
                                  31
                                )
                              : data.endDate
                          ),

                      data.fractionType === "today"
                        ? parseNumber(rates[findDateForRate(new Date())])
                        : data.fractionType === "endPeriod"
                        ? parseNumber(rates[findDateForRate(data.endDate)])
                        : data.fractionType === "date"
                        ? parseNumber(rates[findDateForRate(data.fractionDate)])
                        : rates[
                            findDateForRate(
                              generateNextDate(
                                penalty.data.at(-1)?.payment.paymentDate
                              ) ?? debtDate
                            )
                          ],
                      data.fraction
                    )
                  : result.periodicity === "year"
                  ? generateFormulaYear(
                      debtAmount,
                      generateDifferenceDays(
                        generateNextDate(
                          penalty.data.at(-1)?.payment.paymentDate
                        ) ?? debtDate,
                        result.periodicity === "year"
                          ? new Date(new Date(debtDate).getFullYear(), 11, 31)
                          : data.endDate
                      ),
                      data.rate
                    )
                  : generateFormula(
                      debtAmount,
                      generateDifferenceDays(
                        generateNextDate(
                          penalty.data.at(-1)?.payment.paymentDate
                        ) ?? debtDate,
                        result.periodicity === "year"
                          ? new Date(new Date(debtDate).getFullYear(), 11, 31)
                          : data.endDate
                      ),
                      data.rate
                    ),
              penaltyAmount:
                data.rateType === "fraction"
                  ? generatePenaltyFraction(
                      debtAmount,
                      result.fractionType === "periods" &&
                        result.rateType === "fraction"
                        ? generateDifferenceDays(
                            generateNextDate(
                              penalty.data.at(-1)?.payment.paymentDate
                            ) ?? debtDate,
                            reformateDate(prevDate)
                          )
                        : generateDifferenceDays(
                            generateNextDate(
                              penalty.data.at(-1)?.payment.paymentDate
                            ) ?? debtDate,
                            data.endDate
                          ),
                      data.fractionType === "today"
                        ? parseNumber(rates[findDateForRate(new Date())])
                        : data.fractionType === "endPeriod"
                        ? parseNumber(rates[findDateForRate(data.endDate)])
                        : data.fractionType === "date"
                        ? parseNumber(rates[findDateForRate(data.fractionDate)])
                        : parseNumber(
                            rates[
                              findDateForRate(
                                generateNextDate(
                                  penalty.data.at(-1)?.payment.paymentDate
                                ) ?? debtDate
                              )
                            ]
                          ),
                      data.fraction
                    )
                  : result.periodicity === "year"
                  ? generatePenaltyYear(
                      debtAmount,
                      generateDifferenceDays(
                        generateNextDate(
                          penalty.data.at(-1)?.payment.paymentDate
                        ) ?? debtDate,
                        result.periodicity === "year"
                          ? new Date(new Date(debtDate).getFullYear(), 11, 31)
                          : data.endDate
                      ),
                      data.rate
                    )
                  : generatePenalty(
                      debtAmount,
                      generateDifferenceDays(
                        generateNextDate(
                          penalty.data.at(-1)?.payment.paymentDate
                        ) ?? debtDate,
                        data.endDate
                      ),
                      data.rate
                    ),
            },
          });
          if (
            result.rateType === "fraction" &&
            data.fractionType === "periods"
          ) {
            for (const [key, value] of reversedRates) {
              if (
                new Date(reformateDate(key)) > new Date(dateFind) &&
                new Date(reformateDate(key)) <= new Date(data.endDate)
              ) {
                if (parseNumber(value) !== copyPrevRate) {
                  copyPrevRate = parseNumber(value);
                  penalty.data.push({
                    debt: {
                      debtAmount: debtAmount,
                      rate: copyPrevRate,
                      debtDate: generateNextDateFraction(
                        reformateDate(prevDate)
                      ),
                      paymentDate: reformateDate(key),
                      days: generateDifferenceDays(
                        generateNextDateFraction(reformateDate(prevDate)),
                        reformateDate(key)
                      ),
                      formula: generateFormulaFraction(
                        debtAmount,
                        generateDifferenceDays(
                          generateNextDateFraction(reformateDate(prevDate)),
                          reformateDate(key)
                        ),
                        value,
                        data.fraction
                      ),
                      penaltyAmount: generatePenaltyFraction(
                        debtAmount,
                        generateDifferenceDays(
                          generateNextDateFraction(reformateDate(prevDate)),
                          reformateDate(key)
                        ),
                        parseNumber(value),
                        data.fraction
                      ),
                    },
                  });
                  prevDate = key;
                }
              }
            }
          }
          if (result.periodicity === "year") {
            for (
              let i = new Date(debtDate).getFullYear() + 1;
              i <= new Date(data.endDate).getFullYear();
              i++
            ) {
              if (i % 4 === 0) {
                penalty.data.push({
                  debt: {
                    debtAmount: debtAmount,
                    debtDate: new Date(i, 0, 1),
                    paymentDate:
                      i === new Date(data.endDate).getFullYear()
                        ? data.endDate
                        : new Date(i, 11, 31),
                    days:
                      i === new Date(data.endDate).getFullYear()
                        ? generateDifferenceDays(
                            new Date(i, 0, 1),
                            data.endDate
                          )
                        : 366,
                    formula: generateFormulaYearLeap(
                      debtAmount,
                      i === new Date(data.endDate).getFullYear()
                        ? generateDifferenceDays(
                            new Date(i, 0, 1),
                            data.endDate
                          )
                        : 366,
                      data.rate
                    ),
                    penaltyAmount: generatePenaltyYearLeap(
                      debtAmount,
                      i === new Date(data.endDate).getFullYear()
                        ? generateDifferenceDays(
                            new Date(i, 0, 1),
                            data.endDate
                          )
                        : 366,
                      data.rate
                    ),
                  },
                });
              } else {
                penalty.data.push({
                  debt: {
                    debtAmount: debtAmount,
                    debtDate: new Date(i, 0, 1),
                    paymentDate:
                      i === new Date(data.endDate).getFullYear()
                        ? data.endDate
                        : new Date(i, 11, 31),
                    days:
                      i === new Date(data.endDate).getFullYear()
                        ? generateDifferenceDays(
                            new Date(i, 0, 1),
                            data.endDate
                          )
                        : 365,
                    formula: generateFormulaYear(
                      debtAmount,
                      i === new Date(data.endDate).getFullYear()
                        ? generateDifferenceDays(
                            new Date(i, 0, 1),
                            data.endDate
                          )
                        : 365,
                      data.rate
                    ),
                    penaltyAmount: generatePenaltyYear(
                      debtAmount,
                      i === new Date(data.endDate).getFullYear()
                        ? generateDifferenceDays(
                            new Date(i, 0, 1),
                            data.endDate
                          )
                        : 365,
                      data.rate
                    ),
                  },
                });
              }
            }
          }
        }
      }
    }

    if (penalty.data.length) {
      result.penalties.push(penalty);
    } else {
      result.sum += Number(debtAmount);

      const remainsPenalties = [
        {
          debt: {
            debtAmount: Number(debtAmount),
            debtDate: debtDate,
            rate:
              result.rateType === "fraction" && data.fractionType === "today"
                ? parseNumber(rates[formattedDate(new Date())])
                : data.fractionType === "endPeriod"
                ? parseNumber(rates[formattedDate(data.endDate)])
                : data.fractionType === "date"
                ? parseNumber(rates[formattedDate(data.fractionDate)])
                : parseNumber(
                    rates[
                      findDateForRate(
                        generateNextDate(
                          penalty.data.at(-1)?.payment.paymentDate
                        ) ?? debtDate
                      )
                    ]
                  ),
            paymentDate:
              result.periodicity === "year"
                ? new Date(new Date(debtDate).getFullYear(), 11, 31)
                : data.endDate,
            days: generateDifferenceDays(
              debtDate,
              result.periodicity === "year"
                ? new Date(new Date(debtDate).getFullYear(), 11, 31)
                : data.endDate
            ),
            formula:
              data.rateType === "fraction"
                ? generateFormulaFraction(
                    Number(debtAmount),
                    generateDifferenceDays(debtDate, data.endDate),
                    data.fractionType === "today"
                      ? parseNumber(rates[formattedDate(new Date())])
                      : data.fractionType === "endPeriod"
                      ? parseNumber(rates[formattedDate(data.endDate)])
                      : data.fractionType === "date"
                      ? parseNumber(rates[formattedDate(data.fractionDate)])
                      : parseNumber(
                          rates[
                            findDateForRate(
                              generateNextDate(
                                penalty.data.at(-1)?.payment.paymentDate
                              ) ?? debtDate
                            )
                          ]
                        ),
                    data.fraction
                  )
                : result.periodicity === "year"
                ? generateFormulaYear(
                    debtAmount,
                    generateDifferenceDays(
                      debtDate,
                      new Date(new Date(debtDate).getFullYear(), 11, 31)
                    ),
                    data.rate
                  )
                : generateFormula(
                    debtAmount,
                    generateDifferenceDays(debtDate, data.endDate),
                    data.rate
                  ),
            penaltyAmount:
              data.rateType === "fraction"
                ? generatePenaltyFraction(
                    debtAmount,
                    generateDifferenceDays(debtDate, data.endDate),
                    data.fractionType === "today"
                      ? parseNumber(rates[formattedDate(new Date())])
                      : data.fractionType === "endPeriod"
                      ? parseNumber(rates[formattedDate(data.endDate)])
                      : data.fractionType === "date"
                      ? parseNumber(rates[formattedDate(data.fractionDate)])
                      : parseNumber(
                          rates[
                            findDateForRate(
                              generateNextDate(
                                penalty.data.at(-1)?.payment.paymentDate
                              ) ?? debtDate
                            )
                          ]
                        ),
                    data.fraction
                  )
                : result.periodicity === "year"
                ? generatePenaltyYear(
                    debtAmount,
                    generateDifferenceDays(
                      debtDate,
                      new Date(new Date(debtDate).getFullYear(), 11, 31)
                    ),
                    data.rate
                  )
                : generatePenalty(
                    debtAmount,
                    generateDifferenceDays(debtDate, data.endDate),
                    data.rate
                  ),
          },
        },
      ];
      if (result.periodicity === "year") {
        for (
          let i = new Date(debtDate).getFullYear() + 1;
          i <= new Date(data.endDate).getFullYear();
          i++
        ) {
          if (i % 4 === 0) {
            remainsPenalties.push({
              debt: {
                debtAmount: debtAmount,
                debtDate: new Date(i, 0, 1),
                paymentDate:
                  i === new Date(data.endDate).getFullYear()
                    ? data.endDate
                    : new Date(i, 11, 31),
                days:
                  i === new Date(data.endDate).getFullYear()
                    ? generateDifferenceDays(new Date(i, 0, 1), data.endDate)
                    : 366,
                formula: generateFormulaYearLeap(
                  debtAmount,
                  i === new Date(data.endDate).getFullYear()
                    ? generateDifferenceDays(new Date(i, 0, 1), data.endDate)
                    : 366,
                  data.rate
                ),
                penaltyAmount: generatePenaltyYearLeap(
                  debtAmount,
                  i === new Date(data.endDate).getFullYear()
                    ? generateDifferenceDays(new Date(i, 0, 1), data.endDate)
                    : 366,
                  data.rate
                ),
              },
            });
          } else {
            remainsPenalties.push({
              debt: {
                debtAmount: debtAmount,
                debtDate: new Date(i, 0, 1),
                paymentDate:
                  i === new Date(data.endDate).getFullYear()
                    ? data.endDate
                    : new Date(i, 11, 31),
                days:
                  i === new Date(data.endDate).getFullYear()
                    ? generateDifferenceDays(new Date(i, 0, 1), data.endDate)
                    : 365,
                formula: generateFormulaYear(
                  debtAmount,
                  i === new Date(data.endDate).getFullYear()
                    ? generateDifferenceDays(new Date(i, 0, 1), data.endDate)
                    : 365,
                  data.rate
                ),
                penaltyAmount: generatePenaltyYear(
                  debtAmount,
                  i === new Date(data.endDate).getFullYear()
                    ? generateDifferenceDays(new Date(i, 0, 1), data.endDate)
                    : 365,
                  data.rate
                ),
              },
            });
          }
        }
      }

      result.penalties.push({
        ...penalty,
        data: remainsPenalties,
      });
    }

    result.penalties.forEach((penalty, index, penalties) => {
      penalties[index].sum = penalty.data.reduce((acc, { debt }) => {
        acc += debt !== null ? debt.penaltyAmount : 0;
        return acc;
      }, 0);
    });

    result.sumPercent = result.penalties.reduce((acc, penalty) => {
      acc += penalty.maxSum ? penalty.maxSum : penalty.sum;
      return acc;
    }, 0);

    result.overpayment = data.payments.reduce((acc, payment) => {
      acc += payment.paymentAmount;
      return acc;
    }, 0);
  });
  console.log(result);
  return result;
};

export const Calculator = () => {
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    sum: 0,
    startDate: "",
    endDate: "",
    rate: 0,
    periodicity: "day",
    rateType: "percent",
    fraction: "",
    fractionType: "periods",
    fractionDate: null,
    maxRate: 0,
    payments: [],
    debts: [],
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleAddPayment = () => {
    const newPayment = {
      paymentDate: "",
      paymentAmount: "",
      paymentNote: "",
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      payments: [...prevFormData.payments, newPayment],
    }));
  };

  const handleRemovePayment = (index) => {
    setFormData((prevFormData) => {
      const updatedPayments = [...prevFormData.payments];
      updatedPayments.splice(index, 1);
      return {
        ...prevFormData,
        payments: updatedPayments,
      };
    });
  };

  const handlePaymentInputChange = (event, index) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      const updatedPayments = [...prevFormData.payments];
      updatedPayments[index][name] = value;
      return {
        ...prevFormData,
        payments: updatedPayments,
      };
    });
  };

  const handleAddDebt = () => {
    const newDebt = {
      debtDate: "",
      debtAmount: "",
      debtNote: "",
    };
    setFormData((prevFormData) => ({
      ...prevFormData,
      debts: [...prevFormData.debts, newDebt],
    }));
  };

  const handleRemoveDebt = (index) => {
    setFormData((prevFormData) => {
      const updatedDebts = [...prevFormData.debts];
      updatedDebts.splice(index, 1);
      return {
        ...prevFormData,
        debts: updatedDebts,
      };
    });
  };

  const handleDebtInputChange = (event, index) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      const updatedDebts = [...prevFormData.debts];
      updatedDebts[index] = {
        ...updatedDebts[index],
        [name]: value,
      };
      return {
        ...prevFormData,
        debts: updatedDebts,
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = generateResult(JSON.parse(JSON.stringify(formData)));
    setResult(result);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <a href="#" onClick={() => setFormData(defaultValues)}>
          Пример заполненой формы
        </a>
        <fieldset>
          <legend>Введите параметры задолженности</legend>
          <input
            type="number"
            placeholder="Сумма задолженности"
            name="sum"
            value={formData.sum}
            onChange={handleInputChange}
            required
          />
          <h4>Период задолженности</h4>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
          -
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            required
          />
          <h4>Ставка</h4>
          <select
            name="rateType"
            value={formData?.rateType}
            onChange={handleInputChange}
          >
            <option value="" selected disabled hidden>
              Ставка
            </option>
            <option value="percent">%</option>
            <option value="fraction">Ставка ЦБ</option>
          </select>
          {formData?.rateType === "percent" ? (
            <>
              <input
                step="0.01"
                type="number"
                placeholder="Размер"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                required
              />
            </>
          ) : (
            <>
              <InputMask
                mask="9/9999999999999"
                type="text"
                name="fraction"
                placeholder="Доля"
                value={formData.fraction}
                onChange={handleInputChange}
              />
            </>
          )}
          {formData?.rateType === "fraction" ? (
            <>
              <select
                name="fractionType"
                value={formData?.fractionType}
                onChange={handleInputChange}
              >
                <option value="" selected disabled hidden>
                  Применять процентную ставку
                </option>
                <option value="endPeriod">на конец периода</option>
                <option value="today">сегодня</option>
                <option value="periods">по периодам действия</option>
                <option value="date">на указанную дату</option>
              </select>
              {formData?.fractionType === "date" && (
                <input
                  type="date"
                  name="fractionDate"
                  value={formData.fractionDate}
                  onChange={handleInputChange}
                  required
                />
              )}
            </>
          ) : (
            <>
              <select
                name="periodicity"
                value={formData?.periodicity}
                onChange={handleInputChange}
              >
                <option value="" selected disabled hidden>
                  Периодичность
                </option>
                <option value="day">В день</option>
                <option value="year">В год</option>
              </select>
              <input
                type="number"
                name="maxRate"
                placeholder="Ограничение %"
                value={formData.maxRate}
                onChange={handleInputChange}
                required
              />
            </>
          )}
          <h4>Частичная оплата задолженности</h4>
          {formData.payments.map(
            ({ paymentDate, paymentAmount, paymentNote }, index) => (
              <div key={index}>
                <input
                  type="date"
                  name={`paymentDate`}
                  value={paymentDate}
                  onChange={(event) => handlePaymentInputChange(event, index)}
                  required
                />
                <input
                  type="number"
                  name={`paymentAmount`}
                  value={paymentAmount}
                  placeholder="Сумма"
                  onChange={(event) => handlePaymentInputChange(event, index)}
                  required
                />
                <input
                  type="text"
                  name={`paymentNote`}
                  placeholder="Примечание"
                  value={paymentNote}
                  onChange={(event) => handlePaymentInputChange(event, index)}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemovePayment(index)}
                >
                  Удалить
                </button>
              </div>
            )
          )}
          <button type="button" onClick={handleAddPayment}>
            Добавить
          </button>
          <h4>Дополнительные задолженности</h4>
          {formData.debts.map(({ debtAmount, debtDate, debtNote }, index) => (
            <div key={index}>
              <input
                type="date"
                name={`debtDate`}
                value={debtDate}
                onChange={(event) => handleDebtInputChange(event, index)}
                required
              />
              <input
                type="number"
                name={`debtAmount`}
                placeholder="Сумма"
                value={debtAmount}
                onChange={(event) => handleDebtInputChange(event, index)}
                required
              />
              <input
                type="text"
                name={`debtNote`}
                placeholder="Примечание"
                value={debtNote}
                onChange={(event) => handleDebtInputChange(event, index)}
                required
              />
              <button type="button" onClick={() => handleRemoveDebt(index)}>
                Удалить
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddDebt}>
            Добавить
          </button>
          <div>
            <button type="submit">Рассчитать</button>
          </div>
        </fieldset>
      </form>

      {result && <Result result={result} />}
    </>
  );
};

export const Result = ({ result }) => {
  return (
    <>
      {" "}
      {result.penalties.map(({ sum, maxSum, data, debtDate, debtNote }) => (
        <table>
          <caption>
            Расчёт процентов по задолженности, возникшей{" "}
            <time dateTime={debtDate}>
              {new Date(debtDate).toLocaleDateString("ru-RU")}
            </time>{" "}
            <i>{debtNote && `(${debtNote})`} </i>
          </caption>
          <thead>
            <tr>
              <th rowspan={2}>Задолженность</th>
              <th colspan={3}>Период просрочки</th>
              {result.periodicity === "year" && (
                <th rowspan={2}>Дней в году </th>
              )}
              {result.rateType === "fraction" && <th rowspan={2}>Ставка</th>}
              <th rowspan={2}>Формула</th>
              <th rowspan={2}>Неустойка</th>
            </tr>
            <tr>
              <th>с</th>
              <th>по</th>
              <th>дней</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ debt, payment }) => (
              <>
                {debt && (
                  <tr>
                    <td>{debt.debtAmount.toFixed(2)}</td>
                    <td>
                      <time dateTime={debt.debtDate}>
                        {new Date(debt.debtDate).toLocaleDateString("ru-RU")}
                      </time>
                    </td>
                    <td>
                      <time dateTime={debt.paymentDate}>
                        {new Date(debt.paymentDate).toLocaleDateString("ru-RU")}
                      </time>
                    </td>
                    <td>{debt.days}</td>
                    {result.rateType === "fraction" && <td>{debt.rate}</td>}
                    {result.periodicity === "year" && (
                      <td>{debt.days === 366 ? 366 : 365}</td>
                    )}
                    <td>{debt.formula}</td>
                    <td>{debt.penaltyAmount.toFixed(2)}</td>
                  </tr>
                )}

                {payment && (
                  <tr style={{ backgroundColor: "lightyellow" }}>
                    <td>-{payment.paymentAmount.toFixed(2)}</td>
                    <td>
                      <time dateTime={payment.paymentDate}>
                        {new Date(payment.paymentDate).toLocaleDateString(
                          "ru-RU"
                        )}
                      </time>
                    </td>
                    <td colSpan={5}>
                      Оплата задолженности{" "}
                      <i>{payment.paymentNote && `(${payment.paymentNote})`}</i>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <b>Итого:</b>
              </td>
              <td colspan={6}>
                {!!maxSum && sum >= maxSum ? (
                  <s>{sum.toFixed(2)} р.</s>
                ) : (
                  `${sum.toFixed(2)} р.`
                )}
              </td>
            </tr>
            {!!maxSum && sum >= maxSum && (
              <tr>
                <td>
                  <b>но не более {result.maxRate}%:</b>
                </td>
                <td colspan={6}>{maxSum.toFixed(2)} руб.</td>
              </tr>
            )}
          </tfoot>
        </table>
      ))}
      <table>
        <tbody>
          <tr>
            <td>
              <b>Сумма основного долга: </b>
            </td>
            <td colspan={5}>{result.sum.toFixed(2)} руб.</td>
          </tr>

          {!!result.overpayment && (
            <tr>
              <td>Переплата:</td>
              <td colspan={5}>{result.overpayment.toFixed(2)} руб.</td>
            </tr>
          )}

          <tr>
            <td>
              <b>
                {result.rateType === "percent"
                  ? "Сумма процентов по всем задолженностям: "
                  : "Сумма неустойки: "}
              </b>
            </td>
            <td colspan={5}>{result.sumPercent.toFixed(2)} руб.</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
