import { Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import BillingTab from "./tabs/BillingTab";
import ChangePasswordTab from "./tabs/ChangePasswordTab";
import GeneralTab from "./tabs/GeneralTab";

import AccountBoxRoundedIcon from "@material-ui/icons/AccountBoxRounded";
import VpnKeyRoundedIcon from "@material-ui/icons/VpnKeyRounded";
import ReceiptRoundedIcon from "@material-ui/icons/ReceiptRounded";
import "./User.styles.scss";

const ACCOUNT_TABS = [
  {
    value: "general",
    icon: <AccountBoxRoundedIcon />,
    component: <GeneralTab />,
  },
  {
    value: "billing",
    icon: <ReceiptRoundedIcon />,
    component: <BillingTab />,
  },
  {
    value: "changePassword",
    icon: <VpnKeyRoundedIcon />,
    component: <ChangePasswordTab />,
  },
];

function a11yProps(index) {
  return {
    id: `account-tabs-${index}`,
    "aria-controls": `account-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className={`account__tab-view ${value}`}>{children}</div>
      )}
    </div>
  );
}

const User = () => {
  const [value, setValue] = useState(0);
  const handleChange = (e, value) => {
    setValue(value);
  };

  return (
    <div className="account">
      <div className="container">
        <div className="account__tabs">
          <Tabs
            classes={{ indicator: "tabIndicator" }}
            value={value}
            onChange={handleChange}
            aria-label="account-tabs"
          >
            {ACCOUNT_TABS.map((tab, index) => (
              <Tab
                classes={{ wrapper: "tab-wrapper" }}
                key={tab.value}
                icon={tab.icon}
                value={index}
                label={tab.value.toUpperCase()}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </div>
        {ACCOUNT_TABS.map((tab, index) => (
          <TabPanel value={value} key={tab.value} index={index}>
            {tab.component}
          </TabPanel>
        ))}
      </div>
    </div>
  );
};

export default User;
