import { Employee_mock_data } from "../EmployeeMockData";
import { Employee } from "../EmplyeeType";

// GET Employees method
export const getEmployees = async(): Promise<Employee[]> =>{
  // const resp = await fetch("https://your-api.com/api/employees");
  // if(!resp.ok){
  //   throw new Error("faild to fetch data")
  // }
  return [...Employee_mock_data];
}

//ADD employee

export const addEmployee = async(employee: Omit<Employee, "id">) => {
  const newEmployee: Employee = {
    id: Math.max(0, ...Employee_mock_data.map(emp => emp.id)) + 1,
    ...employee
  }

  Employee_mock_data.push(newEmployee);
  console.log(newEmployee)
  return newEmployee;
};

//update Employees

export const updateEmployee = async(
  id: number,
  updateEmployee: Omit<Employee, "id">
): Promise<Employee> => {
  const index = Employee_mock_data.findIndex(emp => emp.id === id);

  if(index == -1){
    throw new Error("Unable to update")
  }

  Employee_mock_data[index] = {
    id,
    ...updateEmployee
  };

  return Employee_mock_data[index];
}

//Delete employee

export const deleteEmployee = async(id: number): Promise<void> => {
 for (let index = Employee_mock_data.length - 1; index >= 0; index--) {
   if (Employee_mock_data[index].id === id) {
     Employee_mock_data.splice(index, 1);
   }
 }
}