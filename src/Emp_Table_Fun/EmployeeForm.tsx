import { useEffect, useState } from "react";
import { Employee } from "./EmplyeeType";

// Props interface
interface EmployeeFormProps {
  onSubmit: (employee: Omit<Employee, "id">) => Promise<void>;
  onCancel: () => void;
  initialData?: Employee | null;
  departments: string[]
}

// FORM STATE interface

interface EmployeeFromData {
    name?: string;
    email?: string;
    dept?: string;
    sal?: string;
}

const initialFormData: EmployeeFromData = {
    name: "",
    email: "",
    dept: "",
    sal: ""
}
export const EmployeeForm: React.FC<EmployeeFormProps> = (
{onSubmit, onCancel, initialData, departments}
) =>{
    const [formData, setFormData] = useState<EmployeeFromData>(initialFormData)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    
    useEffect(() => {
        if(initialData){
            setFormData({
                name: initialData.name,
                email: initialData.email,
                dept: initialData.dept,
                sal: String(initialData.sal)
            })
        } else{
            setFormData(initialFormData)
        }
    }, [initialData])
    const handleChage = 
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
        const {name, value} = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        if (saving) return;
       const employee = {
        name: (formData.name ?? "").trim(),
        email: (formData.email ?? "").trim(),
        dept: formData.dept ?? "",
        sal: Number(formData.sal)
    };
    setSaving(true);
    setError("");
    try {
        await onSubmit(employee);
    } catch (error) {
        setError(error instanceof Error ? error.message : "Unable to save employee");
    } finally {
        setSaving(false);
    }
    }
return(
    <>
        <h3>{initialData ? "Edit Employee" : "Add Employee"}</h3>
        {error && <p role="alert">{error}</p>}
        <form onSubmit={handleSubmit}>
            {/*Name*/}
            <div>
                <label>Employee Name: </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter employee name"
                  onChange={handleChage}
                  value={formData.name}
                />
            </div>
            {/*Email*/}
            <div>
                <label>Employee Email: </label>
                <input
                  id="email"
                  type="text"
                  name="email"
                  placeholder="Enter employee email"
                  onChange={handleChage}
                  value={formData.email}
                />
            </div>
            {/* Deplartment */}
            <div>
                <label>Department: </label>
                <select id="dept" name="dept" onChange={handleChage} value={formData.dept}>
                   {departments.map(dept => (
                    dept != "All" &&
                    <option key={dept} value= {dept}>{dept}</option>
                   ))}
                </select>
            </div>
            {/*Salary */}
            <div>
                <label>Salary</label>
                <input
                    id="sal"
                    type="number"
                    name="sal"
                    placeholder="Enter salary"
                    onChange={handleChage}
                    value={formData.sal}
                />
            </div>

 {/* Buttons */}
            <div style={{ marginTop: "20px" }}>
                   <button type="submit" disabled={saving}>{saving ? "Saving..." : initialData? "Edit" : "Add"}</button>
                   <button type="button" onClick={onCancel} disabled={saving}>Cancel</button>
            </div>
        </form>
    </>
);
}