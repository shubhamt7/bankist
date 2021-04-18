'use strict';

let currentAccount;

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

//Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroToUSD = 1.1;

// const movementsUSD = movements.map(mov => Math.trunc(mov*euroToUSD));
// console.log(movements);
// console.log(movementsUSD);

// /////////////////////////////////////////////////

const displayMovements = function (account, ascendingOrder = true) {
  const movements = account.movements;
  if (ascendingOrder) {
    movements.sort((a, b) => b - a);
  } else {
    movements.sort((a, b) => a - b);
  }

  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i} - ${type}</div>
          <div class="movements__value">${mov}</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcPrintBalance = function (account) {
  const movements = account.movements;
  const balance = movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);

  account.balance = balance;
  labelBalance.textContent = `${balance}€`;
  // return balance;
};
// displayMovements(movements);
// calcPrintBalance(movements);

// console.log(movements);

const calcDisplaySummary = function (account) {
  const euroToUsd = 1.1;

  const incomes = account.movements
    .filter(mov => mov > 0)
    // .map(mov => mov * euroToUsd)
    .reduce((acc, mov) => acc + mov, 0);

  const outgoings = account.movements
    .filter(mov => mov < 0)
    // .map(mov => mov * euroToUsd)
    .reduce((acc, mov) => acc + mov, 0);

  //interest @5%
  const interest = incomes * account.interestRate;

  labelSumIn.textContent = `${Math.floor(incomes)}€`;
  labelSumOut.textContent = `${Math.floor(-1 * outgoings)}€`;
  labelSumInterest.textContent = `${Math.floor(interest)}€`;
};

// calcDisplaySummary(account1.movements);

function computeUsernames(accounts) {
  accounts.forEach((account, i) => {
    const nameStrings = account.owner.toLowerCase().split(' ');
    let username = '';
    for (const name of nameStrings) {
      username += name[0];
    }
    // console.log(username);
    accounts[i].username = username;
  });
}

//******************************************
// Implementing LOGIN

//computing usernames
computeUsernames(accounts);

//******************************************

// const deposits = movements.filter(mov => mov > 0);
// console.log(deposits);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// Find method
// Returns the first element that satisfies the condition

// const jessica = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(jessica);

// //acc - accumulator, initial value can be specified, like we specified 0
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   console.log(`Iteration : ${i} acc : ${acc}`);
//   return acc + curr;
// }, 0); //this zero is the initial value

// console.log(balance);

// const calcAverageHumanAge = ages => {
//   const average = ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length);

//   console.log('avg age ' + average);
//   return average;
// };

// const data = [5, 2, 4, 1, 15, 8, 3];
// const data2 = [16, 6, 10, 5, 6, 1, 4];

// calcAverageHumanAge(data);
// calcAverageHumanAge(data2);

function updateUI(account) {
  displayMovements(currentAccount);
  calcDisplaySummary(currentAccount);
  calcPrintBalance(currentAccount);
}

//******************************************
// Implementing LOGIN
//******************************************

btnLogin.addEventListener('click', e => {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  const pin = Number(inputLoginPin.value);

  if (currentAccount?.pin === pin) {
    //clear input fields

    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur(); //to make it lose the focus, i.e. the cursor

    //display details of the current user
    containerApp.style.opacity = 100;
    // console.log(currentAccount);
    labelWelcome.textContent = `Welcome, ${currentAccount.owner}!`;

    updateUI(currentAccount);
    // Log out automatically after 5 minutes
    logOutAfterFiveMinutes();
  } else {
    alert('Invalid username/password');
  }
});

//******************************************
// Implementing LOGOUT
//******************************************

function logOut(message = 'Session timed out, login again') {
  currentAccount = undefined;
  containerApp.style.opacity = 0;
  labelWelcome.textContent = message;
}

function logOutAfterFiveMinutes() {
  //five minutes = 60000 * 5 = 300000 ms
  setTimeout(logOut, 300000);
}

//******************************************
// Implementing TRANSFER
//******************************************

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // grabbing values from the inputs
  const amount = Number(inputTransferAmount.value);
  const transferTo = inputTransferTo.value.toLowerCase();

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();

  // searching for the receiver's account
  // matching should be case insensitive in order to enhance UX
  let receiver = accounts.find(function (account, index) {
    return account.owner.toLowerCase() === transferTo;
  });

  //sanity checks

  // 1. receiver should exist
  if (!receiver) {
    alert('No such user exists');
  } else {
    // 2. receiver should not be same as the sender
    if (receiver === currentAccount) {
      alert("Can't transfer to own account!");
      return;
    }

    // 3. Amount should be valid
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // 4. Sender should have enough balance to transfer
    if (amount > currentAccount.balance) {
      alert("Sorry, you don't have enough funds!");
      return;
    }

    // 5. Updating balances and movements of sender and receiver
    currentAccount.balance -= amount;
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    console.log(receiver.movements);
    console.log(receiver.owner);

    // 6. Updating UI
    updateUI(currentAccount);
  }
});

//******************************************
// Implementing ACCOUNT CLOSING
//******************************************

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  // console.log(username, pin);
  inputCloseUsername.value = inputClosePin.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();

  const user = accounts.find(acc => acc.username === username);

  if (user && user.pin === pin) {
    const i = accounts.findIndex(acc => acc.username === user.username);
    accounts.splice(i, 1);
    logOut('Account closed successfully');
  }
});

//******************************************
// Implementing LOAN APPROVAL

// If there is atleast one deposit with
// amount > 10% of loan requested,
// we will approve the loan, else reject.

//******************************************

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  inputLoanAmount.blur();

  if (amount > 0) {
    const eligible = currentAccount.movements.some(mov => mov >= 0.1 * amount);

    if (eligible) {
      currentAccount.movements.push(amount);
      updateUI(currentAccount);
      alert('Loan sanctioned successfully!');
    } else {
      alert('Sorry, You are not eligible for the loan...');
    }
  }
});

//******************************************
// Implementing SORTING OF MOVEMENTS
//******************************************

let ascendingOrder = true;

function sortMovements(account) {
  if (ascendingOrder) {
    displayMovements(account, false);
    btnSort.innerHTML = `&uparrow; SORT`;
    ascendingOrder = false;
  } else {
    displayMovements(account, true);
    btnSort.innerHTML = `&downarrow; SORT`;
    ascendingOrder = true;
  }
}

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  sortMovements(currentAccount);
});
