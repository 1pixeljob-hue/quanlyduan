import { useState, useEffect } from "react";
import {
  Plus,
  Settings as SettingsIcon,
  CalendarPlus,
  LogOut,
  Tag,
} from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { HostingForm } from "./components/HostingForm";
import { HostingList } from "./components/HostingList";
import { Notifications } from "./components/Notifications";
import { Statistics } from "./components/Statistics";
import { Settings } from "./components/Settings";
import { ProjectList, Project } from "./components/ProjectList";
import { ProjectForm } from "./components/ProjectForm";
import { ProjectView } from "./components/ProjectView";
import {
  PasswordList,
  Password,
} from "./components/PasswordList";
import { PasswordForm } from "./components/PasswordForm";
import {
  CategoryManager,
  Category,
} from "./components/CategoryManager";
import { CodeX } from "./components/CodeX";
import { CodeForm } from "./components/CodeForm";
import { CodeSnippet } from "./components/CodeList";
import { LoginPage } from "./components/LoginPage";
import { Header } from "./components/Header";
import { NotificationPanel } from "./components/NotificationPanel";
import { ReportsView } from "./components/ReportsView";
import { LogList } from "./components/LogList";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { CustomSelect } from "./components/CustomSelect";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { Toaster, toast } from "sonner@2.0.3";
import * as api from "./utils/api";
import * as googleCalendar from "./utils/googleCalendar";

export interface Hosting {
  id: string;
  name: string;
  domain: string;
  provider: string;
  registrationDate: string;
  expirationDate: string;
  price: number;
  status: "active" | "expiring" | "expired";
  notes?: string;
  createdAt?: string;
}

export default function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Loading states
  const [isInitialLoading, setIsInitialLoading] =
    useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);

  // Sidebar state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Google Calendar state
  const [isGoogleCalendarInitialized, setIsGoogleCalendarInitialized] = useState(false);

  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHosting, setEditingHosting] =
    useState<Hosting | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] =
    useState<string>("all");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Project states
  const [isProjectFormOpen, setIsProjectFormOpen] =
    useState(false);
  const [editingProject, setEditingProject] =
    useState<Project | null>(null);
  const [viewingProject, setViewingProject] =
    useState<Project | null>(null);
  const [projectSearchTerm, setProjectSearchTerm] =
    useState("");
  const [projectFilterStatus, setProjectFilterStatus] =
    useState<string>("all");

  // Password states
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [isPasswordFormOpen, setIsPasswordFormOpen] =
    useState(false);
  const [editingPassword, setEditingPassword] =
    useState<Password | null>(null);
  const [passwordSearchTerm, setPasswordSearchTerm] =
    useState("");
  const [passwordFilterCategory, setPasswordFilterCategory] =
    useState<string>("all");

  // Category states
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryFormOpen, setIsCategoryFormOpen] =
    useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);
  const [categorySearchTerm, setCategorySearchTerm] =
    useState("");

  // Code states
  const [codes, setCodes] = useState<CodeSnippet[]>([]);
  const [isCodeFormOpen, setIsCodeFormOpen] = useState(false);
  const [editingCode, setEditingCode] =
    useState<CodeSnippet | null>(null);
  const [codeSearchTerm, setCodeSearchTerm] = useState("");
  const [codeFilterType, setCodeFilterType] =
    useState<string>("all");

  // Notification panel state
  const [showNotificationPanel, setShowNotificationPanel] =
    useState(false);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Initialize Google Calendar API on mount
  useEffect(() => {
    const initGoogle = async () => {
      try {
        await googleCalendar.initGoogleAPI();
        setIsGoogleCalendarInitialized(true);
        console.log('✅ Google Calendar API initialized');
      } catch (error) {
        console.warn('⚠️ Google Calendar API initialization failed:', error);
        // Don't show error to user - it's optional feature
      }
    };

    initGoogle();
  }, []);

  // Check if user is logged in on mount
  useEffect(() => {
    const loggedIn =
      localStorage.getItem("isLoggedIn") === "true";
    const savedUsername =
      localStorage.getItem("username") || "";
    if (loggedIn) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    }
  }, []);

  // Load data from backend API - only when logged in
  useEffect(() => {
    if (!isLoggedIn) return; // Skip if not logged in

    const loadData = async () => {
      setIsInitialLoading(true);
      try {
        // Load from backend
        const [
          hostingsData,
          projectsData,
          passwordsData,
          categoriesData,
          codesData,
        ] = await Promise.all([
          api.hostingApi.getAll(),
          api.projectApi.getAll(),
          api.passwordApi.getAll(),
          api.categoryApi.getAll(),
          api.codexApi.getAll(),
        ]);

        // Set data from backend
        setHostings(hostingsData);
        setProjects(projectsData);
        setPasswords(passwordsData);

        if (categoriesData.length > 0) {
          setCategories(categoriesData);
        } else {
          // Default category "Chưa Phân Loại" if none exist
          const defaultCategory: Category = {
            id: "uncategorized",
            name: "Chưa Phân Loại",
            color: "#6B7280" // Gray color
          };
          setCategories([defaultCategory]);
          // Save default category to backend
          try {
            await api.categoryApi.create(defaultCategory);
            console.log('✅ Created default category: Chưa Phân Loại');
          } catch (err) {
            console.error("Error saving default category:", err);
          }
        }

        setCodes(codesData);
      } catch (error) {
        console.error(
          "Error loading data from backend:",
          error,
        );
        toast.error("Không thể tải dữ liệu từ backend", {
          description: "Vui lòng kiểm tra kết nối và thử lại",
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn]);

  // Update hosting status based on expiration date
  useEffect(() => {
    const updateStatuses = () => {
      const today = new Date();
      const updated = hostings.map((hosting) => {
        const expDate = new Date(hosting.expirationDate);
        const daysUntilExpiry = Math.ceil(
          (expDate.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        let status: "active" | "expiring" | "expired" =
          "active";
        if (daysUntilExpiry < 0) {
          status = "expired";
        } else if (daysUntilExpiry <= 30) {
          status = "expiring";
        }

        return { ...hosting, status };
      });

      if (
        JSON.stringify(updated) !== JSON.stringify(hostings)
      ) {
        setHostings(updated);
      }
    };

    updateStatuses();
  }, [hostings]);

  // Authentication handlers
  const handleLogin = () => {
    setIsLoggedIn(true);
    const savedUsername =
      localStorage.getItem("username") || "";
    setUsername(savedUsername);
  };

  const handleLogout = () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      setIsLoggedIn(false);
      setUsername("");
    }
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const handleAddHosting = async (
    hosting: Omit<Hosting, "id" | "createdAt" | "status">,
  ) => {
    const newHosting: Hosting = {
      ...hosting,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "active",
    };

    const addPromise = async () => {
      // Save to backend
      await api.hostingApi.create(newHosting);

      // Log the creation
      await api.logApi.create({
        id: `log-${Date.now()}`,
        action_type: "create",
        module_name: "hosting",
        item_id: newHosting.id,
        item_name: newHosting.name,
        new_data: newHosting,
        created_at: new Date().toISOString(),
        user: "quydev",
      });

      // Update local state
      setHostings([...hostings, newHosting]);
      setIsFormOpen(false);

      // Auto-sync to Google Calendar if authorized
      if (isGoogleCalendarInitialized && googleCalendar.isAuthorized()) {
        try {
          await googleCalendar.createHostingEvent(newHosting);
          console.log(
            "✅ Synced to Google Calendar:",
            newHosting.name,
          );
        } catch (err) {
          console.error(
            "Failed to sync to Google Calendar:",
            err,
          );
        }
      }

      return { name: newHosting.name, synced: googleCalendar.isAuthorized() };
    };

    toast.promise(addPromise(), {
      loading: "Đang thêm hosting...",
      success: (data) => ({
        title: "Đã thêm hosting thành công!",
        description: data.synced 
          ? `Hosting "${data.name}" đã được lưu vào hệ thống và đồng bộ lên Google Calendar 📅`
          : `Hosting "${data.name}" đã được lưu vào hệ thống`,
      }),
      error: {
        title: "Không thể thêm hosting",
        description: "Vui lòng kiểm tra kết nối và thử lại",
      },
    });

    try {
      await addPromise();

      // Đề xuất xuất lịch nhắc nhở nếu hosting sắp hết hạn
      const expDate = new Date(hosting.expirationDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil(
        (expDate.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysUntilExpiry <= 60) {
        setTimeout(() => {
          if (
            confirm(
              `Hosting "${hosting.name}" sẽ hết hạn sau ${daysUntilExpiry} ngày!\n\nBạn có muốn tải file lịch nhắc nhở (.ics) để thêm vào Google Calendar/Outlook không?`,
            )
          ) {
            downloadICS(newHosting);
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error saving hosting to Supabase:", error);
    }
  };

  const handleUpdateHosting = async (
    hosting: Omit<Hosting, "status">,
  ) => {
    const currentHosting = hostings.find(
      (h) => h.id === hosting.id,
    );
    const updatedHosting = {
      ...hosting,
      status: currentHosting?.status || "active",
    };

    const updatePromise = async () => {
      // Update in backend
      await api.hostingApi.update(hosting.id, updatedHosting);

      // Log the update
      if (currentHosting) {
        await api.logApi.create({
          id: `log-${Date.now()}`,
          action_type: "update",
          module_name: "hosting",
          item_id: hosting.id,
          item_name: updatedHosting.name,
          old_data: currentHosting,
          new_data: updatedHosting,
          created_at: new Date().toISOString(),
          user: "quydev",
        });
      }

      // Update local state
      const updated = hostings.map((h) =>
        h.id === hosting.id ? updatedHosting : h,
      );
      setHostings(updated);
      setEditingHosting(null);
      setIsFormOpen(false);

      // Auto-sync to Google Calendar if authorized
      if (isGoogleCalendarInitialized && googleCalendar.isAuthorized()) {
        try {
          await googleCalendar.updateHostingEvent(
            updatedHosting,
          );
          console.log(
            "✅ Updated Google Calendar:",
            updatedHosting.name,
          );
        } catch (err) {
          console.error(
            "Failed to update Google Calendar:",
            err,
          );
        }
      }

      return { name: updatedHosting.name, synced: googleCalendar.isAuthorized() };
    };

    toast.promise(updatePromise(), {
      loading: "Đang cập nhật hosting...",
      success: (data) => ({
        title: "Đã cập nhật hosting thành công!",
        description: data.synced
          ? `Thông tin "${data.name}" đã được lưu và đồng bộ lên Google Calendar 📅`
          : `Thông tin "${data.name}" đã được lưu`,
      }),
      error: {
        title: "Không thể cập nhật hosting",
        description: "Vui lòng kiểm tra kết nối và thử lại",
      },
    });
  };

  const handleDeleteHosting = async (id: string) => {
    const hostingToDelete = hostings.find((h) => h.id === id);
    const name = hostingToDelete?.name || "hosting";

    // Show confirm dialog
    setConfirmDialog({
      show: true,
      title: "Xác nhận xóa hosting",
      message: `Bạn có chắc chắn muốn xóa hosting "${name}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        setConfirmDialog(null);

        const deletePromise = async () => {
          // Delete from backend
          await api.hostingApi.delete(id);

          // Log the deletion
          if (hostingToDelete) {
            await api.logApi.create({
              id: `log-${Date.now()}`,
              action_type: "delete",
              module_name: "hosting",
              item_id: id,
              item_name: hostingToDelete.name,
              old_data: hostingToDelete,
              created_at: new Date().toISOString(),
              user: "quydev",
            });
          }

          // Update local state
          setHostings(hostings.filter((h) => h.id !== id));

          // Auto-sync to Google Calendar if authorized
          if (isGoogleCalendarInitialized) {
            try {
              await googleCalendar.deleteHostingEvent(id);
              console.log("✅ Deleted from Google Calendar");
            } catch (err) {
              console.error(
                "Failed to delete from Google Calendar:",
                err,
              );
            }
          }

          return name;
        };

        toast.promise(deletePromise(), {
          loading: "Đang xóa hosting...",
          success: (name) => ({
            title: "Đ xóa hosting thành công!",
            description: isGoogleCalendarInitialized 
              ? `Hosting "${name}" đã đưc xóa khỏi hệ thống và Google Calendar 📅`
              : `Hosting "${name}" đã được xóa khỏi hệ thống`,
          }),
          error: {
            title: "Không thể xóa hosting",
            description: "Vui lòng kiểm tra kết nối và thử lại",
          },
        });
      },
    });
  };

  const handleEditHosting = (hosting: Hosting) => {
    setEditingHosting(hosting);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingHosting(null);
  };

  // Project handlers
  const handleAddProject = async (
    project: Omit<Project, "id"> & { createdAt?: string },
  ) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: project.createdAt || new Date().toISOString(),
    };

    const addPromise = async () => {
      // Save to backend
      await api.projectApi.create(newProject);

      // Log the creation
      await api.logApi.create({
        id: `log-${Date.now()}`,
        action_type: "create",
        module_name: "project",
        item_id: newProject.id,
        item_name: newProject.name,
        new_data: newProject,
        created_at: new Date().toISOString(),
        user: "quydev",
      });

      // Update local state
      setProjects([...projects, newProject]);
      setIsProjectFormOpen(false);

      return newProject.name;
    };

    toast.promise(addPromise(), {
      loading: "Đang thêm project...",
      success: (name) => ({
        title: "Đã thêm project thành công!",
        description: `Project "${name}" đã được lưu vào hệ thống`,
      }),
      error: {
        title: "Không thể thêm project",
        description: "Vui lòng kiểm tra kết nối và thử lại",
      },
    });
  };

  const handleUpdateProject = async (project: Project) => {
    const currentProject = projects.find(
      (p) => p.id === project.id,
    );

    const updatePromise = async () => {
      // Update in Supabase
      await api.projectApi.update(project.id, project);

      // Log the update
      if (currentProject) {
        await api.logApi.create({
          id: `log-${Date.now()}`,
          action_type: "update",
          module_name: "project",
          item_id: project.id,
          item_name: project.name,
          old_data: currentProject,
          new_data: project,
          created_at: new Date().toISOString(),
          user: "quydev",
        });
      }

      // Update local state
      setProjects(
        projects.map((p) =>
          p.id === project.id ? project : p,
        ),
      );
      setEditingProject(null);
      setIsProjectFormOpen(false);

      return project.name;
    };

    toast.promise(updatePromise(), {
      loading: "ang cập nhật project...",
      success: (name) => ({
        title: "Đã cập nhật project thành công!",
        description: `Thông tin "${name}" đã được lưu`,
      }),
      error: {
        title: "Không thể cập nhật project",
        description: "Vui lòng kiểm tra kết nối và thử lại",
      },
    });
  };

  const handleDeleteProject = async (id: string) => {
    const projectToDelete = projects.find((p) => p.id === id);
    const name = projectToDelete?.name || "project";

    // Show confirm dialog
    setConfirmDialog({
      show: true,
      title: "Xác nhận xóa project",
      message: `Bạn có chắc chắn muốn xóa project "${name}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        setConfirmDialog(null);

        const deletePromise = async () => {
          // Delete from Supabase
          await api.projectApi.delete(id);

          // Log the deletion
          if (projectToDelete) {
            await api.logApi.create({
              id: `log-${Date.now()}`,
              action_type: "delete",
              module_name: "project",
              item_id: id,
              item_name: projectToDelete.name,
              old_data: projectToDelete,
              created_at: new Date().toISOString(),
              user: "quydev",
            });
          }

          // Update local state
          setProjects(projects.filter((p) => p.id !== id));

          return name;
        };

        toast.promise(deletePromise(), {
          loading: "Đang xóa project...",
          success: (name) => ({
            title: "Đã xóa project thành công!",
            description: `Project "${name}" đã được xóa khỏi hệ thống`,
          }),
          error: {
            title: "Không thể xóa project",
            description: "Vui lòng kiểm tra kết nối và thử lại",
          },
        });
      },
    });
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  };

  const handleViewProject = (project: Project) => {
    setViewingProject(project);
  };

  const handleCloseProjectForm = () => {
    setIsProjectFormOpen(false);
    setEditingProject(null);
  };

  const handleCloseProjectView = () => {
    setViewingProject(null);
  };

  // Password handlers
  const handleAddPassword = async (
    password: Omit<Password, "id" | "createdAt">,
  ) => {
    const newPassword: Password = {
      ...password,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const addPromise = async () => {
      // Save to backend
      await api.passwordApi.create(newPassword);

      // Log the creation
      await api.logApi.create({
        id: `log-${Date.now()}`,
        action_type: "create",
        module_name: "password",
        item_id: newPassword.id,
        item_name: newPassword.title,
        new_data: newPassword,
        created_at: new Date().toISOString(),
        user: "quydev",
      });

      // Update local state
      setPasswords([...passwords, newPassword]);
      setIsPasswordFormOpen(false);

      return newPassword.title;
    };

    toast.promise(addPromise(), {
      loading: "Đang thêm password...",
      success: (title) => ({
        title: "Đã thêm password thành công!",
        description: `Password "${title}" đã được lưu vào hệ thống`,
      }),
      error: {
        title: "Không thể thêm password",
        description: "Vui lòng kiểm tra kết nối và thử lại",
      },
    });
  };

  const handleUpdatePassword = async (password: Password) => {
    const currentPassword = passwords.find(
      (p) => p.id === password.id,
    );

    const updatePromise = async () => {
      // Update in backend
      await api.passwordApi.update(password.id, password);

      // Log the update
      if (currentPassword) {
        await api.logApi.create({
          id: `log-${Date.now()}`,
          action_type: "update",
          module_name: "password",
          item_id: password.id,
          item_name: password.title,
          old_data: currentPassword,
          new_data: password,
          created_at: new Date().toISOString(),
          user: "quydev",
        });
      }

      // Update local state
      setPasswords(
        passwords.map((p) =>
          p.id === password.id ? password : p,
        ),
      );
      setEditingPassword(null);
      setIsPasswordFormOpen(false);

      return password.title;
    };

    toast.promise(updatePromise(), {
      loading: "Đang cập nhật password...",
      success: (title) => ({
        title: "Đã cập nhật password thành công!",
        description: `Thông tin "${title}" đã được lưu`,
      }),
      error: {
        title: "Không thể cập nhật password",
        description: "Vui lòng kiểm tra kết nối và thử lại",
      },
    });
  };

  const handleDeletePassword = async (id: string) => {
    const passwordToDelete = passwords.find((p) => p.id === id);
    const title = passwordToDelete?.title || "password";

    // Show confirm dialog
    setConfirmDialog({
      show: true,
      title: "Xác nhận xóa password",
      message: `Bạn có chắc chắn muốn xóa password "${title}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        setConfirmDialog(null);

        const deletePromise = async () => {
          // Delete from backend
          await api.passwordApi.delete(id);

          // Log the deletion
          if (passwordToDelete) {
            await api.logApi.create({
              id: `log-${Date.now()}`,
              action_type: "delete",
              module_name: "password",
              item_id: id,
              item_name: passwordToDelete.title,
              old_data: passwordToDelete,
              created_at: new Date().toISOString(),
              user: "quydev",
            });
          }

          // Update local state
          setPasswords(passwords.filter((p) => p.id !== id));

          return title;
        };

        toast.promise(deletePromise(), {
          loading: "Đang xóa password...",
          success: (title) => ({
            title: "Đã xóa password thành công!",
            description: `Password "${title}" đã được xóa khỏi hệ thống`,
          }),
          error: {
            title: "Không thể xóa password",
            description: "Vui lòng kiểm tra kết nối và thử lại",
          },
        });
      },
    });
  };

  const handleEditPassword = (password: Password) => {
    setEditingPassword(password);
    setIsPasswordFormOpen(true);
  };

  const handleClosePasswordForm = () => {
    setIsPasswordFormOpen(false);
    setEditingPassword(null);
  };

  // Category handlers
  const handleAddCategory = async (
    category: Omit<Category, "id">,
  ) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };

    try {
      await api.categoryApi.create(newCategory);
      const updated = [...categories, newCategory];
      setCategories(updated);
      setIsCategoryFormOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      const updated = [...categories, newCategory];
      setCategories(updated);
      setIsCategoryFormOpen(false);
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    try {
      await api.categoryApi.update(category.id, category);
      const updated = categories.map((c) =>
        c.id === category.id ? category : c,
      );
      setCategories(updated);
      setEditingCategory(null);
      setIsCategoryFormOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
      const updated = categories.map((c) =>
        c.id === category.id ? category : c,
      );
      setCategories(updated);
      setEditingCategory(null);
      setIsCategoryFormOpen(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.categoryApi.delete(id);
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      toast.success('Đã xóa danh mục thành công');
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error('Có lỗi khi xóa danh mục');
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleCloseCategoryForm = () => {
    setIsCategoryFormOpen(false);
    setEditingCategory(null);
  };

  // Code handlers
  const handleAddCode = async (
    code: Omit<CodeSnippet, "id" | "createdAt">,
  ) => {
    const newCode: CodeSnippet = {
      ...code,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const addPromise = async () => {
      // Save to Supabase
      await api.codexApi.create(newCode);

      // Log the creation
    };

    toast.promise(addPromise(), {
      loading: "Đang thêm code snippet...",
      success: (name) => ({
        title: "Đã thêm code snippet thành công!",
        description: `Code "${name}" đã được lưu vào hệ thống`,
      }),
      error: {
        title: "Không thể thêm code snippet",
        description: "Vui lòng kiểm tra kết nối và thử lại",
      },
    });
  };

  const handleUpdateCode = async (code: CodeSnippet) => {
    const currentCode = codes.find((c) => c.id === code.id);

    const updatePromise = async () => {
      // Update in backend
      await api.codexApi.update(code.id, code);

      // Log the update
      if (currentCode) {
        await api.logApi.create({
          id: `log-${Date.now()}`,
          action_type: "update",
          module_name: "codex",
          item_id: code.id,
          item_name: code.name,
          old_data: currentCode,
          new_data: code,
          created_at: new Date().toISOString(),
          user: "quydev",
        });
      }

      // Update local state
      setCodes(codes.map((c) => (c.id === code.id ? code : c)));
      setEditingCode(null);
      setIsCodeFormOpen(false);

      return code.name;
    };

    toast.promise(updatePromise(), {
      loading: "Đang cập nhật code snippet...",
      success: (name) => ({
        title: "Đã cập nhật code snippet thành công!",
        description: `Thông tin "${name}" đã được lưu`,
      }),
      error: {
        title: "Không thể cập nhật code snippet",
        description: "Vui lòng kiểm tra kết nối và thử lại",
      },
    });
  };

  const handleDeleteCode = async (id: string) => {
    const codeToDelete = codes.find((c) => c.id === id);
    const name = codeToDelete?.name || "code";

    // Show confirm dialog
    setConfirmDialog({
      show: true,
      title: "Xác nhận xóa code",
      message: `Bạn có chắc chắn muốn xóa code "${name}"? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        setConfirmDialog(null);

        const deletePromise = async () => {
          // Delete from backend
          await api.codexApi.delete(id);

          // Log the deletion
          if (codeToDelete) {
            await api.logApi.create({
              id: `log-${Date.now()}`,
              action_type: "delete",
              module_name: "codex",
              item_id: id,
              item_name: codeToDelete.name,
              old_data: codeToDelete,
              created_at: new Date().toISOString(),
              user: "quydev",
            });
          }

          // Update local state
          setCodes(codes.filter((c) => c.id !== id));

          return name;
        };

        toast.promise(deletePromise(), {
          loading: "Đang xóa code...",
          success: (name) => ({
            title: "Đã xóa code thành công!",
            description: `Code "${name}" đã được xóa khỏi hệ thống`,
          }),
          error: {
            title: "Không thể xóa code",
            description: "Vui lòng kiểm tra kết nối và thử lại",
          },
        });
      },
    });
  };

  const handleEditCode = (code: CodeSnippet) => {
    setEditingCode(code);
    setIsCodeFormOpen(true);
  };

  const handleCloseCodeForm = () => {
    setIsCodeFormOpen(false);
    setEditingCode(null);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(hostings, null, 2);
    const dataBlob = new Blob([dataStr], {
      type: "application/json",
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hosting-data-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = async (data: Hosting[]) => {
    try {
      // Import each hosting to backend
      for (const hosting of data) {
        await api.hostingApi.create(hosting);
      }

      // Reload all data from backend
      const hostingsData = await api.hostingApi.getAll();
      setHostings(hostingsData);

      alert(
        `Đã nhập thành công ${data.length} hosting!`,
      );
    } catch (error) {
      console.error("Error importing data:", error);
      alert(
        "Có lỗi khi nhập dữ liệu. Vui lòng thử lại.",
      );
    }
  };

  const handleClearData = async () => {
    if (
      confirm(
        "Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.",
      )
    ) {
      try {
        // Delete all hostings from backend
        for (const hosting of hostings) {
          await api.hostingApi.delete(hosting.id);
        }

        setHostings([]);
        alert("Đã xóa tất cả dữ liệu!");
      } catch (error) {
        console.error(
          "Error clearing data:",
          error,
        );
        alert(
          "Có lỗi khi xóa dữ liệu. Vui lòng thử lại.",
        );
      }
    }
  };

  // Calculate notification count
  const notificationCount =
    hostings.filter(
      (h) => h.status === "expired" || h.status === "expiring",
    ).length +
    projects.filter(
      (p) => p.status === "expired" || p.status === "expiring",
    ).length;

  // Filtered data
  const filteredHostings = hostings.filter((hosting) => {
    const matchesSearch =
      hosting.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      hosting.domain
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      hosting.provider
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || hosting.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name
        .toLowerCase()
        .includes(projectSearchTerm.toLowerCase()) ||
      project.customer
        .toLowerCase()
        .includes(projectSearchTerm.toLowerCase()) ||
      (project.description &&
        project.description
          .toLowerCase()
          .includes(projectSearchTerm.toLowerCase()));
    const matchesStatus =
      projectFilterStatus === "all" ||
      project.status === projectFilterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredPasswords = passwords.filter((password) => {
    const matchesSearch =
      password.title
        .toLowerCase()
        .includes(passwordSearchTerm.toLowerCase()) ||
      password.username
        .toLowerCase()
        .includes(passwordSearchTerm.toLowerCase()) ||
      (password.website &&
        password.website
          .toLowerCase()
          .includes(passwordSearchTerm.toLowerCase()));
    const matchesCategory =
      passwordFilterCategory === "all" ||
      password.category === passwordFilterCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter options for CustomSelect
  const hostingStatusOptions = [
    {
      value: "all",
      label: "Tất cả trạng thái",
      bgColor: "bg-gray-100",
      color: "text-gray-800",
    },
    {
      value: "active",
      label: "Hoạt động",
      bgColor: "bg-green-100",
      color: "text-green-800",
    },
    {
      value: "expiring",
      label: "Sắp hết hạn",
      bgColor: "bg-yellow-100",
      color: "text-yellow-800",
    },
    {
      value: "expired",
      label: "Đã hết hạn",
      bgColor: "bg-red-100",
      color: "text-red-800",
    },
  ];

  const projectStatusOptions = [
    {
      value: "all",
      label: "Tất c trạng thái",
      bgColor: "bg-gray-100",
      color: "text-gray-800",
    },
    {
      value: "planning",
      label: "Lên Kế Hoạch",
      bgColor: "bg-blue-100",
      color: "text-blue-800",
    },
    {
      value: "in-progress",
      label: "Đang Thực Hiện",
      bgColor: "bg-orange-100",
      color: "text-orange-800",
    },
    {
      value: "pending-acceptance",
      label: "Chờ Nghiệm Thu",
      bgColor: "bg-purple-100",
      color: "text-purple-800",
    },
    {
      value: "completed",
      label: "Hoàn Thành",
      bgColor: "bg-green-100",
      color: "text-green-800",
    },
    {
      value: "on-hold",
      label: "Tạm Dừng",
      bgColor: "bg-gray-100",
      color: "text-gray-800",
    },
  ];

  const passwordCategoryOptions = [
    {
      value: "all",
      label: "Tất cả loại",
      bgColor: "bg-gray-100",
      color: "text-gray-800",
    },
    ...categories.map(cat => ({
      value: cat.id,
      label: cat.name,
      hexColor: cat.color
    }))
  ];

  // Handle tab change with loading
  const handleTabChange = async (newTab: string) => {
    if (newTab === activeTab) return; // Skip if same tab

    setIsTabLoading(true);
    setActiveTab(newTab);

    // Reset filters when switching tabs
    // Hosting filters
    setSearchTerm("");
    setFilterStatus("all");
    
    // Project filters
    setProjectSearchTerm("");
    setProjectFilterStatus("all");
    
    // Password filters
    setPasswordSearchTerm("");
    setPasswordFilterCategory("all");

    // Simulate data loading for the new tab
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsTabLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Loading Overlay for Initial Load */}
      {isInitialLoading && (
        <LoadingOverlay message="Đang tải dữ liệu hệ thống..." />
      )}

      {/* Loading Overlay for Tab Switching */}
      {isTabLoading && (
        <LoadingOverlay message="Đang tải dữ liệu module..." />
      )}

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        richColors
        expand={true}
        duration={4000}
      />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          notificationCount={notificationCount}
          onNotificationClick={() =>
            setShowNotificationPanel(true)
          }
          activeTab={activeTab}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {activeTab === "dashboard" && (
            <Dashboard
              hostings={hostings}
              projects={projects}
              passwords={passwords}
              codes={codes}
              onEditProject={handleEditProject}
              onEditHosting={handleEditHosting}
              onAddHosting={() => {
                setEditingHosting(null);
                setIsFormOpen(true);
              }}
              onAddProject={() => {
                setEditingProject(null);
                setIsProjectFormOpen(true);
              }}
              onAddPassword={() => {
                setEditingPassword(null);
                setIsPasswordFormOpen(true);
              }}
              onAddCode={() => {
                setEditingCode(null);
                setIsCodeFormOpen(true);
              }}
            />
          )}

          {activeTab === "hostings" && (
            <>
              {/* Search and Filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, domain, nhà cung cấp..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    className="flex-1 h-11 border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:border-[#4DBFAD] focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent transition-all duration-200 px-[16px] py-[10px]"
                  />
                  <div className="sm:w-auto min-w-[200px]">
                    <CustomSelect
                      value={filterStatus}
                      onChange={(value) =>
                        setFilterStatus(value)
                      }
                      options={hostingStatusOptions}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditingHosting(null);
                      setIsFormOpen(true);
                    }}
                    className="h-11 flex items-center justify-center gap-2 px-6 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Thêm Mới</span>
                  </button>
                </div>
              </div>

              <HostingList
                hostings={filteredHostings}
                onEdit={handleEditHosting}
                onDelete={handleDeleteHosting}
              />
            </>
          )}

          {activeTab === "projects" && (
            <>
              {/* Search and Filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, khách hàng, mô tả..."
                    value={projectSearchTerm}
                    onChange={(e) =>
                      setProjectSearchTerm(e.target.value)
                    }
                    className="flex-1 h-11 border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:border-[#4DBFAD] focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent transition-all duration-200 px-[16px] py-[10px]"
                  />
                  <div className="sm:w-auto min-w-[200px]">
                    <CustomSelect
                      value={projectFilterStatus}
                      onChange={(value) =>
                        setProjectFilterStatus(value)
                      }
                      options={projectStatusOptions}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setIsProjectFormOpen(true);
                    }}
                    className="h-11 flex items-center justify-center gap-2 px-6 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Thêm Mới</span>
                  </button>
                </div>
              </div>

              <ProjectList
                projects={filteredProjects}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onView={handleViewProject}
              />
            </>
          )}

          {activeTab === "passwords" && (
            <>
              {/* Search and Filter */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tiêu đề, tên đăng nhập, website..."
                    value={passwordSearchTerm}
                    onChange={(e) =>
                      setPasswordSearchTerm(e.target.value)
                    }
                    className="flex-1 h-11 px-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:border-[#4DBFAD] focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent transition-all duration-200"
                  />
                  <div className="sm:w-auto min-w-[200px]">
                    <CustomSelect
                      value={passwordFilterCategory}
                      onChange={(value) =>
                        setPasswordFilterCategory(value)
                      }
                      options={passwordCategoryOptions}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setIsCategoryFormOpen(true);
                    }}
                    className="h-11 flex items-center justify-center gap-2 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold whitespace-nowrap"
                  >
                    <Tag className="w-5 h-5" />
                    <span>Quản Lý Danh Mục</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingPassword(null);
                      setIsPasswordFormOpen(true);
                    }}
                    className="h-11 flex items-center justify-center gap-2 px-6 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Thêm Mới</span>
                  </button>
                </div>
              </div>

              <PasswordList
                passwords={filteredPasswords}
                categories={categories}
                onEdit={handleEditPassword}
                onDelete={handleDeletePassword}
              />
            </>
          )}

          {activeTab === "codex" && (
            <CodeX
              codes={codes}
              onAdd={handleAddCode}
              onEdit={handleUpdateCode}
              onDelete={handleDeleteCode}
            />
          )}

          {activeTab === "settings" && (
            <Settings
              onExportData={handleExportData}
              onImportData={handleImportData}
              onClearData={handleClearData}
              hostings={hostings}
              projects={projects}
            />
          )}

          {activeTab === "reports" && (
            <ReportsView
              hostings={hostings}
              projects={projects}
            />
          )}

          {activeTab === "logs" && <LogList />}
        </main>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <HostingForm
          hosting={editingHosting}
          onSubmit={
            editingHosting
              ? handleUpdateHosting
              : handleAddHosting
          }
          onClose={handleCloseForm}
        />
      )}

      {/* Project Form Modal */}
      {isProjectFormOpen && (
        <ProjectForm
          project={editingProject}
          onSubmit={
            editingProject
              ? handleUpdateProject
              : handleAddProject
          }
          onClose={handleCloseProjectForm}
        />
      )}

      {/* Project View Modal */}
      {viewingProject && (
        <ProjectView
          project={viewingProject}
          onClose={handleCloseProjectView}
        />
      )}

      {/* Password Form Modal */}
      {isPasswordFormOpen && (
        <PasswordForm
          password={editingPassword}
          categories={categories}
          onSubmit={
            editingPassword
              ? handleUpdatePassword
              : handleAddPassword
          }
          onClose={handleClosePasswordForm}
        />
      )}

      {/* Category Form Modal */}
      {isCategoryFormOpen && (
        <CategoryManager
          categories={categories}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onClose={handleCloseCategoryForm}
        />
      )}

      {/* Code Form Modal */}
      {isCodeFormOpen && (
        <CodeForm
          code={editingCode}
          onSubmit={
            editingCode ? handleUpdateCode : handleAddCode
          }
          onClose={handleCloseCodeForm}
        />
      )}

      {/* Notification Panel */}
      {showNotificationPanel && (
        <NotificationPanel
          hostings={hostings}
          projects={projects}
          onClose={() => setShowNotificationPanel(false)}
          onHostingClick={handleEditHosting}
          onProjectClick={handleEditProject}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}