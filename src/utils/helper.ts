
import { connectionUrl } from "./connectionUrl";


function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}



  const searchuser = 
    debounce(async (query: string, type: "username"| "phonenumber" | "email", setState: React.Dispatch<React.SetStateAction<any[]>>) => {
      console.log("true");
      console.log(query);
    
      await fetch(
        `${connectionUrl}/api/v1/user-info?${type}=${query}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then(async (response) => {
          console.log("done");
          const data = await response.json();
        
          console.log(data);
          setState(data.users);
        ;
          return data.users;
        })
        .catch(() => {
          console.log("no results found");
      
        });
    }, 3000);




export function searchUser(query: string, type: "username" | "email" | "phonenumber", setState: React.Dispatch<React.SetStateAction<any[]>>) {

    return searchuser(query, type, setState);
}
