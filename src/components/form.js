import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

const DeviceForm = () => {
  useEffect(() => {
    AOS.init({});
  }, []);

  const [formData, setFormData] = useState([]);
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [flag, setFlag] = useState(false);
  const [indexing, setIndexing] = useState("");
  const [updateflag, setUpdateflag] = useState("");
  const [operationMessage, setOperationMessage] = useState("");

  const [titleError, setTitleError] = useState("");
  const [brandError, setBrandError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    getTodo();
  }, []);

  const getTodo = async () => {
    try {
      let response = await axios.get("https://todoappbackend-alpha.vercel.app/todo/get-todo");
      setFormData(response.data.Todo);
    } catch (error) {
      console.log(error);
    }
  };

  const validateInputs = () => {
    let isValid = true;

    // Title validation
    if (!title) {
      setTitleError("Title is required");
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(title)) {
      setTitleError("Title must be alphabetic");
      isValid = false;
    } else {
      setTitleError("");
    }

    // Brand validation
    if (!brand) {
      setBrandError("Brand is required");
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(brand)) {
      setBrandError("Brand must be alphabetic");
      isValid = false;
    } else {
      setBrandError("");
    }

    // Price validation
    if (!price) {
      setPriceError("Price is required");
      isValid = false;
    } else if (!/^[0-9]+$/.test(price)) {
      setPriceError("Price must be a valid number");
      isValid = false;
    } else {
      setPriceError("");
    }

    // Description validation
    if (!description) {
      setDescriptionError("Description is required");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    return isValid;
  };

  const showMessage = (message) => {
    setOperationMessage(message);
    showPopupMessage(message); // Display pop-up message as well
    setTimeout(() => {
      setOperationMessage("");
    }, 3000); // Show the message for 3 seconds
  };

  const showPopupMessage = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setPopupMessage("");
    }, 3000); // Show the pop-up for 3 seconds
  };

  const onAddHandler = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      setFlag(true);
      let payload = {
        title: title,
        description: description,
        price: price,
        brand: brand,
      };

      let response = await axios.post(
        "https://todoappbackend-alpha.vercel.app/todo/add-todo",
        payload
      );
      setFormData([...formData, response.data]); // Assuming response.data is the new data
      setFlag(false);
      setBrand("");
      setDescription("");
      setPrice("");
      setTitle("");
      showMessage("Data submitted successfully.");
    } catch (error) {
      console.log(error);
      showMessage("Error submitting data. Please try again.");
    }
  };

  const onDeleteHandler = async (iding) => {
    try {
      await axios.delete(`https://todoappbackend-alpha.vercel.app/todo/delete-todo/${iding}`);
      let updatedFormData = formData.filter((value) => value._id !== iding);
      setFormData(updatedFormData);
      showMessage("Data deleted successfully.");
    } catch (error) {
      console.log(error);
    }
  };

  const onTitleHandler = (e) => {
    setTitle(e.target.value);
  };

  const onEditHandler = (value, index) => {
    setUpdateflag(true);
    setIndexing(index);
    setBrand(value.brand);
    setTitle(value.title);
    setDescription(value.description);
    setPrice(value.price);
  };

  const onBrandHandler = (e) => {
    setBrand(e.target.value);
  };

  const onPriceHandler = (e) => {
    setPrice(e.target.value);
  };

  const onDescriptonHandler = (e) => {
    setDescription(e.target.value);
  };

  const onUpdateHandler = async () => {
    let payload = {
      title: title,
      description: description,
      price: price,
      brand: brand,
    };
    try {
      await axios.put(`https://todoappbackend-alpha.vercel.app/todo/update-todo/${indexing}`, payload);
      let updatedFormData = formData.map((value) =>
        value._id === indexing ? payload : value
      );
      setFormData(updatedFormData);
      setUpdateflag(false);
      setTitle("");
      setBrand("");
      setDescription("");
      setPrice("");
      showMessage("Data updated successfully.");
    } catch (error) {
      console.log(error);
    }
  };

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  return (
    <div>
      <div className="flex items-center justify-center ">
        <div
          data-aos="zoom-in"
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-6 mx-4 mb-4 w-96"
        >
          <div className="mb-4 text-xl font-bold">
            Enter your device details
          </div>
          {operationMessage && (
            <div className="mt-4 text-green-600 text-sm">
              {operationMessage}
            </div>
          )}
          <div className="mb-4">
            <label
              data-aos="slide-left"
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              data-aos="rotate-up-left"
              value={title}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                titleError ? "border-red-500" : ""
              }`}
              id="title"
              type="text"
              placeholder="Enter title"
              name="title"
              onChange={onTitleHandler}
              required
            />
            {titleError && (
              <p className="text-red-500 text-xs italic">{titleError}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              data-aos="slide-right"
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="brand"
            >
              Brand
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                brandError ? "border-red-500" : ""
              }`}
              id="brand"
              type="text"
              placeholder="Enter brand"
              name="brand"
              value={brand}
              onChange={onBrandHandler}
              required
            />
            {brandError && (
              <p className="text-red-500 text-xs italic">{brandError}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              data-aos="slide-left"
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                priceError ? "border-red-500" : ""
              }`}
              id="price"
              type="text"
              placeholder="Enter price"
              name="price"
              value={price}
              onChange={onPriceHandler}
              required
            />
            {priceError && (
              <p className="text-red-500 text-xs italic">{priceError}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              data-aos="slide-right"
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                descriptionError ? "border-red-500" : ""
              }`}
              id="description"
              placeholder="Enter description"
              name="description"
              value={description}
              onChange={onDescriptonHandler}
              required
            />
            {descriptionError && (
              <p className="text-red-500 text-xs italic">{descriptionError}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            {updateflag ? (
              <button
                disabled={flag}
                onClick={onUpdateHandler}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {flag ? "Updating" : "Update"}
              </button>
            ) : (
              <button
                disabled={flag}
                onClick={onAddHandler}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {flag ? "Submitting" : "Submit"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto flex items-center justify-center">
        {formData.length > 0 ? (
          <div className="w-full overflow-x-auto lg:w-3/4 md:w-2/4 lg:justify-center">
            <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr className="font-extrabold text-lg">
                  <th scope="col" className="px-2 sm:px-6 py-3">
                    Id
                  </th>
                  <th scope="col" className="px-2 sm:px-6 py-3">
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-2 sm:px-6 py-3 hidden md:table-cell"
                  >
                    Brand
                  </th>
                  <th scope="col" className="px-2 sm:px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-2 sm:px-6 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-2 sm:px-6 py-3">
                    Delete
                  </th>
                  <th scope="col" className="px-2 sm:px-6 py-3">
                    Update
                  </th>
                </tr>
              </thead>
              {formData.map((value, index) => (
                <tbody key={index}>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 ">
                    <th
                      scope="row"
                      className="px-2 sm:px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
                    >
                      {index + 1}
                    </th>
                    <td className="px-2 sm:px-6 py-4 items-center justify-center text-center">
                      {value.title}
                    </td>
                    <td className="px-2 sm:px-6 py-4 items-center text-center hidden md:table-cell">
                      {" "}
                      {/* Hidden on smaller screens */}
                      {value.brand}
                    </td>
                    <td className="px-2 sm:px-6 py-4 text-center">
                      {value.price}
                    </td>
                    <td className="px-2 sm:px-6 py-4 text-center">
                      {value.description}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => onDeleteHandler(value._id)}
                        className="bg-red-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => onEditHandler(value, value._id)}
                        className="bg-green-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        ) : (
          ""
        )}
      </div>

      {showPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default DeviceForm;
