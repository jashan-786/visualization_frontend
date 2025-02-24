import { useRef } from "react";


export default function Filter({setFilter }: {setFilter:(filter: { Name: string, Email: string}) => void }) {

  const nameRef= useRef<HTMLInputElement>(null);
  const emailRef= useRef<HTMLInputElement>(null);
  
return (<aside className="w-full h-full md:w-[300px] lg:w-[400px] bg-white p-2 sm:p-4 border-b md:border-b-0 md:border-r border-gray-200">
<div className="space-y-4">
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
    <button onClick={() =>  { setFilter(  { Name: nameRef.current ? nameRef.current?.value : ""  , Email:  emailRef.current ? emailRef.current?.value : "" }  ) }} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
      Apply Filters
    </button>
  </div>
</div>
</aside>
)
}





