let price = 0;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

const purchaseBtn = document.getElementById("purchase-btn");
const cashInput = document.getElementById("cash");
const priceInput = document.getElementById("price");
const changeDueDisplay = document.getElementById("change-due");

//const printResult = () => {};

const CheckCashRegister = () => {
  price = parseFloat(priceInput.value);
  let cash = parseFloat(cashInput.value);

  const cashInCents = Math.round(Number(cash) * 100);
  const priceInCents = Math.round(price * 100);
  const cidInCents = cid.map((item) => [item[0], Math.round(item[1] * 100)]);

  if (cashInCents < priceInCents) {
    changeDueDisplay.innerHTML = "<p>Customer does not have enough money to purchase the item</p>";
    cash = "";
    return;
  }
  if (cashInCents === priceInCents) {
    changeDueDisplay.innerHTML = "<p>No change due - customer paid with exact cash</p>";
    cash = "";
    return;
  }

  let changeDueInCents = cashInCents - priceInCents;
  const currencyUnitsInCents = [
    ["ONE HUNDRED", 10000],
    ["TWENTY", 2000],
    ["TEN", 1000],
    ["FIVE", 500],
    ["ONE", 100],
    ["QUARTER", 25],
    ["DIME", 10],
    ["NICKEL", 5],
    ["PENNY", 1],
  ];
  let changeToGive = [];
  let totalCidInCents = 0;
  for (let i = 0; i < cid.length; i++) {
    totalCidInCents += cidInCents[i][1];
  }

  if (totalCidInCents < changeDueInCents) {
    changeDueDisplay.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  let tempCidInCents = [...cidInCents];

  for (let i = 0; i < currencyUnitsInCents.length; i++) {
    const unitName = currencyUnitsInCents[i][0];
    const unitValueInCents = currencyUnitsInCents[i][1];
    let availableAmountInCents = 0;

    for (let j = 0; j < tempCidInCents.length; j++) {
      if (tempCidInCents[j][0] === unitName) {
        availableAmountInCents = tempCidInCents[j][1];
        break;
      }
    }

    let amountToGiveInCents = 0;
    while (changeDueInCents >= unitValueInCents && availableAmountInCents > 0) {
      changeDueInCents -= unitValueInCents;
      availableAmountInCents -= unitValueInCents;
      amountToGiveInCents += unitValueInCents;
    }

    if (amountToGiveInCents > 0) {
      changeToGive.push([unitName, amountToGiveInCents]);

      for (let j = 0; j < tempCidInCents.length; j++) {
        if (tempCidInCents[j][0] === unitName) {
          tempCidInCents[j][1] = availableAmountInCents;
          break;
        }
      }
    }
  }

  if (changeDueInCents > 0) {
    changeDueDisplay.textContent = "Status: INSUFFICIENT_FUNDS";
  } else if (changeDueInCents == 0 && totalCidInCents == cashInCents - priceInCents && changeToGive.length > 0) {
    changeDueDisplay.textContent =
      "Status: CLOSED</br>" +
      changeToGive
        .reverse()
        .map((item) => {
          const amountInDollars = (item[1] / 100).toFixed(2);
          return `${item[0]}: $${amountInDollars}</br>`;
        })
        .join(" ");
  } else if (changeDueInCents == 0) {
    changeDueDisplay.innerHTML =
      "Status: OPEN</br>" +
      changeToGive
        .reverse()
        .map((item) => {
          const amountInDollars = (item[1] / 100).toFixed(2);
          return `${item[0]}: $${amountInDollars}</br>`;
        })
        .join(" ");
  } else {
    changeDueDisplay.textContent = "Status: INSUFFICIENT_FUNDS";
  }
};

purchaseBtn.addEventListener("click", CheckCashRegister);

cash.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    CheckCashRegister();
  }
});
