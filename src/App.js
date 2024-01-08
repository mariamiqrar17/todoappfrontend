import React, { useEffect } from "react";
import axios from "axios";
import './App.css';
import DeviceForm from './components/form';

function App() {
  const getData = async () => {
    try {
      await axios.post("http://localhost:4000/todo/add-todo", {
        title: "",
        brand: "",
        price: "",
        description: ""
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='bg-blue-500 h-auto py-6'>
      <DeviceForm />
    </div>
  );
}

export default App;
