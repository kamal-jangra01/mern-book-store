import React, { useEffect, useMemo, useState } from "react";
import { bookBaseUrl } from "../../axiosInstance";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import Navbar from "./Navbar";
import toast, { Toaster } from "react-hot-toast";

const PAGE_SIZE = 5;

const Home = () => {
  const [bookForm, setBookForm] = useState({
    BookName: "",
    BookTitle: "",
    Author: "",
    SellingPrice: "",
    PublishDate: "",
    Id: "",
  });

  const [bookList, setBookList] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);

  // ================= FETCH =================
  const getAllbookList = async () => {
    try {
      const { data } = await bookBaseUrl.get("booklists");
      setBookList(data?.BookList || []);
    } catch {
      toast.error("Failed to fetch books");
    }
  };

  useEffect(() => {
    getAllbookList();
  }, []);

  // ================= SEARCH =================
  const filteredBooks = useMemo(() => {
    return bookList.filter((book) =>
      `${book.BookName} ${book.BookTitle} ${book.Author}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [bookList, search]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredBooks.length / PAGE_SIZE);

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBooks.slice(start, start + PAGE_SIZE);
  }, [filteredBooks, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ================= FORM =================
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBookForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setBookForm({
      BookName: "",
      BookTitle: "",
      Author: "",
      SellingPrice: "",
      PublishDate: "",
      Id: "",
    });
    setIsUpdating(false);
  };

  const handleSubmit = async () => {
    try {
      if (
        !bookForm.BookName ||
        !bookForm.BookTitle ||
        !bookForm.Author ||
        !bookForm.SellingPrice
      ) {
        return toast.error("All required fields must be filled");
      }

      if (!isUpdating) {
        const { data } = await bookBaseUrl.post("/addbook", bookForm);
        if (data?.Success) toast.success(data?.Message);
      } else {
        const { data } = await bookBaseUrl.put("/updatebook", bookForm);
        if (data?.Success) toast.success(data?.Message);
      }

      resetForm();
      getAllbookList();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await bookBaseUrl.post("deletebook", { Id: id });
      if (data?.Success) {
        toast.success(data?.Message);
        getAllbookList();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = (book) => {
    setBookForm({
      BookName: book.BookName,
      BookTitle: book.BookTitle,
      Author: book.Author,
      SellingPrice: book.SellingPrice,
      PublishDate: book.PublishDate,
      Id: book._id,
    });
    setIsUpdating(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <Toaster />

      <div className="bg-gray-100 min-h-[calc(100vh-60px)] p-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-700">
            📚 Book Management
          </h2>

          <input
            type="text"
            placeholder="Search books..."
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-gray-400 outline-none w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {isUpdating ? "Update Book" : "Add New Book"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(bookForm).map((key) =>
              key !== "Id" ? (
                <div key={key} className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">{key}</label>
                  <input
                    type={
                      key === "PublishDate"
                        ? "date"
                        : key === "SellingPrice"
                          ? "number"
                          : "text"
                    }
                    name={key}
                    value={bookForm[key]}
                    onChange={handleFormChange}
                    className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-gray-300 outline-none"
                  />
                </div>
              ) : null,
            )}
          </div>

          <div className="flex justify-end mt-6 gap-3">
            {isUpdating && (
              <button
                onClick={resetForm}
                className="px-5 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            )}

            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
            >
              {isUpdating ? "Update Book" : "Add Book"}
            </button>
          </div>
        </div>

        {/* ================= BOOK LIST ================= */}

        <div className="mt-6">
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-white rounded-xl shadow-md overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[800px]">
              <thead className="bg-gray-200 text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-3">Book Name</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Publish Date</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedBooks.length > 0 ? (
                  paginatedBooks.map((book) => (
                    <tr
                      key={book._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3 font-medium">{book.BookName}</td>
                      <td className="px-6 py-3">{book.BookTitle}</td>
                      <td className="px-6 py-3">{book.Author}</td>
                      <td className="px-6 py-3 text-green-600 font-semibold">
                        ₹{book.SellingPrice}
                      </td>
                      <td className="px-6 py-3">{book.PublishDate}</td>

                      <td className="px-6 py-3">
                        <div className="flex justify-center gap-4">
                          <MdDelete
                            size={20}
                            className="text-red-500 cursor-pointer hover:scale-110 transition"
                            onClick={() => handleDelete(book._id)}
                          />
                          <FaPen
                            size={18}
                            className="text-green-600 cursor-pointer hover:scale-110 transition"
                            onClick={() => handleUpdate(book)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No Books Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden space-y-4">
            {paginatedBooks.length > 0 ? (
              paginatedBooks.map((book) => (
                <div
                  key={book._id}
                  className="bg-white p-4 rounded-xl shadow-md border hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-800">
                      {book.BookName}
                    </h3>
                    <span className="text-green-600 font-semibold">
                      ₹{book.SellingPrice}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium text-gray-700">Title:</span>{" "}
                      {book.BookTitle}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Author:</span>{" "}
                      {book.Author}
                    </p>
                    <p className="text-xs text-gray-500">
                      Published: {book.PublishDate}
                    </p>
                  </div>

                  <div className="flex justify-end gap-5 mt-4">
                    <MdDelete
                      size={20}
                      className="text-red-500 cursor-pointer hover:scale-110 transition"
                      onClick={() => handleDelete(book._id)}
                    />
                    <FaPen
                      size={18}
                      className="text-green-600 cursor-pointer hover:scale-110 transition"
                      onClick={() => handleUpdate(book)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-6">
                No Books Found
              </div>
            )}
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
