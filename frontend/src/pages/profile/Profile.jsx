import { useEffect, useState } from "react";
import {
  User,
  Mail,
  CalendarDays,
  MapPin,
  BriefcaseBusiness,
  Lock,
  Pencil,
  ShieldCheck,
  X,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { api } from "../../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* =========================================================
     EDIT PROFILE FORM
  ========================================================= */

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    personalEmail: "",
    personalMobile: "",
    emergencyContact: "",
    emergencyMobile: "",
    bloodGroup: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  /* =========================================================
     PASSWORD FORM
  ========================================================= */

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/employees/profile"
      );

      if (response.success) {
        setProfile(response.data);

        setFormData({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          phone: response.data.phone || "",
          personalEmail:
            response.data.personalEmail || "",
          personalMobile:
            response.data.personalMobile || "",
          emergencyContact:
            response.data.emergencyContact || "",
          emergencyMobile:
            response.data.emergencyMobile || "",
          bloodGroup:
            response.data.bloodGroup || "",
          dateOfBirth: response.data.dateOfBirth
            ? response.data.dateOfBirth.substring(0, 10)
            : "",
          gender: response.data.gender || "",
          address: response.data.address || "",
          city: response.data.city || "",
          state: response.data.state || "",
          country: response.data.country || "",
          pincode: response.data.pincode || "",
        });
      } else {
        setError(
          response.message ||
            "Failed to load profile."
        );
      }
    } catch (err) {
      console.error(
        "Fetch profile error:",
        err
      );

      setError(
        err.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const getFullName = () => {
    if (!profile) {
      return "Administrator";
    }

    const name =
      `${profile.firstName || ""} ${
        profile.lastName || ""
      }`.trim();

    return name || "Administrator";
  };

  const getInitial = () => {
    return getFullName()
      .charAt(0)
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getLengthOfService = (
    joiningDate
  ) => {
    if (!joiningDate) {
      return "—";
    }

    const joining = new Date(
      joiningDate
    );

    const today = new Date();

    if (
      Number.isNaN(
        joining.getTime()
      )
    ) {
      return "—";
    }

    let years =
      today.getFullYear() -
      joining.getFullYear();

    let months =
      today.getMonth() -
      joining.getMonth();

    if (
      today.getDate() <
      joining.getDate()
    ) {
      months--;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0 && months > 0) {
      return `${years} yr ${months} mo`;
    }

    if (years > 0) {
      return `${years} yr`;
    }

    if (months > 0) {
      return `${months} mo`;
    }

    return "Less than 1 month";
  };

  /* =========================================================
     CLEAR MESSAGES
  ========================================================= */

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  /* =========================================================
     EDIT PROFILE
  ========================================================= */

  const handleEdit = () => {
    clearMessages();

    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      phone: profile?.phone || "",
      personalEmail:
        profile?.personalEmail || "",
      personalMobile:
        profile?.personalMobile || "",
      emergencyContact:
        profile?.emergencyContact || "",
      emergencyMobile:
        profile?.emergencyMobile || "",
      bloodGroup:
        profile?.bloodGroup || "",
      dateOfBirth: profile?.dateOfBirth
        ? profile.dateOfBirth.substring(0, 10)
        : "",
      gender: profile?.gender || "",
      address: profile?.address || "",
      city: profile?.city || "",
      state: profile?.state || "",
      country: profile?.country || "",
      pincode: profile?.pincode || "",
    });

    setIsEditing(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    clearMessages();

    setFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      phone: profile?.phone || "",
      personalEmail:
        profile?.personalEmail || "",
      personalMobile:
        profile?.personalMobile || "",
      emergencyContact:
        profile?.emergencyContact || "",
      emergencyMobile:
        profile?.emergencyMobile || "",
      bloodGroup:
        profile?.bloodGroup || "",
      dateOfBirth: profile?.dateOfBirth
        ? profile.dateOfBirth.substring(0, 10)
        : "",
      gender: profile?.gender || "",
      address: profile?.address || "",
      city: profile?.city || "",
      state: profile?.state || "",
      country: profile?.country || "",
      pincode: profile?.pincode || "",
    });
  };

  /* =========================================================
     UPDATE PROFILE
  ========================================================= */

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      clearMessages();

      const response = await api.put(
        "/employees/profile",
        formData
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to update profile."
        );
      }

      /*
       * Backend returns the updated employee.
       * Use it directly instead of making another request.
       */
      if (response.data) {
        setProfile(response.data);
      } else {
        await fetchProfile();
      }

      setIsEditing(false);

      setSuccess(
        "Profile updated successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err) {
      console.error(
        "Update profile error:",
        err
      );

      setError(
        err.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     PASSWORD
  ========================================================= */

  const openPasswordModal = () => {
    clearMessages();

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    if (changingPassword) {
      return;
    }

    setShowPasswordModal(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleChangePassword = async () => {
    clearMessages();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = passwordData;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all password fields."
      );

      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "New password and confirm password do not match."
      );

      return;
    }

    if (
      currentPassword ===
      newPassword
    ) {
      setError(
        "New password must be different from your current password."
      );

      return;
    }

    try {
      setChangingPassword(true);

      const response = await api.post(
        "/auth/change-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        }
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to change password."
        );
      }

      setShowPasswordModal(false);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess(
        "Password changed successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err) {
      console.error(
        "Change password error:",
        err
      );

      setError(
        err.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="admin-page">
        <div className="profile-page">

          <div className="profile-loading">

            <div className="profile-loading-spinner"></div>

            <p>
              Loading profile...
            </p>

          </div>

        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error && !profile) {
    return (
      <div className="admin-page">
        <div className="profile-page">

          <div className="profile-error">

            <div className="profile-error-icon">
              <AlertCircle size={24} />
            </div>

            <h2>
              Unable to load profile
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="profile-primary-button"
              onClick={fetchProfile}
            >
              Try Again
            </button>

          </div>

        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const isActive =
    String(
      profile.status || ""
    ).toLowerCase() === "active";

  return (
    <div className="admin-page">

      <div className="profile-page">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="profile-page-header">

          <div>
            <h1>
              My Profile
            </h1>

            <p>
              View and manage your personal and
              employment information.
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              className="profile-primary-button"
              onClick={handleEdit}
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          )}

        </div>


        {/* =====================================================
            SUCCESS MESSAGE
        ===================================================== */}

        {success && (
          <div className="profile-alert profile-alert-success">

            <CheckCircle2 size={17} />

            <span>
              {success}
            </span>

            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Close"
            >
              <X size={15} />
            </button>

          </div>
        )}


        {/* =====================================================
            ERROR MESSAGE
        ===================================================== */}

        {error && profile && (
          <div className="profile-alert profile-alert-error">

            <AlertCircle size={17} />

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close"
            >
              <X size={15} />
            </button>

          </div>
        )}


        {/* =====================================================
            PROFILE HERO
        ===================================================== */}

        <div className="profile-hero-card">

          <div className="profile-identity">

            <div className="profile-avatar-wrapper">

              <div className="profile-avatar">
                {getInitial()}
              </div>

              {isActive && (
                <span className="profile-online-dot"></span>
              )}

            </div>


            <div className="profile-identity-content">

              <h2>
                {getFullName()}
              </h2>

              <p className="profile-role">

                {profile.designation_name ||
                  profile.role ||
                  "Employee"}

                <span>•</span>

                {profile.department_name ||
                  "Administration"}

              </p>


              <div className="profile-contact-row">

                <span>
                  <Mail size={15} />

                  {profile.email || "—"}
                </span>

                <span>
                  Employee ID:

                  <strong>
                    {profile.employeeCode || "—"}
                  </strong>
                </span>

              </div>


              <span className="profile-status-badge">

                <span></span>

                {profile.status || "Active"}

              </span>

            </div>

          </div>


          {/* Quick Employment Information */}

          <div className="profile-quick-info">

            <QuickInfo
              icon={
                <CalendarDays size={20} />
              }
              label="Joining Date"
              value={formatDate(
                profile.joiningDate
              )}
            />

            <QuickInfo
              icon={
                <BriefcaseBusiness size={20} />
              }
              label="Employment Type"
              value={
                profile.employmentType || "—"
              }
            />

            <QuickInfo
              icon={
                <MapPin size={20} />
              }
              label="Job Location"
              value={
                profile.jobLocation || "—"
              }
            />

          </div>

        </div>


        {/* =====================================================
            INFORMATION GRID
        ===================================================== */}

        <div className="profile-content-grid">


          {/* ===================================================
              PERSONAL INFORMATION
          =================================================== */}

          <ProfileCard
            icon={<User size={19} />}
            title="Personal Information"
            description="Your basic personal information"
          >

            <div className="profile-details-list">

              <DetailRow
                label="Employee Code"
                value={profile.employeeCode}
              />

              <DetailRow
                label="First Name"
                value={profile.firstName}
              />

              <DetailRow
                label="Last Name"
                value={profile.lastName}
              />

              <DetailRow
                label="Email"
                value={profile.email}
                highlight
              />

              <DetailRow
                label="Phone"
                value={profile.phone}
              />

              <DetailRow
                label="Personal Email"
                value={profile.personalEmail}
                highlight
              />

              <DetailRow
                label="Personal Mobile"
                value={profile.personalMobile}
              />

              <DetailRow
                label="Date of Birth"
                value={formatDate(
                  profile.dateOfBirth
                )}
              />

              <DetailRow
                label="Gender"
                value={profile.gender}
              />

              <DetailRow
                label="Blood Group"
                value={profile.bloodGroup}
              />

            </div>

          </ProfileCard>


          {/* ===================================================
              EMPLOYMENT INFORMATION
          =================================================== */}

          <ProfileCard
            icon={
              <BriefcaseBusiness size={19} />
            }
            title="Employment Information"
            description="Organization and employment details"
          >

            <div className="profile-details-list">

              <DetailRow
                label="Department"
                value={
                  profile.department_name
                }
              />

              <DetailRow
                label="Designation"
                value={
                  profile.designation_name
                }
              />

              <DetailRow
                label="Reporting Manager"
                value={
                  profile.reporting_manager_name ||
                  "Not assigned"
                }
              />

              <DetailRow
                label="Joining Date"
                value={formatDate(
                  profile.joiningDate
                )}
              />

              <DetailRow
                label="Employment Type"
                value={
                  profile.employmentType
                }
              />

              <DetailRow
                label="Role"
                value={profile.role}
              />

              <DetailRow
                label="Job Location"
                value={
                  profile.jobLocation
                }
              />

              <DetailRow
                label="Length of Service"
                value={getLengthOfService(
                  profile.joiningDate
                )}
              />

              <DetailRow
                label="Status"
                value={
                  profile.status || "Active"
                }
                status
              />

            </div>

          </ProfileCard>


          {/* ===================================================
              ADDRESS INFORMATION
          =================================================== */}

          <ProfileCard
            icon={<MapPin size={19} />}
            title="Address Information"
            description="Your residential information"
          >

            <div className="profile-details-list">

              <DetailRow
                label="Address"
                value={profile.address}
              />

              <DetailRow
                label="City"
                value={profile.city}
              />

              <DetailRow
                label="State"
                value={profile.state}
              />

              <DetailRow
                label="Country"
                value={profile.country}
              />

              <DetailRow
                label="Pincode"
                value={profile.pincode}
              />

              <DetailRow
                label="Emergency Contact"
                value={
                  profile.emergencyContact
                }
              />

              <DetailRow
                label="Emergency Mobile"
                value={
                  profile.emergencyMobile
                }
              />

            </div>

          </ProfileCard>


          {/* ===================================================
              SECURITY
          =================================================== */}

          <ProfileCard
            icon={<Lock size={19} />}
            title="Security"
            description="Manage your account security"
          >

            <div className="security-content">

              <div className="security-password-row">

                <div className="security-password-info">

                  <div className="security-icon">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <span>
                      Password
                    </span>

                    <strong>
                      ••••••••••
                    </strong>
                  </div>

                </div>


                <button
                  type="button"
                  className="profile-secondary-button"
                  onClick={
                    openPasswordModal
                  }
                >
                  <Lock size={16} />

                  Change Password
                </button>

              </div>


              <div className="security-divider"></div>


              <p className="security-note">
                Keep your password secure and
                change it regularly to protect
                your account.
              </p>

            </div>

          </ProfileCard>

        </div>


        {/* =====================================================
            EDIT PROFILE MODAL
        ===================================================== */}

        {isEditing && (
          <div className="profile-modal-overlay">

            <div
              className="profile-modal profile-edit-modal"
              role="dialog"
              aria-modal="true"
            >

              <div className="profile-modal-header">

                <div>
                  <h2>
                    Edit Profile
                  </h2>

                  <p>
                    Update your personal information.
                  </p>
                </div>

                <button
                  type="button"
                  className="profile-modal-close"
                  onClick={
                    handleCancelEdit
                  }
                  disabled={saving}
                  aria-label="Close"
                >
                  <X size={19} />
                </button>

              </div>


              <div className="profile-modal-body">

                {/* Basic Information */}

                <div className="profile-edit-section">

                  <h3>
                    Personal Information
                  </h3>

                  <div className="profile-form-grid">

                    <FormField
                      label="First Name"
                      name="firstName"
                      value={
                        formData.firstName
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                    <FormField
                      label="Last Name"
                      name="lastName"
                      value={
                        formData.lastName
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                    <FormField
                      label="Phone"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                    <FormField
                      label="Personal Email"
                      name="personalEmail"
                      type="email"
                      value={
                        formData.personalEmail
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                    <FormField
                      label="Personal Mobile"
                      name="personalMobile"
                      value={
                        formData.personalMobile
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                    <FormField
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={
                        formData.dateOfBirth
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                    <div className="profile-form-field">

                      <label htmlFor="gender">
                        Gender
                      </label>

                      <select
                        id="gender"
                        name="gender"
                        value={
                          formData.gender
                        }
                        onChange={
                          handleFormChange
                        }
                      >
                        <option value="">
                          Select Gender
                        </option>

                        <option value="Male">
                          Male
                        </option>

                        <option value="Female">
                          Female
                        </option>

                        <option value="Other">
                          Other
                        </option>
                      </select>

                    </div>


                    <div className="profile-form-field">

                      <label htmlFor="bloodGroup">
                        Blood Group
                      </label>

                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        value={
                          formData.bloodGroup
                        }
                        onChange={
                          handleFormChange
                        }
                      >
                        <option value="">
                          Select Blood Group
                        </option>

                        <option value="A+">
                          A+
                        </option>

                        <option value="A-">
                          A-
                        </option>

                        <option value="B+">
                          B+
                        </option>

                        <option value="B-">
                          B-
                        </option>

                        <option value="AB+">
                          AB+
                        </option>

                        <option value="AB-">
                          AB-
                        </option>

                        <option value="O+">
                          O+
                        </option>

                        <option value="O-">
                          O-
                        </option>

                      </select>

                    </div>

                  </div>

                </div>


                {/* Emergency Contact */}

                <div className="profile-edit-section">

                  <h3>
                    Emergency Contact
                  </h3>

                  <div className="profile-form-grid">

                    <FormField
                      label="Emergency Contact"
                      name="emergencyContact"
                      value={
                        formData.emergencyContact
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                    <FormField
                      label="Emergency Mobile"
                      name="emergencyMobile"
                      value={
                        formData.emergencyMobile
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                  </div>

                </div>


                {/* Address */}

                <div className="profile-edit-section">

                  <h3>
                    Address
                  </h3>

                  <div className="profile-form-grid">

                    <div className="profile-form-field profile-form-field-full">

                      <label htmlFor="address">
                        Address
                      </label>

                      <textarea
                        id="address"
                        name="address"
                        rows="3"
                        value={
                          formData.address
                        }
                        onChange={
                          handleFormChange
                        }
                      />

                    </div>


                    <FormField
                      label="City"
                      name="city"
                      value={
                        formData.city
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                    <FormField
                      label="State"
                      name="state"
                      value={
                        formData.state
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                    <FormField
                      label="Country"
                      name="country"
                      value={
                        formData.country
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                    <FormField
                      label="Pincode"
                      name="pincode"
                      value={
                        formData.pincode
                      }
                      onChange={
                        handleFormChange
                      }
                    />

                  </div>

                </div>

              </div>


              <div className="profile-modal-footer">

                <button
                  type="button"
                  className="profile-secondary-button"
                  onClick={
                    handleCancelEdit
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="profile-primary-button"
                  onClick={
                    handleSaveProfile
                  }
                  disabled={saving}
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>
        )}


        {/* =====================================================
            CHANGE PASSWORD MODAL
        ===================================================== */}

        {showPasswordModal && (
          <div className="profile-modal-overlay">

            <div
              className="profile-modal profile-password-modal"
              role="dialog"
              aria-modal="true"
            >

              <div className="profile-modal-header">

                <div>

                  <h2>
                    Change Password
                  </h2>

                  <p>
                    Update your account password.
                  </p>

                </div>

                <button
                  type="button"
                  className="profile-modal-close"
                  onClick={
                    closePasswordModal
                  }
                  disabled={
                    changingPassword
                  }
                  aria-label="Close"
                >
                  <X size={19} />
                </button>

              </div>


              <div className="profile-modal-body">

                <div className="profile-password-info-box">

                  <ShieldCheck size={19} />

                  <div>

                    <strong>
                      Keep your account secure
                    </strong>

                    <span>
                      Use a password with at least
                      8 characters.
                    </span>

                  </div>

                </div>


                <div className="profile-password-fields">

                  <PasswordField
                    label="Current Password"
                    name="currentPassword"
                    value={
                      passwordData.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    visible={
                      showCurrentPassword
                    }
                    onToggle={() =>
                      setShowCurrentPassword(
                        (previous) =>
                          !previous
                      )
                    }
                  />


                  <PasswordField
                    label="New Password"
                    name="newPassword"
                    value={
                      passwordData.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    visible={
                      showNewPassword
                    }
                    onToggle={() =>
                      setShowNewPassword(
                        (previous) =>
                          !previous
                      )
                    }
                  />


                  <PasswordField
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    visible={
                      showConfirmPassword
                    }
                    onToggle={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                  />

                </div>

              </div>


              <div className="profile-modal-footer">

                <button
                  type="button"
                  className="profile-secondary-button"
                  onClick={
                    closePasswordModal
                  }
                  disabled={
                    changingPassword
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="profile-primary-button"
                  onClick={
                    handleChangePassword
                  }
                  disabled={
                    changingPassword
                  }
                >
                  {changingPassword ? (
                    "Changing..."
                  ) : (
                    <>
                      <Lock size={16} />
                      Change Password
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}


/* =========================================================
   PROFILE CARD
========================================================= */

function ProfileCard({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className="profile-card">

      <div className="profile-card-header">

        <div className="profile-card-icon">
          {icon}
        </div>

        <div>

          <h3>
            {title}
          </h3>

          <p>
            {description}
          </p>

        </div>

      </div>

      <div className="profile-card-divider"></div>

      {children}

    </section>
  );
}


/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
  highlight = false,
  status = false,
}) {
  return (
    <div className="profile-detail-row">

      <span className="profile-detail-label">
        {label}
      </span>

      {status ? (
        <span className="profile-status-small">

          <span></span>

          {value || "Active"}

        </span>
      ) : (
        <strong
          className={
            highlight
              ? "profile-detail-value profile-value-highlight"
              : "profile-detail-value"
          }
        >
          {value || "—"}
        </strong>
      )}

    </div>
  );
}


/* =========================================================
   QUICK INFORMATION
========================================================= */

function QuickInfo({
  icon,
  label,
  value,
}) {
  return (
    <div className="profile-quick-item">

      <div className="profile-quick-icon">
        {icon}
      </div>

      <span>
        {label}
      </span>

      <strong>
        {value || "—"}
      </strong>

    </div>
  );
}


/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div className="profile-form-field">

      <label htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />

    </div>
  );
}


/* =========================================================
   PASSWORD FIELD
========================================================= */

function PasswordField({
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
}) {
  return (
    <div className="profile-form-field">

      <label htmlFor={name}>
        {label}
      </label>

      <div className="profile-password-input">

        <input
          id={name}
          name={name}
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={onChange}
          autoComplete="new-password"
        />

        <button
          type="button"
          onClick={onToggle}
          tabIndex="-1"
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
        >
          {visible ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>

      </div>

    </div>
  );
}


export default Profile;