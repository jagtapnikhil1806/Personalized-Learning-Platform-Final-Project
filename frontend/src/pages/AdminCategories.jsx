

import React, { useEffect, useState } from 'react'
import { createCourseCategory, deleteCourseCategory, fetchCourseCategories, updateCourseCategory } from "../services/operations/courseDetailsAPI"
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import ConfirmationModal from '../components/common/ConfirmationModal'

const CategoriesAdminPage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchCourseCategories()
        // Filter out any null or undefined values from the response
        setCategories(Array.isArray(result) ? result.filter(Boolean) : [])
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to fetch categories. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    getCategories()
  }, [])

  const onSubmit = async (data) => {
    try {
      let result
      if (currentCategory) {
        result = await updateCourseCategory({
          categoryId: currentCategory._id,
          ...data
        })
        setCategories(categories.map(cat => 
          cat?._id === currentCategory._id ? { ...cat, ...data } : cat
        ))
      } else {
        result = await createCourseCategory(data)
        if (result) {
          setCategories([...categories, result])
        }
      }
      reset()
      setCurrentCategory(null)
      toast.success(`Category ${currentCategory ? 'updated' : 'created'} successfully!`)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEdit = (category) => {
    if (!category) return
    setCurrentCategory(category)
    setValue('name', category.name)
    setValue('description', category.description)
    setIsEditModalOpen(true)
  }

  const handleDelete = (categoryId) => {
    setConfirmationModal({
      text1: "Delete Category",
      text2: "Are you sure you want to delete this category?",
      btn1Text: "Delete",
      btn2Text: "Cancel",
      btn1Handler: async () => {
        try {
          const success = await deleteCourseCategory(categoryId)
          if (success) {
            setCategories(categories.filter(cat => cat?._id !== categoryId))
            toast.success("Category deleted successfully")
          }
        } catch (error) {
          toast.error(error.message)
        }
        setConfirmationModal(null)
      },
      btn2Handler: () => setConfirmationModal(null)
    })
  }

  return (
    <div className="p-6 bg-richblack-900 text-richblack-5 min-h-screen">
      <h1 className="text-3xl font-semibold mb-8">Manage Categories</h1>
      
      {/* Create/Edit Category Form */}
      <div className="bg-richblack-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-medium mb-4">
          {currentCategory ? 'Edit Category' : 'Create New Category'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Category Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full bg-richblack-700 rounded-md p-2 text-richblack-5"
              placeholder="Enter category name"
            />
            {errors.name && (
              <span className="text-yellow-25 text-xs">{errors.name.message}</span>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 text-sm font-medium">
              Description *
            </label>
            <textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              className="w-full bg-richblack-700 rounded-md p-2 text-richblack-5 min-h-[100px]"
              placeholder="Enter category description"
            />
            {errors.description && (
              <span className="text-yellow-25 text-xs">{errors.description.message}</span>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-yellow-50 text-richblack-900 py-2 px-4 rounded-md font-medium hover:bg-yellow-25 transition-all duration-200"
            >
              {currentCategory ? 'Update Category' : 'Create Category'}
            </button>
            {currentCategory && (
              <button
                type="button"
                onClick={() => {
                  reset()
                  setCurrentCategory(null)
                }}
                className="bg-richblack-700 text-richblack-5 py-2 px-4 rounded-md font-medium hover:bg-richblack-600 transition-all duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div>
        <h2 className="text-xl font-medium mb-4">Existing Categories</h2>
        {error ? (
          <div className="text-center text-yellow-25">{error}</div>
        ) : loading ? (
          <div className="text-center">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-richblack-400">No categories found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-richblack-800 rounded-lg overflow-hidden">
              <thead className="bg-richblack-700">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.filter(Boolean).map((category) => (
                  <tr key={category._id} className="border-b border-richblack-700 hover:bg-richblack-750">
                    <td className="py-3 px-4">{category?.name || 'N/A'}</td>
                    <td className="py-3 px-4">{category?.description || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-200 hover:text-blue-100 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="text-pink-200 hover:text-pink-100 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </div>
  )
}

export default CategoriesAdminPage

