"use client";

import React, { useState, useEffect } from "react";
import { ownerService } from "./ownerService";
import axios from "axios";
import { RiFileEditLine, RiAddLargeFill, RiArrowLeftCircleFill, RiSave3Line,RiDeleteBinLine } from "react-icons/ri";
import { ToastContainer } from "react-toastify";

interface Owner {
  _id: string;
  HN: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

const OwnerPage = () => {
  const { fetchOwners, createOwner, updateOwner, deleteOwner, owner } =
    ownerService();
  
  const [owners, setOwners] = useState(owner);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOwner, setShowOwner] = useState<Owner[]>([]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setShowOwner(owners.slice(startIndex, endIndex));
  }, [currentPage, pageSize, owners]);

  useEffect(() => {
    setOwners(owner);
  }, [setOwners, owner]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await axios.get("/api/owners");
        console.log("Fetched Owners:", response.data.data);
        setOwners(response.data.data);
      } catch (error: any) {
        console.error("Error fetching owners:", error.message);
      }
    };

    fetchOwners();
  }, [fetchOwners]);

  const handleRowClick = (owner: Owner) => {
    setSelectedOwner(owner);
    setIsEditModalOpen(true);
  };

  const handleCreate = async () => {
    if (selectedOwner) {
      await createOwner(selectedOwner);
    }
    await fetchOwners();
    setIsCreateModalOpen(false);
  }

  const handleSave = async () => {
    if (selectedOwner?._id) {
      await updateOwner(selectedOwner._id, selectedOwner);
    }
    await fetchOwners();
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedOwner?._id) {
      await deleteOwner(selectedOwner._id);
    }
    await fetchOwners();
    setIsEditModalOpen(false);
  };

  const totalPages = Math.ceil(owners.length / pageSize);

  const handlePageChange = (page: number) => {
      setCurrentPage(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };



  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">ค้นหาเจ้าของ</h1>
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={() => {setSelectedOwner({
            _id: "",
            HN: "",
            first_name: "",
            last_name: "",
            phone: "",
            email: ""
          });
            setIsCreateModalOpen(true)}}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center">
          <RiAddLargeFill className="mr-2" />
          เพิ่มเจ้าของ
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Operation</th>
                <th className="border border-gray-300 px-4 py-2">HN เจ้าของ</th>
                <th className="border border-gray-300 px-4 py-2">ชื่อเจ้าของ</th>
                <th className="border border-gray-300 px-4 py-2">เบอร์ติดต่อ</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {showOwner.map((owner) => (
                <tr key={owner._id}>
                  <td
                    onClick={() => handleRowClick(owner)}
                    className="border border-gray-300 px-4 py-2">
                    <div className="flex justify-center items-center">
                    <RiFileEditLine className="rounded-md hover:bg-gray-300 cursor-pointer size-7"/></div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{owner.HN}</td>
                  <td
                    onClick={() => handleRowClick(owner)}
                    className="border border-gray-300 px-4 py-2">
                      <div className="hover:text-blue-600 cursor-pointer">
                        {`${owner.first_name} ${owner.last_name}`}
                      </div>
                    </td>
                  <td className="border border-gray-300 px-4 py-2">{owner.phone}</td>
                  <td className="border border-gray-300 px-4 py-2">{owner.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div>
          Page {currentPage} of {totalPages} ({owners.length} items)
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-300 cursor-pointer rounded mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page + 1)}
              className={`px-4 py-2 rounded mx-1 ${
                currentPage === page + 1
                  ? "bg-gray-200 text-black hover:bg-gray-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-300 cursor-pointer rounded ml-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div>
          <label htmlFor="pageSize" className="mr-2">
            Page size:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Create Owner modal */}
      {isCreateModalOpen && selectedOwner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">เจ้าของ</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <label className="text-right flex justify-end items-center">HN:</label>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={selectedOwner.HN}
                    onChange={(e) =>
                      setSelectedOwner({
                        ...selectedOwner,
                        HN: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <label className="text-right flex justify-end items-center">ชื่อจริง:</label>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={selectedOwner.first_name}
                    onChange={(e) =>
                      setSelectedOwner({
                        ...selectedOwner,
                        first_name: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <label className="text-right flex justify-end items-center">นามสกุล:</label>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={selectedOwner.last_name}
                    onChange={(e) =>
                      setSelectedOwner({
                        ...selectedOwner,
                        last_name: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <label className="text-right flex justify-end items-center">เบอร์โทร:</label>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={selectedOwner.phone}
                    onChange={(e) =>
                      setSelectedOwner({
                        ...selectedOwner,
                        phone: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <label className="text-right flex justify-end items-center">Email:</label>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={selectedOwner.email}
                    onChange={(e) =>
                      setSelectedOwner({
                        ...selectedOwner,
                        email: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 justify-between items-center flex ">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded flex items-center"
              >
                <RiArrowLeftCircleFill className="mr-2"/>Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center"
              >
                <RiSave3Line className="mr-2"/>Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Owner modal */}
      {isEditModalOpen && selectedOwner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">เจ้าของ</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <label className="text-right flex justify-end items-center">HN:</label>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={selectedOwner.HN}
                    disabled
                    className="w-full p-2 "
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <label className="text-right flex justify-end items-center">ชื่อจริง:</label>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={selectedOwner.first_name}
                    onChange={(e) =>
                      setSelectedOwner({
                        ...selectedOwner,
                        first_name: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <label className="text-right flex justify-end items-center">นามสกุล:</label>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={selectedOwner.last_name}
                    onChange={(e) =>
                      setSelectedOwner({
                        ...selectedOwner,
                        last_name: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <label className="text-right flex justify-end items-center">เบอร์โทร:</label>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={selectedOwner.phone}
                    onChange={(e) =>
                      setSelectedOwner({
                        ...selectedOwner,
                        phone: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <label className="text-right flex justify-end items-center">Email:</label>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={selectedOwner.email}
                    onChange={(e) =>
                      setSelectedOwner({
                        ...selectedOwner,
                        email: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 justify-between items-center flex">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded mr-28 flex items-center"
              >
                <RiArrowLeftCircleFill className="mr-2"/>Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded ml-10 flex items-center"
              >
                <RiSave3Line className="mr-2"/>Save
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center"
              >
                <RiDeleteBinLine className="mr-2"/>Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default OwnerPage;