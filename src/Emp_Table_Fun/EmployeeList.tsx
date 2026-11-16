import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Employee } from './EmplyeeType';
import { addEmployee, deleteEmployee, getEmployees, updateEmployee } from './services/employeeServices';
import { EmployeeForm } from './EmployeeForm';

export const EmployeeList: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [emplyeeData, setEmployeeData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [department, setDepartment] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false)
  const itemsPerPage = 5
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    const fetchData = async() =>{
      try{
        setLoading(true);
        setError("");
        const empData = await getEmployees();
        setEmployeeData(empData);
        setLoading(false);
      }
      catch(error){
         setError("Unable to load employees");
      }
    }
    fetchData();
  },[])

  useEffect(() => {
  setCurrentPage(1);
}, [search, department]);

  const handleSearch = useCallback(
    (event:  React.ChangeEvent<HTMLInputElement>) =>
    {
    setSearch(event.target.value)
  }, [])

  //Get unique departments
  const departments = useMemo(() =>{
    return [
      "All",
      ... new Set(emplyeeData.map(emp => emp.dept))
    ]
  }, [emplyeeData]);

  // Handle department change
  const handleDepartmentChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setDepartment(event.target.value)
    }, []
  );

  // filter employee

 const filteredEmployee = useMemo(() => {
  return emplyeeData.filter((emp: Employee) => {
    const matchedResult = emp.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchedDepartment =
      department === "All" || emp.dept === department;

    return matchedResult && matchedDepartment;
  });
}, [search, department, emplyeeData]);

// Pagination
const totalPage = Math.ceil(filteredEmployee.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage
const endIndex = startIndex + itemsPerPage;

const paginatedData  = filteredEmployee.slice(startIndex,endIndex);

   if (loading) {
    return <h3>Loading employees...</h3>;
  }

  if (error) {
    return <h3>{error}</h3>;
  }

  const handleAdd = () =>{
    setSelectedEmployee(null)
    setShowForm(true);
  }

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  }
  const handleSubmit = async(employee: Omit<Employee, "id">) => {
    if(selectedEmployee){
      const updatedEmployee = await updateEmployee(selectedEmployee.id, employee)
      setEmployeeData(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp))
    } else{
      const newEmployee = await addEmployee(employee)
      setEmployeeData(prev => [...prev, newEmployee])
    }
    setShowForm(false)
    setSelectedEmployee(null)
  }
console.log(paginatedData)

const handleDelete = async(id: number): Promise<void> => {
  await deleteEmployee(id);
  setEmployeeData(prev => prev.filter(emp => emp.id !== id));
}
return (
  <>
    <div>
      <h1>Employee Management</h1>
    </div>
    <button onClick={handleAdd}>
      Add Employee
    </button>
    {
      showForm && (
        <EmployeeForm
          key={selectedEmployee?.id ?? "new"}
          onSubmit={handleSubmit}
          onCancel={() =>{
            setShowForm(false)
          }
          }
          departments={departments}
          initialData={selectedEmployee}
        />
      )
    }

    {emplyeeData.map(employee => (
        <div key={employee.id}>
          {employee.name} - {employee.dept}

           <button onClick={() => handleEdit(employee)}>
            Edit
          </button>
          <button onClick={() => handleDelete(employee.id)}>
            Delete
          </button>
        </div>
      ))}

    {/*Search*/}
    <div>
      <input
        type="text"
        placeholder="Search employee..."
        value={search}
        onChange={handleSearch}
      />
    </div>

    <div>
      <select value={department} onChange={handleDepartmentChange}>
        {
          departments.map(dept => (
            <option key={dept} value={dept}>
            {dept}
            </option>
          ))
        }
      </select>
    </div>
    {/* Table*/}
    <table border={1} cellPadding={10}>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Dept</th>
          <th>Salary</th>
        </tr>
      </thead>
      <tbody>
      <>
      {
        paginatedData.length > 0 ? (
          paginatedData.map((emp: Employee) => {
            return(
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.dept}</td>
                <td>{emp.sal}</td>
              </tr>
            )
           
        
      })
       
        ) : 
        (
          <>
             <tr>
              <td colSpan={5}>No employees found</td>
            </tr>
          </>
        )
      }
     
      </>
      </tbody>
    </table>
     <div>
      <button
        disabled={currentPage==1}
        onClick={() => setCurrentPage((prev) => prev -1)}
        >
        Prev</button> 
        Page {currentPage} of {totalPage}
      <button
      disabled={currentPage == totalPage || totalPage == 0}
      onClick = {() => setCurrentPage((prev) => prev +1)}
      >
      Next
      </button>
      </div>
  </>
)
}