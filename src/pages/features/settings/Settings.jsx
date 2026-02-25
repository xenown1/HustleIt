import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";

export default function Settings() {

  const [activeTab, setActiveTab] = useState("business");

  const {settingForms, setSettingForms} = useContext(UserContext)
  

  useEffect(() => {
    localStorage.setItem("settingForms", JSON.stringify(settingForms));
  }, [settingForms]);

  function handleChange(e) {
    const { name, value } = e.target;
    setSettingForms((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    window.alert("Settings saved");
  }

  return (
    <div className="settings-page">
      <div className="settings-sidebar">
        <button
            className={`settings-tab ${activeTab === "business" ? "active" : ""}`}
            onClick={() => setActiveTab("business")}
        >
        Business Profile
        </button>

        <button
            className={`settings-tab ${activeTab === "invoice" ? "active" : ""}`}
            onClick={() => setActiveTab("invoice")}
        >
        Invoice Settings
        </button>

        <button
            className={`settings-tab ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
        >
        Account Settings
        </button>
    </div>

    <div className="settings-content">
        

        {activeTab === "business" && (<>
            <h1 className="settings-title">Business Profile</h1>
            <form className="settings-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Your Name</label>
                    <input name="name" value={settingForms.name} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Business Name</label>
                    <input name="businessName" value={settingForms.businessName} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Address</label>
                    <input name="address" value={settingForms.address} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input name="email" value={settingForms.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Phone</label>
                    <input name="phone" value={settingForms.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Tax ID / Business Number</label>
                    <input name="taxId" value={settingForms.taxId} onChange={handleChange} />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-edit">
                        Save Changes
                    </button>
                </div>
            </form>
        </>)}

        {activeTab === "invoice" && (<>
            <h1 className="settings-title">Invoice Settings</h1>
                <form className="settings-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="paymentType">Preferred Payment Terms</label>
                        <input name="paymentType" value={settingForms.paymentType} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Currency: </label>
                        <select name="currency" value={settingForms.currency} onChange={handleChange}>
                            <option value="CAD">CAD</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Footer:</label>
                        <input name="invoiceFooter" value={settingForms.invoiceFooter} onChange={handleChange} />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-edit">
                            Save Changes
                        </button>
                    </div>
                </form>
        </>)}

        {activeTab === "account" && (<>
            <h1 className="settings-title">Account Settings</h1>
            <div className="settings-placeholder">
                <p>Account preferences and security settings will go here.</p>
            </div>
        </>)}
      </div>
    </div>
  );
}