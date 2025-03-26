import { useRef } from "react";
import {  z } from "zod";



const formObject = z.object({
  Name: z.string().min(1, "Username is required"), // Added min(1) to ensure it's not empty
  Email: z.string().email("Invalid email format"),
  phoneNumber: z.string().regex(/[0-9]{3}-[0-9]{3}-[0-9]{4}/, "Invalid phone format"),
 
 
});

export type InputType = z.infer<typeof formObject>; // { userName: string; email: string; phoneNumber: string; entityType: "Normal" | "Workplace" }
export default function Filter({setFilter }: {setFilter:(filter:  InputType) => void }) {

  const nameRef= useRef<HTMLInputElement>(null);
  const emailRef= useRef<HTMLInputElement>(null);
  const phoneRef= useRef<HTMLInputElement>(null);
  const entityTypeRef= useRef<HTMLInputElement>(null);
  
return (<aside className="w-max h-full  bg-white  sm:p-4 border-b md:border-b-0 md:border-r border-gray-200">
<div className="">
  <h2 className="text-lg font-medium">Filters</h2>
  <div className="space-y-3">
    <div>
      <label className="block text-sm mb-1">Name</label>
      <input
      ref={nameRef}
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        placeholder="Search by name"
      />
    </div>

    <div>
      <label className="block text-sm mb-1">Phone Number</label>
      <input
      ref={phoneRef}
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        placeholder="Search by phone number"
      />
    </div>
    <div>
      <label className="block text-sm mb-1">Email</label>
      <input
      ref={emailRef}
        type="email"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        placeholder="Search by email"
      />
    </div>
    {/* <div>
      <label className="block text-sm mb-1">Status</label>
      <select  ref={statusRef}  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div> */}
    <button onClick={() =>  {
      console.log(nameRef.current?.value)
      console.log(emailRef.current?.value)  
      console.log(phoneRef.current?.value)
      console.log(entityTypeRef.current)

      setFilter(  { Name: nameRef.current ? nameRef.current?.value : ""  , Email:  emailRef.current ? emailRef.current?.value : "" , phoneNumber: phoneRef.current ? phoneRef.current?.value : ""  } 
      
      
    ) }} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
      Apply Filters
    </button>
  </div>
</div>
</aside>
)
}





