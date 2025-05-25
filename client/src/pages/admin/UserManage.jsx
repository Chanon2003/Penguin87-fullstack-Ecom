import { useEffect, useState } from "react";
import SummaryApi from "../../common/SummaryApi";
import Axios from "../../utils/Axios";
import { toast } from "react-hot-toast";

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await Axios({ ...SummaryApi.getAllUser });
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUserRole = async (userId, newRole) => {
    try {
      const response = await Axios({
        ...SummaryApi.changeRoleUser,
        data: { userId, role: newRole }
      });
      if (response.data.success) {
        toast.success("User role updated successfully");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      }
    } catch (error) {
      toast.error("Failed to update user role");
      console.error(error);
    }
  };

  const handleEditUserStatus = async (userId, newStatus) => {
    try {
      const response = await Axios({
        ...SummaryApi.changeStatusUser,
        data: { userId, status: newStatus }
      });
      if (response.data.success) {
        toast.success("User status updated successfully");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );
      }
    } catch (error) {
      toast.error("Failed to update user status");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
  
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
              <thead className="bg-gray-50 md:table-header-group hidden">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 overflow-hidden">
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                className="h-full w-full object-cover" 
                                alt={user.name} 
                              />
                            ) : (
                              user.name?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.mobile}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleEditUserRole(user.id, e.target.value)}
                          className="px-2 py-1 text-sm border border-gray-300 rounded bg-white focus:outline-none"
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
                          onChange={(e) =>
                            handleEditUserStatus(user.id, e.target.value)
                          }
                          className="px-2 py-1 text-sm border border-gray-300 rounded bg-white focus:outline-none"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
  
            {/* Mobile View */}
            <div className="md:hidden">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} className="p-4 border-b">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} className="h-full w-full object-cover" alt={user.name} />
                        ) : (
                          user.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
  
                    <div className="mt-3">
                      <label className="text-xs font-semibold text-gray-600">Role</label>
                      <select
                        value={user.role}
                        onChange={(e) => handleEditUserRole(user.id, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white focus:outline-none"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
  
                    <div className="mt-2">
                      <label className="text-xs font-semibold text-gray-600">Status</label>
                      <select
                        value={user.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
                        onChange={(e) => handleEditUserStatus(user.id, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white focus:outline-none"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-center text-sm text-gray-500">No users found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default UserManage;
