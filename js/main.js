let firstNameInp = document.querySelector(".student-first-name");
let lastNameInp = document.querySelector(".student-last-name");
let phoneNumberInp = document.querySelector(".phone-number");
let weeksKpiInp = document.querySelector(".weeks-kpi");
let monthKpiInp = document.querySelector(".month-kpi");

let addStudentBtn = document.querySelector(".add-student-btn");
let closeModalBtn = document.querySelector("#btn-close-modal");

let STUDENTS_API = "http://localhost:5000/students";

//create
function createStudent() {
  if (
    !firstNameInp.value.trim() ||
    !lastNameInp.value.trim() ||
    !phoneNumberInp.value.trim() ||
    !weeksKpiInp.value.trim() ||
    !monthKpiInp.value.trim()
  ) {
    alert("Some inputs are empty!");
    return;
  }
  let studentObj = {
    firstName: firstNameInp.value,
    lastName: lastNameInp.value,
    number: phoneNumberInp.value,
    weeksKPI: weeksKpiInp.value,
    monthKPI: monthKpiInp.value,
  };
  fetch(STUDENTS_API, {
    method: "POST",
    body: JSON.stringify(studentObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  alert("SUCCESS!");
  firstNameInp.value = "";
  lastNameInp.value = "";
  phoneNumberInp.value = "";
  weeksKpiInp.value = "";
  monthKpiInp.value = "";

  closeModalBtn.click();
}
addStudentBtn.addEventListener("click", createStudent);

//read
let currentPage = 1;
let search = "";

let studentsList = document.querySelector(".students-list");
async function render() {
  let requestAPI = `${STUDENTS_API}?q=${search}&_page=${currentPage}&_limit=3`;
  if (search !== "") {
    requestAPI = `${STUDENTS_API}?q=${search}&_limit=3`;
  }
  let res = await fetch(requestAPI);
  let data = await res.json();
  studentsList.innerHTML = "";
  data.forEach((item) => {
    studentsList.innerHTML += `

    <div class="card m-3" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title first-last-name-info">${item.firstName} ${item.lastName}</h5>
      <p class="card-text phone-number-info"> Phone number: ${item.number}</p>
      <p class="card-text weeks-kpi-info"> Weeks KPI: ${item.weeksKPI}</p>
      <p class="card-text month-kpi-info"> Month KPI: ${item.monthKPI}</p>
      <a href="#" class="btn btn-success btn-update" data-bs-toggle="modal" data-bs-target="#exampleModal" id="${item.id}">Update</a>
      <a href="#" class="btn btn-danger btn-delete" id="${item.id}">Delete</a>
    </div>
  </div>
    `;
  });
  if (data.length === 0) return;
  deleteEventStudent();
  addUpdateEvent();
}
render();

//delete
async function deleteStudent(e) {
  let studentId = e.target.id;
  await fetch(`${STUDENTS_API}/${studentId}`, {
    method: "DELETE",
  });

  render();
}

function deleteEventStudent() {
  let deleteBtns = document.querySelectorAll(".btn-delete");
  deleteBtns.forEach((item) => {
    item.addEventListener("click", deleteStudent);
  });
}

// update
let saveBtn = document.querySelector(".save-changes-btn");

async function addUpdateStudentToForm(e) {
  let studentId = e.target.id;
  let res = await fetch(`${STUDENTS_API}/${studentId}`);
  let studentObj = await res.json();
  firstNameInp.value = studentObj.firstName;
  lastNameInp.value = studentObj.lastName;
  phoneNumberInp.value = studentObj.number;
  weeksKpiInp.value = studentObj.weeksKPI;
  monthKpiInp.value = studentObj.monthKPI;

  saveBtn.setAttribute("id", studentObj.id);
  checkAddAndSaveBtn();
}
// addUpdateStudentToForm();

function checkAddAndSaveBtn() {
  if (saveBtn.id) {
    addStudentBtn.setAttribute("style", "display: none;");
    saveBtn.setAttribute("style", "display: block;");
  } else {
    addStudentBtn.setAttribute("style", "display: block;");
    saveBtn.setAttribute("style", "display: none;");
  }
}
checkAddAndSaveBtn();

async function saveChangesStudent(e) {
  closeModalBtn.setAttribute("style", "display: none !important;");
  let updateStudentObj = {
    id: e.target.id,
    firstName: firstNameInp.value,
    lastName: lastNameInp.value,
    number: phoneNumberInp.value,
    weeksKPI: weeksKpiInp.value,
    monthKPI: monthKpiInp.value,
  };
  await fetch(`${STUDENTS_API}/${e.target.id}`, {
    method: "PUT",
    body: JSON.stringify(updateStudentObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  firstNameInp.value = "";
  lastNameInp.value = "";
  phoneNumberInp.value = "";
  weeksKpiInp.value = "";
  monthKpiInp.value = "";

  saveBtn.removeAttribute("id");
  render();
  closeModalBtn.click();
}
saveBtn.addEventListener("click", saveChangesStudent);

function addUpdateEvent() {
  let updateBtns = document.querySelectorAll(".btn-update");
  updateBtns.forEach((item) => {
    item.addEventListener("click", addUpdateStudentToForm);
  });
}

closeModalBtn.addEventListener("click", () => {
  firstNameInp.value = "";
  lastNameInp.value = "";
  phoneNumberInp.value = "";
  weeksKpiInp.value = "";
  monthKpiInp.value = "";
});

//search
requestAPI = `${STUDENTS_API}?q=${search}&_page=${currentPage}&_limit=3`;
let searchInp = document.querySelector("#search-inp");
console.log(searchInp);
searchInp.addEventListener("input", () => {
  search = searchInp.value;

  render();
});

//pagination
let prevPageBtn = document.querySelector("#prev-page-btn");
let nextPageBtn = document.querySelector("#next-page-btn");

async function showPaginationBtns() {
  if (currentPage == 1) {
    prevPageBtn.style.display = "none";
  } else {
    prevPageBtn.style.display = "block";
  }

  let res = await fetch(STUDENTS_API);
  let data = await res.json();
  let students = data.length;
  let pagesNumber = Math.ceil(students / 3);
  if (currentPage == pagesNumber) {
    nextPageBtn.style.display = "none";
  } else {
    nextPageBtn.style.display = "block";
  }
}
showPaginationBtns();

prevPageBtn.addEventListener("click", () => {
  currentPage--;
  render();
  showPaginationBtns();
});

nextPageBtn.addEventListener("click", () => {
  currentPage++;
  render();
  showPaginationBtns();
});
